import useTzFilter, {
  TzFilterBack,
} from '@/components/lib/TzFilter/useTzFilter';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { useIntl } from '@umijs/max';
import { usePrevious, useUpdateEffect } from 'ahooks';
import { isEqual, lowerCase } from 'lodash';
import { useMemo, useState } from 'react';
import { trans2PluginFilterData } from '../CloudPlatform/util';

type PluginProps = {
  baseData?: API.CommonPolicyDatum[];
  platform?: string;
  services?: API.CommonServicetreeResponse[];
};
type PluginPropsBack = {
  dataFilter: TzFilterBack;
  dataSource: API.CommonPolicyItem[];
  setFilters: React.Dispatch<
    React.SetStateAction<Record<string, any> | undefined>
  >;
  filters?: Record<string, any>;
  filterIsChange?: boolean;
};
const usePlugin = (props: PluginProps): PluginPropsBack => {
  const { baseData, platform, services } = props;
  const intl = useIntl();
  const [filters, setFilters] = useState<Record<string, any>>();
  const previous = usePrevious(filters);
  const { riskSeverityOption } = useSeverityEnum();
  const filterIsChange = useMemo(() => !isEqual(previous, filters), [filters]);

  const dataSource = useMemo(() => {
    const { title, description, service, severity } = filters ?? {};
    const origin: API.CommonPolicyItem[] | undefined = baseData?.find(
      (v) => v.key === platform,
    )?.policy_items;
    if (!origin?.length) {
      return [];
    }
    const _s = service?.length ? trans2PluginFilterData(service, services) : [];

    return origin
      .filter(
        (v) =>
          !title || lowerCase(v.policy_title).indexOf(lowerCase(title)) > -1,
      )
      .filter(
        (v) =>
          !description ||
          lowerCase(v.description).indexOf(lowerCase(description)) > -1,
      )
      .filter((v) => !_s?.length || _s.includes(v.service_id))
      .filter((v) => !severity?.length || severity.includes(v.severity));
  }, [filters, baseData, platform]);

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'scanOptions' }),
        name: 'title',
        type: 'input',
        icon: 'icon-jiance',
      },
      {
        label: intl.formatMessage({ id: 'concreteContent' }),
        name: 'description',
        type: 'input',
        icon: 'icon-baimingdan',
      },
      {
        label: intl.formatMessage({ id: 'cloudServices' }),
        name: 'service',
        type: 'cascader',
        icon: 'icon-yuming',
        props: {
          multiple: true,
          options: services,
        },
      },
      {
        label: intl.formatMessage({ id: 'severityLevel' }),
        name: 'severity',
        type: 'select',
        icon: 'icon-chengdu',
        props: {
          mode: 'multiple',
          options: riskSeverityOption,
        },
      },
    ],
    [services, riskSeverityOption],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [services]);

  return {
    dataFilter,
    dataSource,
    setFilters,
    filters,
    filterIsChange,
  };
};

export default usePlugin;
