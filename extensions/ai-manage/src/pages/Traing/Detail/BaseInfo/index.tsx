import React from 'react';
import { Panel } from '@ks-console/shared';
// import { Col, Row } from '@kubed/components';

import StatusInfo from './statusInfo';

function BaseInfo() {
  return (
    <Panel title="任务运行信息">
      <StatusInfo />
    </Panel>
  );
}

export default BaseInfo;
