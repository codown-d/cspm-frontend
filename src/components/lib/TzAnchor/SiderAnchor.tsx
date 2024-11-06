import { useIntl, useLocation } from '@umijs/max';
import { useBoolean, useSize } from 'ahooks';
import { Affix, Anchor, AnchorProps } from 'antd';
import classNames from 'classnames';
import { useMemo } from 'react';
import TzTypography from '../TzTypography';
import { TzTooltip } from '../tz-tooltip';

const DefalutHeaderH = 76;
export interface SiderAnchorProps extends AnchorProps {
  // 锚点菜单区域高度
  targetH?: number;
  // 页脚高度，有Footer情况
  offsetBottom?: number;
  wrapperClassName?: string;
  defalutHeader?: number;
}

const SiderAnchor = (props: SiderAnchorProps) => {
  const { key } = useLocation();
  const {
    className,
    onClick,
    targetH,
    offsetBottom = 0,
    wrapperClassName,
    defalutHeader = DefalutHeaderH,
    items,
    ...rest
  } = props;
  const intl = useIntl();
  const { key: pathKey } = useLocation();
  // const a = useContext(OffScreenContext);

  const [isHidden, { toggle }] = useBoolean();

  // 顶部栏上所有占有空间的高度
  const { height: headerH = 98 } =
    useSize(
      document.querySelector(
        `.tz-page-container-${pathKey} .ant-pro-page-container-affix`,
      ) ?? document.body,
    ) || {};
  const pageHeaderH = headerH;

  const realProps = useMemo(
    () => ({
      showInkInFixed: false,
      getContainer: () =>
        document.getElementById('tz-container') || document.body,
      offsetTop: pageHeaderH + 4,
      ...rest,
      items: items?.map(({ title, ...itemRest }) => ({
        ...itemRest,
        title: (
          <TzTypography.Paragraph ellipsis={{ rows: 1, tooltip: title }}>
            {title}
          </TzTypography.Paragraph>
        ),
      })),
      onClick: (e: any, link: any) => {
        e.preventDefault();
        onClick?.(e, link);
      },
      className: classNames('tz-anchor', className),
    }),
    [rest, pageHeaderH],
  );

  return (
    <div
      className={classNames('tz-anchor-wrapper', wrapperClassName, {
        isHidden,
      })}
    >
      <Affix offsetTop={pageHeaderH + 8}>
        <div className="tz-anchor-tip" style={{ top: pageHeaderH + 6 }}>
          <span>{intl.formatMessage({ id: 'anchor.shortcuts' })}</span>
          <TzTooltip
            title={intl.formatMessage({
              id: isHidden ? 'anchor.shortcutsOpen' : 'anchor.shortcutsClose',
            })}
            placement="left"
          >
            <div className="arrow-bar">
              <i
                onClick={toggle}
                className="icon iconfont icon-arrow-double text-xl"
              />
            </div>
          </TzTooltip>
        </div>
      </Affix>
      <Anchor key={pageHeaderH} {...realProps} />
    </div>
  );
};
export default SiderAnchor;
