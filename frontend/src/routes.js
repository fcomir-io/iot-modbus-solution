import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Testbench = React.lazy(() => import('./views/testbench/Testbench'));
const Devices = React.lazy(() => import('./views/devices/Devices'));
const Signals = React.lazy(() => import('./views/signals/Signals'));
const Data = React.lazy(() => import('./views/data/Data'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/testbench', name: 'Testbench', component: Testbench },
  { path: '/devices', name: 'Devices', component: Devices },
  { path: '/signals', name: 'Signals', component: Signals },
  { path: '/data', name: 'Data', component: Data }
];

export default routes;
