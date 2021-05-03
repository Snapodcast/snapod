import React from 'react';
import * as Store from '../../../lib/Store';
import { useQuery } from '@apollo/client';
import { GET_PODCAST } from '../../../lib/GraphQL/queries';
import { Input, TextArea } from '../../../components/Textarea';
import Head from '../../../components/Head';

export default function ManagePodcast() {
  const podcastCuid = Store.get('currentPodcast.cuid');
  const { loading, error, data } = useQuery(GET_PODCAST, {
    variables: { podcastCuid },
    fetchPolicy: 'cache-and-network',
  });
  const [podcastInfo, setInfo] = React.useState<any>({});

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex gap-x-8 py-4 px-5">
      <Head title="管理 / 播客信息" description="修改你的播客信息和元数据" />
      <div>
        <button
          aria-label="upload image"
          type="button"
          className="bg-gray-100 rounded-xl h-64 w-64 flex items-center justify-center shadow-lg border"
          style={{
            backgroundImage: `url(${data.podcast.profile.cover_art_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
      <div className="flex-1">
        {podcastInfo.name}
        <div>
          <Input
            name="播客名称 / Name"
            placeholder={data.podcast.name}
            value={podcastInfo.name}
            onChange={(e: { target: { value: any } }) => {
              setInfo({
                ...podcastInfo,
                ...{ name: e.target.value },
              });
            }}
          />
        </div>
        <div className="mt-3">
          <TextArea
            name="播客简介 / Description"
            placeholder={data.podcast.name}
            value={podcastInfo.des}
            onChange={(e: { target: { value: any } }) => {
              setInfo({
                ...podcastInfo,
                ...{ des: e.target.value },
              });
            }}
            maxLength={255}
            minLength={1}
            rows={3}
          />
        </div>
        <div className="mt-1 flex gap-x-2">
          <div>
            <select
              value={podcastInfo.type || data.podcast.type}
              onChange={(e) => {
                setInfo({ ...podcastInfo, ...{ type: e.target.value } });
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
            >
              <option value="" disabled>
                选择播客类型...
              </option>
              <option value="episodic">单集 (Episodic)</option>
              <option value="serial">季集 (Serial)</option>
            </select>
          </div>
          <div>
            <select
              value={
                podcastInfo.contentType || data.podcast.profile.clean_content
              }
              onChange={(e) => {
                setInfo({
                  ...podcastInfo,
                  ...{ contentType: e.target.value },
                });
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
            >
              <option value="" disabled>
                选择播客节目类型...
              </option>
              <option value="false">包含 (Explicit content)</option>
              <option value="true">不包含 (No explicit content)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
