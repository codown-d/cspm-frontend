import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import Range from '@/components/Range';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { TzSwitch } from '@/components/lib/tz-switch';
import { TzConfirm } from '@/components/lib/tzModal';
import { useTaskEnum } from '@/hooks/enum/useTaskEnum';
import {
  delPeriodTask,
  getPeriodTask,
  togglePeriodTask,
} from '@/services/cspm/Task';
import { DATE_TIME } from '@/utils/constants';
import {
  history,
  useIntl,
  useLocation,
  useParams,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import ActLog from './ActLog';
import ExecLog, { ITaskType } from './ExecLog';
import './index.less';

export default function PeriodicTaskDetail() {
  const { breadcrumb } = useRouteProps();
  const id: any = (useParams().id ?? '') as any;
  const [loading, setLoading] = useState(true);
  // const { nextTo } = useJump();
  const [info, setInfo] = useState<API.PeriodTaskInfo>({} as any);
  const filterRef = useRef<HTMLDivElement>(null);
  const { key: pathKey, pathname } = useLocation();
  // const agentlessRegions = useRegion(undefined, 'agentless');
  // const regions = useRegion();
  // const services = useServiceTree();
  const isRisk = pathname.includes('/risks');
  const urlPrefix = isRisk ? '/risks/list' : '/asset';
  const taskType: ITaskType = isRisk ? 'risks_scan' : 'assets_scan';
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  const { getTaskStatus } = useTaskEnum();

  /**
   * 配置检测范围
  const scopeCountMap = useMemo(() => {
    const numArray = [regions, services, agentlessRegions].map(
      (scopeItem: any) =>
        (scopeItem || []).reduce((acc: any, item: any) => {
          const k = item.key ?? item.id;
          const lab = item.label;
          acc[k] = {
            num: (item.children || []).length,
            lab,
          };
          return acc;
        }, {} as any),
    );
    return {
      region: numArray[0],
      services: numArray[1],
      agentLessRegion: numArray[2],
    };
  }, [regions, services]);
  **/

  const AnchorIds = useMemo(
    () => ({
      info: `info${pathKey}`,
      execLog: `execLog${pathKey}`,
      actLog: `actLog${pathKey}`,
    }),
    [pathKey],
  );
  const AnchorItems = useMemo(
    () => [
      {
        href: `#${AnchorIds.info}`,
        key: 'info',
        title: translate('basicInfo'),
      },
      {
        href: `#${AnchorIds.execLog}`,
        key: 'exeLog',
        title: translate('taskExecutionRecord'),
      },
      {
        href: `#${AnchorIds.actLog}`,
        key: 'actLog',
        title: translate('taskOperationRecord'),
      },
    ],
    [AnchorIds],
  );

  const fetchInfo = useMemoizedFn(async () => {
    const res = await getPeriodTask({
      type: taskType,
      id,
    });
    setInfo(res);
    setLoading(false);
  });

  const backFn = useMemoizedFn(() =>
    history.replace(`${urlPrefix}/periodic-task`),
  );

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleOprClick = useMemoizedFn(
    (type: 'delete' | 'edit' | 'copy' | 'switch') => {
      if (type === 'edit') {
        history.push(`${urlPrefix}/periodic-task/edit/${info.id}`);
        return;
      }
      if (type === 'copy') {
        history.push(`${urlPrefix}/periodic-task/add?copy=true&id=${info.id}`);
        return;
      }
      if (type === 'delete') {
        TzConfirm({
          title: false,
          okButtonProps: {
            danger: true,
          },
          content: translate('unStand.deleteBaseLine', {
            type: translate('cloudAccount1'),
            name: info.name,
          }),
          onOk: () => {
            delPeriodTask({
              type: taskType,
              id: info.id,
            }).then((res) => {
              if (!res) {
                message.success(
                  translate('oprSuc', { name: translate('delete') }),
                );
                backFn();
              }
            });
          },
          okText: translate('delete'),
        });
        return;
      }
      if (type === 'switch') {
        const open = !info.status;
        const toggleText = open ? 'enable' : 'disable';
        TzConfirm({
          content: translate(
            open
              ? 'unStand.areYouSureEnablePeriodicTask'
              : 'unStand.areYouSureDisablePeriodicTask',
            { name: info.name },
          ),
          cancelText: translate('cancel'),
          okText: translate(toggleText),
          okButtonProps: {
            type: 'primary',
          },
          cancelButtonProps: {
            className: 'cancel-btn',
          },
          onOk() {
            togglePeriodTask({
              disable: !open,
              id: info.id,
              type: taskType,
            }).then((res) => {
              if (!res) {
                message.success(
                  translate('oprSuc', { name: translate(toggleText) }),
                );
                // nextTo('');
                history.replace(`${urlPrefix}/periodic-task/detail/${id}`, {
                  keepAlive: true,
                });
              }
            });
          },
        });
        return;
      }
    },
  );

  const infoColumns = useMemo(() => {
    let cols = [
      {
        title: translate('scanRange'),
        render(_: unknown, record: API_TASK.PeriodTaskInfo) {
          return <Range conf={record.scope} />;
        },
      },
      {
        title: translate('detectContent'),
        dataIndex: 'content',
      },
      {
        title: translate('executionPeriod'),
        dataIndex: 'schedule',
        // render(_: unknown, record: API.PeriodTaskInfo) {
        //   return cronToText(record.cron);
        // },
      },
      {
        title: translate('creator'),
        dataIndex: 'creator',
      },
      {
        title: translate('creationTime'),
        dataIndex: 'created_at',
        render: (_: any, record: API.PeriodTaskInfo) => {
          return dayjs(record.created_at).format(DATE_TIME);
        },
      },
      {
        title: translate('updater'),
        dataIndex: 'updater',
      },
      {
        title: translate('turnoverTime'),
        dataIndex: 'updated_at',
        render: (_: any, record: API.PeriodTaskInfo) => {
          return dayjs(record.updated_at).format(DATE_TIME);
        },
      },
      {
        title: translate('remark'),
        dataIndex: 'note',
      },
    ];
    return cols;
  }, [info]);

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: translate('taskCreationTime'),
        name: 'date',
        // type: 'rangePicker',
        type: 'rangePickerCt',
        icon: 'icon-shijian',
        props: {
          showTime: true,
        },
      },
      {
        label: translate('status'),
        name: 'status',
        type: 'select',
        icon: 'icon-celveguanli',
        props: {
          mode: 'multiple',
          // options: getTaskStatusOptions(taskType),
          options: getTaskStatus('assets_scan'),
        },
      },
    ],
    [],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  const [filterVal, setFilterVal] = useState<any>({});

  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            title={info?.name ?? '-'}
            tag={
              <TzSwitch
                size="small"
                checked={info.status}
                style={{ marginLeft: '12px' }}
                onChange={() => handleOprClick('switch')}
              />
            }
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={[
        <TzButton key="1" onClick={() => handleOprClick('copy')}>
          {translate('createCopy')}
        </TzButton>,
        <TzButton key="2" onClick={() => handleOprClick('edit')}>
          {translate('edit')}
        </TzButton>,
        <TzButton key="3" danger onClick={() => handleOprClick('delete')}>
          {translate('delete')}
        </TzButton>,
      ]}
    >
      <div className="flex periodic-task-detail">
        <div className="flex gap-3">
          <TzCard
            bodyStyle={
              loading ? { padding: '4px 16px 16px 16px' } : { paddingTop: 4 }
            }
            id={`info${pathKey}`}
            className="is-descriptions basis-80"
            title={translate('basicInfo')}
          >
            <TzProDescriptions
              loading={loading}
              dataSource={info}
              columns={infoColumns}
              column={1}
            />
          </TzCard>
          <div className="flex-1">
            <TzCard
              id={AnchorIds.execLog}
              title={translate('taskExecutionRecord')}
              bodyStyle={{ paddingTop: 0 }}
              extra={<div ref={filterRef}></div>}
            >
              <FilterContext.Provider value={{ ...dataFilter }}>
                <TzFilter />
                <TzFilterForm
                  onChange={(v) => setFilterVal(v)}
                  className="-mt-[6px]"
                />
              </FilterContext.Provider>
              <ExecLog id={id} filterValue={filterVal} type={taskType} />
            </TzCard>
            <TzCard
              className="mt-2"
              id={AnchorIds.actLog}
              title={translate('taskOperationRecord')}
              bodyStyle={{ paddingTop: 0 }}
            >
              <ActLog id={id} isRisk />
            </TzCard>
          </div>
        </div>
        {/* <TzAnchor items={AnchorItems} targetOffset={100} /> */}
      </div>
    </TzPageContainer>
  );
}
