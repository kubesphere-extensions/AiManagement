export const navs = [
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
      { name: 'pools', title: 'Computing pools manage', icon: 'resource', disabled: true },
    ],
  },
  {
    name: 'Development and training',
    title: '开发与训练',
    children: [
      { name: 'notebooks', title: 'Container Instance', icon: 'container' },
      { name: 'training', title: 'Distributed training', icon: 'topology' },
    ],
  },
  // {
  //   name: 'Resource Management',
  //   title: '资源管理',
  //   children: [{ name: 'resources', title: 'Dedicated Resource Group', icon: 'resource' }],
  // },
];
