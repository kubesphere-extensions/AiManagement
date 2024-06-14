const getIbNav = () => {
  if (globals?.config?.enable_infiniband_grafana) {
    return [
      {
        name: 'ib-networkwork-monitor',
        title: 'IB 网络监控',
        icon: 'monitor',
      },
    ];
  }
  return [];
};

const getPerNav = () => {
  if (globals?.config?.enable_performance_grafana) {
    return [
      {
        name: 'performance-monitor',
        title: '性能监控',
        icon: 'monitor',
      },
    ];
  }
  return [];
};

const getNPUNav = () => {
  if (globals?.config?.enable_npu) {
    return [
      {
        name: 'npu-monitor',
        title: 'NPU 监控',
        icon: 'monitor',
      },
    ];
  }
  return [];
};

const getHFKav = () => {
  if (globals?.config?.enable_hfk) {
    return [
      {
        name: 'hexaflake-monitor',
        title: 'Hexaflake 监控',
        icon: 'monitor',
      },
    ];
  }
  return [];
};

export const navs = [
  {
    name: 'overview',
    title: '',
    children: [
      { name: 'overview', title: 'Dashboard', icon: 'dashboard' },
      { name: 'dashboard', title: 'Monitor Dashboard', icon: 'monitor' },
      ...getPerNav(),
      ...getNPUNav(),
      ...getIbNav(),
      ...getHFKav(),
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
