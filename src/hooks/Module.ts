import axios from 'axios';
import { MODULE_API } from '.';

const setUpWifi = async (ssid: string, pass: string) => {
  const response = await axios.post(MODULE_API, {
    params: {
      ssid,
      pass,
    },
  });
  return response.data;
};

export const ModuleService = {
  setUpWifi,
};
