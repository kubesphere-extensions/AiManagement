import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import PoolDetail from './index';
import NodeManage from './Nodes';
// import RunningStatus from './RunningStatus';

const PATH = '/ai-manage';
const routes: RouteObject[] = [
  {
    path: `${PATH}/:cluster?/pools/:pool_id`,
    element: <PoolDetail />,
    children: [
      {
        index: true,
        element: <Navigate to="nodes" />,
      },
      {
        path: 'nodes',
        element: <NodeManage />,
      },
    ],
  },
];
export default routes;
