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
import { TzCard } from '@/components/lib/tz-card';
import { TzConfirm } from '@/components/lib/tzModal';
import { deleteTag, getTags } from '@/services/cspm/Tags';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Space, message } from 'antd';
import { useMemo, useRef, useState } from 'react';
import TagModal from './TagModal';

function Tags() {
  const intl = useIntl();
  const [filterVal, setFilterVal] = useState<any>({});
  const actionRef = useRef<ActionType>();

  const rereshTable = useMemoizedFn(() => actionRef.current?.reloadAndRest?.());
  const handleDelete = useMemoizedFn((key) =>
    TzConfirm({
      title: false,
      okButtonProps: {
        danger: true,
      },
      content: intl.formatMessage(
        { id: 'unStand.areYouSureDeleteTag' },
        {
          name: key,
        },
      ),
      onOk: () => {
        deleteTag(key).then((res) => {
          if (!res) {
            message.success(intl.formatMessage({ id: 'deleteSuc' }));
            rereshTable();
          }
        });
      },
      okText: intl.formatMessage({ id: 'delete' }),
    }),
  );
  const columns: TzProColumns<API_TAG.TagsDatum>[] = [
    {
      title: intl.formatMessage({ id: 'tagLabel' }),
      dataIndex: 'key',
      width: '18%',
    },
    {
      title: intl.formatMessage({ id: 'tagValue' }),
      dataIndex: 'values',
      tzEllipsis: 2,
      render(dom, entity, index, action, schema) {
        // return entity.values?.map((item) => (
        //   <span className="inline-block last:after:content-[''] after:content-['，']">
        //     {item.value}
        //   </span>
        // ));
        return entity.values?.map((item) => item.value).join('，');
      },
    },
    {
      title: intl.formatMessage({ id: 'remark' }),
      dataIndex: 'desc',
      width: '13%',
      tzEllipsis: 2,
    },
    {
      title: intl.formatMessage({ id: 'updater' }),
      key: 'updater',
      dataIndex: 'updater',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'turnoverTime' }),
      key: 'updated_at',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: '13%',
    },
    {
      title: intl.formatMessage({ id: 'operate' }),
      dataIndex: 'option',
      width: 110,
      render: (_, record) => {
        const { key } = record;
        return (
          <Space
            size={4}
            onClick={(e) => {
              e.stopPropagation();
              return false;
            }}
          >
            <TagModal
              calFn={rereshTable}
              record={record}
              trigger={
                <TzButton key="edit" className="-ml-2" size="small" type="text">
                  {intl.formatMessage({ id: 'edit' })}
                </TzButton>
              }
            />

            <TzButton
              danger
              key="delete"
              size="small"
              type="text"
              onClick={() => handleDelete(key)}
            >
              {intl.formatMessage({ id: 'delete' })}
            </TzButton>
          </Space>
        );
      },
    },
  ];
  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'unStand.tagSearch' }),
        name: 'search',
        type: 'input',
        icon: 'icon-jiance',
      },
    ],
    [],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  return (
    <TzCard
      title={
        <div className="flex items-center justify-between">
          <span>{intl.formatMessage({ id: 'tabManagement' })}</span>
          <TagModal
            calFn={rereshTable}
            trigger={
              <TzButton size="small" key="setting">
                {intl.formatMessage({ id: 'new' })}
              </TzButton>
            }
          />
        </div>
      }
      bodyStyle={{
        padding: '0 16px 16px',
      }}
    >
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex gap-x-[6px] mb-2">
          <TzFilter />
          <TzFilterForm hideToolBar onChange={setFilterVal} />
        </div>
      </FilterContext.Provider>
      <TzProTable<API_TAG.TagsDatum>
        className="no-hover-table"
        params={filterVal}
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={async () => {
          const data = await getTags({ ...filterVal });
          const newData = data?.map((item) => {
            return {
              ...item,
              id: `${item.key}${item.values?.map((item) => item.id).join('-')}`,
            };
          });
          return { data: newData || [] };
        }}
      />
    </TzCard>
  );
}

export default Tags;
