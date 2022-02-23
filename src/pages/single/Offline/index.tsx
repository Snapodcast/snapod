import React from 'react';
import { useHistory } from 'react-router-dom';
import { useI18n } from '../../../hooks';

export default function OfflinePage() {
  const { t } = useI18n();
  const history = useHistory();

  /* Online status detection */
  window.addEventListener('online', () => {
    history.goBack();
  });

  return (
    <div className="z-10 shadow-md rounded-md w-2/5 max-h-96 overflow-y-auto overflow-hidden bg-white dark:bg-darkBg px-8 py-7 no-drag animate-slideUp">
      <div className="text-center">
        <h1 className="font-bold text-5xl tracking-wide">
          <span role="img" aria-label="snapod-logo" className="mr-0.5">
            🔌
          </span>
        </h1>
        <p className="text-gray-500 dark:text-white text-sm mt-1.5 transition-all">
          {t('checkInternet')}
        </p>
      </div>
      <div className="justify-center text-center mt-5 text-gray-600">
        <p>{t('snapodRequiresInternet')}</p>
      </div>
    </div>
  );
}
