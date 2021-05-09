/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { Line, Bar, Pie } from '@ant-design/charts';
import Icons from '../../../components/Icons';
import * as Store from '../../../lib/Store';
import Configs from '../../../configs';
import { toDateString } from '../../../utilities/format/date';
import formatPlaysData from '../../../utilities/format/playsData';
import formatCountriesData from '../../../utilities/format/countriesData';
import formatDevicesData from '../../../utilities/format/devicesData';
import formatClientsData from '../../../utilities/format/clientsData';
import Head from '../../../components/Head';

const fetchData = async (
  setLoading: any,
  setError: any,
  startDate: Date,
  endDate: Date,
  dateInterval: string,
  podcastCuid: string,
  setPlaysData: any,
  setCountriesData: any,
  setDevicesDate: any,
  setClientsData: any
) => {
  setLoading(true);
  const startTime = new Date(toDateString(startDate)).getTime();
  const endTime = new Date(toDateString(endDate)).getTime() + 86400000;
  const interval = parseInt(dateInterval, 10);
  await fetch(
    `${Configs.stats_url}/stats/podcast/${podcastCuid}/from/${startTime}/to/${endTime}/interval/${interval}`
  )
    .then((response) => response.json())
    .then((json: any) => {
      // plays
      setPlaysData(formatPlaysData(interval, json));
      // countries & cities
      setCountriesData(formatCountriesData(json));
      // devices
      setDevicesDate(formatDevicesData(json));
      // clients
      setClientsData(formatClientsData(json));
      setError(false);
    })
    .catch(() => {
      setError(true);
    });
  setLoading(false);
};

