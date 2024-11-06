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
import { TzTooltip } from '@/components/lib/tz-tooltip';
import { useScanStatusEnum } from '@/hooks/enum/useScanStatusEnum';
import { useCloudAccountLimit } from '@/hooks/useLoginConf';
import useRefreshTable from '@/hooks/useRefreshTable';
import useTableAnchor from '@/hooks/useTableAnchor';
import { EN_LANG } from '@/locales';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getCredentials } from '@/services/cspm/CloudPlatform';
import { getFilterPannelOpenStatus, toDetailIntercept } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { getLocale, history, useIntl, useModel } from '@umijs/max';
import { Space } from 'antd';
import React, {
  ReactNode,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import CExportModal from '../CExportModal';
import useClodPlatformEvent from '../useClodPlatformEvent';

interface IProps {
  optionals?: string[];
  renderActionBtns?: (
    arg: ReactNode,
    record: API.CredentialsDatum,
  ) => ReactNode;
}

const TableList: React.FC<IProps> = ({
  optionals,
  renderActionBtns,
}: IProps) => {
  const { handleOprClick } = useClodPlatformEvent();
  // const platforms = useEffectivePlatform();
  const actionRef = useRef<ActionType>();
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const [accountTotal, setAccountTotal] = useState(0);
  const creditLimit = useCloudAccountLimit();
  const [exportOpent, setExportOpent] = useState<boolean>();
  useRefreshTable(actionRef);
  const { commonConst } = useModel('global') ?? {};

  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};

  const { getScanTagInfoByStatus } = useScanStatusEnum();
  const columns: TzProColumns<API.CredentialsDatum>[] = useMemo(() => {
    const _colums = [
      {
        title: intl.formatMessage({ id: 'accountName' }),
        dataIndex: 'name',
        tzEllipsis: 2,
      },
      {
        title: intl.formatMessage({ id: 'cloudPlatformType' }),
        dataIndex: 'platform',
        render(dom) {
          return <RenderColWithIcon platform={dom as string} />;
        },
      },
      {
        title: intl.formatMessage({ id: 'testingResult' }),
        dataIndex: 'status',
        isOptional: true,
        align: 'center',
        width: 90,
        render: (_, { status }) =>
          status
            ? renderCommonStatusTag(
                {
                  getTagInfoByStatus: getScanTagInfoByStatus,
                  status,
                },
                { size: 'small' },
              )
            : '-',
      },
      {
        title: intl.formatMessage({ id: 'tag' }),
        dataIndex: 'tags',
        render: (_, record) => record.tags?.length,
      },
      {
        title: intl.formatMessage({ id: 'operate' }),
        dataIndex: 'option',
        width: getLocale() === EN_LANG ? 236 : 192,
        render: (_, record) => (
          <Space size={4}>
            <CExportModal
              key={record.id}
              id={record.id}
              name={record.name}
              renderTrigger={
                <TzButton
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ marginLeft: -8 }}
                  size="small"
                  type="text"
                  key={record.id}
                >
                  {intl.formatMessage({ id: 'exportReport' })}
                </TzButton>
              }
              onOpenChange={setExportOpent}
            />
            <TzButton
              size="small"
              type="text"
              onClick={(e) => {
                if (getFilterPannelOpenStatus()) {
                  return;
                }
                handleOprClick(e, 'edit', record.id);
              }}
            >
              {intl.formatMessage({ id: 'edit' })}
            </TzButton>
            <TzButton
              danger
              size="small"
              type="text"
              onClick={(e) =>
                handleOprClick(e, 'delete', record, () => {
                  actionRef.current?.reset?.();
                })
              }
            >
              {intl.formatMessage({ id: 'delete' })}
            </TzButton>
          </Space>
        ),
      },
    ].filter((v) => !v.isOptional || optionals?.includes(v.dataIndex));

    renderActionBtns &&
      _colums.push({
        title: intl.formatMessage({ id: 'operate' }),
        dataIndex: 'option',
        width: 110,
        render: renderActionBtns,
      });
    return _colums;
  }, []);

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'accountName' }),
        name: 'name',
        type: 'input',
        icon: 'icon-ziyuan',
      },
      {
        label: intl.formatMessage({ id: 'platformType' }),
        name: 'platforms',
        type: 'select',
        icon: 'icon-yunpingtai',
        props: {
          mode: 'multiple',
          options: commonPlatforms,
        },
      },
      // 后端暂不支持，下个版本支持后放开 2024.7.5
      // {
      //   label: intl.formatMessage({ id: 'riskTypes' }),
      //   name: 'risk_types',
      //   type: 'select',
      //   icon: 'icon-leixing',
      //   props: {
      //     mode: 'multiple',
      //     options: commonConst?.risk_type,
      //   },
      // },
    ],
    [commonPlatforms, commonConst],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  const handleChange = useCallback((data: any) => {
    setFilters(data);
  }, []);

  const disableAddBtn = creditLimit > 0 && accountTotal >= creditLimit;

  return (
    <div className="relative">
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="absolute -top-[72px]" ref={anchorRef} />
        <div className="flex justify-between mb-2">
          <TzTooltip
            title={intl.formatMessage({ id: 'unStand.disableAddCloudAccount' })}
            placement="top"
            key="1"
            disabled={!disableAddBtn}
          >
            <TzButton
              disabled={disableAddBtn}
              key="1"
              type="primary"
              onClick={() => history.push('/sys/cloud-platform/add')}
            >
              {intl.formatMessage(
                { id: 'accountOpr' },
                { name: intl.formatMessage({ id: 'add' }) },
              )}
            </TzButton>
          </TzTooltip>
          <TzFilter />
        </div>
        <TzFilterForm className="fir" onChange={handleChange} />
      </FilterContext.Provider>
      <TzProTable<API.CredentialsDatum>
        onChange={listOffsetFn}
        actionRef={actionRef}
        params={filters}
        onRow={(record) => {
          return {
            onClick: (e) =>
              !exportOpent &&
              onRowClick(() =>
                toDetailIntercept({ type: 'credential', id: record?.id }, () =>
                  history.push(`/sys/cloud-platform/info/${record.id}`),
                ),
              ),
          };
        }}
        request={async (dp) => {
          const { total, items } = await getCredentials({
            ...dp,
            ...(filters || {}),
          });
          setAccountTotal(total);
          return { total, data: items || [] };
        }}
        columns={columns}
      />
      {/* {exportInfo && <CExportModal ref={exportRef} {...exportInfo} />} */}
    </div>
  );
};

export default memo(TableList);
