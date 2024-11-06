import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzButton } from '@/components/lib/tz-button';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useTagFilterItem from '@/hooks/filterItems/useTagFilterItem';
import { useCloudAccountLimit } from '@/hooks/useLoginConf';
import useRefreshTable from '@/hooks/useRefreshTable';
import useTableAnchor from '@/hooks/useTableAnchor';
import AssignTags, { IAssignTags } from '@/pages/components/AssignTags';
import { editCredentials, getCredentials } from '@/services/cspm/CloudPlatform';
import { getFilterPannelOpenStatus, toDetailIntercept } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { history, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { Space, message } from 'antd';
import React, {
  ReactNode,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { transFilterData2Params } from '../../util';
import useClodPlatformEvent from '../useClodPlatformEvent';
import CredentialTable from './CredentialTable';

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
  const [assignTagObj, setAssignTagObj] = useState<IAssignTags>();
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const [accountTotal, setAccountTotal] = useState(0);
  const creditLimit = useCloudAccountLimit();
  const { platformItem } = useCommonFilterItem();
  const { tagFilterItem, tags, refreshTags } = useTagFilterItem();
  const { refresh } = useModel('@@initialState');
  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'accountName' }),
        name: 'search',
        type: 'input',
        icon: 'icon-ziyuan',
      },
      platformItem,
      tagFilterItem,
    ],
    [platformItem, tagFilterItem],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [tagFilterItem]);
  const handleChange = useCallback(
    (data: any) => {
      setFilters(transFilterData2Params(data, { tagFilterItem }));
    },
    [tags],
  );

  useRefreshTable(actionRef);

  const disableAddBtn = creditLimit > 0 && accountTotal >= creditLimit;
  const handleTagAssign = useMemoizedFn((v) => {
    editCredentials({ id: assignTagObj?.id, tags: v })
      .then((res) => {
        message.success(intl.formatMessage({ id: 'saveSuccess' }));
        actionRef.current?.reload();
      })
      .then(() => setAssignTagObj(undefined));
  });
  const renderActionBtnsFn = useMemoizedFn((_, record) => (
    <Space size={4}>
      <TzButton
        className="-ml-2"
        size="small"
        type="text"
        onClick={(e) => {
          e.stopPropagation();
          setAssignTagObj({
            tags: record.tags.map(({ key, values }) => ({ key, values })),
            id: record.id,
          });
        }}
      >
        {intl.formatMessage({ id: 'choiceTags' })}
      </TzButton>
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
            refresh();
            actionRef.current?.reload?.();
            history.replace('/sys/cloud-platform/list', {
              state: null, // 清除 state
            });
          })
        }
      >
        {intl.formatMessage({ id: 'delete' })}
      </TzButton>
    </Space>
  ));
  return (
    <div className="relative">
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="absolute -top-[72px]" ref={anchorRef} />
        <div className="flex justify-between mb-2">
          <div className="flex mr-2">
            <TzFilter />
            <TzFilterForm
              className="ml-[6px] align-center-input"
              onChange={handleChange}
            />
          </div>

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
              {intl.formatMessage({ id: 'add' })}
            </TzButton>
          </TzTooltip>
        </div>
      </FilterContext.Provider>
      <CredentialTable
        optionals={['updated_at']}
        onChange={listOffsetFn}
        ref={actionRef}
        params={filters}
        onRow={(record) => {
          return {
            onClick: (e) =>
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
        renderActionBtns={renderActionBtnsFn}
      />
      {!!assignTagObj && (
        <AssignTags
          onCancel={() => setAssignTagObj(undefined)}
          onOk={handleTagAssign}
          tagList={tags}
          refreshTags={refreshTags}
          {...assignTagObj}
        />
      )}
      {/* {exportInfo && <CExportModal ref={exportRef} {...exportInfo} />} */}
    </div>
  );
};

export default memo(TableList);
