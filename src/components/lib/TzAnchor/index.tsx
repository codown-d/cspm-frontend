import { Anchor, AnchorProps } from 'antd';
import classNames from 'classnames';
import SiderAnchor, { SiderAnchorProps } from './SiderAnchor';
import './index.less';

type TzAnchorProps = (AnchorProps | SiderAnchorProps) & {
  isSideAnchor?: boolean; //侧边栏anchor，默认true
};

const TzAnchor = (props: TzAnchorProps) => {
  const { className, isSideAnchor = true, ...rest } = props;

  if (!isSideAnchor) {
    return (
      <Anchor
        className={classNames('tz-anchor', { className })}
        {...(rest as AnchorProps)}
      />
    );
  }
  return <SiderAnchor {...(rest as SiderAnchorProps)} className={className} />;
};
export default TzAnchor;
