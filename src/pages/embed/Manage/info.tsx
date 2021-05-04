import React from 'react';
import * as Store from '../../../lib/Store';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PODCAST, MODIFY_PODCAST } from '../../../lib/GraphQL/queries';
import { Input, TextArea } from '../../../components/Form';
import Head from '../../../components/Head';
import CateSelect from '../../../components/CateSelect';
import Switch from 'react-switch';
import LangSelect from '../../../components/LangSelect';
import Icons from '../../../components/Icons';
import { ipcRenderer } from 'electron';
import uploadFileToCDN from '../../../lib/Qiniu';
import fs from 'fs';
import path from 'path';

export default function ManagePodcast() {
  const podcastCuid = Store.get('currentPodcast.cuid');
  const { loading, error, data, refetch } = useQuery(GET_PODCAST, {
    variables: { podcastCuid },
    fetchPolicy: 'network-only',
  });
  const [modifyPodcast] = useMutation(MODIFY_PODCAST);
  const [podcastInfo, setInfo] = React.useState<any>({
    name: '',
    description: '',
    type: 'episodic',
    clean_content: 'false',
    language: 'zh-cn',
    category_name: '',
    useCr: false,
    copyright: '',
    useOwner: false,
    ownerName: '',
    ownerEmail: '',
    complete: 'false',
    block: 'false',
  });
  const [savable, setSavable] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  /* Save action */
  const doSave = async () => {
    if (!uploading) {
      setSaving(true);
      const postBody = { ...podcastInfo };
      postBody.podcastCuid = podcastCuid;
      postBody.clean_content = podcastInfo.clean_content === 'true';
      postBody.copyright = podcastInfo.useCr ? podcastInfo.copyright : null;
      postBody.ownerName = podcastInfo.useOwner ? podcastInfo.ownerName : null;
      postBody.ownerEmail = podcastInfo.useOwner
        ? podcastInfo.ownerEmail
        : null;
      postBody.complete = podcastInfo.complete === 'true';
      postBody.block = podcastInfo.block === 'true';
      delete postBody.useCr;
      delete postBody.useOwner;
      delete postBody.image;

      await modifyPodcast({
        variables: postBody,
      })
        .then((res: any) => {
          Store.set('currentPodcast.name', res.data.modifyPodcast.name);
          refetch();
          alert('修改成功');
        })
        .catch(() => {
          alert(`修改失败`);
        });
      setSaving(false);
    }
  };

  /* Select cover art image action */
  const selectImage = async () => {
    setUploading(true);
    const imagePaths = await ipcRenderer.invoke('select-image');
    if (imagePaths.length) {
      const url = await uploadFileToCDN(imagePaths[0]);
      setInfo({
        ...podcastInfo,
        image: imagePaths[0],
        cover_art_image_url: url,
      });
    }
    setUploading(false);
  };

  const toBase64 = (podcastImage: string) => {
    const image = fs.readFileSync(podcastImage, { encoding: 'base64' });
    const extensionName = path.extname(podcastImage);
    return `data:image/${extensionName.split('.').pop()};base64,${image}`;
  };

  /* Fill in default values */
  const isDataFirstRun = React.useRef(true);
  if (data && isDataFirstRun.current) {
    setInfo({
      name: data.podcast.name,
      description: data.podcast.description,
      type: data.podcast.type,
      clean_content: data.podcast.profile.clean_content.toString(),
      language: data.podcast.profile.language,
      category_name: data.podcast.profile.category_name,
      useCr: !!data.podcast.profile.copyright,
      copyright: data.podcast.profile.copyright,
      useOwner: !!data.podcast.profile.ownerName,
      ownerName: data.podcast.profile.ownerName,
      ownerEmail: data.podcast.profile.ownerEmail,
      complete: data.podcast.profile.complete.toString(),
      block: data.podcast.profile.block.toString(),
      cover_art_image_url: data.podcast.profile.cover_art_image_url,
    });
    isDataFirstRun.current = false;
  }

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
      <div className="flex justify-center">
        <button
          aria-label="create"
          type="button"
          className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
          onClick={() => {
            refetch();
          }}
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 mb-14">
      <Head title="管理播客信息" description="修改你的播客信息和元数据" />
      {savable && (
        <div className="flex justify-center items-center w-full">
          <div className="flex absolute bottom-5 z-10 gap-x-3">
            <button
              className="bg-blue-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-blue-600"
              aria-label="save changes"
              type="button"
              onClick={() => {
                doSave();
              }}
            >
              {saving ? '保存中...' : uploading ? '上传中...' : '保存更改'}
            </button>
          </div>
        </div>
      )}
      <section className="border-b flex gap-x-8 mb-4 pb-8 mx-5 border-gray-200">
        <div>
          <button
            aria-label="upload image"
            type="button"
            className="bg-gray-100 rounded-xl h-64 w-64 flex items-center justify-center shadow-lg border border-gray-300"
            onClick={() => {
              if (!uploading) {
                selectImage();
              }
              setSavable(true);
            }}
            style={{
              backgroundImage: `url(${
                podcastInfo.image
                  ? toBase64(podcastInfo.image)
                  : podcastInfo.cover_art_image_url
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {uploading && (
            <div className="flex justify-center">
              <span className="bg-blue-500 py-1 px-3 text-xs text-white rounded-xl absolute -mt-9 shadow-lg">
                上传中...
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div>
            <Input
              name="播客名称 / Name"
              placeholder={data.podcast.name}
              value={podcastInfo.name}
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...podcastInfo,
                  name: e.target.value,
                });
                setSavable(true);
              }}
            />
          </div>
          <div className="mt-5">
            <TextArea
              name="播客简介 / Description"
              placeholder={data.podcast.description}
              value={podcastInfo.description}
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...podcastInfo,
                  description: e.target.value,
                });
                setSavable(true);
              }}
              maxLength={255}
              minLength={1}
              rows={3}
            />
          </div>
          <div className="mt-3 flex gap-x-3">
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                  播客类型 / Podcast Type
                </em>
              </span>
              <select
                value={podcastInfo.type}
                onChange={(e) => {
                  setInfo({ ...podcastInfo, type: e.target.value });
                  setSavable(true);
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
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                  节目类型 / Content Type
                </em>
              </span>
              <select
                value={podcastInfo.clean_content}
                onChange={(e) => {
                  setInfo({
                    ...podcastInfo,
                    clean_content: e.target.value,
                  });
                  setSavable(true);
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
      </section>
      <section className="flex gap-x-4 pt-3 mx-5">
        <section className="flex-1 border rounded-lg p-3">
          <div className="items-center mb-4">
            <span className="flex-1 items-center">
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                播客元数据
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Podcast metadata
              </em>
            </span>
          </div>
          <div>
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                播客语言 / Language
              </em>
            </span>
            <LangSelect
              podcastLang={podcastInfo.language}
              setLang={(language: string) => {
                setInfo({ ...podcastInfo, language });
                setSavable(true);
              }}
            />
          </div>
          <div className="mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                播客分类 / Category
              </em>
            </span>
            <CateSelect
              podcastCate={podcastInfo.category_name}
              setCate={(category_name: string) => {
                setInfo({ ...podcastInfo, category_name });
                setSavable(true);
              }}
            />
          </div>
          <div className="mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                版权字段 / Copyright
              </em>
              <Switch
                onChange={() => {
                  setInfo({
                    ...podcastInfo,
                    useCr: !podcastInfo.useCr,
                  });
                  setSavable(true);
                }}
                checked={podcastInfo.useCr}
                handleDiameter={14}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={16}
                width={34}
                className="react-switch"
              />
            </span>
            <input
              disabled={!podcastInfo.useCr}
              placeholder={data.podcast.profile.copyright}
              value={podcastInfo.copyright}
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...podcastInfo,
                  copyright: e.target.value,
                });
                setSavable(true);
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
        </section>
        <section>
          <section className="border rounded-lg p-3">
            <div className="flex items-center mb-4">
              <span className="flex-1 items-center">
                <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                  播客实际所有
                </em>
                <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                  Podcast owner
                </em>
              </span>
              <Switch
                onChange={() => {
                  setInfo({
                    ...podcastInfo,
                    useOwner: !podcastInfo.useOwner,
                  });
                  setSavable(true);
                }}
                checked={podcastInfo.useOwner}
                handleDiameter={14}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={16}
                width={34}
                className="react-switch"
              />
            </div>
            <div>
              <Input
                disabled={!podcastInfo.useOwner}
                name="所有者名称 / Owner Name"
                placeholder={data.podcast.profile.ownerName}
                value={podcastInfo.ownerName}
                onChange={(e: { target: { value: any } }) => {
                  setInfo({
                    ...podcastInfo,
                    ...{ ownerName: e.target.value },
                  });
                  setSavable(true);
                }}
              />
            </div>
            <div className="mt-3">
              <Input
                disabled={!podcastInfo.useOwner}
                name="所有者邮箱 / Owner Email"
                placeholder={data.podcast.profile.ownerEmail}
                value={podcastInfo.ownerEmail}
                onChange={(e: { target: { value: any } }) => {
                  setInfo({
                    ...podcastInfo,
                    ownerEmail: e.target.value,
                  });
                  setSavable(true);
                }}
              />
            </div>
          </section>
          <section className="mt-4 flex gap-x-3 border rounded-lg p-3">
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                  已完结 / Completion
                </em>
              </span>
              <select
                value={podcastInfo.complete}
                onChange={(e) => {
                  setInfo({
                    ...podcastInfo,
                    complete: e.target.value,
                  });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  播客是否完结...
                </option>
                <option value="true">已完结 (Completed)</option>
                <option value="false">未完结 (Incomplete)</option>
              </select>
            </div>
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                  屏蔽收录 / Block
                </em>
              </span>
              <select
                value={podcastInfo.block}
                onChange={(e) => {
                  setInfo({
                    ...podcastInfo,
                    block: e.target.value,
                  });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  是否屏蔽收录...
                </option>
                <option value="true">屏蔽 (Blocked)</option>
                <option value="false">不屏蔽 (Unblocked)</option>
              </select>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}
