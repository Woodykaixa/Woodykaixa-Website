import ossClient from '../oss';
import { OK } from '@/dto';
import { BadRequest } from '@/util/error';

export namespace OssService {
  export async function getFile(name: string): Promise<string> {
    const result = await ossClient.get(name);
    if (result.res.status !== OK.code) {
      throw new BadRequest(result.res.status.toString(10));
    }
    return result.content.toString();
  }

  export async function putFile(name: string, content: Buffer) {
    const result = await ossClient.put(name, content);
    if (result.res.status !== OK.code) {
      throw new BadRequest(result.res.status.toString(10));
    }
    return {
      filename: result.name,
      url: result.url,
      size: content.length,
    };
  }

  export async function listFile() {
    const list = await ossClient.list(
      {
        'max-keys': 100,
      },
      {}
    );
    return list.objects.map(meta => ({
      path: meta.name,
      type: meta.type,
    }));
  }

  export async function deleteFile(filename: string) {
    const result = await ossClient.delete(filename);
    console.log('delete result', result);
    // @ts-ignore
    if (!result.res.status.toString(10).startsWith('2')) {
      // @ts-ignore
      throw new BadRequest(result.res.status.toString(10));
    }
    console.log('delete success');
  }
}
