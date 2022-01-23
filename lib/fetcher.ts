import { Blog, Err, OK } from '@/dto';

type FetchType = typeof fetch;
type FetchParam = Parameters<FetchType>;
export const fetcher = <TData = any, TError = Err.CommonResp>(...args: FetchParam) =>
  fetch(...args).then(async res => {
    if (res.status === OK.code) {
      return res.json() as Promise<TData>;
    }
    throw (await res.json()) as TError;
  });
