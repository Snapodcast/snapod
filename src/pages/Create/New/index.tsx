import React from 'react';
import { useHistory } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import validator from 'validator';
import StorageContext from '../../../lib/Context/storage';
import PodcastContext from '../../../lib/Context/podcast';
import Head from '../../../components/Head';
import Icons from '../../../components/Icons';
import podcastCreate from '../../../lib/Database/create';

export default function New({ mutate }: { mutate: any }) {
  const { storageDir, setStorageDir } = React.useContext(StorageContext);
  const { setPodcast } = React.useContext(PodcastContext);

  // Router history
  const history = useHistory();

  // Logo
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [imageBlob, setImageBlob] = React.useState<string>('');
  const [confirmImage, setConfirm] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Podcast info
  const [podcastName, setName] = React.useState<string>('');
  const [podcastDes, setDes] = React.useState<string>('');
  const [podcastAdvisory, setAdvisory] = React.useState<string>('clean');
  const [podcastAuthor, setAuthor] = React.useState<string>('');
  const [podcastOwnerName, setOwnerName] = React.useState<string>('');
  const [podcastOwnerEmail, setOwnerEmail] = React.useState<string>('');

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

  // Podcast local storage directory
  const [podcastStorageDir, setPodcastStorageDir] = React.useState<string>('');
  const selectStorageDir = () => {
    setPodcastStorageDir(ipcRenderer.sendSync('select-dir')[0]);
  };

  // Create

  const [createLoading, setCreateLoading] = React.useState<boolean>(false);

  const doCreate = async () => {
    setCreateLoading(true);
    // Determine if any required field is empty
    if (
      confirmImage &&
      !loading &&
      podcastName &&
      podcastDes &&
      podcastAuthor &&
      podcastAdvisory &&
      podcastOwnerName
    ) {
      if (!validator.isEmail(podcastOwnerEmail)) {
        alert(`${podcastOwnerEmail} is not a valid email.`);
      } else if (!validator.isURL(imageUrl)) {
        alert(`Podcast logo does not have a valid url.`);
      } else {
        const statusJson = await podcastCreate({
          dir: podcastStorageDir,
          logo: imageUrl,
          name: podcastName,
          description: podcastDes,
          author: podcastAuthor,
          advisory: podcastAdvisory,
          owner: {
            name: podcastOwnerName,
            email: podcastOwnerEmail,
          },
        });
        if (statusJson.status) {
          mutate();
          setPodcast(podcastName);
          setStorageDir(podcastStorageDir);
          history.push('/podcast');
        } else {
          alert(statusJson.msg);
        }
      }
    } else {
      alert('Imcomplete Infomation');
    }
    setCreateLoading(false);
  };

  return (
    <div className="p-5 h-full w-full">
      <Head title="New Podcast" description="Create a new podcast" />
      <div className="flex h-full">
        <div>
          <div
            className={`flex justify-center items-center podcast-image bg-gray-400 rounded-md shadow-lg border ${
              loading ? 'animate-pulse' : ''
            }`}
            style={{
              backgroundImage: `url("${confirmImage ? imageBlob : ''}")`,
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
          <div className="w-full mt-4 group flex">
            <input
              onChange={(e) => {
                setConfirm(false);
                setImageUrl(e.target.value);
              }}
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
                {loading ? <Icons name="refresh" /> : <Icons name="confirm" />}
              </span>
            </div>
          </div>
        </div>
        <div className="podcast-info">
          <p className="w-full">
            <input
              type="text"
              value={podcastName}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Podcast Name"
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </p>
          <p className="w-full mt-2">
            <textarea
              value={podcastDes}
              onChange={(e) => {
                setDes(e.target.value);
              }}
              placeholder="Podcast Description"
              className="tracking-wide resize-none focus:outline-none border h-20 rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </p>
          <p className="w-full mt-5">
            <select
              value={podcastAdvisory}
              onChange={(e) => {
                setAdvisory(e.target.value);
              }}
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-2 text-gray-700"
            >
              <option value="clean">Clean</option>
              <option value="explicit">Explicit</option>
            </select>
          </p>
          <p className="w-full mt-2">
            <input
              type="text"
              value={podcastAuthor}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
              placeholder="Author Name"
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </p>
          <p className="w-full mt-2">
            <input
              type="text"
              value={podcastOwnerName}
              onChange={(e) => {
                setOwnerName(e.target.value);
              }}
              placeholder="Owner Name"
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </p>
          <p className="w-full mt-2">
            <input
              type="email"
              value={podcastOwnerEmail}
              onChange={(e) => {
                setOwnerEmail(e.target.value);
              }}
              placeholder="Owner Email"
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-700"
            />
          </p>
          <div className="w-full mt-6 flex">
            <input
              disabled
              value={podcastStorageDir}
              placeholder={`Local files folder (${storageDir})`}
              className="tracking-wide focus:outline-none border rounded-md w-full shadow-sm text-sm py-1.5 px-3 text-gray-400"
            />
            <button
              className="ml-2 h-input tracking-wide focus:outline-none border rounded-md shadow-sm hover:text-white hover:bg-blue-500 hover:border-blue-500 text-sm py-1.5 px-3 text-gray-500"
              type="button"
              onClick={() => selectStorageDir()}
            >
              Choose...
            </button>
          </div>
          <button
            type="button"
            onClick={() => doCreate()}
            className={`focus:outline-none tracking-wide text-base rounded-md mt-7 w-full py-1.5 justify-center items-center text-white bg-blue-500 shadow-sm flex ${
              createLoading ? 'animate-pulse' : ''
            }`}
          >
            Create
            <span className="w-4 h-4 ml-1">
              <Icons name="right" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
