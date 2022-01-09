import OSS from 'ali-oss';
import { OssConfig } from '@/config/oss';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, OK } from '@/dto';
import { ensureMethod, parseParam, firstValue } from '@/util/api';
let client = new OSS(OssConfig);

// old api
export default function handler(req: NextApiRequest, res: NextApiResponse<{ content: string } | Err.CommonResp>) {
  ensureMethod(req.method, ['GET'])
    .then(() => {
      return parseParam<{ name: string }>(req.query, {
        name: param => ({
          valid: !!param,
          parsed: firstValue(param!),
        }),
      });
    })
    .then(param => {
      return client.get(param.name);
    })
    .then(result => {
      console.log(result);

      res.status(OK.code).json({ content: result.content.toString() });
    })
    .catch((err: Error) => {
      res.status(400).json({
        error: err.name,
        desc: err.message,
      });
    });
}
