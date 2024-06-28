import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GoogleLogin_OnSuccess } from '../../models/auth/GoogleResponse';
import { UserInfo } from '../../models/UserInfo';
import axios, { AxiosError } from 'axios';
import AuthService from '../../hooks/Auth';
import { useToast } from 'react-native-toast-notifications';

interface AuthState {
  authStatus: boolean;
  googleAuth?: GoogleLogin_OnSuccess;
  userDetail?: UserInfo;
  loadingStatus: boolean;
}

const initialState: AuthState = {
  authStatus: false,
  googleAuth: undefined,
  userDetail: undefined,
  loadingStatus: false,
};

// const toast = useToast();
// const showToast = (message: string, type: string) => {
//   try {
//     const fmtType = type ? type : 'normal';
//     toast.show(message, {
//       type: fmtType,
//       placement: 'top',
//       duration: 3000,
//       animationType: 'slide-in',
//     });
//   } catch (error) {
//     console.log('err at show toast', error);
//   }
// };

const login = createAsyncThunk(
  'auth/login',
  async (arg: { username: string; password: string }, { rejectWithValue }) => {
    // console.log('Imhereeeeeeee ');
    const { username, password } = arg;
    try {
      const loginPromise = AuthService.login(username, password);
      const result = await loginPromise;
      // console.log('User result here ', result);
      return result;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('hi error here ', error);
        throw new AxiosError(error.response);
      }
      return rejectWithValue(error.message.data);
    }
  },
);
// {
//   "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImFjZDg1ZDQ3LTA0MTktNDEwOS1iMjUxLTA4ZGM4NWZmMDE2MCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhZG1pbjEiLCJzY29wZSI6IkFkbWluIiwiZXhwIjoxNzE5Mzk1NTAzLCJpc3MiOiJsb2NhbGhvc3Q6NTAwMC1wcm9qZWN0LWJhc2Utc2VydmljZSIsImF1ZCI6ImxvY2FsaG9zdDo1MDAwLXByb2plY3QtYmFzZS1zZXJ2aWNlIn0.0jRYNd_BTWondtNo_P-bY55rn_NBkOA0cSDe1W9DQ2D33WyayCbA6bM3xXnrqF0xgL4lK6XDAJaun__tj7F4DP392Ui0C5GRJmKBiOQeNnCjyDMf3GJr7Bo_XXsZTllY6-tdTu28AzFRvpl-_sxZI-T7FfhfcRdsiMTmNvG-nQEAz0Cf9LVXWofnR56mukIiMEPtyDhe9vXU-ZYlAC_-ANN0T8ZB3XzWyToqH08ah_3tjS2KCPAo5XGn9F679WU2EC2PssjGULFv2ER6vtLgfR_ZGFRDXSeApI7I-DVeRBXbhLwcIyBwqN_njJl9np8k7FDKFVbJKuwheDEcfv-QGA",
//   "result": {
//     "id": "acd85d47-0419-4109-b251-08dc85ff0160",
//     "email": null,
//     "normalizedEmail": null,
//     "emailConfirmed": false,
//     "phoneNumber": null,
//     "phoneNumberConfirmed": false,
//     "twoFactorEnabled": false,
//     "lockoutEnd": null,
//     "lockoutEnabled": false,
//     "filePath": null,
//     "displayName": null,
//     "role": {
//       "roleId": 1,
//       "name": "Admin",
//       "createdBy": "Undefined",
//       "createdAt": "2024-06-06T07:58:41.5264576"
//     },
//     "createdBy": "Undefined",
//     "createdAt": "2024-06-06T15:02:26.4549455"
//   }
// }

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.authStatus = false;
      state.loadingStatus = false;
      state.googleAuth = undefined;
      state.userDetail = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      return {
        ...state,
        loadingStatus: true,
      };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      // console.log('In the case fulfilled, ', action);
      const { payload } = action;
      // showToast('Login successfully!', 'success');
      return {
        ...state,
        authStatus: true,
        loadingStatus: false,
        userDetail: payload,
      };
    });
    builder.addCase(login.rejected, (state) => {
      // showToast('Invalid credentials', 'danger');
      return {
        ...state,
        authStatus: false,
        loadingStatus: false,
      };
    });
  },
});

export { login };
export const { logout } = AuthSlice.actions;

export default AuthSlice.reducer;
