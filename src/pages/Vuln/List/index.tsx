import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzButton } from '@/components/lib/tz-button';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useCredentialFilterItem from '@/hooks/filterItems/useCredentialFilterItem';
import useTableAnchor from '@/hooks/useTableAnchor';
import { getVulnRisks } from '@/services/cspm/CloudPlatform';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { memo, useMemo, useRef, useState } from 'react';
import Export from './Export';
import VulnTable from './VulnTable';

type TVulnRiskList = {
  platforms?: string[];
};
function VulnList(props: TVulnRiskList) {
  const { platforms } = props;
  const { severityOption, getSeverityTagInfoByStatus: getTagInfoByStatus } =
    useSeverityEnum();
  const [modalOpen, setModalOpen] = useState<boolean>();
  const [filters, setFilters] = useState<any>();

  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);

  const { attackPathItem, vulnAttrItem } = useCommonFilterItem();
  const credentialItem = useCredentialFilterItem();

  const filterData: FilterFormParam[] = useMemo(
    () =>
      [
        {
          label: intl.formatMessage({ id: 'unStand.vulnSearch' }),
          name: 'search',
          type: 'input',
          icon: 'icon-bianhao',
        },
        credentialItem,
        attackPathItem,
        vulnAttrItem,
        {
          label: intl.formatMessage({ id: 'severityLevel' }),
          name: 'severity',
          type: 'select',
          icon: 'icon-chengdu',
          props: {
            mode: 'multiple',
            options: severityOption,
          },
        },
      ] as FilterFormParam[],
    [credentialItem],
  );

  const data = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    data.updateFilter({ formItems: filterData });
  }, [credentialItem]);

  const handleChange = useMemoizedFn(setFilters);

  return (
    <div className="relative">
      <div className="absolute -top-[74px]" ref={anchorRef} />
      <FilterContext.Provider value={{ ...data }}>
        <div className="flex justify-between">
          <div className="flex gap-x-[6px] mb-2">
            <TzFilter />
            <TzFilterForm
              className="align-center-input"
              onChange={handleChange}
            />
          </div>
          <Export
            renderTrigger={
              <TzButton
                disabled={!platforms?.length}
                size="small"
                className="mt-[3px]"
                icon={<i className="icon iconfont icon-daochu1" />}
                type="text"
              >
                {intl.formatMessage({ id: 'export' })}
              </TzButton>
            }
            parameter={{ ...filters, platforms }}
          />
        </div>
      </FilterContext.Provider>
      <VulnTable
        onChange={listOffsetFn}
        onRow={(record) => {
          return {
            onClick: () =>
              !modalOpen &&
              onRowClick(() => {
                history.push(`/vuln/info/${record.unique_id}`, {
                  // infoBreadcrumb,
                  // task_id,
                });
              }),
          };
        }}
        // onRow={(record) => {
        //   return {
        //     onClick: () =>
        //       onRowClick(() => {
        //         if (inDetail) {
        //           setRecordInfo(record);
        //         } else {
        //           history.push(`/risks/vuln-info/${record.unique_id}`, {
        //             infoBreadcrumb,
        //             task_id,
        //           });
        //         }
        //       }),
        //   };
        // }}
        optionals={[
          'vuln_name',
          'cloud_static',
          'vuln_attr',
          'cvssv3_score',
          {
            name: 'created_at',
            label: intl.formatMessage({ id: 'firstFindTime' }),
          },
        ]}
        params={{ ...filters, platforms }}
        request={async (dp) => {
          const { total, items } = await getVulnRisks({
            ...dp,
          });
          return { total, data: items || [] };
        }}
        renderActionBtns={(_, record) => (
          <Export
            tip={false}
            fileName={record?.name}
            parameter={{ unique_id: record.unique_id, platforms }}
            onOpenChange={setModalOpen}
            renderTrigger={
              <TzButton
                className="-ml-2"
                size="small"
                type="text"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {intl.formatMessage({ id: 'export' })}
              </TzButton>
            }
          />
        )}
      />
    </div>
  );
}

export default memo(VulnList);
