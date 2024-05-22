import React from 'react';
import { useStore } from '@kubed/stook';
import { get, sortBy } from 'lodash';
import { formatTime } from '@ks-console/shared';

import TimeLine from '../../../../components/TimeLine';

function StatusInfo() {
  const [detail] = useStore('trainingDetail');
  const status = get(detail, 'train_k8s_objects.status.conditions', []);
  const statusOptions = sortBy(status, ['lastTransitionTime']).map(item => ({
    title: t(item?.type),
    time: formatTime(item?.lastTransitionTime),
    desc: item?.message,
    status: item?.status,
  }));

  return (
    <>
      <TimeLine data={statusOptions} />
    </>
  );
}

export default StatusInfo;
