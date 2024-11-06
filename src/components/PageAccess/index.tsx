import { PUBLIC_URL } from '@/utils';

import Loading from '@/loading';
import {
  KeepAliveOutlet,
  OffScreenContext,
  useActivity,
} from '@tz/components/dist';
import {
  history,
  useAccess,
  useIntl,
  useLocation,
  useOutlet,
  useRouteProps,
} from '@umijs/max';
import { Image, Result } from 'antd';
import { get } from 'lodash';
import { memo, type ReactElement } from 'react';
import './index.less';

//处理页面权限的组件, 放置在所有需要鉴权的页面的最外层
const PageAccess = (): ReactElement | null => {
  const accessFull = useAccess();
  const { access } = useRouteProps();
  const intl = useIntl();
  const location = useLocation();
  const outlet = useOutlet();

  const res = useActivity({ action: history.action, location, outlet });

  if (access && !get(accessFull, access)) {
    return (
      <Result
        className="page-no-auth"
        title={
          <Image
            width={200}
            preview={false}
            src={`${PUBLIC_URL}/403.png`}
            alt="loading"
          />
        }
        status="403"
        subTitle={intl.formatMessage({ id: 'layout.403' })}
      />
    );
  }

  return (
    <OffScreenContext.Provider value={{ ...res, loading: Loading }}>
      <KeepAliveOutlet />
    </OffScreenContext.Provider>
  );
};

export default memo(PageAccess);
