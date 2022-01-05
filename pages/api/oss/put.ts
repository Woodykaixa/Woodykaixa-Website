import OSS from 'ali-oss';
import { OssConfig } from '@/config/oss';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PutFileDTO, PutFileResp } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
let client = new OSS(OssConfig);

export default function handler(req: NextApiRequest, res: NextApiResponse<PutFileResp>) {
  try {
    ensureMethod(req.method, ['POST']);
  } catch (e) {
    const err = e as Error;
    res.status(400).json({
      error: err.name,
      desc: err.message,
    });
  }
  parseParam<PutFileDTO>(req.body, {
    name: param => ({
      valid: !!param,
      parsed: firstValue(param!),
    }),
    content: param => ({
      valid: !!param,
      parsed: firstValue(param!),
    }),
    auth: param => ({
      valid: process.env.APP_ENV === 'development' || !!param,
      parsed: firstValue(param) ?? '',
    }),
  })
    .then(param => {
      if (process.env.APP_ENV !== 'development' && param.auth !== process.env.OSS_PUT_AUTH) {
        throw new Error('');
      }
      return client.put(param.name, new Buffer(param.content, 'utf-8'));
    })
    .then(result => {
      console.log(result);

      res.status(200).json({});
    })
    .catch((err: Error) => {
      res.status(400).json({
        error: err.name,
        desc: err.message,
      });
    });
}
