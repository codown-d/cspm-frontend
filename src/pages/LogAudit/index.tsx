import ExportModal, { mixFileName } from '@/components/ExportModal';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzButton } from '@/components/lib/tz-button';
import { useSucFailEnum } from '@/hooks/enum/useSucFailEnum';
import useTableAnchor from '@/hooks/useTableAnchor';
import { exportTask } from '@/services/cspm/Home';
import { getAuditLogs } from '@/services/cspm/LogAudit';
import { useIntl, useModel } from '@umijs/max';
import { cloneDeep, keys, set } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { renderCommonStatusTag } from '../components/RenderRiskTag';
import './index.less';
const TableList: React.FC<unknown> = () => {
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);

  const { sucFailOption, getSucFailTagInfoByStatus: getTaskTagInfoByStatus } =
    useSucFailEnum();

  const { commonConst } = useModel('global') ?? {};
  const { audit_operation } = commonConst ?? {};
  const columns: TzProColumns<API.SystemLogsDatum>[] = [
    {
      title: intl.formatMessage({ id: 'occurrenceTime' }),
      dataIndex: 'created_at',
      valueType: 'dateTime',
      width: '18%',
    },
    {
      title: intl.formatMessage({ id: 'username' }),
      dataIndex: 'username',
      tzEllipsis: 2,
    },
    {
      title: 'IP',
      dataIndex: 'source_ip',
      width: '13%',
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      width: '8%',
      align: 'center',
      render: (status) =>
        renderCommonStatusTag(
          {
            getTagInfoByStatus: getTaskTagInfoByStatus,
            status,
          },
          { size: 'small' },
        ),
    },
    {
      title: intl.formatMessage({ id: 'operation' }),
      dataIndex: 'operation',
      width: '8%',
    },
    {
      title: intl.formatMessage({ id: 'concreteBehavior' }),
      dataIndex: 'details',
    },
    // {
    //   title: intl.formatMessage({ id: 'account' }),
    //   dataIndex: 'account',
    //   width: '13%',
    // },
  ];

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'username' }),
        name: 'username',
        type: 'input',
        icon: 'icon-yonghuming',
      },
      {
        label: 'IP',
        name: 'ip',
        type: 'input',
        icon: 'icon-ziyuan',
      },
      {
        label: intl.formatMessage({ id: 'concreteBehavior' }),
        name: 'action',
        type: 'input',
        icon: 'icon-lujing',
      },
      {
        label: intl.formatMessage({ id: 'status' }),
        name: 'status',
        type: 'select',
        icon: 'icon-celveguanli',
        props: {
          mode: 'multiple',
          options: sucFailOption,
        },
      },
      {
        label: intl.formatMessage({ id: 'operation' }),
        name: 'operation',
        type: 'select',
        icon: 'icon-caozuo',
        props: {
          mode: 'multiple',
          options: audit_operation,
        },
      },
      {
        label: intl.formatMessage({ id: 'occurrenceTime' }),
        name: 'created_at',
        type: 'rangePickerCt',
        icon: 'icon-shijian',
        props: {
          showTime: true,
        },
      },
    ],
    [audit_operation, sucFailOption],
  );
  const data = useTzFilter({ initial: filterData });
  const handleChange = useCallback((data: any) => {
    const temp = {};
    keys(data).forEach((key) => {
      let _val = cloneDeep(data[key]);
      if (key === 'created_at' && _val) {
        _val[0] && set(temp, ['created_at_start'], +_val[0]);
        _val[1] && set(temp, ['created_at_end'], +_val[1]);

        return;
      }
      set(temp, [key], _val);
    });
    setFilters(temp);
  }, []);
  return (
    <TzPageContainer
      className="log-audit"
      header={{
        title: intl.formatMessage({ id: 'logAudit' }),
      }}
    >
      <div className="absolute top-0" ref={anchorRef} />
      <FilterContext.Provider value={{ ...data }}>
        <div className="flex justify-between gap-x-[6px] mb-2">
          <div className="flex gap-x-[6px]">
            <TzFilter />
            <TzFilterForm
              className="align-center-input"
              onChange={handleChange}
            />
          </div>
          <ExportModal
            tip={intl.formatMessage(
              { id: 'unStand.exportTypeTip' },
              { name: intl.formatMessage({ id: 'log' }) },
            )}
            renderTrigger={
              <TzButton
                size="small"
                className="mt-[3px]"
                icon={<i className="icon iconfont icon-daochu1" />}
                type="text"
              >
                {intl.formatMessage({ id: 'export' })}
              </TzButton>
            }
            onOpenChange={(open, form) => {
              open &&
                form.setFieldsValue({
                  file_name: mixFileName(
                    intl.formatMessage({
                      id: 'auditLog',
                    }),
                  ),
                });
            }}
            onSubmit={({ file_name: filename }) =>
              exportTask({
                task_type: 'excel',
                execute_type: 'audit',
                filename,
                parameter: {
                  audit_log_search: filters,
                },
              })
            }
          />
        </div>
      </FilterContext.Provider>
      <TzProTable<API.SystemLogsDatum>
        onChange={listOffsetFn}
        className="no-hover-table"
        params={filters}
        request={async (dp) => {
          const { total, items } = await getAuditLogs({
            ...dp,
            ...(filters || {}),
          });

          return { total, data: items || [] };
        }}
        columns={columns}
      />
    </TzPageContainer>
  );
};

export default TableList;
