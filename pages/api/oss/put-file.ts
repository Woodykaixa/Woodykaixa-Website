import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, Oss } from '@/dto';
import { ensureMethod, parseParam, isType } from '@/util/api';
import { errorHandler } from '@/util/error';
import ossClient from '@/lib/oss';

export default function handler(req: NextApiRequest, res: NextApiResponse<Oss.PutFileResp | Err.CommonResp>) {
  ensureMethod(req.method, ['POST'])
    .then(() =>
      parseParam<Oss.PutFileDTO>(req.body, {
        name: param => ({
          valid: isType(param, 'string') && param!.length > 0,
          parsed: param!,
        }),
        content: param => ({
          valid: isType(param, 'string') && param!.length > 0,
          parsed: param!,
        }),
        auth: param => ({
          valid: isType(param, 'string') && param === process.env.OSS_PUT_AUTH,
          parsed: param!,
        }),
        encoding: param => ({
          valid: isType(param, 'string') && Oss.OssFileEncodings.includes(param!),
          parsed: param!,
        }),
      })
    )
    .then(param => ossClient.put(param.name, Buffer.from(param.content, param.encoding)))
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
