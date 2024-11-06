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
import useRefreshTable from '@/hooks/useRefreshTable';
import useTableAnchor from '@/hooks/useTableAnchor';
import { EN_LANG } from '@/locales';
import { getBaselines } from '@/services/cspm/CloudPlatform';
import { getFilterPannelOpenStatus, toDetailIntercept } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import {
  getLocale,
  history,
  useIntl,
  useModel,
  useRouteProps,
} from '@umijs/max';
import { Space } from 'antd';
import { cloneDeep, keys, set } from 'lodash';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import RenderPIcon from '../components/RenderPIcon';
import useBasicLineEvent from './useBasicLineEvent';

function BasicLine() {
  const { breadcrumb } = useRouteProps();
  const actionRef = useRef<ActionType>();
  const [filters, setFilters] = useState<any>();
  const { handleOprClick } = useBasicLineEvent();
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  useRefreshTable(actionRef);
  const listOffsetFn = useTableAnchor(anchorRef);
  const columns: TzProColumns<API.BaselinesDatum>[] = [
    {
      title: intl.formatMessage({ id: 'baselineName' }),
      dataIndex: 'name',
      tzEllipsis: 2,
      width: '18%',
    },
    {
      title: intl.formatMessage({ id: 'overlayCloudPlatform' }),
      dataIndex: 'platforms',
      width: 180,
      render(_, record) {
        return <RenderPIcon platform={record.platforms} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'policyCount' }),
      dataIndex: 'policy_counts',
      width: 130,
    },
    {
      title: intl.formatMessage({ id: 'remark' }),
      dataIndex: 'description',
      tzEllipsis: 2,
    },
    {
      title: intl.formatMessage({ id: 'updater' }),
      dataIndex: 'updater',
      tzEllipsis: 2,
      width: 130,
    },
    {
      title: intl.formatMessage({ id: 'turnoverTime' }),
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: 170,
    },
    {
      title: intl.formatMessage({ id: 'operate' }),
      width: getLocale() === EN_LANG ? 126 : 116,
      dataIndex: 'option',
      render: (_, record) =>
        record.is_default ? (
          '-'
        ) : (
          <Space size={4}>
            <TzButton
              style={{ marginLeft: -8 }}
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
              size="small"
              type="text"
              danger
              onClick={(e) =>
                handleOprClick(
                  e,
                  'delete',
                  record,
                  () => actionRef.current?.reset?.(),
                )
              }
            >
              {intl.formatMessage({ id: 'delete' })}
            </TzButton>
          </Space>
        ),
    },
  ];

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'baselineName' }),
        name: 'name',
        type: 'input',
        icon: 'icon-celveguanli',
      },
      // {
      //   label: intl.formatMessage({ id: 'overlayCloudPlatform' }),
      //   name: 'platforms',
      //   type: 'select',
      //   icon: 'icon-yunpingtai',
      //   props: {
      //     mode: 'multiple',
      //     options: commonPlatforms,
      //   },
      // },

      {
        label: intl.formatMessage({ id: 'overlayCloudPlatform' }),
        name: 'platforms',
        type: 'select',
        icon: 'icon-yunpingtai',
        props: {
          mode: 'multiple',
          options: commonPlatforms,
        },
        // condition: {
        //   name: 'platformsIntersection',
        //   props: {
        //     optionLabelProp: 'optionLabel',
        //     options: [
        //       {
        //         value: 'or',
        //         optionLabel: <span>&cup;</span>,
        //         label: (
        //           <>
        //             <span className="mr8 fw550 f15">&cup;</span>
        //             {intl.formatMessage({ id: 'union' })}
        //           </>
        //         ),
        //       },
        //       {
        //         value: 'and',
        //         optionLabel: <span>&cap;</span>,
        //         label: (
        //           <>
        //             <span className="mr8 fw550 f15">&cap;</span>
        //             {intl.formatMessage({ id: 'intersection' })}
        //           </>
        //         ),
        //       },
        //     ],
        //   },
        // },
      },
      {
        label: intl.formatMessage({ id: 'turnoverTime' }),
        name: 'created_at',
        type: 'rangePickerCt',
        icon: 'icon-shijian',
        props: {
          showTime: true,
        },
      },
    ],
    [commonPlatforms],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  const handleChange = useCallback((data: any) => {
    const temp = {};
    keys(data).forEach((key) => {
      let _val = cloneDeep(data[key]);
      if (key === 'created_at' && _val) {
        _val[0] && set(temp, ['start_at'], +_val[0]);
        _val[1] && set(temp, ['end_at'], +_val[1]);
        return;
      }
      set(temp, [key], _val);
    });
    setFilters(temp);
  }, []);
  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            showBack
            title={intl.formatMessage({ id: 'baselineManagement' })}
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
    >
      <div className="absolute top-0" ref={anchorRef} />
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex justify-between mb-3">
          <TzButton
            key="1"
            type="primary"
            onClick={() => history.push('/risks/basic-line/add')}
          >
            {intl.formatMessage({ id: 'add' })}
          </TzButton>
          <TzFilter />
        </div>
        <TzFilterForm onChange={handleChange} />
      </FilterContext.Provider>
      <TzProTable<API.BaselinesDatum>
        onChange={listOffsetFn}
        actionRef={actionRef}
        params={filters}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() =>
                toDetailIntercept({ type: 'benchmark', id: record.id }, () =>
                  history.push(`/risks/basic-line/info/${record.id}`),
                ),
              ),
          };
        }}
        request={async (dp) => {
          const { total, items } = await getBaselines({
            ...dp,
            ...(filters || {}),
          });
          return { total, data: items || [] };
        }}
        columns={columns}
      />
    </TzPageContainer>
  );
}

export default memo(BasicLine);
