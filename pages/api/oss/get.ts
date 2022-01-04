import OSS from 'ali-oss';
import { OssConfig } from '@/config/oss';
import type { NextApiRequest, NextApiResponse } from 'next';
import { GetFileDTO, GetFileResp } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
let client = new OSS(OssConfig);

export default function handler(req: NextApiRequest, res: NextApiResponse<GetFileResp>) {
  try {
    ensureMethod(req.method, ['GET']);
  } catch (e) {
    const err = e as Error;
    res.status(400).json({
      error: err.name,
      desc: err.message,
    });
  }
  parseParam<GetFileDTO>(req.query, {
    name: param => ({
      valid: !!param,
      parsed: firstValue(param!),
    }),
  })
    .then(param => {
      return client.get(param.name);
    })
    .then(result => {
      console.log(result);

      res.status(200).json({ content: result.content.toString() });
    })
    .catch((err: Error) => {
      res.status(400).json({
        error: err.name,
        desc: err.message,
      });
    });
}