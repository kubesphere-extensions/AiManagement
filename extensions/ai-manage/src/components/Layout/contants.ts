export const navs = [
  {
    name: 'overview',
    title: '',
    children: [
      { name: 'overview', title: 'Dashboard', icon: 'dashboard' },
      { name: 'dashboard', title: 'Monitor Dashboard', icon: 'monitor' },
      // {
      //   name: 'monitor-dashboard',
      //   title: 'Monitor Dashboard',
      //   icon: 'monitor'
      // },
      // {
      //   name: 'alarm-dashboard',
      //   title: 'Alarm Dashboard',
      //   icon: 'loudspeaker',
      //   disabled: true,
      //   showInDisable: true
      // },
    ],
  },
  {
    name: 'O&M Management',
    title: '运维管理',
    children: [{ name: 'fault', title: 'Fault Log', icon: 'error' ,}]
  },
  {
    name: 'cluster manage',
    title: '集群管理',
    children: [{ name: 'nodes', title: 'Node Manage', icon: 'nodes' ,}]
  }
];
