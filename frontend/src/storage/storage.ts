import AsyncStorage from "@react-native-async-storage/async-storage";

let currentDevice = "deviceA";

export const setCurrentDevice = (
  device: string
) => {
  currentDevice = device;
};

const deviceKey = (key: string) =>
  `${currentDevice}_${key}`;

export const saveData = async (
  key: string,
  value: any
) => {
  await AsyncStorage.setItem(
    deviceKey(key),
    JSON.stringify(value)
  );
};

export const getData = async (
  key: string
) => {
  const data =
    await AsyncStorage.getItem(
      deviceKey(key)
    );

  if (!data) return null;

  return JSON.parse(data);
};

export const getDeviceId = async () => {
  let id =
    await AsyncStorage.getItem(
      deviceKey("deviceId")
    );

  if (!id) {
    id =
      currentDevice +
      "_" +
      Math.random()
        .toString(36)
        .substring(2);

    await AsyncStorage.setItem(
      deviceKey("deviceId"),
      id
    );
  }

  return id;
};

export const saveOperation = async (
  operation: any
) => {
  const operations =
    (await getData("operations")) || [];

  operations.push(operation);

  await saveData(
    "operations",
    operations
  );
};