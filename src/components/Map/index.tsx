import React, { useEffect, useState, memo } from 'react';
import { scaleLinear } from 'd3-scale';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from 'react-simple-maps';
import { alpha2ToAlpha3 } from 'i18n-iso-countries';
import geoData from '../../public/features.json';
import { FormattedDataItem } from '../../utilities/format/countriesData';
import ReactTooltip from 'react-tooltip';

// Map color scale function
const colorScale = scaleLinear().domain([0, 1]).range(['#93c5fd', '#3b82f6']);

interface MapDataItem {
  [country: string]: number;
}

const MapChart = ({
  data,
  setTooltipContent,
}: {
  data: FormattedDataItem[];
  setTooltipContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}) => {
  const [mapData, setMapData] = useState<MapDataItem>({});
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const formattedData: MapDataItem = {};

    data.forEach((item) => {
      const country = alpha2ToAlpha3(item.country);
      if (country) {
        if (Object.hasOwnProperty.call(mapData, country)) {
          formattedData[country] += item.plays;
        } else {
          formattedData[country] = item.plays;
        }
      }
    });

    setMapData(formattedData);
    setMaxValue(Math.max(...Object.values(mapData)));
  }, [data]);

  return (
    <ComposableMap
      data-tip=""
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147,
      }}
      height={400}
    >
      <Sphere
        id="sphere"
        fill="transparent"
        stroke="#d4d4d4"
        strokeWidth={0.5}
      />
      <Graticule stroke="#d4d4d4" strokeWidth={0.5} />
      {Object.keys(mapData).length > 0 && (
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const playCount = mapData[geo.id];
              const fill = playCount
                ? colorScale(playCount / maxValue)
                : '#e5e5e5';

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  onMouseEnter={() => {
                    setTooltipContent(
                      <div className="text-center flex items-center">
                        <div className="flex items-center mr-[30px]">
                          <span
                            className="w-[8px] h-[8px] rounded-full mr-[10px]"
                            style={{
                              backgroundColor: fill,
                            }}
                          />
                          <span>{geo.properties.name}:</span>
                        </div>
                        <div>
                          <span>{playCount || 0}</span>
                        </div>
                      </div>
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                  }}
                  style={{
                    hover: {
                      fill: '#2563eb',
                      outline: 'none',
                    },
                    pressed: {
                      fill: '#2563eb',
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  );
};

const MemorizedMapChart = memo(MapChart);

const Map = ({ data }: { data: FormattedDataItem[] }) => {
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);

  return (
    <div>
      <MemorizedMapChart data={data} setTooltipContent={setTooltipContent} />
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  );
};

export default Map;
