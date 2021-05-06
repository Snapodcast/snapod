import { useEffectOnce } from 'react-use';
import { useHistory } from 'react-router';
import React from 'react';

export default function Reset() {
  const history = useHistory();
  useEffectOnce(() => history.goBack());
  return <></>;
}
