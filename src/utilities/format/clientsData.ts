interface DataItem {
  clients: { [name: string]: number };
}

export default function formatClientsData(data: DataItem[]) {
  const newData: {
    client: string;
    plays: number;
  }[] = [];

  const newDataClientsObject: {
    [client: string]: number;
  } = {};

  for (let i = 0; i < data.length; i += 1) {
    Object.keys(data[i].clients).forEach((clientKey) => {
      const clientPlays = data[i].clients[clientKey];
      if (newDataClientsObject[clientKey]) {
        newDataClientsObject[clientKey] += clientPlays;
      } else {
        newDataClientsObject[clientKey] = clientPlays;
      }
    });
  }

  Object.keys(newDataClientsObject).forEach((client, index) => {
    const plays = newDataClientsObject[client];
    newData[index] = {
      client,
      plays,
    };
  });

  return newData;
}
