import { TzCard } from '@/components/lib/tz-card';
import { useIntl } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import classNames from 'classnames';
import InfoContext, { IInfoContext } from './InfoContext';

type InfoProps = IInfoContext & {
  infoBreadcrumb?: ItemType[];
  className?: string;
  dataSource?: API.PolicyInfoResponse;
};
function Info({ infoBreadcrumb, className, ...restProps }: InfoProps) {
  const intl = useIntl();

  return (
    <TzCard
      bodyStyle={
        restProps.loading
          ? { padding: '4px 16px 16px 16px' }
          : { paddingBlock: '4px 0' }
      }
      className={classNames('is-descriptions', className)}
      title={intl.formatMessage({ id: 'basicRiskInfo' })}
    >
      <InfoContext {...restProps} column={1} />
    </TzCard>
  );
}

export default Info;
