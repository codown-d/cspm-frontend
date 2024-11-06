import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: false,
  pwa: true,
  token: {
    // header: {
    //   colorBgHeader: '#292f33',
    //   colorHeaderTitle: '#fff',
    //   colorTextMenu: '#dfdfdf',
    //   colorTextMenuSecondary: '#dfdfdf',
    //   colorTextMenuSelected: '#fff',
    //   colorBgMenuItemSelected: '#22272b',
    //   colorTextRightActionsItem: '#dfdfdf',
    // },
    sider: {
      colorMenuBackground: '#fff',
      colorMenuItemDivider: '#dfdfdf',
      colorTextMenu: '#6C7480',
      colorTextMenuSelected: '#2177D1',
      // colorTextMenuItemHover: '#2177D1',
      colorTextMenuActive: '#2177D1',
      colorBgMenuItemHover: 'rgba(33, 119, 209, 0.05)',
      colorBgMenuItemSelected: 'rgba(33, 119, 209, 0.05)',
    },
  },
};

export default Settings;
