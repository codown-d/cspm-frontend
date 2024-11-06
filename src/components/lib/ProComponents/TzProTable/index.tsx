import NoData from '@/components/NoData';
import translate from '@/locales/translate';
import { getFilterPannelOpenStatus, PUBLIC_URL } from '@/utils';
import {
  ParamsType,
  ProColumns,
  ProTable,
  ProTableProps,
  RequestData,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Image, message } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { get, isFunction, isNil, keys, set } from 'lodash';
import { MouseEventHandler, ReactNode, useMemo, useState } from 'react';
import TzTypography from '../../TzTypography';
import './index.less';

export const renderTextEllipsis = (dom: ReactNode) => (
  <TzTypography.Paragraph ellipsis={{ tooltip: dom, rows: 2 }}>
    {dom}
  </TzTypography.Paragraph>
);
export const renderTextWithPropmt = (
  dom: ReactNode,
  record: Record<string, any>,
  cal?: Function,
) => {
  // todo 暂时一行处理
  return (
    <div className="prompt-col ai-link no-color group flex">
      {/* <div className="prompt-icon"> */}
      <TzTypography.Paragraph
        ellipsis={{
          tooltip: dom,
          rows: 2,
          // @ts-ignore
          // suffix: (
          //   <Image
          //     key={dom}
          //     className="ai-img hidden group-hover:inline ml-1"
          //     onClick={(e) => {
          //       e.stopPropagation();
          //       cal?.(record);
          //     }}
          //     preview={false}
          //     src={`${PUBLIC_URL}/ai_active.png`}
          //   />
          // ),
        }}
      >
        {dom}
      </TzTypography.Paragraph>
      <div className=" hidden group-hover:inline-flex group-hover:items-end">
        <Image
          key={dom}
          className="ai-img ml-1"
          onClick={(e) => {
            e.stopPropagation();
            cal?.(record);
          }}
          preview={false}
          src={`${PUBLIC_URL}/ai_active.png`}
        />
      </div>

      {/* </div> */}
    </div>
  );
};

export const renderTextWithCopy = (dom: string, maxWidth: number = 100) => (
  <div
    className="link no-color group flex-1 min-w-0 flex"
    style={{ maxWidth }}
    onClick={(e?: React.MouseEvent<HTMLDivElement>) => {
      copy(dom);
      message.success(translate('TzProDescriptions.copySuc'));
      e?.stopPropagation();
    }}
  >
    <TzTypography.Text
      ellipsis={{
        tooltip: dom,
      }}
    >
      {dom}
    </TzTypography.Text>
    <i className="icon iconfont icon-fuzhi hidden group-hover:inline leading-3 ml-1 mt-1" />
  </div>
);

export type TzProColumns<T = any, ValueType = 'text'> = ProColumns<
  T,
  ValueType
> & {
  tzEllipsis?: boolean | number;
  withPrompt?: (arg: T) => void;
};
type RequestParams<U> = U & {
  size?: number;
  page?: number;
  keyword?: string;
};
export type TzProTableProps<
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
> = Omit<ProTableProps<DataType, Params, ValueType>, 'columns' | 'request'> & {
  isInDetail?: boolean;
  columns?: TzProColumns<DataType, ValueType>[];
  request?: (
    params: RequestParams<Params>,
    sort: { sort_by: string; ascending: boolean } | {},
    filter: Record<string, (string | number)[] | null>,
  ) => Promise<Partial<RequestData<DataType>>>;
};
const pageSizeOptions = [10, 20, 50, 100];

const TzProTable = <
  DataType extends Record<string, any>,
  Params extends RequestParams<ParamsType> = RequestParams<ParamsType>,
  ValueType = 'text',
