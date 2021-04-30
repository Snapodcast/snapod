import React from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { GET_PODCASTS } from '../../../lib/GraphQL/queries';
import * as Store from '../../../lib/Store';
import Icons from '../../../components/Icons';
import { useHistory } from 'react-router-dom';

interface QueryInterface {
  loading: boolean;
  error: ApolloError | undefined;
  data: any;
  history: any;
  setAnimation: any;
  refetch: any;
}

const PodcastsContainer = ({
  loading,
  error,
  data,
  history,
  setAnimation,
  refetch,
}: QueryInterface) => {
  if (loading)
    return (
      <div className="flex justify-center">
        <span className="animate-spin w-5 h-5">
          <Icons name="spinner" />
        </span>
      </div>
    );
  if (error)
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

  return (
    <div>
      {data.length ? (
        data.map((podcast: any) => (
          <div key={podcast.cuid}>
            <h3>{podcast.name}</h3>
            <p>{podcast.description}</p>
          </div>
        ))
      ) : (
        <div className="flex justify-center">
          <button
            aria-label="create"
            type="button"
            className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
            onClick={() => {
              setAnimation(true);
              setTimeout(() => {
                history.push('/landing/create/podcast');
              }, 500);
            }}
          >
            创建新播客 →
          </button>
        </div>
      )}
    </div>
  );
};

export default function StartSingle() {
  const authorCuid = Store.get('currentUser.cuid');
  const { loading, error, data, refetch } = useQuery(GET_PODCASTS(authorCuid));
  const history = useHistory();
  const [showAnimation, setShowAnimation] = React.useState(false);

  return (
    <div
      className={`z-10 shadow-md rounded-md w-2/5 bg-white px-8 py-7 no-drag animate-slideUp ${
        showAnimation && 'animate-slideDown'
      }`}
    >
      <div className="text-center">
        <h1 className="font-bold text-5xl tracking-wide">
          <span role="img" aria-label="snapod-logo" className="mr-0.5">
            🎙️
          </span>
        </h1>
        <p className="text-gray-500 text-sm mt-1.5 transition-all">
          {loading
            ? '正在为你加载内容'
            : error
            ? '加载失败'
            : '欢迎使用 Snapod, 让我们开始吧'}
        </p>
      </div>
      <div className="justify-center text-center mt-5">
        <PodcastsContainer
          loading={loading}
          error={error}
          data={data}
          history={history}
          setAnimation={setShowAnimation}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
