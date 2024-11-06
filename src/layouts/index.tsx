import AiGpt from '@/components/AiGpt';
import PageAccess from '@/components/PageAccess';
import TaskSocketList from '@/components/TaskSocketList';
import UserInfo from '@/components/UserInfo';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import TzLayoutProvider from '@/contexts/TzLayoutProvider';
import locale, { EN_LANG } from '@/locales';
import { PUBLIC_URL } from '@/utils';
import { LOGIN_PATH } from '@/utils/constants';
import { MenuDataItem, ProLayout } from '@ant-design/pro-components';
import {
  Outlet,
  getLocale,
  history,
  useAccess,
  useAppData,
  useIntl,
  useLocation,
  useModel,
  useNavigate,
} from '@umijs/max';
import { useScroll } from 'ahooks';
import { FloatButton, Image, Tooltip } from 'antd';
import classNames from 'classnames';
import 'dayjs/locale/zh-cn';
import { cloneDeepWith, flatten, get, has, keys } from 'lodash';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import './index.less';

const Layouts = () => {
  const AppData = useAppData();
  const { routes } = AppData;
  const accessFull = useAccess();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // const [pathname, setPathname] = useState(pn ?? '/');
  const { top = 0 } = useScroll(scrollRef) ?? {};
  const { pathname: pn } = location;
  const intl = useIntl();
  const { setCollapsed, collapsed } = useModel('layout');

  const lang = getLocale();
  const loginLogoSrc = useMemo(() => {
    return lang === EN_LANG
      ? `${PUBLIC_URL}/images/logo_en.png`
      : `${PUBLIC_URL}/images/logo.png`;
  }, [lang]);
  useEffect(() => {
    document.querySelector('html')?.setAttribute('class', lang);
  }, [lang]);
  // useUpdateEffect(() => {
  //   setPathname(pn);
  // }, [pn]);
  const menu = useMemo(() => {
    const _routes = cloneDeepWith(routes);
    const _menu: MenuDataItem[] = [];
    const arr: [MenuDataItem[], MenuDataItem[]] = [[], []];
    const hasInMenuById = (parentId: string) =>
      flatten(_menu).find((v: MenuDataItem) => v.id === parentId);
    const noAccess = (access: string) => access && !get(accessFull, access);
    const notInMenu = (item: MenuDataItem) =>
      has(item, 'redirect') || item.hideInMenu || item.isLayout;
    const shouldInMemu = (item: MenuDataItem) =>
      !arr[0]?.some((v) => v.parentId === item.id) ||
      arr[1].some((v) => v.parentId === item.id);
    keys(_routes).forEach((idx) => {
      let item: MenuDataItem = _routes[idx];
      if (item.name && !notInMenu(item)) {
        arr[0].push(item);
        !noAccess(item.access) && arr[1].push(item);
      }
    });

    keys(_routes).forEach((idx) => {
      let item: MenuDataItem = _routes[idx];

      if (notInMenu(item) || noAccess(item.access)) {
        return;
      }
      const parent = item.parentId && hasInMenuById(item.parentId);
      item.icon && (item.icon = <i className={`icon iconfont ${item.icon}`} />);
      item.name && (item.name = intl.formatMessage({ id: item.name }));
      if (parent) {
        parent.routes?.length
          ? parent.routes.push(item)
          : (parent.routes = [item]);
      } else {
        shouldInMemu(item) && _menu.push(item);
      }
    });
    return _menu;
  }, [routes, accessFull]);

  const getNode = useCallback(
    (item, dom) => (
      <span
        className="menu-row"
        onClick={() => {
          item.path && history.push(item.path);
          navigate(item.path || '/welcome');
          // setPathname(item.path || '/welcome');
        }}
      >
        {dom}
      </span>
    ),
    [],
  );
  // useEffect(() => {
  //   const setTitle = (nextPathName: string) => {
  //     const nowRoute: any = matchRoutes(
  //       Object.values(routes),
  //       nextPathName,
  //     )?.pop()?.route;
  //     const t =
  //       nowRoute?.name || nowRoute?.breadcrumb?.[0]?.title || 'tensorName';
  //     document.title = intl.formatMessage({ id: t });
  //   };
  //   setTitle(pn);
  //   history.listen((param) => {
  //     if (param.location.pathname === '/task') {
  //       setTitle(param.location.pathname);
  //     }
  //   });
  // }, []);

  if (LOGIN_PATH.includes(pn)) {
    // clear();
    return (
      <TzLayoutProvider>
        <Outlet />
      </TzLayoutProvider>
    );
  }

  return (
    <TzLayoutProvider>
      <div
        ref={scrollRef}
        id="tz-container"
        className={classNames('tz-container', { scrolling: top > 0 }, lang)}
      >
        <div ref={containerRef}>
          <ProLayout
            // @ts-ignore
            locale={locale}
            prefixCls="tz"
            token={{
              sider: {
                colorMenuBackground: '#fff',
              },
              pageContainer: {
                colorBgPageContainer: '#fff',
                colorBgPageContainerFixed: '#fff',
                paddingInlinePageContainerContent: 32,
                paddingBlockPageContainerContent: 0,
              },
              bgLayout: '#fff',
            }}
            defaultCollapsed={collapsed}
            collapsed={collapsed}
            layout="side"
            disableMobile={true}
            siderWidth={160}
            collapsedButtonRender={(collapsed?: boolean) => (
              <div
                onClick={() => setCollapsed(!collapsed)}
                className={classNames('collapsed-box', { collapsed })}
              >
                <TzTooltip
                  title={intl.formatMessage({
                    id: collapsed
                      ? 'anchor.shortcutsOpen'
                      : 'anchor.shortcutsClose',
                  })}
                  placement="right"
                >
                  <i className="icon iconfont icon-arrow-double text-lg" />
                </TzTooltip>
              </div>
            )}
            menuHeaderRender={() => (
              <Image
                className="tz-logo"
                preview={false}
                src={
                  collapsed
                    ? `${PUBLIC_URL}/images/logo-white-small.png`
                    : loginLogoSrc
                }
              />
            )}
            menu={{
              type: 'group',
              locale: true,
            }}
            route={{
              path: PUBLIC_URL,
              routes: menu,
            }}
            location={{
              pathname: pn ?? '/',
            }}
            actionsRender={(props) => {
              if (props.isMobile) return [];
              return [<UserInfo collapsed={collapsed} />];
            }}
            menuItemRender={(item, dom) => {
              return item.parentId !== '@@/global-layout' && collapsed ? (
                <Tooltip title={item.name} placement="right">
                  {getNode(item, dom)}
                </Tooltip>
              ) : (
                getNode(item, dom)
              );
            }}
          >
            <AiGpt />
            <TaskSocketList />
            <FloatButton.BackTop
              className="back-top-btn"
              target={() =>
                document.getElementById('tz-container') ?? document.body
              }
              icon={
                <div className="content">
                  <p>{intl.formatMessage({ id: 'backTop.back' })}</p>
                  <p>{intl.formatMessage({ id: 'backTop.top' })}</p>
                </div>
              }
            />
            <PageAccess />
          </ProLayout>
        </div>
      </div>
    </TzLayoutProvider>
  );
};
export default memo(Layouts);
