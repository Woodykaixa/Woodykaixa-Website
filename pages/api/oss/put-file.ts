import type { NextApiRequest, NextApiResponse } from 'next';
import { PutFileDTO, PutFileResp } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
import { errorHandler } from '@/util/error';
import ossClient from '@/lib/oss';

export default function handler(req: NextApiRequest, res: NextApiResponse<PutFileResp>) {
  ensureMethod(req.method, ['POST'])
    .then(() =>
      parseParam<PutFileDTO>(req.body, {
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
      })
    )
    .then(param => ossClient.put(param.name, Buffer.from(param.content, 'utf-8')))
    .then(result => {
      console.log(result);
      if (result.res.status !== 200) {
        throw new Error(result.res.status.toString(10));
      }
      res.status(200).json({
        filename: result.name,
        url: result.url,
        size: result.res.size,
      });
    })
    .catch(errorHandler(res));
}
