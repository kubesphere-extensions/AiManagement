import React from 'react';
import { ClusterDetail, hasClusterModule } from '@ks-console/shared';
import { useStore } from '@kubed/stook';
import Dashboard from './Dashboard';
// import Initializing from './Initializing';
import Embed from './embed';

function Overview() {
  const [cluster] = useStore<ClusterDetail>('cluster');

  if (hasClusterModule(cluster.name, 'whizard-monitoring')) {
    return <Embed />;
  }
  return <Dashboard />;
}

export default Overview;
