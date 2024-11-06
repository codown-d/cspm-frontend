import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import Range from '@/components/Range';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
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
import { TzSwitch } from '@/components/lib/tz-switch';
import { TzConfirm } from '@/components/lib/tzModal';
import useRefreshTable from '@/hooks/useRefreshTable';
import useTableAnchor from '@/hooks/useTableAnchor';
import {
  delPeriodTask,
  getPeriodTaskList,
  togglePeriodTask,
} from '@/services/cspm/Task';
import { getFilterPannelOpenStatus } from '@/utils';
import { DATE_TIME } from '@/utils/constants';
import { ActionType } from '@ant-design/pro-components';
import {
  history,
  useIntl,
  useLocation,
  useModel,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Space, message } from 'antd';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
// import Highlighter from 'react-highlight-words';

const AssetPeriodicTask: React.FC<unknown> = () => {
  const { breadcrumb } = useRouteProps();
  const pathname = useLocation().pathname;
  const [keyword, setKeyword] = useState<string>();
  const tableRef = useRef<ActionType>();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const isRisk = pathname.includes('/risks');
  const taskType = isRisk ? 'risks_scan' : 'assets_scan';
  const urlPrefix = isRisk ? '/risks/list' : '/asset';
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  useRefreshTable(tableRef);
  const { commonConst } = useModel('global') ?? {};
  const { task_type } = commonConst ?? {};

  const filterData: FilterFormParam[] = useMemo(() => {
    return [
      {
        label: translate('taskName'),
        name: 'name',
        type: 'input',
        icon: 'icon-mingmingkongjian',
      },
      // {
      //   label: translate('detectContent'),
      //   name: 'sub_type',
      //   type: 'select',
      //   icon: 'icon-jiance',
      //   props: {
      //     mode: 'multiple',
      //     options: task_type,
      //   },
      // },
    ];
  }, [task_type]);
  const dataFilter = useTzFilter({ initial: filterData });
  const [filterVal, setFilterVal] = useState<any>({});

  // 操作列
  const oprFn = useMemoizedFn((type, record, open?: boolean) => {
    if (type === 'delete') {
      TzConfirm({
        title: false,
        okButtonProps: {
          danger: true,
        },
        content: translate('unStand.deleteBaseLine', {
          type: translate('task'),
          name: record.name,
        }),
        onOk: () => {
          delPeriodTask({
            type: taskType,
            id: record.id,
          }).then((res) => {
            if (!res) {
              message.success(
                translate('oprSuc', { name: translate('delete') }),
              );
              tableRef.current?.reload?.();
            }
          });
        },
        okText: translate('delete'),
      });
      return;
    }
    if (type === 'switch') {
      const toggleText = translate(open ? 'enable' : 'disable');
      TzConfirm({
        content: translate(
          open
            ? 'unStand.areYouSureEnablePeriodicTask'
            : 'unStand.areYouSureDisablePeriodicTask',
          { name: record.name },
        ),
        cancelText: translate('cancel'),
        okText: toggleText,
        okButtonProps: {
          type: 'primary',
        },
        cancelButtonProps: {
          className: 'cancel-btn',
        },
        onOk() {
          togglePeriodTask({
            disable: !open,
            id: record.id,
            type: taskType,
          }).then((res) => {
            if (!res) {
              // message.success(translate('oprSuc', { name: toggleText }));
              tableRef.current?.reload?.();
            }
          });
        },
      });
      return;
    }
  });

  const columns: TzProColumns<API_TASK.PeriodTaskListRes>[] = useMemo(() => {
    const cols: TzProColumns<API.PeriodTaskListRes>[] = [
      {
        title: translate('taskName'),
        dataIndex: 'name',
        ellipsis: {
          showTitle: true,
        },
        width: '10%',
        tzEllipsis: 2,
        // render: (_, record) => (
        //   <Highlighter
        //     className="highlight"
        //     searchWords={keyword ? [keyword] : []}
        //     autoEscape={true}
        //     textToHighlight={record.name || '-'}
        //   />
        // ),
      },
      {
        title: translate('detectContent'),
        ellipsis: {
          showTitle: true,
        },
        dataIndex: 'content',
        tzEllipsis: 2,
      },
      {
        title: translate('scanRange'),
        dataIndex: 'scope',
        tzEllipsis: 2,
        width: '18%',
        render: (_, record) => {
          const { scope } = record;
          if (isEmpty(scope)) {
            return '-';
          }
          return <Range conf={scope} />;
        },
      },
      {
        title: translate('executionPeriod'),
        dataIndex: 'schedule',
        tzEllipsis: 2,
        width: '12%',
        ellipsis: {
          showTitle: true,
        },
      },
      {
        title: translate('updater'),
        dataIndex: 'updater',
        tzEllipsis: 2,
      },
      {
        title: translate('turnoverTime'),
        dataIndex: 'created_at',
        width: '14%',
        render(_: unknown, record) {
          return dayjs(record.updated_at).format(DATE_TIME);
        },
      },
      {
        title: translate('taskStatus'),
        dataIndex: 'status',
        align: 'center',
        width: '10%',
        render: (_, record) => {
          return (
            <TzSwitch
              size="small"
              checked={record.status}
              onChange={(v, e) => {
                e.stopPropagation();
                e.preventDefault();
                oprFn('switch', record, v);
                return false;
              }}
            />
          );
        },
      },
      {
        title: translate('operate'),
        dataIndex: 'operate',
        width: 120,
        render: (_, record) => {
          return (
            <Space
              size={4}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                return false;
              }}
            >
              <TzButton
                style={{ marginLeft: -8 }}
                size="small"
                type="text"
                onClick={() => {
                  if (getFilterPannelOpenStatus()) {
                    return;
                  }
                  history.push(`${urlPrefix}/periodic-task/edit/${record.id}`);
                }}
              >
                {translate('edit')}
              </TzButton>
              <TzButton
                danger
                size="small"
                type="text"
                onClick={() => oprFn('delete', record)}
              >
                {translate('delete')}
              </TzButton>
            </Space>
          );
        },
      },
    ];
    // if (!isRisk) {
    //   return cols.filter((_item) => _item.dataIndex !== 'content');
    // }
    return cols;
  }, []);

  const requestFn = useMemoizedFn(async (dp) => {
    const { total, items } = await getPeriodTaskList(dp);
    return { total, data: items || [] };
  });

  return (
    <TzPageContainer
      header={{
        title: <PageTitle title={translate('periodicTask')} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
    >
      <div className="absolute top-0" ref={anchorRef} />

      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex justify-between mb-2 ">
          <div className="flex gap-x-[6px]">
            <TzFilter />
            <TzFilterForm hideToolBar onChange={setFilterVal} />
          </div>
          <TzButton
            key="1"
            type="primary"
            onClick={() => history.push(`${urlPrefix}/periodic-task/add`)}
          >
            {translate('add')}
          </TzButton>
        </div>
      </FilterContext.Provider>

      <TzProTable<API_TASK.PeriodTaskListRes>
        onChange={listOffsetFn}
        className="no-hover-table mt-2"
        actionRef={tableRef}
        params={filterVal}
        request={requestFn}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() =>
                history.push(`${urlPrefix}/periodic-task/detail/${record.id}`),
              ),
          };
        }}
      />
    </TzPageContainer>
  );
};

export default AssetPeriodicTask;
