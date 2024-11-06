import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import usePlatformKeys from '@/hooks/usePlatformKeys';
import { useIntl } from '@umijs/max';
import { useState } from 'react';
import PlatformCheckbox from '../components/PlatformCheckbox';
import List from './List';
import VulnCharts from './VulnCharts';

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
            <span>{intl.formatMessage({ id: 'vuln' })}</span>
            <PlatformCheckbox
              options={platformsOpt}
              value={platforms}
              onChange={setPlatforms}
            />
          </div>
        ),
      }}
    >
      <VulnCharts platforms={platforms} />
      <List platforms={platforms} />
    </TzPageContainer>
  );
}

export default Risks;
