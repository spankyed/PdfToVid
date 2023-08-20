// import Layout from "./layout";
// import System from "../system";
// import Modules, { action as newModule, loader as modulesLoader} from "../system/modules/modules";
// import ModuleEdit, { action as moduleAction, loader as moduleLoader } from "../system/modules/edit/edit";
// import React from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Dashboard from '../dashboard';
// import { Outlet, useLocation } from 'react-router-dom'
import Layout from './layout';
import Day from '~/day/day';
import Entry from '~/entry/entry';

const routes = [{
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/papers" />,
        key: '1',

      },
      {
        path: 'papers',
        element: <Dashboard />,
      },
      {
        path: 'day/:dayId',
        element: <Day />,
      },
      {
        path: 'entry/:entryId',
        element: <Entry />,
      }
    ]
  },
  {
    path: '/404',
    element: <div>Losing</div>,
  },
]

export default createBrowserRouter(routes)
