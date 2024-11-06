import TzProTable, {
  renderTextWithCopy,
  TzProColumns,
  TzProTableProps,
} from '@/components/lib/ProComponents/TzProTable';
import { TzTag } from '@/components/lib/tz-tag';
import TzTypography from '@/components/lib/TzTypography';
import { useScanStatusEnum } from '@/hooks/enum/useScanStatusEnum';
import useTableAnchor from '@/hooks/useTableAnchor';
import { renderCopyInTag } from '@/pages/Asset/OldList/CustomList';
import { getStandardOptionals, IPolicyTableOptionals } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { ceil, get, isEmpty, keys } from 'lodash';
import {
  forwardRef,
  memo,
  ReactNode,
  Ref,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import RenderColWithIcon from '../RenderColWithPlatformIcon';
import { renderCommonStatusTag } from '../RenderRiskTag';
import RenderRiskType from './RenderRiskType';
// type IPolicyItems = API.CommonPolicyItem | API_RISK.RiskItem;
export type AssetTableProps = TzProTableProps<API_ASSETS.AssetsDatum> & {
  filterIsChange?: boolean;
  optionals?: IPolicyTableOptionals;
  className?: string;
  rowEllipsis?: boolean;
  renderActionBtns?: (
    arg: ReactNode,
    record: API_ASSETS.AssetsDatum,
  ) => ReactNode;
};
export type AssetTableRef = {
  reload: VoidFunction;
  reset: VoidFunction;
  reloadAndRest: VoidFunction;
  clearSelected: VoidFunction;
};
function AssetTable(props: AssetTableProps, ref: Ref<AssetTableRef>) {
  const {
    filterIsChange,
    renderActionBtns,
    className,
    optionals,
    rowEllipsis = true,
    ...restProps
  } = props;
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const { getScanTagInfoByStatus } = useScanStatusEnum();
  const { containerW: width } = useModel('layout') ?? {};
  const colMaxWid_instanceId = ceil(width / 4) - 16;

  const _optionals = useMemo(
    () => getStandardOptionals(optionals),
    [optionals],
  );

  const pluginColumns = useMemo(() => {
    const colums: TzProColumns<API_ASSETS.AssetsDatum>[] = [
      {
        title: intl.formatMessage({ id: 'instanceInfo' }),
        dataIndex: 'instance_info',
        isOptional: true,
        width: colMaxWid_instanceId,
        render(dom, entity) {
          const { instance_name, instance_id, asset_type_name, updated_at } =
            entity;
          if (!instance_id && !instance_name) {
            return '-';
          }
          return (
            <div
              className="w-full"
              style={{ width: colMaxWid_instanceId - 16 }}
            >
              {/* <div className="leading-6 inline-flex h-[22px]"> */}
              <div className="w-full text-[13px] leading-6 inline-flex h-[22px]">
                <TzTypography.Text
                  className="w-full"
                  ellipsis={{
                    suffix: (
                      <TzTag
                        size="small"
                        className="bg-[#2177d1]/5 text-[#2177d1] ml-[6px]"
                      >
                        {asset_type_name}
                      </TzTag>
                    ),
                  }}
                >
                  {instance_name || '-'}
                </TzTypography.Text>
                {/* </div> */}
              </div>
              <div className="my-1 h-[22px] ">
                {renderCopyInTag({
                  tit: instance_id,
                  label: intl.formatMessage({ id: 'instanceId' }),
                  maxW: colMaxWid_instanceId - 32,
                })}
              </div>
            </div>
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'instanceName' }),
        dataIndex: 'instance_name',
        isOptional: true,
        tzEllipsis: 1,
      },
      {
        title: intl.formatMessage({ id: 'instanceId' }),
        dataIndex: 'instance_id',
        isOptional: true,
        render: (dom, record) =>
          record.instance_id ? renderTextWithCopy(dom as string, 230) : '-',
      },
      {
        title: intl.formatMessage({ id: 'cloudServices' }),
        dataIndex: 'service_ids',
        isOptional: true,
        filters: true,
        valueEnum: get(_optionals, ['service_ids', 'valueEnum']),
        render(txt, { service_name, platform }) {
          if (!service_name) {
            return '-';
          }
          return (
            <RenderColWithIcon platform={platform} name={`${service_name}`} />
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'securityRisk' }),
        dataIndex: 'risk_types',
        width: '22%',
        isOptional: true,
        filters: true,
        valueEnum: get(_optionals, ['risk_types', 'valueEnum']),
        render: (_, { severity_count }) =>
          isEmpty(severity_count) ? '-' : RenderRiskType(severity_count),
      },
      {
        title: intl.formatMessage({ id: 'cloudAccount' }),
        dataIndex: 'credential_ids',
        filters: true,
        valueEnum: get(_optionals, ['credential_ids', 'valueEnum']),
        tzEllipsis: 2,
        render: (_, { credential_name }) =>
          credential_name ? (
            <TzTypography.Paragraph
              ellipsis={{ tooltip: credential_name, rows: 2 }}
            >
              {credential_name}
            </TzTypography.Paragraph>
          ) : (
            '-'
          ),
      },
      {
        title: intl.formatMessage({ id: 'region' }),
        dataIndex: 'region_ids',
        filters: true,
        valueEnum: get(_optionals, ['region_ids', 'valueEnum']),
        tzEllipsis: 2,
        render: (_, record) => record.region_name || '-',
      },
      {
        title: intl.formatMessage({ id: 'testingResult' }),
        dataIndex: 'status',
        isOptional: true,
        align: 'center',
        width: 90,
        filters: true,
        valueEnum: get(_optionals, ['status', 'valueEnum']),
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
        title: intl.formatMessage({ id: 'riskNum' }),
        dataIndex: 'risk_count',
        isOptional: true,
      },
      {
        title:
          get(_optionals, ['created_at', 'label']) ??
          intl.formatMessage({ id: 'lastUpdatedTime' }),
        dataIndex: 'created_at',
        isOptional: true,
        valueType: 'dateTime',
        sorter: get(_optionals, ['created_at', 'sorter']) ?? true,
        // render(txt, entity) {
        //   const t = get(entity, 'created_at');
        //   if (!t) {
        //     return '-';
        //   }
        //   if (rowEllipsis) {
        //     return txt;
        //   }
        //   return (
        //     <span style={{ whiteSpace: 'pre-wrap' }}>
        //       {dayjs(t).format(DATE_TIME)?.split(' ').join('\n')}
        //     </span>
        //   );
        // },
      },
      {
        title:
          get(_optionals, ['updated_at', 'label']) ??
          intl.formatMessage({ id: 'modifiedTime' }),
        dataIndex: 'updated_at',
        isOptional: true,
        valueType: 'dateTime',
        sorter: get(_optionals, ['updated_at', 'sorter']) ?? true,
        // render(txt, entity) {
        //   const t = get(entity, 'updated_at');
        //   if (!t) {
        //     return '-';
        //   }
        //   if (rowEllipsis) {
        //     return txt;
        //   }
        //   return (
        //     <span style={{ whiteSpace: 'pre-wrap' }}>
        //       {dayjs(t).format(DATE_TIME)?.split(' ').join('\n')}
        //     </span>
        //   );
        // },
      },
    ].filter((v) => !v.isOptional || keys(_optionals)?.includes(v.dataIndex));

    renderActionBtns &&
      colums.push({
        title: intl.formatMessage({ id: 'operate' }),
        dataIndex: 'option',
        width: 110,
        render: renderActionBtns,
      });
    return colums;
  }, [_optionals, rowEllipsis]);

  useImperativeHandle(ref, () => {
    return {
      reload() {
        actionRef.current?.reload?.();
      },
      reset() {
        actionRef.current?.reset?.();
      },
      reloadAndRest() {
        actionRef.current?.reloadAndRest?.();
      },
      clearSelected() {
        actionRef.current?.clearSelected?.();
      },
    };
  });
  return (
    <>
      {/* <div className={classNames(className)}> */}
      {/* <div className="absolute -top-[88px]" ref={anchorRef} /> */}
      <TzProTable<API_ASSETS.AssetsDatum>
        rowKey="hash_id"
        onChange={listOffsetFn}
        actionRef={actionRef}
        {...restProps}
        className={className}
        columns={pluginColumns}
        // tableAlertRender={false}
      />
      {/* </div> */}
    </>
  );
}

export default memo(forwardRef(AssetTable));
