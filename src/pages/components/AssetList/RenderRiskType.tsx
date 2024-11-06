import { useRiskTypeEnum } from '@/hooks/enum/useRiskTypeEnum';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { RISK_STATUS_LETTER_MAP } from '@/utils';
import { Space, Tooltip } from 'antd';
import classNames from 'classnames';
import { get, isEmpty, keys, omitBy } from 'lodash';

export const renderTitle = (risks, severityEnum, name?: string) => {
  return (
    <div>
      {name}
      {name && <br />}
      <Space size={8}>
        {keys(risks).map((key) => {
          return <span>{`${severityEnum[key]?.label}：${risks[key]}`}</span>;
        })}
      </Space>
    </div>
  );
};
function ConfigRisk({ risks }) {
  const { severityEnum, getSeverityTagInfoByStatus } = useSeverityEnum();
  const { RiskTypeEnum } = useRiskTypeEnum();
  const _risks = omitBy(risks, (v) => !v);
  if (isEmpty(_risks)) {
    return;
  }
  return (
    <Tooltip
      title={() =>
        renderTitle(
          _risks,
          severityEnum,
          get(RiskTypeEnum, 'config')?.label as string,
        )
      }
    >
      <div className="inline-flex items-center ">
        <i className="icon iconfont icon-a-ATTCK text-base text-[#6C7480] mr-[6px]" />
        <div className="flex gap-2 flex-wrap">
          {keys(_risks).map((key) => {
            const { label, cusStyle } = getSeverityTagInfoByStatus(
              key as API.PolicySeverity,
            );
            return (
              <p key={key}>
                <span
                  className={classNames('risk-type-circle', cusStyle as string)}
                />
                {get(_risks, key ?? '')}
              </p>
            );
          })}
        </div>
      </div>
    </Tooltip>
  );
}
function VulnRisk({ risks }) {
  const { severityEnum, getSeverityTagInfoByStatus } = useSeverityEnum();
  const { RiskTypeEnum } = useRiskTypeEnum();
  const _risks = omitBy(risks, (v) => !v);
  if (isEmpty(_risks)) {
    return;
  }
  return (
    <Tooltip
      title={() =>
        renderTitle(
          _risks,
          severityEnum,
          get(RiskTypeEnum, 'vuln')?.label as string,
        )
      }
    >
      <div className="inline-flex items-center">
        <i className="icon iconfont icon-loudong text-sm text-[#6C7480] mr-[6px]" />
        <div className="flex gap-2 flex-wrap">
          {keys(_risks).map((key) => {
            const { label, cusStyle } = getSeverityTagInfoByStatus(
              key as API.PolicySeverity,
            );
            return (
              <p
                key={key}
                className="border border-solid border-[#F4F6FA] rounded overflow-hidden leading-4"
              >
                <span
                  style={{
                    width: 'auto',
                    height: 'auto',
                    marginRight: 0,
                    paddingInline: 4,
                    borderRadius: 0,
                  }}
                  className={classNames(
                    'risk-type-circle text-white',
                    cusStyle as string,
                  )}
                >
                  {get(RISK_STATUS_LETTER_MAP, key)}
                </span>
                <span className="px-1">{get(_risks, key ?? '')}</span>
              </p>
            );
          })}
        </div>
      </div>
    </Tooltip>
  );
}
function SensitiveRisk({ risks }) {
  const { severityEnum, getSeverityTagInfoByStatus } = useSeverityEnum();
  const { RiskTypeEnum } = useRiskTypeEnum();
  const _risks = omitBy(risks, (v) => !v);
  if (isEmpty(_risks)) {
    return;
  }
  return (
    <Tooltip
      title={() =>
        renderTitle(
          _risks,
          severityEnum,
          get(RiskTypeEnum, 'sensitive')?.label as string,
        )
      }
    >
      <div className="inline-flex items-center">
        <i className="icon iconfont icon-minganwenjian1 text-sm text-[#6C7480] mr-[6px]" />
        <div className="flex gap-2 flex-wrap">
          {keys(_risks).map((key) => {
            const { label, cusStyle } = getSeverityTagInfoByStatus(
              key as API.PolicySeverity,
            );
            return (
              <div
                key={key}
                className="relative border border-solid border-[#F4F6FA] overflow-hidden leading-4"
              >
                <span
                  style={{
                    width: 2,
                    height: 16,
                    marginRight: 0,
                    borderRadius: 0,
                  }}
                  className={classNames(
                    'risk-type-circle leading-4 align-middle absolute left-0 top-0',
                    cusStyle as string,
                  )}
                />
                <span className="px-1 pl-[6px] leading-4 text-nowrap">
                  {get(_risks, key ?? '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Tooltip>
  );
}
const SplitNode = () => (
  <span className="inline-block w-[1px] h-3 bg-[#E7E9ED] mx-3 my-1" />
);
function RenderRiskType(data: API_ASSETS.SeverityCount) {
  const { config, sensitive, vuln } = data;

  return (
    <div className="flex flex-wrap">
      <ConfigRisk risks={config} />
      {!!config && (!!vuln || !!sensitive) && <SplitNode />}
      <VulnRisk risks={vuln} />
      {(!!config || !!sensitive) && !!vuln && <SplitNode />}
      <SensitiveRisk risks={sensitive} />
    </div>
  );
}

export default RenderRiskType;
