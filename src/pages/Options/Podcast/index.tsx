/* eslint-disable no-else-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import React from 'react';
import validator from 'validator';

import StorageContext from '../../../lib/Context/storage';
import PodcastContext from '../../../lib/Context/podcast';

import usePodcast, { refetchPodcast } from '../../../lib/DataFetching/podcast';

import Head from '../../../components/Head';
import Icons from '../../../components/Icons';
import podcastUpdate from '../../../lib/Database/update';
import CateSelect from '../../../components/CateSelect';
import LangSelect from '../../../components/LangSelect';

export default function Podcast({ mutate }: { mutate: any }) {
  const { storageDir } = React.useContext(StorageContext);
  const { podcast } = React.useContext(PodcastContext);

  // Logo
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [imageBlob, setImageBlob] = React.useState<string>('');
  const [confirmImage, setConfirm] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Podcast info
  const [podcastName, setName] = React.useState<string>('');
  const [podcastDes, setDes] = React.useState<string>('');
  const [podcastAdvisory, setAdvisory] = React.useState<string>('');
  const [podcastAuthor, setAuthor] = React.useState<string>('');
  const [podcastOwnerName, setOwnerName] = React.useState<string>('');
  const [podcastOwnerEmail, setOwnerEmail] = React.useState<string>('');
  const [podcastType, setType] = React.useState<string>('');
  const [podcastCate, setCate] = React.useState<string>('');
  const [podcastLang, setLang] = React.useState<string>('');
  const [podcastUrl, setUrl] = React.useState<'snapod' | string>('snapod');

  // Podcast logo
  const fetchImage = () => {
    setLoading(true);
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((image) => {
        setImageBlob(URL.createObjectURL(image));
        setConfirm(true);
        setLoading(false);
      })
      .catch(() => {
        alert('Error loading your logo');
        setLoading(false);
      });
  };

  // Update
  const [updateLoading, setUpdateLoading] = React.useState<boolean>(false);

  const doUpdate = async () => {
    setUpdateLoading(true);
    // Determine if any required field is empty
    if (
      confirmImage &&
      !loading &&
      podcastName &&
      podcastDes &&
      podcastAuthor &&
      podcastAdvisory &&
      podcastOwnerName &&
      podcastCate &&
      podcastLang &&
      podcastType &&
      podcastUrl
    ) {
      if (!validator.isEmail(podcastOwnerEmail)) {
        alert(`${podcastOwnerEmail} is not a valid email.`);
      } else if (!validator.isURL(imageUrl)) {
        alert(`Podcast logo does not have a valid url.`);
      } else {
        const statusJson = await podcastUpdate({
          id: podcast,
          dir: storageDir,
          logo: imageUrl,
          name: podcastName,
          description: podcastDes,
          cate: podcastCate,
          type: podcastType,
          lang: podcastLang,
          url: podcastUrl,
          author: podcastAuthor,
          advisory: podcastAdvisory,
          owner: {
            name: podcastOwnerName,
            email: podcastOwnerEmail,
          },
        });
        if (statusJson.status) {
          refetchPodcast(podcast);
          mutate();
          alert(`${podcastName} has been updated`);
        } else {
          alert(statusJson.msg);
        }
      }
    } else {
      alert('Imcomplete Infomation');
    }
    setUpdateLoading(false);
  };

  // Fetch current podcast data
  const { podcastData, isLoading, isError } = usePodcast(podcast, storageDir);

  // Update states
  React.useEffect(() => {
    setImageUrl(podcastData ? podcastData.logo : '');
    setConfirm(true);
    setName(podcastData ? podcastData.name : '');
    setDes(podcastData ? podcastData.description : '');
    setAdvisory(podcastData ? podcastData.advisory : '');
    setAuthor(podcastData ? podcastData.author : '');
    setOwnerName(
      podcastData ? (podcastData.owner ? podcastData.owner.name : '') : ''
    );
    setOwnerEmail(
      podcastData ? (podcastData.owner ? podcastData.owner.email : '') : ''
    );
    setType(podcastData ? podcastData.type : '');
    setCate(podcastData ? podcastData.cate : '');
    setLang(podcastData ? podcastData.lang : '');
    setUrl(podcastData ? podcastData.url : 'snapod');
    return () => {
      setImageUrl('');
      setConfirm(false);
      setName('');
      setDes('');
      setAdvisory('');
      setAuthor('');
      setOwnerName('');
      setOwnerEmail('');
      setType('');
      setCate('');
      setLang('');
      setUrl('snapod');
    };
  }, [podcastData]);

  if (isError || (!isError && !isLoading && podcastData === undefined)) {
    return (
      <div className="h-full w-full items-center justify-center flex">
        <div>
          <p className="h-20 w-20 mx-auto">
            <span className="text-gray-500">
              <Icons name="info" />
            </span>
          </p>
          <p className="text-gray-600">
            Please choose or create a podcast to view info
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full items-center justify-center flex">
        <span className="animate-spin h-10 w-10 text-gray-400">
          <Icons name="refresh" />
        </span>
      </div>
    );
  }

  return (
    <div
      className={`p-5 ${!isLoading && !isError ? 'h-auto' : 'h-full'} w-full`}
    >
      <Head
        title={podcastData ? podcastData.name : 'Podcast'}
        description="View info and modify settings"
      />
      <div className="flex h-full">
        <div>
          <div
            className={`flex justify-center items-center podcast-image bg-gray-400 rounded-md shadow-lg border ${
              loading ? 'animate-pulse' : ''
            }`}
            style={{
              backgroundImage: `url("${
                confirmImage ? (imageBlob !== '' ? imageBlob : imageUrl) : ''
              }")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {!confirmImage && (
              <span className="w-28 h-28 text-gray-500">
                <Icons name="microphone" />
              </span>
            )}
          </div>
          <div className="w-full mt-4">
            <p className="text-xs text-gray-400">Image URL</p>
            <div className="w-full mt-0.5 group flex">
              <input
                onChange={(e) => {
                  setConfirm(false);
                  setImageUrl(e.target.value);
                }}
                value={imageUrl}
                required
                placeholder="Image URL"
                className="tracking-wide focus:outline-none border rounded-md group-hover:border-r-0 group-hover:rounded-tr-none group-hover:rounded-br-none w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
              />
              <div
                role="button"
                tabIndex={0}
                onClick={() => fetchImage()}
                onKeyDown={() => fetchImage()}
                className="focus:outline-none cursor-pointer rounded-tl-none rounded-bl-none rounded-md img-confirm p-1 bg-blue-500 group-hover:flex hidden text-white shadow-sm"
              >
                <span className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}>
                  {loading ? (
                    <Icons name="refresh" />
                  ) : (
                    <Icons name="confirm" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="podcast-info">
          <div className="w-full">
            <p className="text-xs text-gray-400 mb-0.5">Name</p>
            <input
              type="text"
              value={podcastName}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Podcast Name"
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
          <div className="w-full mt-3">
            <p className="text-xs text-gray-400 mb-0.5">Description</p>
            <textarea
              value={podcastDes}
              onChange={(e) => {
                setDes(e.target.value);
              }}
              placeholder="Podcast Description"
              className="tracking-wide resize-none focus:outline-none border h-20 rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
          <p className="w-full mt-5 grid grid-cols-2 shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => {
                setUrl('snapod');
              }}
              className={`focus:outline-none text-sm rounded-tl-md rounded-bl-md py-1.5 px-2 ${
                podcastUrl === 'snapod'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 border border-r-0'
              }`}
            >
              Snapod Hosting
            </button>
            <button
              type="button"
              onClick={() => {
                setUrl('');
              }}
              className={`focus:outline-none text-sm rounded-tr-md rounded-br-md py-1.5 px-2 ${
                podcastUrl !== 'snapod'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 border border-l-0'
              }`}
            >
              Custom site URL
            </button>
          </p>
          {podcastUrl === 'snapod' && (
            <p className="text-gray-400 text-xs mt-2">
              Note: You will still be able to assign a custom domain to your
              Snapod site later,{' '}
              <a
                href="https://snapodcast.com/help/customize-domain"
                className="text-blue-500"
                target="_blank"
                rel="noreferrer"
              >
                Learn more →
              </a>
            </p>
          )}
          {podcastUrl !== 'snapod' && (
            <p>
              <input
                type="text"
                value={podcastUrl}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                placeholder="Site URL"
                className="mt-2 tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
              />
            </p>
          )}
          <div className="w-full mt-6">
            <p className="text-xs text-gray-400 mb-0.5">Author&apos;s name</p>
            <input
              type="text"
              value={podcastAuthor}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
              placeholder="Author Name"
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
          <div className="w-full mt-3">
            <p className="text-xs text-gray-400 mb-0.5">Owner&apos;s name</p>
            <input
              type="text"
              value={podcastOwnerName}
              onChange={(e) => {
                setOwnerName(e.target.value);
              }}
              placeholder="Owner Name"
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
          <div className="w-full mt-3">
            <p className="text-xs text-gray-400 mb-0.5">Owner&apos;s email</p>
            <input
              type="email"
              value={podcastOwnerEmail}
              onChange={(e) => {
                setOwnerEmail(e.target.value);
              }}
              placeholder="Owner Email"
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
          <div className="w-full mt-6">
            <p className="text-xs text-gray-400 mb-0.5">Category</p>
            <CateSelect podcastCate={podcastCate} setCate={setCate} />
          </div>
          <div className="w-full mt-3">
            <p className="text-xs text-gray-400 mb-0.5">Language</p>
            <LangSelect podcastLang={podcastLang} setLang={setLang} />
          </div>
          <div className="w-full mt-3">
            <p className="text-xs text-gray-400 mb-0.5">Podcast Type</p>
            <select
              value={podcastType}
              onChange={(e) => {
                setType(e.target.value);
              }}
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-2 text-gray-700"
            >
              <option value="" disabled>
                Podcast Type
              </option>
              <option value="episodic">Episodic</option>
              <option value="serial">Serial</option>
            </select>
          </div>
          <div className="w-full mt-3">
            <p className="text-xs text-gray-400 mb-0.5">Content advisory</p>
            <select
              value={podcastAdvisory}
              onChange={(e) => {
                setAdvisory(e.target.value);
              }}
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-2 text-gray-700"
            >
              <option value="" disabled>
                Content advisory
              </option>
              <option value="clean">Clean</option>
              <option value="explicit">Explicit</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => doUpdate()}
            className={`focus:outline-none tracking-wide text-base rounded-md mt-7 w-full py-1.5 justify-center items-center text-white bg-blue-500 shadow-sm flex ${
              updateLoading ? 'animate-pulse' : ''
            }`}
          >
            Save
            <span className="w-4 h-4 ml-1">
              <Icons name="right" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
