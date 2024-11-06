import { TzTooltip } from '@/components/lib/tz-tooltip';
import TzLayoutContext from '@/contexts/TzLayoutContext';
import { EN_LANG, ZH_LANG } from '@/locales';
import translate, { changeLanguage } from '@/locales/translate';
import {
  history,
  useIntl,
  useLocation,
  useModel,
  useSearchParams,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Menu, Popover, Typography } from 'antd';
import classNames from 'classnames';
import { stringify } from 'querystring';
import { useContext, useMemo, useState } from 'react';
import RestPwdPopup from '../ResetPwd';
import styles from './index.less';

const { Text } = Typography;

function UserInfo({ collapsed }: any) {
  const context = useContext(TzLayoutContext) || {};
  const { signout } = context;
  const _userInfo: any =
    useModel('@@initialState')?.initialState?.userInfo ?? {};
  const { taskCount } = useModel('global');
  const intl = useIntl();
  const { pathname, state } = useLocation();
  const [searchParams] = useSearchParams();
  const [showUpdatePwdPopup, setShowUpdatePwdPopup] = useState<boolean>(false);

  const currentUser = _userInfo.username || '-';

  // const setLang = useMemoizedFn((lang) => {
  //   storage.set('lang', lang);
  //   setLocale(lang);
  // });
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = useMemoizedFn(() => {
    signout?.(() => {
      history.replace({
        pathname: '/login',
        search: stringify({
          redirect: pathname + searchParams,
        }),
      });
      // document.title = intl.formatMessage({id: 'tensorName'});
    });
    // const { search, pathname } = window.location;
    // const urlParams = new URL(window.location.href).searchParams;
    // const redirect = urlParams.get('redirect');
    // storage.clear();
    // storage.clearCookie();
  });

  const MenuNode = () => {
    const items: any = [
      {
        key: '1',
        style: { height: 'auto' },
        className: styles.tit,
        label: (
          <Text ellipsis={{ tooltip: currentUser }}>
            <span>{currentUser}</span>
          </Text>
        ),
      },
      {
        type: 'divider',
      },
      {
        key: '3',
        label: intl.formatMessage({ id: 'language' }),
        children: [
          {
            type: 'divider',
          },
          {
            key: '4',
            className: 'mt-1',
            onClick: () => changeLanguage(ZH_LANG),
            label: '简体中文',
          },
          {
            key: '5',
            className: 'mb-1',
            onClick: () => changeLanguage(EN_LANG),
            label: intl.formatMessage({ id: 'english' }),
          },
          {
            type: 'divider',
            classNames: 'mb-1',
          },
        ],
      },
      {
        key: '6',
        onClick: () => {
          setShowUpdatePwdPopup(true);
        },
        label: intl.formatMessage({ id: 'pwdModal.updatePwd' }, { name: '' }),
      },
      // {
      //   key: '2',
      //   onClick: loginOut,
      //   label: intl.formatMessage({ id: 'logOut' }),
      // },
    ];
    return (
      <Menu
        mode={'inline'}
        className={styles.language}
        style={{
          width: 218,
        }}
        items={items}
      />
    );
  };

  const hasNewTask = Object.values(taskCount).some((v) => v > 0);

  const exitAndTaskNode = useMemo(() => {
    return [
      <div
        className={classNames(styles.hover, 'flex w-6/12')}
        onClick={loginOut}
      >
        <i className={'icon iconfont icon-tuichu'} />
        {!collapsed && (
          <Text className="px-4 h-8 max-w-[116px]">
            <span className="text-nowrap">{translate('exit')}</span>
          </Text>
        )}
      </div>,
      <div
        id="global_task"
        className={classNames(styles.hover, 'flex w-6/12')}
        style={{ position: 'relative' }}
        onClick={() => {
          history.push('/task');
        }}
      >
        {hasNewTask && <div className={classNames(styles.newTask)}></div>}
        <i className={'icon iconfont icon-renwuliebiao'} />
        {!collapsed && (
          <Text className="px-4 h-8 max-w-[116px]">
            <span className="text-nowrap">{translate('task')}</span>
          </Text>
        )}
      </div>,
    ];
  }, [hasNewTask, collapsed]);

  return (
    <div
      className={classNames(styles.userInfo, { [styles.collapsed]: collapsed })}
    >
      <Popover
        arrow={false}
        destroyTooltipOnHide
        overlayClassName={styles.userInfoWrapper}
        content={MenuNode}
        placement="rightBottom"
      >
        <div className={classNames(styles.hover, 'flex', 'user')}>
          <i className={'icon iconfont icon-zhanghu '} />
          {!collapsed && (
            <Text
              className="w-full px-4 h-8 ml-1 max-w-[116px]"
              ellipsis={{ tooltip: '' }}
            >
              <span>{currentUser}</span>
            </Text>
          )}
        </div>
      </Popover>

      {collapsed ? (
        <div className={classNames(styles.exitAndTaskColla)}>
          <TzTooltip
            title={intl.formatMessage({ id: 'task' })}
            placement="right"
          >
            {exitAndTaskNode[1]}
          </TzTooltip>
          <TzTooltip
            title={intl.formatMessage({ id: 'exit' })}
            placement="right"
          >
            {exitAndTaskNode[0]}
          </TzTooltip>
        </div>
      ) : (
        <div className={classNames(styles.exitAndTask)}>
          {exitAndTaskNode[0]}
          {/* <Divider type="vertical" style={{ height: '20px' }} /> */}
          {exitAndTaskNode[1]}
        </div>
      )}

      <RestPwdPopup
        open={showUpdatePwdPopup}
        onCancel={() => setShowUpdatePwdPopup(false)}
      />
    </div>
  );
}

export default UserInfo;
