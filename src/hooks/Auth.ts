import axios from 'axios';
import { GET_GG_USER_INFO, USER_API, USER_AUTH_API } from './index';
import { UserInfo } from '../models/UserInfo';
import { GGUserInfo } from '../models/auth/GoogleResponse';
import { UserProfile } from '../screens/account/AccountProfile';

const login = async (
  username: string,
  password: string,
  deviceToken?: string,
): Promise<UserInfo | undefined> => {
  if (deviceToken) {
    const response = await axios.post(USER_AUTH_API + '/login', {
      username,
      password,
      deviceToken,
    });
    return response.data as UserInfo;
  } else {
    const response = await axios.post(USER_AUTH_API + '/login', {
      username,
      password,
    });
    return response.data as UserInfo;
  }
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
  const response = await axios.post(
    USER_AUTH_API + '/forget-password',
    undefined,
    {
      params: {
        email,
      },
    },
  );
  return response.data;
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
) => {
  const response = await axios.post(USER_AUTH_API + '/reset-password', {
    userId,
    oldPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

const getUserDetailByID = async (id: string) => {
  const response = await axios.get(`${USER_API}/${id}`);
  return response.data;
};

const updateProfileByID = async (id: string, data: UserProfile) => {
  const response = await axios.put(
    `${USER_API}/${id}`,
    {
      Email: data.email,
      PhoneNumber: data.phoneNumber,
      DisplayName: data.displayName,
      Address: data.address,
      DOB: data.DOB,
      Gender: data.gender,
      FirstName: data.firstName,
      LastName: data.lastName,
    },
    {
      headers: {
        accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

const AuthService = {
  login,
  getGGInfo,
  forgotPassword,
  changePassword,
  getUserDetailByID,
  updateProfileByID,
};

export default AuthService;
