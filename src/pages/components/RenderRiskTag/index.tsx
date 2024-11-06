import TzTypography from '@/components/lib/TzTypography';
import { TzTagProps } from '@/components/lib/tz-tag';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { EN_LANG } from '@/locales';
import { IGetTagInfoFnBack } from '@/models/global';
import { getLocale } from '@umijs/max';
import { Space } from 'antd';
import classNames from 'classnames';
import { get, isObject, keys } from 'lodash';
import { TzTag } from '../../../components/lib/tz-tag';
type RenderRiskTagProps = Partial<API.SeverityCount>;

const renderTagWithTip = (
  { label, cusStyle }: IGetTagInfoFnBack,
  num: number,
) => {
  // const { label, name } = RISK_OPT.find((v) => v.value === severity) ?? {};

  return (
    <TzTooltip key={label as string} title={`${label}: ${num}`}>
      <TzTag
        size="small"
        closable={false}
        className={classNames('risk', cusStyle as string)}
      >
        {num}
      </TzTag>
    </TzTooltip>
  );
};

type TRenderRiskTag = {
  record?: RenderRiskTagProps;
  noEmpty?: boolean;
};

function RenderRiskTag({ record, noEmpty }: TRenderRiskTag) {
  const { severityOption, getSeverityTagInfoByStatus } = useSeverityEnum();
  const items = keys(record ?? {}).filter((v) => get(record, v) > 0);

  if (!items?.length) {
    return noEmpty ? '' : '-';
  }

  const sortData = severityOption
    .filter((v) => items.includes(v.value))
    .map((v) => v.value);
  return (
    <Space size={4} wrap>
      {sortData.map((key) =>
        renderTagWithTip(
          getSeverityTagInfoByStatus(key as API.PolicySeverity),
          get(record, key),
        ),
      )}
    </Space>
  );
}
// export function renderStatusTag({
//   status,
//   noEmpty,
//   options,
//   className,
// }: {
//   status?: API.TaskDetailBasicStatus;
//   noEmpty?: boolean;
//   options?: Record<string, string>[];
//   className?: string;
// }) {
//   if (!status) {
//     return noEmpty ? '' : '-';
//   }
//   const { label, name } =
//     (options ?? getTaskStatusOptions()).find((v) => v.value === status) ?? {};
//   return (
//     <TzTag
//       closable={false}
//       className={classNames('status-tag', className, name)}
//     >
//       {label}
//     </TzTag>
//   );
// }
// export function renderSeverityTag(severity?: any, noEmpty?: boolean) {
//   return renderStatusTag({
//     options: FULL_RISK_OPT,
//     className: 'risk no-prev',
//     status: severity,
//     noEmpty,
//   });
//   if (!severity) {
//     return '-';
//   }
//   const { label, value, name } =
//     RISK_OPT.find((v) => v.value === severity) ?? {};
//   return (
//     <TzTag closable={false} className={classNames('risk no-prev', name)}>
//       {label}
//     </TzTag>
//   );
// }
export type IRenderTagNew = {
  getTagInfoByStatus: Function;
  status?: unknown;
  [keyof: string]: unknown;
};
export const RenderStatusTag = ({
  label,
  name,
  ...restProps
}: {
  label: string;
  name: string;
} & TzTagProps) => (
  <TzTag
    {...restProps}
    closable={false}
    size="small"
    className={classNames('status-tag no-prev', name)}
  >
    {label}
  </TzTag>
);
type IRenderTagNewProps = TzTagProps & { noEmpty?: boolean };
function getTagProps(props?: boolean | IRenderTagNewProps) {
  if (isObject(props)) {
    const { noEmpty, ...r } = props as IRenderTagNewProps;
    return r;
  }
  return {};
}
export function renderCommonStatusTag(
  { getTagInfoByStatus, status, ...rest }: IRenderTagNew,
  props?: boolean | IRenderTagNewProps,
) {
  const noEmpty = isObject(props)
    ? (props as IRenderTagNewProps).noEmpty
    : props;
  if (!status) {
    return noEmpty ? '' : '-';
  }

  const { label, cusStyle } = getTagInfoByStatus(
    keys(rest)?.length ? { status, ...rest } : status,
  );
  const name = isObject(cusStyle) ? get(cusStyle, 'name') : cusStyle;
  return <RenderStatusTag {...getTagProps(props)} name={name} label={label} />;
}

// export function renderSeverityTag(severity?: any) {
//   if (!severity) {
//     return '-';
//   }
//   const { label, value, name } =
//     RISK_OPT.find((v) => v.value === severity) ?? {};
//   return (
//     <TzTag closable={false} className={classNames('risk no-prev', name)}>
//       {label}
//     </TzTag>
//   );
// }
// export function renderTaskStatusTag(
//   status?: API.TaskDetailBasicStatus,
//   taskType?: API.ITaskType,
//   noEmpty?: boolean,
// ) {
//   if (!status) {
//     return noEmpty ? '' : '-';
//   }
//   const { label, name } =
//     getTaskStatusOptions(taskType, true).find((v) => v.value === status) ?? {};
//   return (
//     <TzTag closable={false} className={classNames('status-tag', name)}>
//       {label}
//     </TzTag>
//   );
// }

export function getSeverityTagWid() {
  return getLocale() === EN_LANG ? 108 : 90;
}

export const renderCommonTag = (
  data?: string[] | API_COMPLIANCE.DatumTag[],
) => (
  <div className="flex gap-[6px] flex-wrap w-full">
    {data?.map((v) => {
      let str;
      if (isObject(v)) {
        const { key, values } = v;
        str = `${key}：${values?.map((ite) => ite.value).join('，')}`;
      } else str = v;
      return (
        <TzTag size="small" className="tag" closeIcon={false} key={str}>
          <TzTypography.Text title={str}>{str}</TzTypography.Text>
        </TzTag>
      );
    })}
  </div>
);

export default RenderRiskTag;
