import React from 'react';
import Icons from '../../Icons';
import Head from '../../Head';
import { ApolloError } from '@apollo/client';
import { Layout } from '../../../constants';
import { useI18n } from '../../../hooks';

type Props = {
  type?: typeof Layout.LAYOUT_TYPES[keyof typeof Layout.LAYOUT_TYPES];
  states: {
    loading: boolean;
    error: ApolloError;
  };
  functions: {
    reload: () => void;
  };
  info: {
    title: string;
    description: string;
  };
  children: React.ReactNode;
};

export default function EmbedLayout(props: Props) {
  const { t } = useI18n();
  if (props.type === Layout.LAYOUT_TYPES.LIST) {
    if (props.states.loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <span className="w-5 h-5">
            <Icons name="spinner" />
          </span>
        </div>
      );
    }

    if (props.states.error) {
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
                onClick={() => props.functions.reload()}
              >
                {t('reload')}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="my-4 mx-5">
      <Head title={props.info.title} description={props.info.description} />
      {props.children}
    </div>
  );
}

EmbedLayout.defaultProps = {
  type: Layout.LAYOUT_TYPES.DEFAULT,
};
