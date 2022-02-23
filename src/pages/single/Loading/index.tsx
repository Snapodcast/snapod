import React from 'react';
import Icons from '../../../components/Icons';
import { useI18n } from '../../../hooks';

export default function LoadingPage() {
  const { t } = useI18n();
  return (
    <div className="z-10 shadow-md rounded-md w-2/5 max-h-100 overflow-y-auto overflow-hidden bg-white px-8 py-7 no-drag animate-slideUp">
      <div className="text-center">
        <h1 className="font-bold text-5xl tracking-wide">
          <span role="img" aria-label="snapod-logo" className="mr-0.5">
            🎙️
          </span>
        </h1>
        <p className="text-gray-500 text-sm mt-1.5 transition-all">
          {t('loadingContent')}
        </p>
        <div className="justify-center text-center mt-5">
          <div className="flex justify-center">
            <span className="w-5 h-5 spinner-start">
              <Icons name="spinner" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
