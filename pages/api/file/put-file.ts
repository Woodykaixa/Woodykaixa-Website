import type { NextApiRequest, NextApiResponse } from 'next';
import { Oss, File, Err, OK } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
import { BadRequest, errorHandler, HttpError } from '@/util/error';
import prismaClient from '@/lib/prisma';

/**
 * POST /api/file/put-file
 *
 * param [File.PutFileDTO]
 *
 * response [File.PutFileResp]
 *
 * @description Upload a file. Firstly, check if the filename exists in db. If does, throw a error. Otherwise
 * invoke /api/oss/put-file, upload file to OSS, and create a File document in db.
 */

export default function handler(req: NextApiRequest, res: NextApiResponse<File.PutFileResp | Err.CommonResp>) {
  ensureMethod(req.method, ['POST'])
    .then(() =>
      parseParam<File.PutFileDTO>(req.body, {
        name: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
        content: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
        auth: param => {
          const auth = firstValue(param) ?? '';
          return {
            valid: auth === process.env.OSS_PUT_AUTH,
            parsed: auth,
          };
        },
        type: param => ({
          valid: !!param && File.FileTypes.includes(param),
          parsed: param!,
        }),
      })
    )
    .then(dto =>
      Promise.all([
        dto,
        prismaClient.file.findFirst({
          where: {
            filename: `${dto.type}/${dto.name}`,
          },
        }),
      ])
    )
    .then(([dto, file]) => {
      if (file) {
        throw new BadRequest(Err.File.EXISTS);
      }
      return dto;
    })
    .then(async dto => {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/oss/put-file', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          content: dto.content,
          auth: dto.auth,
          name: `${dto.type}/${dto.name}`,
          encoding: dto.type === 'POST' ? 'utf8' : 'base64',
        } as Oss.PutFileDTO),
      });
      const json = (await res.json()) as Oss.PutFileResp;
      if (res.status === OK.code) {
        return Promise.resolve([dto, json] as const);
      }
      const jErr = json as unknown as Err.CommonResp;
      const err = new HttpError(jErr.desc, res.status);
      err.name = jErr.error;
      throw err;
    })
    .then(([dto, putResult]) =>
      prismaClient.file.create({
        data: {
          ...putResult,
          type: dto.type,
        },
      })
    )
    .then(file => {
      res.status(OK.code).json(file);
    })
    .catch(errorHandler(res));
}
