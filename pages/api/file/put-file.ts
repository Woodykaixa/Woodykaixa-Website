import type { NextApiRequest, NextApiResponse } from 'next';
import { Oss, File, CommonAPIErrorResponse } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
import { BadRequest, errorHandler } from '@/util/error';
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

export default function handler(req: NextApiRequest, res: NextApiResponse<File.PutFileResp | CommonAPIErrorResponse>) {
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
        throw new BadRequest(`File exists`);
      }
      return dto;
    })
    .then(dto =>
      Promise.all([
        dto,
        fetch(process.env.NEXT_PUBLIC_BASE_URL + '/oss/put-file', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            content: dto.content,
            auth: dto.auth,
            name: `${dto.type}/${dto.name}`,
          } as Oss.PutFileDTO),
        }),
      ])
    )
    .then(([dto, res]) => Promise.all([dto, res.json() as Promise<Oss.PutFileResp>]))
    .then(([dto, putResult]) =>
      prismaClient.file.create({
        data: {
          ...putResult,
          type: dto.type,
        },
      })
    )
    .then(file => {
      res.status(200).json(file);
    })
    .catch(errorHandler(res));
}
