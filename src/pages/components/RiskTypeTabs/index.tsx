import TzTabs, { TzTabsProps } from '@/components/lib/TzTabs';
import { useModel } from '@umijs/max';
import classNames from 'classnames';
import { get } from 'lodash';
import './index.less';
type RiskTypeTabsProps = TzTabsProps & {
  risksStaticData?: API_RISK.RisksStaticResponse;
  showRisksStatic?: boolean;
};
function RiskTypeTabs({
  className,
  showRisksStatic,
  risksStaticData,
  ...restProps
}: RiskTypeTabsProps) {
  const { commonConst } = useModel('global') ?? {};
  return (
    <TzTabs
      className={classNames('common-type-bar', className)}
      defaultActiveKey="platform"
      items={commonConst?.risk_type.map((item) => {
        const data = {
          ...item,
          key: item.value,
          label: item.label as string,
          children: null,
        };
        if (showRisksStatic) {
          const val = get(risksStaticData, item.value);
          return { ...data, label: `${item.label}(${val ?? 0})` };
        }
        return data;
      })}
      {...restProps}
    />
  );
}

export default RiskTypeTabs;
