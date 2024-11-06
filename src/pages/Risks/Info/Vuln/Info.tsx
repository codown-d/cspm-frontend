import { TzCard } from '@/components/lib/tz-card';
import { useIntl } from '@umijs/max';
import InfoContext, { IInfoContext } from './InfoContext';

type InfoProps = IInfoContext & {};
function Info(props: InfoProps) {
  const intl = useIntl();
  return (
    <TzCard
      bodyStyle={
        props.loading
          ? { padding: '4px 16px 16px 16px' }
          : { paddingBlock: '4px 0' }
      }
      className="is-descriptions"
      title={intl.formatMessage({ id: 'basicInfo' })}
    >
      <InfoContext {...props} />
    </TzCard>
  );
}

export default Info;
