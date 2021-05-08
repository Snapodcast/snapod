interface DataItem {
  countries: {
    [name: string]: {
      plays: number;
      cities: {
        [name: string]: number;
      };
    };
  };
}

export default function formatCountriesData(data: DataItem[]) {
  const newData: {
    country: string;
    city: string;
    plays: number;
  }[] = [];

  const newDataCitiesObject: {
    [city: string]: { plays: number; country: string };
  } = {};

  for (let i = 0; i < data.length; i += 1) {
    Object.keys(data[i].countries).forEach((countryKey) => {
      const country = data[i].countries[countryKey];
      Object.keys(country.cities).forEach((cityKey) => {
        const cityPlays = country.cities[cityKey];
        if (newDataCitiesObject[cityKey]) {
          newDataCitiesObject[cityKey].plays += cityPlays;
        } else {
          newDataCitiesObject[cityKey] = {
            plays: cityPlays,
            country: countryKey,
          };
        }
      });
    });
  }

  Object.keys(newDataCitiesObject).forEach((cityItem, index) => {
    const itemObject = newDataCitiesObject[cityItem];
    newData[index] = {
      country: itemObject.country,
      city: cityItem,
      plays: itemObject.plays,
    };
  });

  return newData;
}
