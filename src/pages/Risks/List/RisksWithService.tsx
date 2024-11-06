import ServiceCatalog from '@/pages/components/ServiceCatalog';
import ServiceCatalogWithAnchor from '@/pages/components/ServiceCatalog/ServiceCatalogWithAnchor';
import useServiceCatalog from '@/pages/components/ServiceCatalog/useServiceCatalog';
import {
  getHistoryRiskServicetree,
  getRiskServicetree,
} from '@/services/cspm/CloudPlatform';
import { CONFIG_RISK_STATIC } from '@/utils';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { isUndefined } from 'lodash';
import { lazy, useMemo } from 'react';
// import RiskList from './RiskList';
// import SensitiveRuleRiskList from './SensitiveRuleRiskList';
// import VulnRiskList from './VulnRiskList';
import { RiskListProps } from './interface';

const RiskList = lazy(() => import('./RiskList'));
const SensitiveRuleRiskList = lazy(() => import('./SensitiveRuleRiskList'));
const VulnRiskList = lazy(() => import('./VulnRiskList'));
function RisksWithService(props: RiskListProps) {
  const {
    className,
    affix,
    // task_id,
    // credential_id,
    boxH,
    total,
    // platform,
    riskType,
    refreshAction,
    state,
    updateServiceData,
    updateFilters,
    ...restprops
  } = props;
  const intl = useIntl();

  const { task_id, credential_id, platform } = state;

  const {
    allValues,
    setSelectNode,
    servicesTree,
    selectNode,
    platformByServiceTree,
    refreshServiceTree,
  } = useServiceCatalog({
    fetchUrl: !task_id ? getRiskServicetree : getHistoryRiskServicetree,
    params: !task_id
      ? { risk_type: riskType, credential_id }
      : { risk_type: riskType, task_id },
    platform,
  });

  useUpdateEffect(refreshServiceTree, [refreshAction]);

  useUpdateEffect(() => {
    if (isUndefined(selectNode)) {
      return;
    }
    updateServiceData(riskType, {
      service_ids: selectNode,
      platform: platformByServiceTree,
    });
  }, [selectNode]);
  const setFilters = useMemoizedFn((filters) =>
    updateFilters(riskType, filters),
  );

  const ListDom = useMemo(() => {
    switch (riskType) {
      case CONFIG_RISK_STATIC.config:
        return RiskList;
      case CONFIG_RISK_STATIC.sensitive:
        return SensitiveRuleRiskList;
      case CONFIG_RISK_STATIC.vuln:
        return VulnRiskList;
      default:
        return null;
    }
  }, [riskType, platform, credential_id, task_id]);
  const serviceCatalogNode = useMemo(
    () => (
      <ServiceCatalog
        boxH={boxH}
        total={total}
        title={intl.formatMessage({ id: 'fullRisks' })}
        onChange={setSelectNode}
        value={selectNode}
        treeData={servicesTree}
        isAll={
          !!selectNode?.length &&
          allValues.current?.length === selectNode?.length
        }
        onAllCheck={(all) => setSelectNode(all ? allValues.current : [])}
      />
    ),
    [riskType, servicesTree, selectNode, setSelectNode, boxH, affix, total],
  );

  const fetchParams = useMemo(() => {
    const {
      service_data: { service_ids },
      filters,
      ...restState
    } = state ?? {};
    return {
      ...restState,
      service_ids,
      ...filters,
    };
  }, [state]);

  return (
    <div className={classNames('flex mt-4', className)}>
      {affix ? (
        <ServiceCatalogWithAnchor maxHeight={boxH ?? 0}>
          {serviceCatalogNode}
        </ServiceCatalogWithAnchor>
      ) : (
        serviceCatalogNode
      )}

      <ListDom
        refreshAction={refreshAction}
        platform={platformByServiceTree}
        setFilters={setFilters}
        fetchParams={fetchParams}
        isFir={affix}
        className="ml-6 flex-1 w-0"
        {...restprops}
      />
    </div>
  );
}

export default RisksWithService;
