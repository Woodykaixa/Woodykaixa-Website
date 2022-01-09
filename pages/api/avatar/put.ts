import type { NextApiRequest, NextApiResponse } from 'next';
import { Avatar, File, OK, Err } from '@/dto';
import { ensureMethod, parseParam, isType } from '@/util/api';
import { errorHandler, HttpError } from '@/util/error';
import prismaClient from '@/lib/prisma';
import { SiteConfig } from '@/config/site';

/**
 * POST /api/avatar/put
 *
 * param [Avatar.PutDTO]
 *
 * response [Avatar.PutResp]
 *
 * @description Upload a avatar file. Just invoke /api/file/put-file, and specify type='AVATAR', then add a AvatarFile model in db.
 */

export default function handler(req: NextApiRequest, res: NextApiResponse<Avatar.PutResp | Err.CommonResp>) {
  ensureMethod(req.method, ['POST'])
    .then(() =>
      parseParam<Avatar.PutDTO>(req.body, {
        filename: param => ({
          valid: isType(param, 'string'),
          parsed: param!,
        }),
        content: param => ({
          valid: isType(param, 'string'),
          parsed: param!,
        }),
        auth: param => ({
          valid: isType(param, 'string') && param === process.env.OSS_PUT_AUTH,
          parsed: param!,
        }),
        height: param => ({
          valid: isType(param, 'number') && 0 < param!,
          parsed: param!,
        }),
        width: param => ({
          valid: isType(param, 'number') && 0 < param!,
          parsed: param!,
        }),
        userId: async param => {
          if (!isType(param, 'string')) {
            return {
              valid: false,
              parsed: param!,
            };
          }
          const user = await prismaClient.user.findFirst({
            where: {
              id: param!,
            },
          });
          return {
            valid: !!user,
            parsed: param!,
          };
        },
      })
    )
    .then(async dto => {
      const res = await fetch(SiteConfig.Url + '/api/file/put-file', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          auth: dto.auth,
          name: dto.filename,
          type: 'AVATAR',
          content: dto.content,
        } as File.PutFileDTO),
      });
      const json = (await res.json()) as File.PutFileResp;
      if (res.status === OK.code) {
        return [dto, json] as const;
      }
      const jErr = json as unknown as Err.CommonResp;
      const err = new HttpError(jErr.desc, res.status);
      err.name = jErr.error;
      throw err;
    })
    .then(([dto, file]) => {
      return prismaClient.avatarFile.create({
        data: {
          filename: dto.filename,
          height: dto.height,
          width: dto.width,
          userId: dto.userId,
          fileId: file.id,
        },
      });
    })
    .then(avatar => {
      res.status(OK.code).json(avatar);
    })
    .catch(errorHandler(res));
}
