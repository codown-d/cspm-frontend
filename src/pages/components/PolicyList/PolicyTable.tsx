import TzProTable, {
  TzProColumns,
  TzProTableProps,
} from '@/components/lib/ProComponents/TzProTable';
import TzTypography from '@/components/lib/TzTypography';
import { useScanStatusEnum } from '@/hooks/enum/useScanStatusEnum';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useTableAnchor from '@/hooks/useTableAnchor';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { IPolicyTableOptionals, getAiDes, getStandardOptionals } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { BaseOptionType } from 'antd/lib/select';
import { get, keys, slice } from 'lodash';
import {
  ReactNode,
  Ref,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { IPolicyTableFilterProps } from './interface';

type IPolicyItems = API.CommonPolicyItem | API_RISK.RiskItem;
export type PolicyTableProps = IPolicyTableFilterProps &
  TzProTableProps<IPolicyItems> & {
    scanTypeEnum?: Record<string, BaseOptionType>;
    filterIsChange?: boolean;
    optionals?: IPolicyTableOptionals;
    className?: string;
    renderActionBtns?: (arg: ReactNode, record: IPolicyItems) => ReactNode;
  };
export type PolicyTableRef = {
  reload: VoidFunction;
  reset: VoidFunction;
  reloadAndRest: VoidFunction;
  clearSelected: VoidFunction;
};
// 配置风险、合规安全、报告详情 点击行跳转详情页面，其它地方列表点击行打开详情抽屉
const PolicyTable = (props: PolicyTableProps, ref: Ref<PolicyTableRef>) => {
  const {
    filterIsChange,
    renderActionBtns,
    className,
    optionals,
    // serviceItem,
    // credentials,
    // scanResItem,
    // scanTypeEnum,
    ...restProps
  } = props;
  const { initialState } = useModel('@@initialState');
  const { aiPromptTemplates } = initialState ?? {};
  const { newConversation } = useModel('aiGptModel');
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const { getSeverityTagInfoByStatus: getTagInfoByStatus, riskSeverityEnum } =
    useSeverityEnum();

  const { getScanTagInfoByStatus } = useScanStatusEnum();

  const _optionals = useMemo(
    () => getStandardOptionals(optionals),
    [optionals],
  );

  const columns = useMemo(() => {
    const hasPromptCol =
      get(_optionals, ['mitigation', 'name']) ||
      get(_optionals, ['description', 'name']);
    const _colums: TzProColumns<IPolicyItems>[] = [
      {
        title: intl.formatMessage({ id: 'scanOptions' }),
        dataIndex: 'policy_title',
        tzEllipsis: 2,
      },
      {
        title:
          get(_optionals, ['service_ids', 'label']) ??
          intl.formatMessage({ id: 'cloudServices' }),
        dataIndex: 'service_ids',
        isOptional: true,
        filters: true,
        valueEnum: get(_optionals, ['service_ids', 'valueEnum']),
        render: (_, { service_name }) => {
          if (!service_name) {
            return '-';
          }
          return (
            <TzTypography.Paragraph
              ellipsis={{ rows: 2, tooltip: service_name }}
            >
              {service_name || '-'}
            </TzTypography.Paragraph>
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'assetClass' }),
        dataIndex: 'asset_type_ids',
        isOptional: true,
        filters: true,
        valueEnum: get(_optionals, ['asset_type_ids', 'valueEnum']),
        render: (_, { asset_type_name }) => {
          if (!asset_type_name) {
            return '-';
          }
          return (
            <TzTypography.Paragraph
              ellipsis={{ rows: 2, tooltip: asset_type_name }}
            >
              {asset_type_name}
            </TzTypography.Paragraph>
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'cloudAccount' }),
        dataIndex: 'credential_ids',
        filters: true,
        isOptional: true,
        valueEnum: get(_optionals, ['credential_ids', 'valueEnum']),
        render: (_, { credential_name }) => {
          if (!credential_name) {
            return '-';
          }
          return (
            <TzTypography.Paragraph
              ellipsis={{ tooltip: credential_name, rows: 2 }}
            >
              {credential_name || '-'}
            </TzTypography.Paragraph>
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'concreteContent' }),
        dataIndex: 'description',
        isOptional: true,
        tzEllipsis: 2,
        withPrompt: (record) => {
          newConversation({
            prompt_by_id: +new Date(),
            ...getAiDes(record, aiPromptTemplates?.policy_description),
          });
        },
      },
      {
        title: intl.formatMessage({ id: 'suggestionRepair' }),
        dataIndex: 'mitigation',
        isOptional: true,
        tzEllipsis: 2,
        withPrompt: (record) => {
          newConversation({
            prompt_by_id: +new Date(),
            ...getAiDes(record, aiPromptTemplates?.policy_mitigation),
          });
        },
      },
      {
        title: intl.formatMessage({ id: 'scanningMode' }),
        dataIndex: 'policy_type_name',
        isOptional: true,
        width: 90,
      },
      {
        title: intl.formatMessage({ id: 'scanningMode' }),
        dataIndex: 'policy_type',
        isOptional: true,
        width: 90,
        filters: true,
        // valueEnum: scanTypeEnum,
        valueEnum: get(_optionals, ['policy_type', 'valueEnum']),
        render: (_, record) =>
          get(scanTypeEnum, record.policy_type)?.label || '-',
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
        title: intl.formatMessage({ id: 'scannedAssets' }),
        dataIndex: 'assets_count',
        isOptional: true,
        render: (_, { assets_count }) => {
          const { unpassed } = assets_count ?? {};
          return unpassed ?? '-';
        },
      },

      {
        title: intl.formatMessage({ id: 'compliantPassedRate' }),
        dataIndex: 'compliance_assets_count',
        isOptional: true,
        render: (_, { assets_count }) => {
          const { passed, total } = assets_count ?? {};
          return (
            <span>
              {passed ?? '-'} / {total ?? '-'}
            </span>
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'severityLevel' }),
        dataIndex: 'severity',
        align: 'center',
        filters: get(_optionals, ['severity', 'filters']) ?? true,
        valueEnum: riskSeverityEnum,
        width: 90,
        render: (_, { severity }) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus,
              status: severity,
            },
            { size: 'small' },
          ),
      },
      {
        title: intl.formatMessage({ id: 'referenceLinking' }),
        dataIndex: 'references',
        isOptional: true,
        render(dom, entity) {
          return (
            <>
              {entity.references?.length
                ? slice(entity.references, 0, 2).map((item) => (
                    <div key={item}>
                      <TzTypography.Text ellipsis={{ tooltip: item }}>
                        <a
                          className="underline link mx-1"
                          target="_blank"
                          href={item}
                        >
                          {item}
                        </a>
                      </TzTypography.Text>
                    </div>
                  ))
                : '-'}
            </>
          );
        },
      },
      {
        title:
          get(_optionals, ['created_at', 'label']) ??
          intl.formatMessage({ id: 'lastUpdatedTime' }),
        dataIndex: 'created_at',
        isOptional: true,
        valueType: 'dateTime',
        sorter: get(_optionals, ['created_at', 'sorter']) ?? true,
      },
      {
        title:
          get(_optionals, ['updated_at', 'label']) ??
          intl.formatMessage({ id: 'modifiedTime' }),
        // title: intl.formatMessage({ id: 'lastUpdatedTime' }),
        dataIndex: 'updated_at',
        isOptional: true,
        valueType: 'dateTime',
        sorter: get(_optionals, ['updated_at', 'sorter']) ?? true,
      },
    ].filter((v) => !v.isOptional || keys(_optionals)?.includes(v.dataIndex));

    renderActionBtns &&
      _colums.push({
        title: intl.formatMessage({ id: 'operate' }),
        dataIndex: 'option',
        width: 110,
        render: renderActionBtns,
      });
    return _colums;
  }, [_optionals]);

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
      <TzProTable<IPolicyItems>
        rowKey="policy_id"
        className={className}
        onChange={listOffsetFn}
        scrollToFirstRowOnChange
        {...restProps}
        actionRef={actionRef}
        columns={columns}
      />
      {/* </div> */}
    </>
  );
};

export default memo(forwardRef(PolicyTable));
