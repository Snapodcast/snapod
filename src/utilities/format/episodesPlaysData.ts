interface DataItem {
  [cuid: string]: number;
}

export default function formatEpisodesPlaysData(
  data: DataItem,
  episodes: {
    cuid: string;
    title: string;
  }[]
) {
  const newData: {
    title: string;
    plays: number;
  }[] = [];

  Object.keys(data).forEach((episodeCuid) => {
    let title = '';
    for (let j = 0; j < episodes.length; j += 1) {
      if (episodes[j].cuid === episodeCuid) {
        title = episodes[j].title;
        break;
      }
    }
    if (title !== '') {
      newData[newData.length] = {
        title,
        plays: data[episodeCuid],
      };
    }
  });

  return newData;
}
