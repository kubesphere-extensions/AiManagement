import React from 'react';

import Layout from '../components/Layout';
import Overview from '../pages/Overview';
import Dashboard from '../pages/Dashboard';
import NodeManage from '../pages/NodeManage';
import FaultLog from '../pages/FaultLog';
import Training from '../pages/Traing';
import Xid from '../pages/Xid';
import PerformanceMonitor from '../pages/Dashboard/PerformanceMonitor';
import IbNetworkMonitor from '../pages/Dashboard/IbNetworkMonitor';
import NpuMonitor from '../pages/Dashboard/NpuMonitor';
import Notebooks from '../pages/Notebooks';
import ResourceGroup from '../pages/ResourceGroup';

import nodeDetailRoutes from '../pages/NodeManage/Detail/router';
import ComputingPools from '../pages/ComputingPools';

import poolDetailRouters from '../pages/ComputingPools/Detail/router';
import traingDetailRouters from '../pages/Traing/Detail/router';

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
        path: ':cluster/ib-networkwork-monitor',
        element: <IbNetworkMonitor />,
      },
      { path: ':cluster/npu-monitor', element: <NpuMonitor /> },
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
      {
        path: ':cluster/notebooks',
        element: <Notebooks />,
      },
      {
        path: ':cluster/resources',
        element: <ResourceGroup />,
      },
    ],
  },
  ...nodeDetailRoutes,
  ...poolDetailRouters,
  ...traingDetailRouters,
];
