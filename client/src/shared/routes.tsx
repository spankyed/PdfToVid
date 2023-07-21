// import Layout from "./layout";
// import System from "../system";
// import Modules, { action as newModule, loader as modulesLoader} from "../system/modules/modules";
// import ModuleEdit, { action as moduleAction, loader as moduleLoader } from "../system/modules/edit/edit";

const routes = [
  {
    name: 'database',
    element: <div>empty</div>,
    icon: DatabaseOutlined,
  },
  {
    name: 'system',
    element: <System/>,
    icon: PartitionOutlined,
    // todo going to /system should redirect to /system/modules
    children: [
      {
        path: 'modules',
        element: <Modules/>,
        loader: modulesLoader,
        action: newModule,
      },
    ]
  },
]


const router = [
  {
    path: "/", // dashboard
    element: <Layout />,
    // loader: rootLoader,
    children: [],
  },
]

// const router = [
//   {
//     path: "/",
//     element: <Layout />,
//     // loader: rootLoader,
//     children: [
//       ...routes.map((route, idx) => ({
//         path: route.name,
//         element: route.element,
//         ...(route.children && { children: route.children }),
//         ...(route.action && { action: route.action }),
//         ...(route.loader && { loader: route.loader }),
//       })),
//       ...dynamicRoutes
//     ],
//   },
// ]
