import React from 'react';

import Layout from '../components/Layout';
import Overview from '../pages/Overview';
import Dashboard from '../pages/Dashboard';
import NodeManage from '../pages/NodeManage';
import FaultLog from '../pages/FaultLog';
import Training from '../pages/Traing';
import Xid from '../pages/Xid';
import Notebooks from '../pages/Notebooks';
import ResourceGroup from '../pages/ResourceGroup';

import nodeDetailRoutes from '../pages/NodeManage/Detail/router';
import ComputingPools from '../pages/ComputingPools';

import poolDetailRouters from '../pages/ComputingPools/Detail/router';
import traingDetailRouters from '../pages/Traing/Detail/router';

import Configs from '../pages/System';

export default [
  {
    path: '/ai-manage',
    element: <Layout />,
    children: [
      { path: ':cluster/:xxx', element: <Dashboard /> },
      {
        path: ':cluster/overview',
        element: <Overview />,
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
      {
        path: ':cluster/notebooks',
        element: <Notebooks />,
      },
      {
        path: ':cluster/resources',
        element: <ResourceGroup />,
      },
      {
        path: ':cluster/config',
        element: <Configs />,
      },
    ],
  },
  ...nodeDetailRoutes,
  ...poolDetailRouters,
  ...traingDetailRouters,
];
