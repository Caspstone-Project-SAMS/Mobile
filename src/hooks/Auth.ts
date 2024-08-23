import axios from 'axios';
import { GET_GG_USER_INFO, USER_AUTH_API } from './index';
import { UserInfo } from '../models/UserInfo';
import { GGUserInfo } from '../models/auth/GoogleResponse';

const login = async (
  username: string,
  password: string,
): Promise<UserInfo | undefined> => {
  const response = await axios.post(USER_AUTH_API + '/login', {
    username,
    password,
  });

  return response.data as UserInfo;
};

const getGGInfo = async (access_token: string): Promise<GGUserInfo> => {
  const response = await axios.get(GET_GG_USER_INFO + access_token, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json',
    },
  });
  return response.data as GGUserInfo;
};

const forgotPassword = async (email: string) => {
  try {
    const response = await axios.get(USER_AUTH_API, { params: email });
    return response.data;
  } catch (error) {
    console.log('Error when forgot password');
  }
};

const AuthService = {
  login,
  getGGInfo,
  forgotPassword,
};

export default AuthService;
