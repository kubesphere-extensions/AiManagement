export const navs = [
  {
    name: 'overview',
    title: '',
    children: [
      { name: 'overview', title: 'Dashboard', icon: 'dashboard' },
      { name: 'dashboard', title: 'Monitor Dashboard', icon: 'monitor' },
      {
        name: 'performance-monitor',
        title: '性能监控',
        icon: 'monitor',
      },
    ],
  },
  {
    name: 'O&M Management',
    title: '运维管理',
    children: [
      {
        name: 'xid',
        title: '错误码管理',
        icon: 'error',
      },
      {
        name: 'fault',
        title: 'Fault Log',
        icon: 'exclamation',
      },
    ],
  },
  {
    name: 'Cluster Management',
    title: '集群管理',
    children: [
      { name: 'nodes', title: 'Node Manage', icon: 'nodes' },
      { name: 'pools', title: 'Computing pools manage', icon: 'resource' },],
  },
  {
    name: 'Container Management',
    title: '容器管理',
    children: [
      { name: 'notebooks', title: 'Container Example', icon: 'container' },
      { name: 'training', title: 'Distributed training', icon: 'topology' },
    ],
  },
];
