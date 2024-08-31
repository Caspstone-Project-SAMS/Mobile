import axios from 'axios';
import { MODULE_API, WIFI_MODULE_API } from '.';

const getModuleByEmployeeID = async (employeeID: string) => {
  const response = await axios.get(MODULE_API, {
    params: {
      employeeID,
    },
  });
  return response.data;
};

const setUpWifi = async (ssid: string, pass: string) => {
  const response = await axios.post(WIFI_MODULE_API, {
    ssid: ssid,
    pass: pass,
  });
  return response.data;
};

export const ModuleService = {
  setUpWifi,
  getModuleByEmployeeID,
};
