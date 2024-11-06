import { CheckCard, CheckCardProps } from '@ant-design/pro-components';
import classNames from 'classnames';
import './index.less';
export type TzCheckCardProps = CheckCardProps & {};
const TzCheckCard = (props: TzCheckCardProps) => {
  const { className, ...restProps } = props;
  return (
    <CheckCard
      className={classNames('tz-check-card', className)}
      {...restProps}
    />
  );
};
TzCheckCard.Group = CheckCard.Group;
export default TzCheckCard;
