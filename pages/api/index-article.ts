import type { NextApiRequest, NextApiResponse } from 'next';
import { Err, OK } from '@/dto';
import { errorHandler } from '@/util/error';
import { OssService } from '@/lib/services';

export default function handler(req: NextApiRequest, res: NextApiResponse<string | Err.CommonResp>) {
  OssService.getFile('README.md')
    .then(content => {
      res.status(OK.code).send(content);
    })
    .catch(errorHandler(res));
}
