import { useMutation } from '@apollo/client';
import React from 'react';
import { useHistory } from 'react-router';
import * as Store from '../../../lib/Store';
import { DELETE_PODCAST } from '../../../lib/GraphQL/queries';
import Head from '../../../components/Head';

export default function PodcastSettings() {
  const podcastCuid = Store.get('currentPodcast.cuid');
  const history = useHistory();
  const [deletePodcast] = useMutation(DELETE_PODCAST);
  const [deleting, setDeleting] = React.useState(false);

  const doDelete = async () => {
    setDeleting(true);
    if (window.confirm('请确认删除\n此操作将不可重做')) {
      await deletePodcast({
        variables: {
          podcastCuid,
        },
      })
        .then(async () => {
          setDeleting(false);
          alert('删除成功');
          history.push('/landing/start');
        })
        .catch(() => {
          setDeleting(false);
          alert(`删除失败`);
        });
    } else {
      setDeleting(false);
    }
  };

  return (
    <div className="my-4 mx-5">
      <Head title="偏好设置" description="播客及应用程序偏好设置" />
      <section className="flex-1 border rounded-lg py-3 px-4">
        <div className="items-center mb-2">
          <span className="flex-1 items-center">
            <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
              永久删除播客
            </em>
            <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
              Delete podcast permanently
            </em>
          </span>
        </div>
        <button
          className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white text-sm py-1 px-2 rounded-md"
          aria-label="delete podcast"
          type="button"
          onClick={() => {
            if (!deleting) {
              doDelete();
            }
          }}
        >
          {deleting ? '删除中 Deleting...' : '删除播客 / Delete Podcast'}
        </button>
      </section>
    </div>
  );
}
