export type GitHubGetUsersDTO = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: false;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: null;
  hireable: null;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export type GetUserInfoDTO = {
  token: string;
};

export type GetUserInfoResp = {
  login: string;
  avatar_url: string;
  html_url: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  bio: string;
  id: number;
};

export type GetTokenDTO = {
  code: string;
};

export type GetTokenResp = {
  token: string;
};
