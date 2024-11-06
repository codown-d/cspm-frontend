import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { history, useIntl } from '@umijs/max';
import PlatformCheckbox from '../components/PlatformCheckbox';
import RiskCharts from './AssetCharts';
import List from './List';
import useDrillParameter from './useDrillParameter';

function Assets() {
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

  return (
    <TzPageContainer
      header={{
        title: (
          <div className="inline-flex">
            <span>{intl.formatMessage({ id: 'assets' })}</span>
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
      extra={[
        <TzButton
          key="scannerRecorder"
          onClick={() => {
            history.push('/asset/periodic-task');
          }}
        >
          {intl.formatMessage({ id: 'periodicTask' })}
        </TzButton>,
      ]}
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

export default Assets;
