import { AvatarFile } from '@prisma/client';
import { File } from './file';
import { Simplify } from '@/util/type';

export namespace Avatar {
  export type PutDTO = Simplify<Omit<AvatarFile, 'id' | 'fileId'> & Omit<File.PutFileDTO, 'name' | 'type'>>;
  export type PutResp = Simplify<AvatarFile>;
}
