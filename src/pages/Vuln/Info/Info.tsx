import { TzCard } from '@/components/lib/tz-card';
import { useIntl } from '@umijs/max';
import InfoContext, { IInfoContext } from './InfoContext';

type InfoProps = IInfoContext & { className?: string };
function Info(props: InfoProps) {
  const { className } = props;
  const intl = useIntl();
  return (
    <TzCard
      bodyStyle={{ padding: '4px 0 0 0' }}
      className={className}
      title={intl.formatMessage({ id: 'basicInfo' })}
    >
      <InfoContext column={1} {...props} />
    </TzCard>
  );
}

export default Info;
