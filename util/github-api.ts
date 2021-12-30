export const GithubAPI = {
  getLoginUrl(state: string) {
    return `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&state=${state}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`;
  },

  // async login(state: string, code: string) {
  //   const { data } = await request.post<GetAccessTokenResp>('/github/access_token', {
  //     redirectUri: `${process.env.BASE_URL}/auth/login`,
  //     code,
  //   } as GetAccessTokenDTO);
  //   return data;
  // },
};
