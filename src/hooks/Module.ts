import axios from 'axios';
import { MODULE_API, WIFI_MODULE_API } from '.';
import { ModuleConfig } from '../models/Module/Module';

interface ConfigExtend extends ModuleConfig {
  autoPrepare: boolean;
  attendanceSound: boolean;
  connectionSound: boolean;
}

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

const configModule = async (moduleID: number, configData: ConfigExtend) => {
  const response = await axios.put(MODULE_API + `/${moduleID}`, configData);
  return response.data;
};

export const ModuleService = {
  setUpWifi,
  getModuleByEmployeeID,
  configModule,
};
