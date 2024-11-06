import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import usePlatformKeys from '@/hooks/usePlatformKeys';
import { useIntl } from '@umijs/max';
import { useState } from 'react';
import PlatformCheckbox from '../components/PlatformCheckbox';
import SensitiveRuleRiskList from './List/SensitiveRuleRiskList';
import SensitiveCharts from './SensitiveCharts';

function Risks() {
  const intl = useIntl();
  const { platformKeys, platformsOpt } = usePlatformKeys();
  const [platforms, setPlatforms] = useState<undefined | string[]>(
    platformKeys,
  );

  return (
    <TzPageContainer
      header={{
        title: (
          <div className="inline-flex">
            <span>{intl.formatMessage({ id: 'sensitive' })}</span>
            <PlatformCheckbox
              options={platformsOpt}
              value={platforms}
              onChange={setPlatforms}
            />
          </div>
        ),
      }}
    >
      <SensitiveCharts platforms={platforms} />
      <SensitiveRuleRiskList platforms={platforms} />
    </TzPageContainer>
  );
}

export default Risks;
