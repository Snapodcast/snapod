/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { useHistory } from 'react-router-dom';
import CateSelect from '../../../components/CateSelect';
import LangSelect from '../../../components/LangSelect';
import Switch from 'react-switch';
import Icons from '../../../components/Icons';
import { CREATE_PODCAST } from '../../../lib/GraphQL/queries';
import { useMutation } from '@apollo/client';
import * as Store from '../../../lib/Store';
import selectImageAndUploadToCDN from '../../../lib/Upload/Image';

interface ContainerInterface {
  stepNumber: number;
  setStep: any;
  podcastInfo: any;
  setPodcastInfo: any;
  podcastImage: string;
  selectImage: any;
  uploading: boolean;
}

const StepContainer = ({
  stepNumber,
  setStep,
  podcastInfo,
  setPodcastInfo,
  podcastImage,
  selectImage,
  uploading,
}: ContainerInterface) => {
  switch (stepNumber) {
    case 6:
      return (
        <div className="justify-center mt-5 text-center">
          <p className="animate-spin w-full flex justify-center mb-2">
            <span className="w-6 h-6">
              <Icons name="spinner" />
            </span>
          </p>
          <p className="ml-1 text-xs font-medium text-gray-500">
            创建中 / Creating your podcast
          </p>
        </div>
      );
    case 5:
      return (
        <div className="mt-5 w-full rounded-md bg-gray-100 h-25 flex p-2.5 gap-x-2">
          <button
            aria-label="upload image"
            type="button"
            onClick={() => {
              if (!uploading) {
                selectImage();
              }
            }}
            className="bg-gray-200 rounded-md h-20 w-20 flex items-center justify-center flex-2 border"
            style={{
              backgroundImage: `url(${podcastImage || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {!podcastImage && (
              <span className="w-6 h-6 text-gray-500">
                <Icons name="image" />
              </span>
            )}
          </button>
          <div className="flex-1 flex items-center">
            <div>
              <p className="ml-1 text-xs font-medium text-gray-500 not-italic">
                播客封面图像 / Cover Art
              </p>
              <p className="text-xs text-gray-400 ml-1 mt-1">
                {!uploading
                  ? `封面图像建议最小 1400 x 1400px, 最大 3000 x 3000px, 使用
                JPEG(.jpg) 或者 PNG(.png) 格式文件, 72 dpi`
                  : '上传中'}
              </p>
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div>
          <p className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                播客语言 / Language
              </em>
            </span>
            <LangSelect
              podcastLang={podcastInfo.lang}
              setLang={(lang: string) => {
                setPodcastInfo({ ...podcastInfo, ...{ lang } });
              }}
            />
            <span className="text-xs text-gray-400 ml-1 mt-1">
              你的播客主要用语
            </span>
          </p>
          <p className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                节目类型 / Content Type
              </em>
            </span>
            <select
              onChange={(e) => {
                setPodcastInfo({
                  ...podcastInfo,
                  ...{ contentType: e.target.value },
                });
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
            >
              <option value="" disabled>
                选择播客节目类型...
              </option>
              <option value="yes">包含潜在不当内容 (Explicit content)</option>
              <option value="no">
                不包含潜在不当内容 (No explicit content)
              </option>
            </select>
            <span className="text-xs text-gray-400 ml-1 mt-1">
              你的播客是否包含潜在不当内容
            </span>
          </p>
          <div className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                版权字段 / Copyright
              </em>
              <Switch
                onChange={() => {
                  setPodcastInfo({
                    ...podcastInfo,
                    ...{ useCr: !podcastInfo.useCr },
                  });
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
              placeholder="©️2021 你的播客"
              onChange={(e) => {
                setPodcastInfo({
                  ...podcastInfo,
                  ...{ copyRight: e.target.value },
                });
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            <span className="text-xs text-gray-400 ml-1 mt-1">
              (可选) 你的播客版权信息
            </span>
          </div>
          <div className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                播客所有 Owner Info
              </em>
              <Switch
                onChange={() => {
                  setPodcastInfo({
                    ...podcastInfo,
                    ...{ useOwner: !podcastInfo.useOwner },
                  });
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
            </span>
            <input
              disabled={!podcastInfo.useOwner}
              placeholder="所有人名称"
              onChange={(e) => {
                setPodcastInfo({
                  ...podcastInfo,
                  ...{ ownerName: e.target.value },
                });
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            <input
              disabled={!podcastInfo.useOwner}
              placeholder="所有人邮箱"
              onChange={(e) => {
                setPodcastInfo({
                  ...podcastInfo,
                  ...{ ownerEmail: e.target.value },
                });
              }}
              className="mt-2 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            <span className="text-xs text-gray-400 ml-1 mt-1">
              (可选) 你的播客实际所有人信息
            </span>
          </div>
        </div>
      );
    case 3:
      return (
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              播客类型 / Type
            </em>
          </span>
          <select
            onChange={(e) => {
              setPodcastInfo({ ...podcastInfo, ...{ type: e.target.value } });
            }}
            className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
          >
            <option value="" disabled>
              选择播客类型...
            </option>
            <option value="episodic">单集 (Episodic)</option>
            <option value="serial">季集 (Serial)</option>
          </select>
          <span className="text-xs text-gray-400 ml-1 mt-1">
            你的播客节目可按集或按季呈现
          </span>
        </p>
      );
    case 2:
      return (
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              播客分类 / Category
            </em>
          </span>
          <CateSelect
            podcastCate={podcastInfo.cate}
            setCate={(cate: string) => {
              setPodcastInfo({ ...podcastInfo, ...{ cate } });
            }}
          />
          <span className="text-xs text-gray-400 ml-1 mt-1">
            你的播客内容所属分类 (Apple Podcasts 标准)
          </span>
        </p>
      );
    case 1:
      return (
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              播客简介 / Description
            </em>
          </span>
          <textarea
            autoFocus
            placeholder="播客描述"
            maxLength={255}
            minLength={1}
            rows={3}
            onChange={(e) => {
              setPodcastInfo({ ...podcastInfo, ...{ des: e.target.value } });
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setStep(stepNumber + 1);
              }
            }}
            className="mt-1 resize-none tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          <span className="text-xs text-gray-400 ml-1 -mt-0.5">
            简单地介绍你的播客
          </span>
        </p>
      );
    default:
      return (
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              播客名称 / Name
            </em>
          </span>
          <input
            autoFocus
            placeholder="播客名"
            maxLength={255}
            minLength={1}
            onChange={(e) => {
              setPodcastInfo({ ...podcastInfo, ...{ name: e.target.value } });
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setStep(stepNumber + 1);
              }
            }}
            className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          <span className="text-xs text-gray-400 ml-1 mt-1">
            ({podcastInfo.name ? podcastInfo.name.length : 0} / 255)
            为你的播客起个响亮的名字
          </span>
        </p>
      );
  }
};

export default function CreatePodcast() {
  const history = useHistory();
  const [creatPodcast] = useMutation(CREATE_PODCAST);

  const [stepNumber, setStepNumber] = React.useState(0);
  const [podcastImage, setImage] = React.useState<any>('');
  const [podcastImageUrl, setImageUrl] = React.useState<any>('');
  const [podcastImageUploading, setUploading] = React.useState(false);
  const [podcastInfo, setPodcastInfo] = React.useState({
    name: '',
    des: '',
    type: 'episodic',
    contentType: 'no',
    cate: '',
    lang: 'zh-cn',
    useCr: false,
    useOwner: false,
    ownerName: '',
    ownerEmail: '',
    copyRight: '©️',
  });

  const selectImage = async () => {
    setUploading(true);
    const result = await selectImageAndUploadToCDN();
    setImage(result.imagePath);
    setImageUrl(result.remotePath);
    setUploading(false);
  };

  const doCreatePodcast = async () => {
    await creatPodcast({
      variables: {
        authorCuid: Store.get('currentUser.cuid'),
        name: podcastInfo.name,
        description: podcastInfo.des,
        type: podcastInfo.type,
        language: podcastInfo.lang,
        category: podcastInfo.cate,
        contentClean: podcastInfo.contentType === 'no',
        coverImageUrl: podcastImageUrl,
        copyright: podcastInfo.useCr ? podcastInfo.copyRight : null,
        ownerName: podcastInfo.useOwner ? podcastInfo.ownerName : null,
        ownerEmail: podcastInfo.useOwner ? podcastInfo.ownerEmail : null,
      },
    })
      .then((res: any) => {
        Store.set({
          currentPodcast: res.data.createPodcast,
        });
        alert(`创建成功`);
        history.push('/snapod');
      })
      .catch(() => {
        alert(`创建失败\n请检查信息已填写完整`);
        setStepNumber(5);
      });
  };

  return (
    <div className="z-10 shadow-md rounded-md w-2/5 bg-white px-8 py-7 no-drag animate-slideUp">
      {stepNumber === 0 && (
        <button
          className="rounded-full -ml-6 bg-white absolute -mt-17 shadow-md flex justify-center items-center h-7 w-7 text-gray-600"
          aria-label="select existing podcast"
          type="button"
          onClick={() => {
            history.goBack();
          }}
        >
          ←
        </button>
      )}
      <div className="mb-2 flex gap-x-2 items-center">
        <h2 className="font-bold text-xl tracking-wide flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
          <span role="img" aria-label="snapod-logo" className="mr-1">
            🎙️
          </span>
          {podcastInfo.name || '新建播客'}
        </h2>
        <span className="text-gray-500 text-sm">步骤 {stepNumber + 1} / 7</span>
      </div>
      <StepContainer
        stepNumber={stepNumber}
        setStep={setStepNumber}
        podcastInfo={podcastInfo}
        setPodcastInfo={setPodcastInfo}
        podcastImage={podcastImage}
        selectImage={selectImage}
        uploading={podcastImageUploading}
      />
      {stepNumber < 6 && (
        <div className="mt-5 w-full flex gap-x-3">
          {stepNumber > 0 && (
            <button
              aria-label="previous step"
              className="flex px-3 items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1 text-center"
              type="button"
              onClick={() => {
                setStepNumber(stepNumber - 1);
              }}
            >
              ← 上一步
            </button>
          )}
          <button
            aria-label="next step"
            className="flex px-3 items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1 text-center"
            type="button"
            onClick={() => {
              setStepNumber(stepNumber + 1);
              if (stepNumber === 5 && !podcastImageUploading) {
                doCreatePodcast();
              }
            }}
          >
            {stepNumber === 5 ? '创建播客' : '下一步 →'}
          </button>
        </div>
      )}
    </div>
  );
}
