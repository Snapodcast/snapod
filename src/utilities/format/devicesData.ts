interface DataItem {
  devices: { [name: string]: number };
}

export default function formatDevicesData(data: DataItem[]) {
  const newData: {
    device: string;
    plays: number;
  }[] = [];

  const newDataDevicesObject: {
    [device: string]: number;
  } = {};

  for (let i = 0; i < data.length; i += 1) {
    Object.keys(data[i].devices).forEach((deviceKey) => {
      const devicePlays = data[i].devices[deviceKey];
      if (newDataDevicesObject[deviceKey]) {
        newDataDevicesObject[deviceKey] += devicePlays;
      } else {
        newDataDevicesObject[deviceKey] = devicePlays;
      }
    });
  }

  Object.keys(newDataDevicesObject).forEach((device, index) => {
    const plays = newDataDevicesObject[device];
    newData[index] = {
      device,
      plays,
    };
  });

  return newData;
}
