import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { useIntl } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import useDrillParameter from '../Asset/useDrillParameter';
import PlatformCheckbox from '../components/PlatformCheckbox';
import List from './List';
import RiskCharts from './RiskCharts';

function Risks() {
  const intl = useIntl();
  const {
    drillId,
    setDrillId,
    category,
    setCategory,
    defaultFilterItemVal,
    platforms,
    setPlatforms,
    platformsOpt,
  } = useDrillParameter();

  useUpdateEffect(() => {
    setCategory('platform');
    setDrillId(undefined);
  }, [platforms]);
  return (
    <TzPageContainer
      header={{
        title: (
          <div className="inline-flex">
            <span>{intl.formatMessage({ id: 'riskDiscovery' })}</span>
            <PlatformCheckbox
              options={platformsOpt}
              value={platforms}
              onChange={(v) => {
                setPlatforms(v);
                setCategory('platform');
                setDrillId(undefined);
              }}
            />
          </div>
        ),
      }}
    >
      <RiskCharts
        value={category}
        onChange={setCategory}
        platforms={platforms}
        drillId={drillId}
        setDrillId={setDrillId}
      />
      <List platformIds={platforms} {...defaultFilterItemVal} />
    </TzPageContainer>
  );
}

export default Risks;
