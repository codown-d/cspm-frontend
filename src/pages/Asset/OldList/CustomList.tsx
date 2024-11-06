import TzProTable, {
  TzProColumns,
  TzProTableProps,
} from '@/components/lib/ProComponents/TzProTable';
import TzTypography from '@/components/lib/TzTypography';
import { TzTag } from '@/components/lib/tz-tag';
import { EN_LANG } from '@/locales';
import translate from '@/locales/translate';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import RenderRiskTypes from '@/pages/components/RenderRiskTypes';
import { DATE_TIME } from '@/utils/constants';
import { getLocale, useIntl, useModel } from '@umijs/max';
import { message } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import dayjs from 'dayjs';
import { ceil, get } from 'lodash';
import { memo, useMemo, useRef } from 'react';
import styles from './customList.less';
type TRenderCopyInTag = {
  tit?: string;
  label: string;
  maxW: number;
};
export const renderCopyInTag = ({ tit, label, maxW }: TRenderCopyInTag) => {
  return (
    <TzTag
      closable={false}
      className={classNames('info small text-left max-w-full', styles.tag)}
    >
      <div className="flex">
        <span>{label}：</span>
        {tit ? (
          <div
            className="link no-color group flex-1 min-w-0 flex"
            style={{ maxWidth: maxW }}
            onClick={(e?: React.MouseEvent<HTMLDivElement>) => {
              copy(tit);
              message.success(translate('TzProDescriptions.copySuc'));
              e?.stopPropagation();
            }}
          >
            <TzTypography.Text
              ellipsis={{
                tooltip: tit,
              }}
            >
              {tit}
            </TzTypography.Text>
            <i className="icon iconfont icon-fuzhi hidden group-hover:inline leading-3 ml-1 mt-[5px]" />
          </div>
        ) : (
          '-'
        )}
      </div>
    </TzTag>
  );
};
/* assetTaskDetail 资产同步任务详情
    config 配置风险
    agentless 无代理
 */
export type IScope = 'assetTaskDetail' | 'config' | 'agentless';
export type CustomListProps = TzProTableProps<API_ASSETS.AssetsDatum> & {
  isHistory?: boolean;
  task_id?: string;
  platform?: string | string[];
  defaultParams?: Omit<
    API_ASSETS.AssetsRequest,
    'platform' | 'page' | 'size'
  > & {
    credential_id?: number;
  };
  noDefaultW?: boolean;
  scope?: IScope;
};
function CustomList({
  scope,
  isHistory,
  platform,
  defaultParams,
  noDefaultW,
  ...restProps
}: CustomListProps) {
  const intl = useIntl();
  const listRef = useRef(null);
  const { containerW = 0 } = useModel('layout') ?? {};
  const width = containerW - (noDefaultW ? 0 : 308);
  const colMaxWid_instanceId = ceil(width / 4) - 16;
  const colMaxWid_service = ceil(width / 5) - 16;
  const timeW = noDefaultW ? 166 : 110;
  const tagLabelW = getLocale() === EN_LANG ? 74 : 52;

  const commonColumn: TzProColumns<API_ASSETS.AssetsDatum>[] = [
    {
      title: intl.formatMessage({ id: 'instanceInfo' }),
      dataIndex: 'instance_id',
      width: colMaxWid_instanceId,
      render(dom, entity) {
        const { instance_name, instance_id, created_at, updated_at } = entity;
        if (!instance_id && !instance_name) {
          return '-';
        }
        return (
          <div className="w-full" style={{ width: colMaxWid_instanceId - 16 }}>
            <div className="leading-6 text-base">
              <TzTypography.Paragraph
                ellipsis={{ tooltip: instance_name, rows: 2 }}
              >
                {instance_name || '-'}
              </TzTypography.Paragraph>
            </div>
            <div className="my-2 h-[22px] ">
              {renderCopyInTag({
                tit: instance_id,
                label: intl.formatMessage({ id: 'instanceId' }),
                maxW: colMaxWid_instanceId - tagLabelW - 32,
              })}
            </div>
            {scope === 'agentless' && (
              <div
                className={classNames('text-[#8E97A3]', {
                  'text-xs': getLocale() === EN_LANG,
                })}
              >
                {intl.formatMessage({
                  id: isHistory ? 'createdAt' : 'lastSeen',
                })}
                ：{dayjs(isHistory ? created_at : updated_at).format(DATE_TIME)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'assetClass' }),
      dataIndex: 'asset_type_name',
      width: colMaxWid_service,
      render(txt, entity) {
        if (!entity?.asset_type_name) {
          return '-';
        }
        return platform && scope !== 'config' ? (
          txt
        ) : (
          <RenderColWithIcon
            platform={entity?.platform}
            name={`${entity?.asset_type_name}`}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'riskTypes' }),
      dataIndex: 'severity_count',
      render: (_, record) => RenderRiskTypes(record.severity_count),
    },
    {
      title: intl.formatMessage({ id: 'cloudAccount' }),
      dataIndex: 'credential_name',
      tzEllipsis: 2,
    },
    {
      title: intl.formatMessage({ id: 'region' }),
      dataIndex: 'region_name',
    },
    {
      title: intl.formatMessage({
        id:
          scope === 'config'
            ? 'lastScan'
            : isHistory
              ? 'createdAt'
              : 'lastSeen',
      }),
      dataIndex:
        scope === 'config'
          ? 'updated_at'
          : isHistory
            ? 'created_at'
            : 'updated_at',
      valueType: 'dateTime',
      width: timeW,
      render(dom, entity) {
        const t = get(entity, isHistory ? 'created_at' : 'updated_at');
        if (!t) {
          return '-';
        }
        if (noDefaultW) {
          return dom;
        }
        return (
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {dayjs(t).format(DATE_TIME)?.split(' ').join('\n')}
          </span>
        );
      },
    },
  ];

  const configColumn: TzProColumns<API_ASSETS.AssetsDatum>[] = [
    ...commonColumn,
  ].filter(
    (v) => v.dataIndex !== 'severity_count',
  ) as TzProColumns<API_ASSETS.AssetsDatum>[];

  const agentlessColumn = [
    ...commonColumn,
    {
      title: intl.formatMessage({ id: 'riskNum' }),
      dataIndex: 'risk_count',
    },
  ].filter(
    (v) =>
      !['severity_count', 'created_at', 'updated_at'].includes(
        v.dataIndex as string,
      ),
  ) as TzProColumns<API_ASSETS.AssetsDatum>[];

  const column = useMemo(() => {
    if (scope === 'agentless') {
      return agentlessColumn;
    }
    if (scope === 'config') {
      return configColumn;
    }

    const cols = defaultParams?.credential_id
      ? commonColumn.filter((v) => v.dataIndex !== 'credential_name')
      : commonColumn;

    return cols.filter(
      (v) => v.dataIndex !== 'severity_count' || scope !== 'assetTaskDetail',
    );
  }, [scope, platform, defaultParams]);

  return (
    <div ref={listRef}>
      <TzProTable<API_ASSETS.AssetsDatum>
        rowKey="hash_id"
        {...restProps}
        columns={column}
      />
    </div>
  );
}

export default memo(CustomList);
