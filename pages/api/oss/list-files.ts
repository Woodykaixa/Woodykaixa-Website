import OSS from 'ali-oss';
import { OssConfig } from '@/config/oss';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ListFilesDTO } from '@/dto';
let client = new OSS(OssConfig);

export default function handler(req: NextApiRequest, res: NextApiResponse<ListFilesDTO>) {
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
    .catch((err: Error) => {
      res.status(400).json({
        error: err.name,
        desc: err.message,
      });
    });
}
