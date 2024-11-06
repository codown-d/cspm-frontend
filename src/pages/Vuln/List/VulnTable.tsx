import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { useVulnAttrEnum } from '@/hooks/enum/useVulnAttrEnum';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { RenderTipByOverlay } from '@/pages/components/RenderTipByOverlay';
import { IPolicyTableOptionals, getStandardOptionals } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { get, isEmpty, keys } from 'lodash';
import { ReactNode, memo, useMemo, useRef } from 'react';

export type IVulnTable = {
  optionals?: IPolicyTableOptionals;
  renderActionBtns?: (
    arg: ReactNode,
    record: API_AGENTLESS.VulnRisksDatum,
  ) => ReactNode;
};
function VulnTable(props: IVulnTable) {
  const { optionals, renderActionBtns, ...restProps } = props;
  const { getSeverityTagInfoByStatus } = useSeverityEnum();
  const { getVulnAttrInfoByStatus } = useVulnAttrEnum();
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const _optionals = useMemo(
    () => getStandardOptionals(optionals),
    [optionals],
  );
  const columns = useMemo(() => {
    const _colums: TzProColumns<API_AGENTLESS.VulnRisksDatum>[] = [
      {
        title: intl.formatMessage({ id: 'vulnNo' }),
        dataIndex: 'name',
        tzEllipsis: 2,
        // width: '15%',
        render(_: string, entity: API_AGENTLESS.VulnRisksDatum) {
          const { name, description } = entity;
          if (!name) {
            return '-';
          }
          // return (
          //   <TzTypography.Paragraph ellipsis={{ tooltip: name, rows: 2 }}>
          //     {name}
          //   </TzTypography.Paragraph>
          // );
          // if (isScanRes) {
          //   return (
          //     <TzTypography.Paragraph ellipsis={{ tooltip: name, rows: 2 }}>
          //       {name}
          //     </TzTypography.Paragraph>
          //   );
          // }
          return <RenderTipByOverlay txt={name} description={description} />;
        },
      },
      {
        title: intl.formatMessage({ id: 'vulnName' }),
        dataIndex: 'vuln_name',
        // isOptional: true,
        tzEllipsis: 2,
      },
      // {
      //   title: intl.formatMessage({ id: 'vulnCategory' }),
      //   dataIndex: 'title',
      //   isOptional: true,
      //   tzEllipsis: 2,
      // },
      {
        title: intl.formatMessage({ id: 'attackPath' }),
        dataIndex: 'attack_path_name',
        width: '12%',
        tzEllipsis: 2,
      },
      {
        title: intl.formatMessage({ id: 'cvssv3Score' }),
        dataIndex: 'cvssv3_score',
        isOptional: true,
        width: '10%',
      },
      {
        title: intl.formatMessage({ id: 'severity' }),
        dataIndex: 'severity',
        align: 'center',
        width: '7%',
        // render: renderSeverityTag,
        render: (status: string) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus: getSeverityTagInfoByStatus,
              status,
            },
            { size: 'small' },
          ),
      },
      {
        title: intl.formatMessage({ id: 'attribute' }),
        dataIndex: 'vuln_attr',
        isOptional: true,
        width: '8%',
        render: (_: string, { vuln_attr }) => {
          if (!vuln_attr?.length) {
            return '-';
          }
          return (
            <div className="flex gap-1 flex-wrap">
              {vuln_attr?.map((status) =>
                renderCommonStatusTag(
                  {
                    getTagInfoByStatus: getVulnAttrInfoByStatus,
                    status,
                  },
                  { size: 'small' },
                ),
              )}
            </div>
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'affectedAssets' }),
        dataIndex: 'cloud_static',
        width: '14%',
        isOptional: true,
        render: (cloud_static) => {
          if (isEmpty(cloud_static)) {
            return '-';
          }
          return (
            <div className="flex flex-wrap gap-x-3">
              {cloud_static.map(({ platform, count }) => (
                <RenderColWithIcon
                  key={platform}
                  name={count}
                  platform={platform}
                />
              ))}
            </div>
          );
        },
      },
      {
        title:
          get(_optionals, ['created_at', 'label']) ??
          intl.formatMessage({ id: 'creationTime' }),
        // title: intl.formatMessage({ id: 'lastUpdatedTime' }),
        dataIndex: 'created_at',
        width: 110,
        isOptional: true,
        valueType: 'dateTime',
      },
      {
        title:
          get(_optionals, ['updated_at', 'label']) ??
          intl.formatMessage({ id: 'modifiedTime' }),
        dataIndex: 'updated_at',
        width: 110,
        isOptional: true,
        valueType: 'dateTime',
      },
    ].filter((v) => !v.isOptional || keys(_optionals)?.includes(v.dataIndex));

    renderActionBtns &&
      _colums.push({
        title: intl.formatMessage({ id: 'operate' }),
        dataIndex: 'option',
        width: 80,
        render: renderActionBtns,
      });
    return _colums;
  }, [_optionals]);

  return (
    <TzProTable<API_AGENTLESS.VulnRisksDatum>
      rowKey="unique_id"
      {...restProps}
      actionRef={actionRef}
      columns={columns}
    />
  );
}

export default memo(VulnTable);
