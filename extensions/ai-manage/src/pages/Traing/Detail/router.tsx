import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Detail from '../Detail';
import BaseInfo from './BaseInfo';
import Pods from './Pods';

const PATH = '/ai-manage';
const routes: RouteObject[] = [
  {
    path: `${PATH}/:cluster?/training/:endpoint/:id`,
    element: <Detail />,
    children: [
      {
        index: true,
        element: <Navigate to="base_info" />,
      },
      {
        path: 'base_info',
        element: <BaseInfo />,
      },
      {
        path: 'pods',
        element: <Pods />,
      },
    ],
  },
];
export default routes;
