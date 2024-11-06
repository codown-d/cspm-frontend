import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
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
import { TzInputNumber } from '@/components/lib/tz-input-number';
import { TzSwitch } from '@/components/lib/tz-switch';
import { ZH_LANG } from '@/locales';
import { int2str, str2int } from '@/pages/UserManagement/components/tool';
import { getCompliance, sequenceCompliance } from '@/services/cspm/Compliance';
import { HolderOutlined } from '@ant-design/icons';
import { ActionType } from '@ant-design/pro-components';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  getLocale,
  history,
  useIntl,
  useLocation,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { Button } from 'antd';
import React, { useContext, useMemo, useRef, useState } from 'react';
import FrameworktOpr from './FrameworktOpr';
import useEvent from './useEvent';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const StatusActMap: Record<string, string> = {
  locked: 'unlock',
  disabled: 'enabled',
  enabled: 'disabled',
};

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = (props: { isDisabled: boolean }) => {
  let { isDisabled } = props;
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: isDisabled ? 'not-allowed' : 'move' }}
      ref={setActivatorNodeRef}
      {...(isDisabled ? {} : listeners)}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const Framework: React.FC = () => {
  const { breadcrumb } = useRouteProps();
  const [filterVal, setFilterVal] = useState<any>();
  const [actRowIndex, setActRowIndex] = useState<any>();
  const [dataSource, setDataSource] =
    React.useState<API_COMPLIANCE.ComplianceDatum[]>();
  const tableRef = useRef<ActionType>();

  const intl = useIntl();
  const { handleOprClick } = useEvent();

  // useRefreshTable(tableRef);
  const getList = useMemoizedFn(() => {
    getCompliance(filterVal).then(setDataSource);
  });
  const l = useLocation();
  useUpdateEffect(getList, [l]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const overIndex = dataSource.findIndex(
        (record) => record.id === over?.id,
      );
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.id === active?.id,
        );
        const overIndex = prevState.findIndex(
          (record) => record.id === over?.id,
        );

        return arrayMove(prevState, activeIndex, overIndex);
      });
      sequenceCompliance({ id: active.id, sequence: 1 + overIndex }).finally(
        () => {
          getList();
        },
      );
    }
  };

  const isZh = getLocale() === ZH_LANG;
  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'scanOptions' }),
        name: 'search',
        type: 'input',
        icon: 'icon-jiance',
        props: {
          placeholder: intl.formatMessage(
            { id: 'txtTips' },
            { name: intl.formatMessage({ id: 'frameworkName' }) },
          ),
        },
      },
    ],
    [],
  );
  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    getList();
  }, [filterVal]);

  const columns: TzProColumns<API_COMPLIANCE.ComplianceDatum>[] = useMemo(
    () => [
      {
        key: 'sort',
        align: 'center',
        width: 40,
        render: (_, record) => (
          <DragHandle isDisabled={actRowIndex === record.id} />
        ),
      },

      {
        title: intl.formatMessage({ id: 'number' }),
        tooltip: intl.formatMessage({ id: 'unStand.complianceSequenceTips' }),
        dataIndex: 'sequence',
        width: 80,
        render: (sequence, record) => {
          return (
            <span
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setActRowIndex(record.id);
              }}
            >
              {actRowIndex === record.id ? (
                <TzInputNumber
                  min={1}
                  ref={(e) => {
                    e?.focus();
                  }}
                  defaultValue={record.sequence}
                  formatter={int2str}
                  parser={str2int}
                  onBlur={(event) => {
                    sequenceCompliance({
                      id: actRowIndex,
                      sequence: Number(event.target.value),
                    }).finally(() => {
                      getList();
                      setActRowIndex(null);
                    });
                  }}
                />
              ) : (
                sequence
              )}
            </span>
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'frameworkName' }),
        tzEllipsis: 1,
        dataIndex: 'name',
      },
      {
        title: intl.formatMessage({ id: 'detectionNum' }),
        dataIndex: 'policy_count',
      },
      {
        title: intl.formatMessage({ id: 'updater' }),
        dataIndex: 'updater',
      },
      {
        title: intl.formatMessage({ id: 'modifiedTime' }),
        dataIndex: 'updated_at',
        width: 200,
        valueType: 'dateTime',
      },
      {
        title: intl.formatMessage({ id: 'status' }),
        dataIndex: 'status',
        render: (_, record) => {
          return (
            <TzSwitch
              size="small"
              checked={record.status}
              onChange={(v, e) => {
                e.stopPropagation();
                handleOprClick('switch', {
                  ...record,
                  backFn: getList,
                });
                // oprFn('switch', record, v);
                return false;
              }}
            />
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'operate' }),
        dataIndex: 'option',
        width: isZh ? 170 : 210,
        render: (_, record) => (
          <FrameworktOpr refreshTable={getList} record={record} />
        ),
      },
    ],
    [actRowIndex],
  );
  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            title={intl.formatMessage({ id: 'complianceFramework' })}
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={[
        <TzButton
          key="new"
          type="primary"
          onClick={() => {
            history.push('/compliance/framework/add');
          }}
        >
          {intl.formatMessage({ id: 'new' })}
        </TzButton>,
      ]}
    >
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex gap-x-[6px] mb-2 ">
          <TzFilter />
          <TzFilterForm
            className="align-center-input"
            hideToolBar
            onChange={setFilterVal}
          />
        </div>
      </FilterContext.Provider>
      {dataSource?.length ? (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={dataSource?.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <TzProTable<API.CredentialsDatum>
              rowKey="id"
              actionRef={tableRef}
              components={{
                body: {
                  row: Row,
                },
              }}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              onRow={(record) => {
                return {
                  onClick: () =>
                    onRowClick(() =>
                      history.push(`/compliance/framework/info/${record.id}`),
                    ),
                };
              }}
            />
          </SortableContext>
        </DndContext>
      ) : (
        <TzProTable<API.CredentialsDatum>
          rowKey="id"
          columns={columns}
          dataSource={undefined}
        />
      )}
    </TzPageContainer>
  );
};

export default Framework;
