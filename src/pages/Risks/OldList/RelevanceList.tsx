import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzButton } from '@/components/lib/tz-button';
import { useScanStatusEnum } from '@/hooks/enum/useScanStatusEnum';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useTableAnchor from '@/hooks/useTableAnchor';
import PolicyList, { PolicyListRef } from '@/pages/components/PolicyList';
import RectifyComplianceRes from '@/pages/components/RectifyComplianceRes';
import {
  getAssetsPolicies,
  getHistoryAssetsPolicies,
} from '@/services/cspm/CloudPlatform';
import { verifyPolicy } from '@/services/cspm/Risks';
import { toDetailIntercept } from '@/utils';
import { useIntl, useLocation, useModel } from '@umijs/max';
import { useMemoizedFn, useSize } from 'ahooks';
import { message } from 'antd';
import classNames from 'classnames';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import RiskDrawer from '../Info/Config/RiskDrawer';
import { TScanResList } from './interface';

function RelevanceList(props: TScanResList) {
  const { infoBreadcrumb, filterToRef, className, defaultParams } = props;
  const { task_id, instance_hash_id } = defaultParams;
  const isHistory = !!task_id;
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const ref = useRef<PolicyListRef>(null);
  const { initialState } = useModel('@@initialState');
  const { aiPromptTemplates } = initialState ?? {};
  const { width: bWid = 0 } = useSize(document.body) ?? {};
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const { getSeverityTagInfoByStatus } = useSeverityEnum();
  const [recordInfo, setRecordInfo] = useState<API.RisksDatum>();

  const { scanStatusOption, getScanTagInfoByStatus } = useScanStatusEnum();
  const { riskSeverityOption } = useSeverityEnum();

  const pathname = useLocation().pathname;

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'scanOptions' }),
        name: 'policy_title',
        type: 'input',
        icon: 'icon-jiance',
        props: {
          placeholder: intl.formatMessage({ id: 'unStand.policyTitleAndDesc' }),
        },
      },
      {
        label: intl.formatMessage({ id: 'severityLevel' }),
        name: 'severity',
        type: 'select',
        icon: 'icon-chengdu',
        props: {
          mode: 'multiple',
          // options: RISK_OPT,
          options: riskSeverityOption,
        },
      },
      {
        label: intl.formatMessage({ id: 'testingResult' }),
        name: 'status',
        type: 'select',
        icon: 'icon-yunhangzhuangtai',
        props: {
          mode: 'multiple',
          options: scanStatusOption,
          // options: SCAN_STATUS_OPT,
        },
      },
    ],
    [scanStatusOption, riskSeverityOption],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  const handleChange = useCallback(setFilters, []);

  const refreshList = useMemoizedFn(() => {
    ref.current?.reloadAndRest();
  });
  // useEffect(refreshList, [JSON.stringify(sendData)]);

  const handlePolicyVerify = useMemoizedFn((policy_id) => {
    verifyPolicy({ policy_id }).then(() => {
      // refreshList();
      message.success(intl.formatMessage({ id: 'unStand.verifySuccess' }));
    });
  });
  return (
    <div className={classNames('relative', className)}>
      <div className="absolute -top-[156px]" ref={anchorRef} />
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex gap-x-[6px] mb-2">
          <TzFilter />
          <TzFilterForm
            className="align-center-input"
            onChange={handleChange}
          />
        </div>
      </FilterContext.Provider>
      <PolicyList
        ref={ref}
        params={filters}
        optionals={[
          'description',
          'status',
          {
            name: 'updated_at',
            label: intl.formatMessage({ id: 'modifiedTime' }),
          },
        ]}
        request={async (dp) => {
          if (!instance_hash_id) {
            return { total: 0, data: [] };
          }
          const apiUrl = isHistory
            ? getHistoryAssetsPolicies
            : getAssetsPolicies;
          const { total, items } = await apiUrl({
            ...dp,
            hash_id: instance_hash_id,
            task_id,
            ...(filters || {}),
          });
          return { total, data: items || [] };
        }}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() => {
                const calFn = () => {
                  setRecordInfo(record);
                };
                if (pathname?.includes('/task')) {
                  calFn();
                } else {
                  toDetailIntercept(
                    { type: 'policy', id: record.policy_id },
                    calFn,
                  );
                }
              }),
          };
        }}
        renderActionBtns={(_, record) =>
          record.type === 'manual' ? (
            <div className="-ml-2">
              <RectifyComplianceRes
                id={record.id}
                calFn={() => {
                  refreshList();
                  message.success(
                    intl.formatMessage({ id: 'unStand.rectifySuccess' }),
                  );
                }}
              />
            </div>
          ) : (
            <TzButton
              size="small"
              type="text"
              onClick={(e) => {
                e.stopPropagation();
                handlePolicyVerify(record.policy_id);
              }}
            >
              {intl.formatMessage({ id: 'verify' })}
            </TzButton>
          )
        }
      />
      <RiskDrawer
        onClose={() => setRecordInfo(undefined)}
        dataSource={recordInfo}
        open={!!recordInfo}
        record={recordInfo}
      />
    </div>
  );
}

export default memo(RelevanceList);
