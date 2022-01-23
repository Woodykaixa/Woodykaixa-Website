import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from '@/lib/prisma';
import { Blog, Err, OK } from '@/dto';
import { ensureMethod, isType, parseParam } from '@/util/api';
import { errorHandler } from '@/util/error';
import { PostService } from '@/lib/services/post';
import { ImageService } from '@/lib/services';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send('test middleware');
}
