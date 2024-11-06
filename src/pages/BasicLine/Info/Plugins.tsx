import TzFilter from '@/components/lib/TzFilter';
import { FilterContext } from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import TzTabs from '@/components/lib/TzTabs';
import { TzCard } from '@/components/lib/tz-card';
import useServiceTree from '@/hooks/useServiceTree';
import PolicyList from '@/pages/components/PolicyList';
import RenderPIcon from '@/pages/components/RenderPIcon';
import { useIntl } from '@umijs/max';
import { get, sum } from 'lodash';
import { memo, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import usePlugin from '../usePlugin';

type TPlugins = {
  // platformVal: string[];
  plugins: API.CommonPolicyDatum[];
};

function Plugins(props: TPlugins) {
  const { plugins } = props;
  const services = useServiceTree(undefined, 1);
  const [platform, setPlatform] = useState<string>(() =>
    get(plugins, [0, 'key']),
  );
  const ref = useRef<HTMLDivElement>(null);

  const intl = useIntl();

  const { dataFilter, dataSource, setFilters, filterIsChange } = usePlugin({
    baseData: plugins,
    platform,
    services,
  });

  const total = useMemo(() => sum(plugins?.map((v) => v.count)), [plugins]);
  return (
    <TzCard
      headStyle={{ paddingBottom: 4 }}
      bodyStyle={{ paddingTop: 0 }}
      extra={<div ref={ref} />}
      title={
        <span className="error-info">
          {intl.formatMessage({ id: 'scanOptions' })}
          <span className="font-normal">
            {intl.formatMessage(
              { id: 'unStand.totalTip' },
              { len: total ?? 0 },
            )}
          </span>
        </span>
      }
    >
      <FilterContext.Provider value={{ ...dataFilter }}>
        {ref.current && createPortal(<TzFilter />, ref.current)}
        <TzFilterForm onChange={setFilters} />
      </FilterContext.Provider>
      <TzTabs
        className="common-type-bar"
        defaultActiveKey={platform}
        onChange={(key) => {
          setPlatform(key);
        }}
        destroyInactiveTabPane={true}
        items={plugins?.map(({ key, label, count, policy_items }) => ({
          key,
          label: (
            <div className="inline-flex items-center">
              <RenderPIcon platform={key} />
              &nbsp;{`${label}(${count ?? 0})`}
            </div>
          ),
          children: (
            <PolicyList
              filterIsChange={filterIsChange}
              dataSource={dataSource}
            />
          ),
        }))}
      />
    </TzCard>
  );
}

export default memo(Plugins);
