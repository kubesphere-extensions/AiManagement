import React from 'react';
import { Nodes } from '@kubed/icons';
import { Banner } from '@kubed/components';

import NodeStatus from './nodeStatus';
import Tables from './Tables';

function NodeManage() {
  return (
    <>
      <Banner
        className="mb12"
        icon={<Nodes />}
        title={t('Node Manage')}
        description={t('Node Desc')}
      />
      <NodeStatus />
      <Tables />
    </>
  );
}

export default NodeManage;
