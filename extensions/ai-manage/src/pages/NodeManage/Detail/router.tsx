import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import NodesDetail from './index';
import MeData from './MeData';
import Pods from './Pods';
import RunningStatus from './RunningStatus';
import Events from './Events';
import Monitorings from './Monitoring';
import Record from './FaultRecord';
import Log from './MaintenanceLog'

const PATH = '/ai-manage';
const routes: RouteObject[] = [
  {
    path: `${PATH}/:cluster?/nodes/:name`,
    element: <NodesDetail />,
    children: [
      {
        index: true,
        element: <Navigate to="status" />,
      },
      {
        path: 'metadata',
        element: <MeData />,
      },
      {
        path: 'pods',
        element: <Pods />,
      },
      {
        path: 'monitors',
        element: <Monitorings />,
      },
      {
        path: 'status',
        element: <RunningStatus />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'record',
        element: <Record />,
      },
      {
       path: 'log',
       element: <Log />
      }
    ],
  },
];
export default routes;
