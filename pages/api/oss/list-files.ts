import OSS from 'ali-oss';
import { OssConfig } from '@/config/oss';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Err } from '@/dto';
import { errorHandler } from '@/util/error';
let client = new OSS(OssConfig);

// old api
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Array<{
        path: string;
        type: string;
      }>
    | Err.CommonResp
  >
) {
  client
    .list(
      {
        'max-keys': 100,
      },
      {}
    )
    .then(list => {
      console.log(list);
      res.status(200).json(
        (list.objects ?? []).map(meta => ({
          path: meta.name,
          type: meta.type,
        }))
      );
    })
    .catch(errorHandler(res));
}
