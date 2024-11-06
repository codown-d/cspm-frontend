import { TzCard } from '@/components/lib/tz-card';
import { useIntl } from '@umijs/max';

function BasicInfo() {
  const intl = useIntl();
  return (
    <TzCard
      bodyStyle={{ paddingBlock: '0 20px', overflow: 'hidden' }}
      title={
        <div className="flex items-center">
          <div className="text-base font-medium text-[#3E4653]">
            {intl.formatMessage({ id: 'basicInfo' })}
          </div>
        </div>
      }
    ></TzCard>
  );
}

export default BasicInfo;
