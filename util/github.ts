import { randomString } from '.';

export const GitHubAPI = {
  registerUrl(state: string) {
    return `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&state=${state}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`;
  },
};

export const GitHubState = {
  get() {
    let state = localStorage.getItem('GITHUB_OAUTH_STATE');
    if (!state) {
      state = randomString();
      localStorage.setItem('GITHUB_OAUTH_STATE', state);
    }
    return state;
  },

  set(state: string) {
    localStorage.setItem('GITHUB_OAUTH_STATE', state);
  },

  remove() {
    localStorage.removeItem('GITHUB_OAUTH_STATE');
  },
};
