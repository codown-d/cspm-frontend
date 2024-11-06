import { useIntl } from '@umijs/max';
import { Tag, TagProps } from 'antd';
import classNames from 'classnames';
import { useMemo } from 'react';
import './index.less';

export type TzTagProps = TagProps & {
  size?: 'small';
};
export const TzTag = (props: TzTagProps) => {
  const { size, className, closeIcon, ...restProps } = props;
  const realProps = useMemo(() => {
    return {
      ...restProps,
      closeIcon: closeIcon && <i className={'icon iconfont icon-close'}></i>,
      className: classNames('tz-tag text-center', className, size),
    };
  }, [props]);
  return restProps.children ? <Tag {...realProps} /> : null;
};

type TzRenderTagProps = TagProps & {
  type: string;
  className?: string | undefined;
  title?: string | undefined;
};

export const policyActionEnum: Record<
  string,
  {
    title: string;
    style?: any;
    cls?: any;
  }
> = {
  closed: {
    title: 'switch.close',
    cls: 'no-active',
    // style: {
    //   color: 'rgba(142, 151, 163, 1)',
    //   background: 'rgba(142, 151, 163, 0.1)',
    // },
  },
  open: {
    title: 'switch.open',
    cls: 'primary',
    // style: {
    //   color: 'rgba(33, 119, 209, 1)',
    //   background: 'rgba(33, 119, 209, 0.05)',
    // },
  },
};

export const RenderTag = (props: TzRenderTagProps) => {
  const { type, className = '', title = '', style, ...tagProps } = props;
  const intl = useIntl();
  const key = (type + '').toLowerCase();
  if (!policyActionEnum[key]) {
    return <span>-</span>;
  }
  return (
    <TzTag
      className={`no-prev status-tag ${className} ${policyActionEnum[key].cls}`}
      key={key}
      style={{ ...policyActionEnum[key].style, ...style }}
      {...tagProps}
    >
      {title || intl.formatMessage({ id: policyActionEnum[key].title })}
    </TzTag>
  );
};
