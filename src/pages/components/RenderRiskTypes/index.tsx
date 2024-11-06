import { TzPopover } from '@/components/lib/TzPopover';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { CONFIG_RISK_STATIC } from '@/utils';
import { useModel } from '@umijs/max';
import { Space } from 'antd';
import classNames from 'classnames';
import { get, keys, pickBy } from 'lodash';
import { FC } from 'react';
import './index.less';
const WithPopOver: FC<{
  name: CONFIG_RISK_STATIC;
  data: API.StatisticsSeverityCount;
  icon: string;
}> = ({ name, data, icon }) => {
  const { commonConst } = useModel('global') ?? {};
  const { getSeverityTagInfoByStatus } = useSeverityEnum();
  return (
    <TzPopover
      destroyTooltipOnHide
      placement="bottomLeft"
      arrow={false}
      title={
        commonConst?.risk_type?.find((v) => v.value === name)?.label as string
      }
      overlayClassName="render-risk-types-overlay render-tip-overlay"
      content={
        <div onClick={(e) => e.stopPropagation()}>
          {keys(data).map((key) => {
            const { label, cusStyle } = getSeverityTagInfoByStatus(
              key as API.PolicySeverity,
            );
            // const { label, value, name } = getSeverityTagInfoByStatus(key as API.PolicySeverity)
            // commonConst?.serverity.find((v) => v.value === key) ?? {};
            return (
              <p key={key} className="render-risk-types-overlay-row">
                <span
                  className={classNames('risk-type-circle', cusStyle as string)}
                />
                {label}: {get(data, key ?? '')}
              </p>
            );
          })}
        </div>
      }
    >
      <span
        className={classNames(
          'icon text-lg iconfont text-[#2177D1]',
          `icon-${icon}`,
        )}
      />
    </TzPopover>
  );
};
const RenderRiskTypes = (
  record?: API.StatisticsSeverity,
  noEmpty?: boolean,
) => {
  const [_config, _vuln, _sensitive] = [
    CONFIG_RISK_STATIC.config,
    CONFIG_RISK_STATIC.vuln,
    CONFIG_RISK_STATIC.sensitive,
  ].map((key) => pickBy(get(record, key), (v?: number) => v ?? 0 > 0));
  if (![_config, _vuln, _sensitive].filter((v) => !!keys(v)?.length)?.length) {
    return noEmpty ? '' : '-';
  }
  const obj: [CONFIG_RISK_STATIC, string][] = [
    [CONFIG_RISK_STATIC.config, 'jiance'],
    [CONFIG_RISK_STATIC.vuln, 'loudong'],
    [CONFIG_RISK_STATIC.sensitive, 'minganwenjian1'],
  ];
  return (
    <Space size={8} wrap>
      {[_config, _vuln, _sensitive].map((v, idx) => {
        const name = get(obj, [idx, 0]);
        return (
          !!keys(v)?.length && (
            <WithPopOver
              key={name}
              name={name}
              data={v}
              icon={get(obj, [idx, 1])}
            />
          )
        );
      })}
    </Space>
  );
};

export default RenderRiskTypes;