>(
  props: TzProTableProps<DataType, Params, ValueType>,
) => {
  const intl = useIntl();
  const { isInDetail = false, className, columns, request, ...rest } = props;
  const _defaultPageSize = isInDetail ? 5 : 10;
  const [totalVal, setTotalVal] = useState(0);
  const realProps = useMemo(() => {
    return {
      rowKey: 'id',
      search: false,
      toolBarRender: false,
      pagination: {
        hideOnSinglePage: totalVal <= _defaultPageSize,
        showQuickJumper: true,
        showSizeChanger: true,
        defaultPageSize: _defaultPageSize,
        defaultCurrent: 1,
        showTotal: (total: number) => {
          setTotalVal(total);
          return intl.formatMessage({ id: 'table.total' }, { total });
        },
        pageSizeOptions: isInDetail ? [5, ...pageSizeOptions] : pageSizeOptions,
      },

      locale: {
        emptyText: !!props.loading ? <></> : <NoData size="middle" />,
      },
      columns: columns?.map((v) => {
        const { withPrompt, tzEllipsis, ...realCol } = v;
        if (isFunction(withPrompt)) {
          return {
            style: { 'max-height': '50px' },
            render: (dom, record) =>
              dom && dom !== '-'
                ? renderTextWithPropmt(dom, record, v.withPrompt)
                : '-',
            ...realCol,
          };
        }
        if (tzEllipsis) {
          if (+tzEllipsis === 1) {
            return {
              ellipsis: true,
              ...realCol,
            };
          }

          return {
            ellipsis: { showTitle: false },
            // title: false,
            className: 'whitespace-normal',
            style: { 'white-space': 'initial' },
            render: (dom: ReactNode, record) => {
              const txt = v?.dataIndex && get(record, v?.dataIndex);
              return (
                <TzTypography.Paragraph
                  ellipsis={{ tooltip: txt, rows: +tzEllipsis }}
                >
                  {txt || '-'}
                </TzTypography.Paragraph>
              );
            },
            ...realCol,
          };
        }
        return v;
      }),
      ...rest,
      ...(request
        ? {
            request: async (p, sort, filter) => {
              const { pageSize: size, current: page, ...restP } = p;
              const sort_by = get(keys(sort), 0);
              const ascending = get(sort, sort_by);
              let _filter = {};
              keys(filter).forEach((key) => {
                !isNil(filter[key]) && set(_filter, [key], filter[key]);
              });
              return request?.(
                { ...restP, size, page } as RequestParams<Params>,
                ascending ? { sort_by, ascending: ascending === 'ascend' } : {},
                _filter,
              );
            },
          }
        : {}),

      className: classNames('tz-table', className),
    } as TzProTableProps<DataType, Params, ValueType>;
  }, [props, totalVal, _defaultPageSize]);

  return <ProTable {...realProps} />;
};

export default TzProTable;

type RenderExpandedRowProps<T> = {
  record: T;
  setExpandedRowKeys: (
    value: React.SetStateAction<string[] | undefined>,
  ) => void;
};

export const RenderExpandedRow = <T extends Record<string, any>>({
  record,
  setExpandedRowKeys,
}: RenderExpandedRowProps<T>) => {
  const intl = useIntl();
  return (
    <div
      onClick={(e) => {
        const key = record.id;
        setExpandedRowKeys((prev: string[] | undefined) =>
          (prev ?? []).filter((v) => v !== key),
        );
      }}
      className="ant-table-expanded-close-btn"
    >
      <i className="icon iconfont icon-arrow -rotate-180" /> &nbsp;
      <span style={{ fontSize: '12px' }}>
        {intl.formatMessage({ id: 'fold' })}
      </span>
    </div>
  );
};
type renderExpandedIconProps = {
  expanded: boolean;
  record: Record<string, any>;
  setExpandedRowKeys: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
};
export const renderExpandedIcon = ({
  expanded,
  record,
  setExpandedRowKeys,
}: renderExpandedIconProps) => (
  <div className={classNames('expand-icon', !expanded ? '-rotate-90' : '')}>
    <i
      onClick={(e) => {
        const key = record.id;
        setExpandedRowKeys((prev) =>
          prev?.includes(key)
            ? prev.filter((v) => v !== key)
            : [...(prev ?? []), key],
        );
        e.stopPropagation();
      }}
      className="icon iconfont icon-arrow"
    />
  </div>
);

// todo 业务代码参与了，tz组件库里需要优化处理
export const onRowClick = (fn: Function, e?: MouseEventHandler<any>) => {
  if (getFilterPannelOpenStatus()) {
    return;
  }
  fn?.();
};
