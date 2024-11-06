import TzProFormCheckbox from '@/components/lib/ProComponents/TzProFormCheckbox';
import { useRiskTypeEnum } from '@/hooks/enum/useRiskTypeEnum';
import { useIntl } from '@umijs/max';
import { memo } from 'react';

type IScanTypeFormItem = {
  className?: string;
};
function ScanTypeFormItem(props: IScanTypeFormItem) {
  const intl = useIntl();
  const { RiskTypeOption } = useRiskTypeEnum();
  return (
    <TzProFormCheckbox.Group
      name="scan_types"
      rules={[
        {
          required: true,
          message: intl.formatMessage(
            { id: 'requiredTips' },
            { name: intl.formatMessage({ id: 'detectContent' }) },
          ),
        },
      ]}
      formItemProps={{ className: props.className }}
      label={intl.formatMessage({ id: 'detectContent' })}
      options={RiskTypeOption}
    />
  );
}

export default memo(ScanTypeFormItem);
