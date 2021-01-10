import React from 'react';
import HeadContext from '../../lib/Context/head';

export default function Head({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { head, setHead } = React.useContext(HeadContext);
  React.useEffect(() => {
    if (head && (head.title !== title || head.description !== description)) {
      setHead({
        title,
        description,
      });
    }
  });
  return <div className="hidden" />;
}
