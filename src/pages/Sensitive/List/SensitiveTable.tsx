import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { IPolicyTableOptionals, getStandardOptionals } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { get, keys } from 'lodash';
import { memo, useMemo, useRef } from 'react';

export type IVulnTable = {
  optionals?: IPolicyTableOptionals;
};
function VulnTable(props: IVulnTable) {
  const { optionals, ...restProps } = props;
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const _optionals = useMemo(
    () => getStandardOptionals(optionals),
    [optionals],
  );
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();
  const columns = useMemo(() => {
    const _colums: TzProColumns<API_AGENTLESS.SensitiveRisksDatum>[] = [
      {
        title: intl.formatMessage({ id: 'sensitiveInformationRule' }),
        dataIndex: 'rule_title',
        tzEllipsis: 2,
      },
      {
        title: intl.formatMessage({ id: 'informationType' }),
        dataIndex: 'rule_category',
        isOptional: true,
        tzEllipse: 2,
        width: '30%',
      },
      {
        title: intl.formatMessage({ id: 'filePath' }),
        dataIndex: 'filename',
        tzEllipse: 2,
      },
      {
        title: intl.formatMessage({ id: 'fileExt' }),
        dataIndex: 'ext',
        tzEllipse: 2,
        width: '10%',
      },
      {
        title: intl.formatMessage({ id: 'severityLevel' }),
        dataIndex: 'severity',
        align: 'center',
        width: 110,
        // render: (txt) => renderSeverityTag(txt),
        render: (status) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus,
              status,
            },
            { size: 'small' },
          ),
      },
      {
        title:
          get(_optionals, ['updated_at', 'label']) ??
          intl.formatMessage({ id: 'modifiedTime' }),
        dataIndex: 'updated_at',
        isOptional: true,
        width: 110,
        valueType: 'dateTime',
      },
    ].filter((v) => !v.isOptional || keys(_optionals)?.includes(v.dataIndex));

    return _colums;
  }, [optionals]);

  return (
    <TzProTable<API_AGENTLESS.SensitiveRisksDatum>
      rowKey="unique_id"
      {...restProps}
      actionRef={actionRef}
      columns={columns}
    />
  );
}

export default memo(VulnTable);
