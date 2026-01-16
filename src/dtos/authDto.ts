export type RefreshInputDto = {
  refreshToken: string;
};

export type RefreshOutputDto = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export type LogoutInputDto = {
  refreshToken: string;
};

export type LogoutOutputDto = {
  success: boolean;
};

export type LoginInputDto = {
  username: string;
  password: string;
};

export type LoginOutputDto = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};
