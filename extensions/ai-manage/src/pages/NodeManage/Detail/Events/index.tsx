import React from 'react';
import { Events } from '@ks-console/shared';
import { useStore } from '@kubed/stook';

export default function DetailMetaData() {
  const [detail] = useStore('detailProps');
  return <Events detail={detail} module="nodes" />;
}
