type FetchType = typeof fetch;
type FetchParam = Parameters<FetchType>;
export const fetcher = (...args: FetchParam) => fetch(...args).then(res => res.json());
