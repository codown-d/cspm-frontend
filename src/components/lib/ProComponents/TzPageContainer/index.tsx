import { PageContainer, PageContainerProps } from '@ant-design/pro-components';
import { useLocation, useModel } from '@umijs/max';
import { useSize } from 'ahooks';
import classNames from 'classnames';
import { memo } from 'react';
import './index.less';
export type TzPageContainerProps = PageContainerProps & {};
function TzPageContainer(
  props: PageContainerProps & {
    prefixedClassName?: string;
  },
) {
  const { key: pathKey } = useLocation();
  const { height = 0 } =
    useSize(
      document.querySelector(
        `.tz-page-container-${pathKey} .ant-page-header`,
      ) ?? null,
    ) ?? {};
  const { collapsed } = useModel('layout');

  return (
    <PageContainer
      fixedHeader
      affixProps={{
        className: 'tz-page-header',
        offsetTop: 0.01,
        style: height > 98 ? { height } : {},
        target: () => document.getElementById('tz-container') ?? document.body,
      }}
      {...props}
      header={{ ...props.header, className: 'tz-page-header' }}
      className={classNames(
        'tz-page-container',
        `tz-page-container-${pathKey}`,
        { collapsed },
        // { 'has-scroll-bar': lw < containerW },
        props.className,
      )}
    />
  );
}
export default memo(TzPageContainer);
