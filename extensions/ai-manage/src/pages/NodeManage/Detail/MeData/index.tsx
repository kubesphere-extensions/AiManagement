import React from 'react';
import { MetaData } from '@ks-console/shared';
import { useStore } from '@kubed/stook';

export default function DetailMetaData() {
  const [detail] = useStore('detailProps');

  return <MetaData detail={detail} />;
}
