import NoData from '@/components/NoData';
import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import { TzCheckbox } from '@/components/lib/tz-checkbox';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useServiceFilterItem from '@/hooks/filterItems/useServiceFilterItem';
import LoadingCover from '@/loadingCover';
import ComplianceDetailContext from '@/pages/components/CoplianceDetailTree/ComplianceDetailContext';
import ItemsTree from '@/pages/components/CoplianceDetailTree/ItemsTree';
import { getAllNodeKey } from '@/pages/components/CoplianceDetailTree/util';
import PolicyList from '@/pages/components/PolicyList';
import PolicyFilters from '@/pages/components/PolicyList/PolicyFilters';
import { riskStore } from '@/pages/components/PolicyList/PolicyListItem';
import { getComplianceWithRisks } from '@/services/cspm/Compliance';
import { getComplianceTaskWithRisks } from '@/services/cspm/Task';
import { NONE_PLATFORM, toDetailIntercept } from '@/utils';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { intersection, set } from 'lodash';
import { Key, useEffect, useMemo, useState } from 'react';
import CExportModal from '../../CExportModal';

type IPlatformRisks = {
  complianceId?: Key;
  taskId?: Key;
  from?: string;
  credentialIds?: number[];
};
const PlatformRisks = ({
  complianceId,
  credentialIds,
  taskId,
  from = 'compliance',
}: IPlatformRisks) => {
  // const [list, setList] = useState<API.ComplianceDatum[]>();
  const intl = useIntl();
  const [info, setInfo] = useState<API_COMPLIANCE.ComplianceInfoResponse>();
  const [loading, setLoading] = useState<boolean>();
  const [filter, setFilter] = useState<Record<string, any>>();
  const [onlyCompliance, setOnlyCompliance] = useState<boolean>();
  const isTask = from === 'task';
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();

  // useUpdateEffect(
  //   () => setExpandedKeys(getAllNodeKey(info?.data)),
  //   [info],
  // );
  const { platforms, ...restFilter } = filter ?? {};

  // const compliance_type = onlyCompliance ? 'compliance' : undefined;
  const getList = useMemoizedFn(() => {
    if (!complianceId) {
      return;
    }
    setLoading(true);
    let params = {
      id: complianceId,
      credential_ids: credentialIds,
      not_passed: onlyCompliance,
    };
    let fetchUrl = getComplianceWithRisks;
    if (isTask) {
      fetchUrl = getComplianceTaskWithRisks;
      params = { ...params, tid: taskId };
    }
    fetchUrl(params)
      .then((res) => {
        setInfo(res);
        setExpandedKeys(getAllNodeKey(res?.data));
      })
      .finally(() => setLoading(false));
  });
  useEffect(() => {
    if (!complianceId) {
      setInfo(undefined);
      return;
    }
    if (onlyCompliance) {
      setOnlyCompliance(false);
      return;
    }
    getList();
  }, [complianceId]);

  useEffect(getList, [onlyCompliance]);

  const serviceItem = useServiceFilterItem({ only_top: 1 });
  const assetTypeItem = useServiceFilterItem();
  const { platformItem, policyTypeItem } = useCommonFilterItem();
  const defaultFilterOpt = useMemo(
    () => ({
      platformItem,
      assetTypeItem,
      serviceItem,
      policyTypeItem,
    }),
    [platformItem, serviceItem, policyTypeItem, assetTypeItem],
  );
  // const renderPolicyListFn = useMemoizedFn((_, node) => (
  //   <RisksList
  //     sendData={{
  //       credential_ids: credentialIds,
  //       compliance_id: complianceId,
  //       compliance_content_id: node.key,
  //     }}
  //     defaultFilter={{
  //       ...restFilter,
  //       not_passed: onlyCompliance,
  //     }}
  //     platforms={
  //       platforms?.length
  //         ? intersection(node.platforms, platforms)
  //         : node.platforms
  //     }
  //   />
  // ));

  const optionals = useMemo(
    () => [
      {
        name: 'service_ids',
        serviceItem,
        // valueEnum: getValueEnumByFilterOption(serviceItem,platform),
        // label: intl.formatMessage({ id: 'cloudServices' }),
      },
      {
        name: 'asset_type_ids',
        assetTypeItem,
        // valueEnum: getValueEnumByFilterOption(serviceItem,platform),
        // label: intl.formatMessage({ id: 'cloudServices' }),
      },
      'policy_type_name',
      'compliance_assets_count',
      'type',
      'status',
      {
        name: isTask ? 'created_at' : 'updated_at',
        sorter: !isTask,
        label: intl.formatMessage({
          id: isTask ? 'taskCreatedAt' : 'lastUpdatedTime',
        }),
      },
    ],
    [serviceItem, from],
  );

  // useUpdateEffect(() => {
  //   if (!platform || !get(refreshLoading, platform)) {
  //     return;
  //   }
  //   ref.current?.reload();
  //   set(riskStore, 'refreshLoading', false);
  // }, [refreshLoading]);

  const renderPolicyListFn = useMemoizedFn((_, node) => (
    <PolicyList
      filters={{
        ...restFilter,
        platformIds: platforms?.length
          ? intersection(node.platforms, platforms)
          : node.platforms,
        // platformIds: node.platforms,
        not_passed: onlyCompliance || undefined,
        credential_ids: credentialIds,
        compliance_id: complianceId,
        compliance_content_id: node.key,
        task_id: taskId,
      }}
      optionals={optionals}
      isInDetail
      renderActionType={!isTask ? 'verify' : undefined}
      from={from}
      onRow={(record) => {
        return {
          onClick: () =>
            onRowClick(() => {
              const fn = () =>
                history.push(`/risks/info/${record.policy_id}`, {
                  compliance_content_id: node.key,
                  credential_ids: credentialIds,
                  policy_type: record.policy_type,
                  entity_type: record.entity_type,
                  task_id: taskId,
                  from,
                  platforms:
                    record.platform === NONE_PLATFORM
                      ? undefined
                      : [record.platform],
                });
              if (isTask) {
                fn();
                return;
              }
              toDetailIntercept(
                {
                  type: 'policy',
                  id: record.policy_id,
                  policy_type: record.policy_type,
                },
                fn,
              );
            }),
        };
      }}
    />
  ));
  const noData = !info?.data?.length;
  return (
    <div className="mt-6 pb-4 relative">
      <LoadingCover rootClassName="mt-6" loading={loading} />
      <div className="flex justify-between -mb-2">
        <PolicyFilters {...defaultFilterOpt} onChange={setFilter} />
        {!isTask && (
          <div className="whitespace-nowrap">
            <TzButton
              disabled={noData}
              onClick={() => {
                set(riskStore, 'refreshLoading', true);
                getList();
              }}
              type="text"
              size="small"
              icon={<i className="icon iconfont icon-refresh1" />}
            >
              {intl.formatMessage({ id: 'refreshRisk' })}
            </TzButton>
            <CExportModal
              disabled={noData}
              parameter={{
                credential_ids: credentialIds,
                compliance_id: complianceId,
              }}
            />
          </div>
        )}
      </div>
      <div className="text-[#3E4653] text-[14px] mt-2 mb-1">
        <TzCheckbox
          checked={onlyCompliance}
          onChange={(e) => setOnlyCompliance(e.target.checked)}
        >
          {intl.formatMessage({ id: 'unStand.onlyNonCompliance' })}
        </TzCheckbox>
      </div>
      {noData ? (
        <NoData />
      ) : (
        <ComplianceDetailContext.Provider
          value={{
            filter,
          }}
        >
          <ItemsTree
            key={complianceId}
            treeData={info?.data}
            renderPolicyList={renderPolicyListFn}
            expandedKeys={expandedKeys}
            setExpandedKeys={setExpandedKeys}
          />
        </ComplianceDetailContext.Provider>
      )}
    </div>
  );
};

export default PlatformRisks;
