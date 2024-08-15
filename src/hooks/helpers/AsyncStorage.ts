import AsyncStorage from '@react-native-async-storage/async-storage';

const storeObjData = async (key: string, value: {}) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    return null;
  }
};

const getObjData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
  }
};

export const AsyncStorageHelpers = {
  storeObjData,
  getObjData,
};
