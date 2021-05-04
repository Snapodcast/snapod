import React from 'react';
import HeadContext, { HeadContextParams } from '../../lib/Context/head';

export default function Head({
  title,
  description,
  savable,
  doSave,
}: HeadContextParams) {
  const { head, setHead } = React.useContext(HeadContext);
  React.useEffect(() => {
    if (
      head &&
      (head.title !== title ||
        head.description !== description ||
        head.savable !== savable)
    ) {
      setHead({
        title,
        description,
        savable,
        doSave,
      });
    }
  });
  return <div className="hidden" />;
}
