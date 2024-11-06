import TzProTable, {
  TzProColumns,
  onRowClick,
} from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzButton } from '@/components/lib/tz-button';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useCredentialFilterItem from '@/hooks/filterItems/useCredentialFilterItem';
import useRuleSensitiveRisks from '@/hooks/useRuleSensitiveRisks';
import useTableAnchor from '@/hooks/useTableAnchor';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getRuleSensitiveRisks } from '@/services/cspm/CloudPlatform';
import { ActionType } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { memo, useMemo, useRef, useState } from 'react';
import Export from './Export';

type TSensitiveRuleRiskList = {
  platforms?: string[];
  className?: string;
};
function SensitiveRuleRiskList(props: TSensitiveRuleRiskList) {
  const { className, platforms } = props;

  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const ruleSensitiveRisks = useRuleSensitiveRisks();
  const {
    secretSeverityOption,
    getSeverityTagInfoByStatus: getTagInfoByStatus,
  } = useSeverityEnum();

  const [modalOpen, setModalOpen] = useState<boolean>();

  const columns: TzProColumns<API_AGENTLESS.RuleSensitiveRisksDatum>[] =
    useMemo(
      () => [
        {
          title: intl.formatMessage({ id: 'sensitiveInformationRule' }),
          dataIndex: 'title',
          tzEllipsis: 2,
        },
        {
          title: intl.formatMessage({ id: 'informationType' }),
          dataIndex: 'category',
          tzEllipse: 2,
          width: '15%',
        },
        {
          title: intl.formatMessage({ id: 'severityLevel' }),
          dataIndex: 'severity',
          width: '8%',
          align: 'center',
          // render: (txt) => renderSeverityTag(txt),
          render: (status: string) =>
            renderCommonStatusTag(
              {
                getTagInfoByStatus,
                status,
              },
              { size: 'small' },
            ),
        },
        {
          title: intl.formatMessage({ id: 'affectedAssets' }),
          dataIndex: 'cloud_static',
          width: '20%',
          render: (cloud_static) => {
            if (isEmpty(cloud_static)) {
              return '-';
            }
            return (
              <div className="flex flex-wrap gap-x-3">
                {cloud_static?.map(({ platform, count }) => (
                  <RenderColWithIcon
                    key={platform}
                    name={count}
                    platform={platform}
                  />
                ))}
              </div>
            );
          },
        },
        {
          title: intl.formatMessage({ id: 'firstFindTime' }),
          dataIndex: 'created_at',
          isOptional: true,
          valueType: 'dateTime',
          width: '15%',
        },
        {
          title: intl.formatMessage({ id: 'operate' }),
          dataIndex: 'option',
          width: 80,
          render: (_, record) => (
            <Export
              tip={false}
              fileName={record?.title}
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
          ),
        },
      ],
      [],
    );
  const credentialItem = useCredentialFilterItem();

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'sensitiveInformationRule' }),
        name: 'search',
        type: 'input',
        icon: 'icon-xingzhuangjiehe',
      },
      credentialItem,
      {
        label: intl.formatMessage({ id: 'severityLevel' }),
        name: 'severity',
        type: 'select',
        icon: 'icon-chengdu',
        props: {
          mode: 'multiple',
          options: secretSeverityOption,
        },
      },
      {
        label: intl.formatMessage({ id: 'informationType' }),
        name: 'category',
        type: 'select',
        icon: 'icon-leixing',
        props: {
          mode: 'multiple',
          options: ruleSensitiveRisks,
        },
      },
    ],
    [ruleSensitiveRisks, credentialItem],
  );
  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [ruleSensitiveRisks, credentialItem]);

  return (
    <div className={classNames('relative', className)}>
      <div className="absolute -top-[74px]" ref={anchorRef} />
      <div className="flex justify-between">
        <FilterContext.Provider value={{ ...dataFilter }}>
          <div className="flex gap-x-[6px] mb-2">
            <TzFilter />
            <TzFilterForm
              className="align-center-input"
              onChange={setFilters}
            />
          </div>
        </FilterContext.Provider>
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
      <TzProTable<API_AGENTLESS.RuleSensitiveRisksDatum>
        params={{ ...filters, platforms }}
        onChange={listOffsetFn}
        onRow={(record) => {
          return {
            onClick: () =>
              !modalOpen &&
              onRowClick(() =>
                history.push(`/secret/info/${record.unique_id}`, {
                  // infoBreadcrumb,
                  // task_id,
                }),
              ),
          };
        }}
        actionRef={actionRef}
        request={async (dp) => {
          const { total, items } = await getRuleSensitiveRisks({
            ...dp,
          });
          return { total, data: items || [] };
        }}
        columns={columns}
      />
    </div>
  );
}

export default memo(SensitiveRuleRiskList);
