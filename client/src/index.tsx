// src/App.js

import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Store from './shared/store';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './App';

// function App() {
//   return (
//     <Router>
//       <Switch>
//         <Route path="/" exact component={Dashboard} />
//         {/* Other routes will go here */}
//       </Switch>
//     </Router>
//   );
// }
import { RouterProvider } from 'react-router-dom'
import router from './shared/routes'

const store = Store.create({ papers: [] });

export const StoreContext = createContext(store);

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <StoreContext.Provider value={store}>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StoreContext.Provider>
);


// export default App;



// src/App.js

// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';

// function App() {
//   return (
//     <Router>
//       <Switch>
//         <Route path="/" exact component={Dashboard} />
//         {/* Other routes will go here */}
//       </Switch>
//     </Router>
//   );
// }

// export default App;
