import React from 'react';

import Layout from '../components/Layout';
import Overview from '../pages/Overview';
import Dashboard from '../pages/Dashboard';
import NodeManage from '../pages/NodeManage';
import FaultLog from '../pages/FaultLog';
import Training from '../pages/Traing';
import Xid from '../pages/Xid';
import PerformanceMonitor from '../pages/PerformanceMonitor';

import nodeDetailRoutes from '../pages/NodeManage/Detail/router';
import ComputingPools from '../pages/ComputingPools';

import poolDetailRouters from '../pages/ComputingPools/Detail/router';

export default [
  {
    path: '/ai-manage',
    element: <Layout />,
    children: [
      { path: '', element: <Layout /> },
      {
        path: ':cluster/overview',
        element: <Overview />,
      },
      {
        path: ':cluster/dashboard',
        element: <Dashboard />,
      },
      {
        path: ':cluster/performance-monitor',
        element: <PerformanceMonitor />,
      },
      {
        path: ':cluster/nodes',
        element: <NodeManage />,
      },
      {
        path: ':cluster/pools',
        element: <ComputingPools />,
      },
      {
        path: ':cluster/fault',
        element: <FaultLog />,
      },
      {
        path: ':cluster/training',
        element: <Training />,
      },
      {
        path: ':cluster/xid',
        element: <Xid />,
      },
    ],
  },
  ...nodeDetailRoutes,
  ...poolDetailRouters,
];