export default function ManageMetrics() {
  const podcastCuid = Store.get('currentPodcast.cuid');

  /* Date picker */
  const [startDate, setStartDate] = React.useState<Date>(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [showPicker, setShowPicker] = React.useState(false);
  const [dateInterval, setDateInterval] = React.useState<string>('86400000');

  const onDateChange = (dates: [any, any]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  /* Chart data */
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [playsData, setPlaysData] = React.useState<any>([]);
  const [countriesData, setCountriesData] = React.useState<any>([]);
  const [devicesData, setDevicesDate] = React.useState<any>([]);
  const [clientsData, setClientsData] = React.useState<any>([]);

  const chartConfigs: any = {
    plays: {
      data: playsData,
      appendPadding: [0, 10, 0, 0],
      autoFit: false,
      height: 300,
      xField: 'Date',
      yField: 'plays',
      xAxis: { tickCount: 5 },
      slider: {
        start: 0,
        end: 1,
      },
      lineStyle: {
        lineWidth: 3,
      },
      point: {
        size: 5,
      },
      meta: {
        plays: {
          alias: '总播放量',
        },
      },
    },
    countries: {
      data: countriesData,
      autoFit: false,
      height: 300,
      xField: 'plays',
      yField: 'country',
      isStack: true,
      seriesField: 'city',
      barWidthRatio: 0.5,
      meta: {
        plays: {
          alias: '播放量',
        },
      },
    },
    devices: {
      data: devicesData,
      angleField: 'plays',
      colorField: 'device',
      autoFit: false,
      height: 200,
      radius: 1,
      innerRadius: 0.6,
      label: {
        type: 'inner',
        offset: '-50%',
        content: '{value}',
        style: {
          textAlign: 'center',
          fontSize: 10,
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
      statistic: {
        title: false,
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 16,
          },
          formatter: function formatter() {
            return '收听设备';
          },
        },
      },
      meta: {
        plays: {
          alias: '播放量',
        },
      },
    },
    clients: {
      data: clientsData,
      angleField: 'plays',
      colorField: 'client',
      autoFit: false,
      height: 200,
      radius: 1,
      innerRadius: 0.6,
      label: {
        type: 'inner',
        offset: '-50%',
        content: '{value}',
        style: {
          textAlign: 'center',
          fontSize: 10,
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
      statistic: {
        title: false,
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 16,
          },
          formatter: function formatter() {
            return '收听平台';
          },
        },
      },
      meta: {
        plays: {
          alias: '播放量',
        },
      },
    },
  };

  React.useEffect(() => {
    if (startDate && endDate) {
      setShowPicker(false);
      fetchData(
        setLoading,
        setError,
        startDate,
        endDate,
        dateInterval,
        podcastCuid,
        setPlaysData,
        setCountriesData,
        setDevicesDate,
        setClientsData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="animate-spin w-5 h-5">
          <Icons name="spinner" />
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center error-container">
        <div className="-mt-3">
          <p className="mb-3 flex justify-center">
            <span className="h-28 w-28 text-gray-200">
              <Icons name="warning" />
            </span>
          </p>
          <div className="justify-center flex">
            <button
              aria-label="refetch"
              type="button"
              className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-600 bg-gray-500 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
              onClick={() => {
                fetchData(
                  setLoading,
                  setError,
                  startDate,
                  endDate,
                  dateInterval,
                  podcastCuid,
                  setPlaysData,
                  setCountriesData,
                  setDevicesDate,
                  setClientsData
                );
              }}
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 mb-12 mx-5">
      <Head title="播客统计数据" description="播客播放数据及听众详情" />
      <section>
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-base font-medium -mb-0.5">播放量统计</h1>
            <p className="text-xs text-gray-600">Plays</p>
          </div>
          <div className="flex gap-x-3 items-center">
            <div className="flex">
              <button
                type="button"
                aria-label="select date range"
                className="border flex gap-x-1 justify-center align-middle items-center text-gray-500 text-sm hover:bg-gray-300 bg-gray-200 focus:outline-none rounded-md py-1 px-3 text-center"
                onClick={() => setShowPicker(!showPicker)}
              >
                <span className="w-4 h-4">
                  <Icons name="calendar" />
                </span>
                {startDate && endDate
                  ? `${toDateString(startDate)} - ${toDateString(endDate)}`
                  : '选择日期区间'}
              </button>
              {showPicker && (
                <DatePicker
                  selected={startDate}
                  onChange={onDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              )}
            </div>
            <div>
              <select
                className="interval-select justify-center align-middle items-center text-gray-500 text-sm hover:bg-gray-50 border focus:outline-none rounded-md py-1 px-3 text-center"
                defaultValue={dateInterval}
                onChange={(e) => {
                  setDateInterval(e.target.value);
                  fetchData(
                    setLoading,
                    setError,
                    startDate,
                    endDate,
                    e.target.value,
                    podcastCuid,
                    setPlaysData,
                    setCountriesData,
                    setDevicesDate,
                    setClientsData
                  );
                }}
              >
                <option value="86400000">按日 / Daily</option>
                <option value="604800000">按周 / Weekly</option>
                <option value="2678400000">按月 / Monthly</option>
              </select>
            </div>
          </div>
        </div>
        {playsData.length ? (
          <div className="mt-6">
            <Line {...chartConfigs.plays} />
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-center bg-gray-100 rounded-md h-12">
            <p className="text-gray-500 text-sm">暂无数据 / Not enough data</p>
          </div>
        )}
      </section>
      <section className="mt-7 pt-7 border-t">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-base font-medium -mb-0.5">听众地理信息</h1>
            <p className="text-xs text-gray-600">Geographic location</p>
          </div>
        </div>
        {countriesData.length ? (
          <div className="mt-5">
            <Bar {...chartConfigs.countries} />
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-center bg-gray-100 rounded-md h-12">
            <p className="text-gray-500 text-sm">暂无数据 / Not enough data</p>
          </div>
        )}
      </section>
      <section className="mt-7 pt-7 border-t">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-base font-medium -mb-0.5">
              听众设备及平台信息
            </h1>
            <p className="text-xs text-gray-600">
              Listening devices and platforms
            </p>
          </div>
        </div>
        {clientsData.length ? (
          <div className="mt-7">
            <div className="grid grid-cols-2 gap-x-3 -ml-5">
              <Pie {...chartConfigs.devices} />
              <Pie {...chartConfigs.clients} />
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-center bg-gray-100 rounded-md h-12">
            <p className="text-gray-500 text-sm">暂无数据 / Not enough data</p>
          </div>
        )}
      </section>
    </div>
  );
}
