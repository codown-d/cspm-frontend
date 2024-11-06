export const PermisionMap = {
  userManage: 'UserManager',
  cloudManage: 'CloudAccountManager',
  logAudit: 'AuditLog',
  Compliance: 'Compliance',
  vulnerabilityAnalysis: 'Fragileness',
  AssetsRisk: 'AssetsRisk',
};

interface IRouteItem {
  path: string;
  name: string;
  component: string;
  access: string;
  icon: string;
  hideInBreadcrumb: boolean;
  hideInMenu: boolean;
  redirect: string;
  breadcrumb: {
    title: string;
    path: string;
  }[];
  routes: IRouteItem[];
}

export default [
  {
    path: '/login',
    component: './Login',
    hideInMenu: true,
    name: 'tensorName',
  },
  {
    path: '/ssoLogin',
    component: './Login/SSOLogin',
    hideInMenu: true,
    name: 'tensorName',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: './Dashboard',
    icon: 'icon-yibiaopan',
  },
  // {
  //   name: 'demo',
  //   path: '/demo',
  //   component: './Demo',
  //   icon: 'icon-yibiaopan',
  // },
  {
    name: 'assets',
    path: '/asset',
    icon: 'icon-zichanfaxian',
    access: PermisionMap.AssetsRisk,
    routes: [
      {
        path: '',
        redirect: '/asset/list',
      },
      {
        hideInMenu: true,
        name: 'assets',
        path: '/asset/list',
        component: './Asset',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'assets',
            path: '/asset',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'assets',
        path: '/asset/info/:id',
        component: './Asset/Info',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'assets',
            path: '/asset',
          },
          {
            title: 'assetInfo',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'assets',
        path: '/asset/periodic-task',
        component: './PeriodicTask/list.tsx',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'assets',
            path: '/asset',
          },
          {
            title: 'periodicTask',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'assets',
        path: '/asset/periodic-task/add',
        component: './PeriodicTask/form/index.tsx',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'assets',
            path: '/asset',
          },
          {
            title: 'periodicTask',
            path: '/asset/periodic-task',
          },
          {
            title: 'addTask',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'assets',
        path: '/asset/periodic-task/edit/:id',
        component: './PeriodicTask/form/index.tsx',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'assets',
            path: '/asset',
          },
          {
            title: 'periodicTask',
            path: '/asset/periodic-task',
          },
          {
            title: 'editCycleTasks',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'assets',
        path: '/asset/periodic-task/detail/:id',
        component: './PeriodicTask/detail/index.tsx',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'assets',
            path: '/asset',
          },
          {
            title: 'periodicTask',
            path: '/asset/periodic-task',
          },
          {
            title: 'taskDetails',
          },
        ],
      },
    ],
  },
  {
    name: 'complianceSafety',
    path: '/compliance',
    icon: 'icon-anquanhegui',
    access: PermisionMap.Compliance,
    routes: [
      {
        path: '',
        redirect: '/compliance/list',
      },
      {
        hideInMenu: true,
        path: '/compliance/list',
        access: PermisionMap.Compliance,
        component: './Compliance',
        name: 'complianceSafety',
      },
      {
        hideInMenu: true,
        path: '/compliance/setting',
        component: './Setting',
        access: PermisionMap.Compliance,
        breadcrumb: [
          {
            title: 'complianceSafety',
            path: '/compliance',
          },
          {
            title: 'setting',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/compliance/framework',
        component: './Compliance/Framework',
        access: PermisionMap.Compliance,
        breadcrumb: [
          {
            title: 'complianceSafety',
            path: '/compliance',
          },
          {
            title: 'complianceFramework',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/compliance/framework/info/:id',
        component: './Compliance/Framework/Info',
        access: PermisionMap.Compliance,
        breadcrumb: [
          {
            title: 'complianceSafety',
            path: '/compliance',
          },
          {
            title: 'complianceFramework',
            path: '/compliance/framework',
          },
          {
            title: 'complianceFrameworkDetail',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/compliance/framework/add',
        component: './Compliance/Framework/Edit',
        access: PermisionMap.Compliance,
        breadcrumb: [
          {
            title: 'complianceSafety',
            path: '/compliance',
          },
          {
            title: 'complianceFramework',
            path: '/compliance/framework',
          },
          {
            title: 'complianceFrameworkAdd',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/compliance/framework/edit/:id',
        component: './Compliance/Framework/Edit',
        access: PermisionMap.Compliance,
        breadcrumb: [
          {
            title: 'complianceSafety',
            path: '/compliance',
          },
          {
            title: 'complianceFramework',
            path: '/compliance/framework',
          },
          {
            title: 'complianceFrameworkEdit',
          },
        ],
      },
    ],
  },
  {
    name: 'riskDiscovery',
    path: '/risks',
    icon: 'icon-a-ATTCK',
    access: PermisionMap.AssetsRisk,
    routes: [
      {
        path: '',
        redirect: '/risks/list',
      },
      {
        hideInMenu: true,
        name: 'riskDiscovery',
        path: '/risks/list',
        component: './Risks',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'riskDiscovery',
            path: '/risks',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'riskDiscovery',
        path: '/risks/info/:id',
        component: './Risks/Info/Config',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'riskDiscovery',
            path: '/risks',
          },
          {
            title: 'configRiskInfo',
          },
        ],
      },
    ],
  },
  {
    name: 'vuln',
    path: '/vuln',
    icon: 'icon-loudong_c',
    access: PermisionMap.AssetsRisk,
    routes: [
      {
        path: '',
        redirect: '/vuln/list',
      },
      {
        hideInMenu: true,
        name: 'vuln',
        path: '/vuln/list',
        component: './Vuln',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'vuln',
            path: '/vuln',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'vulnInfo',
        path: '/vuln/info/:id',
        component: './Vuln/Info',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'vuln',
            path: '/vuln',
          },
          {
            title: 'vulnInfo',
          },
        ],
      },
    ],
  },
  {
    name: 'sensitive',
    path: '/secret',
    icon: 'icon-pingzhengmiyue',
    access: PermisionMap.AssetsRisk,
    routes: [
      {
        path: '',
        redirect: '/secret/list',
      },
      {
        hideInMenu: true,
        name: 'vuln',
        path: '/secret/list',
        component: './Sensitive',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'sensitive',
            path: '/secret',
          },
        ],
      },
      {
        hideInMenu: true,
        name: 'sensitiveInfo',
        path: '/secret/info/:id',
        component: './Sensitive/Info',
        access: PermisionMap.AssetsRisk,
        breadcrumb: [
          {
            title: 'sensitive',
            path: '/secret',
          },
          {
            title: 'sensitiveInfo',
          },
        ],
      },
    ],
  },
  {
    name: 'fragileChainAnalysis',
    path: '/vulnerability',
    icon: 'icon-gaojing',
    access: PermisionMap.vulnerabilityAnalysis,
    routes: [
      {
        path: '',
        redirect: '/vulnerability/list',
      },
      {
        hideInMenu: true,
        path: '/vulnerability/list',
        access: PermisionMap.vulnerabilityAnalysis,
        name: 'fragileChainAnalysis',
        component: './Vulnerability/list',
      },
      {
        hideInMenu: true,
        path: '/vulnerability/detail/:id',
        component: './Vulnerability/detail',
        access: PermisionMap.vulnerabilityAnalysis,
        breadcrumb: [
          {
            title: 'fragileChainAnalysis',
            path: '/vulnerability/list',
          },
          {
            title: 'vulnerabilityChainDetails',
          },
        ],
      },
    ],
  },
  {
    name: 'systemManagement',
    path: '/sys',
    routes: [
      {
        path: '',
        redirect: '/sys/user-management',
      },
      {
        path: '/sys/user-management',
        name: 'userManagement',
        component: './UserManagement/UserList/index.tsx',
        icon: 'icon-yonghuquanxianshezhi',
        access: PermisionMap.userManage,
        hideInBreadcrumb: true,
      },
      {
        hideInMenu: true,
        path: '/sys/user-management/add',
        name: 'userAdd',
        component: './UserManagement/components/EditUser',
        access: PermisionMap.userManage,
        breadcrumb: [
          {
            title: 'userManagement',
            path: '/sys/user-management',
          },
          {
            title: 'userAdd',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/sys/user-management/edit/:id',
        access: PermisionMap.userManage,
        name: 'userEdit',
        component: './UserManagement/components/EditUser',
        breadcrumb: [
          {
            title: 'userManagement',
            path: '/sys/user-management',
          },
          {
            title: 'userEdit',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/sys/user-management/detail/:id',
        access: PermisionMap.userManage,
        name: 'userDetail',
        component: './UserManagement/UserDetail/index.tsx',
        breadcrumb: [
          {
            title: 'userManagement',
            path: '/sys/user-management',
          },
          {
            title: 'userDetail',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/sys/user-management/role-list',
        access: PermisionMap.userManage,
        name: 'roleManagement',
        component: './UserManagement/RoleList',
        breadcrumb: [
          {
            title: 'userManagement',
            path: '/sys/user-management',
          },
          {
            title: 'roleManagement',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/sys/user-management/role-add',
        access: PermisionMap.userManage,
        name: 'addRole',
        component: './UserManagement/RoleForm',
        breadcrumb: [
          {
            title: 'userManagement',
            path: '/sys/user-management',
          },
          {
            title: 'roleManagement',
            path: '/sys/user-management/role-list',
          },
          {
            title: 'addRole',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/sys/user-management/role-edit/:id',
        access: PermisionMap.userManage,
        name: 'editRole',
        component: './UserManagement/RoleForm',
        breadcrumb: [
          {
            title: 'userManagement',
            path: '/sys/user-management',
          },
          {
            title: 'roleManagement',
            path: '/sys/user-management/role-list',
          },
          {
            title: 'editRole',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/sys/user-management/role-detail/:id',
        access: PermisionMap.userManage,
        name: 'roleDetails',
        component: './UserManagement/RoleDetail/index.tsx',
        breadcrumb: [
          {
            title: 'userManagement',
            path: '/sys/user-management',
          },
          {
            title: 'roleManagement',
            path: '/sys/user-management/role-list',
          },
          {
            title: 'roleDetails',
          },
        ],
      },
      {
        hideInMenu: true,
        path: '/sys/user-management/management-config',
        access: PermisionMap.userManage,
        name: 'config',
        component: './UserManagement/ManageConf',
        breadcrumb: [
          {
            title: 'userManagement',
            path: '/sys/user-management',
          },
          {
            title: 'config',
          },
        ],
      },
      {
        path: '/sys/cloud-platform',
        name: 'cloudPlatform',
        icon: 'icon-yunzhanghu',
        access: PermisionMap.cloudManage,
        hideInBreadcrumb: true,
        routes: [
          {
            path: '',
            redirect: '/sys/cloud-platform/list',
          },
          {
            hideInMenu: true,
            name: 'platformManagemant',
            path: '/sys/cloud-platform/list',
            component: './CloudPlatform',
            access: PermisionMap.cloudManage,
          },
          {
            hideInMenu: true,
            path: '/sys/cloud-platform/add',
            name: 'accountAdd',
            component: './CloudPlatform/Credentials/EditAccount',
            access: PermisionMap.cloudManage,
            breadcrumb: [
              {
                title: 'cloudPlatform',
                path: '/sys/cloud-platform',
              },
              {
                title: 'accountAdd',
              },
            ],
          },
          {
            hideInMenu: true,
            path: '/sys/cloud-platform/edit/:id',
            name: 'editAccount',
            component: './CloudPlatform/Credentials/EditAccount',
            access: PermisionMap.cloudManage,
            breadcrumb: [
              {
                title: 'cloudPlatform',
                path: '/sys/cloud-platform',
              },
              {
                title: 'editAccount',
              },
            ],
          },
          {
            hideInMenu: true,
            path: '/sys/cloud-platform/info/:id',
            name: 'platformInfo',
            component: './CloudPlatform/Credentials/Info',
            access: PermisionMap.cloudManage,
            breadcrumb: [
              {
                title: 'cloudPlatform',
                path: '/sys/cloud-platform',
              },
              {
                title: 'platformDetail',
              },
            ],
          },
        ],
      },
      {
        path: '/sys/log-audit',
        name: 'logAudit',
        component: './LogAudit',
        access: PermisionMap.logAudit,
        icon: 'icon-xuexirenwu',
        hideInBreadcrumb: true,
      },
      // {
      //   name: 'license',
      //   path: '/sys/license',
      //   icon: 'icon-license',
      //   component: './License',
      // },
    ],
  },
  {
    name: 'task',
    path: '/task',
    hideInMenu: true,
    routes: [
      {
        path: '',
        name: 'task',
        component: './Task/List/index.tsx',
        icon: 'icon-yonghuquanxianshezhi',
        hideInMenu: true,
      },
      {
        path: '/task/compliance/detail/:id',
        component: './Task/Detail/Compliance',
        hideInMenu: true,
        name: 'task',
        icon: 'icon-yonghuquanxianshezhi',
        breadcrumb: [
          {
            title: 'task',
            path: '/task',
          },
          {
            title: 'complianceDetectionTaskDetails',
          },
        ],
      },
      {
        path: `/task/asset/detail/:id`,
        component: './Task/Detail/Asset',
        hideInMenu: true,
        name: 'task',
        icon: 'icon-yonghuquanxianshezhi',
        breadcrumb: [
          {
            title: 'task',
            path: '/task',
          },
          {
            title: 'assetDetectionTaskDetails',
          },
        ],
      },
    ],
  },
  {
    path: '/503',
    component: '@/pages/503.tsx',
    hideInMenu: true,
    layout: false,
  },
  { path: '/*', component: '@/pages/404.tsx', hideInMenu: true },
];
