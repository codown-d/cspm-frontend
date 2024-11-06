import ExportModal, {
  ExportModalProps,
  mixFileName,
} from '@/components/ExportModal';
import { TzButton } from '@/components/lib/tz-button';
import { exportTask } from '@/services/cspm/Home';
import { useIntl } from '@umijs/max';
import { memo } from 'react';

type IExport = Pick<ExportModalProps, 'renderTrigger' | 'onOpenChange'> & {
  parameter?: API_COMPLIANCE.ComplianceWithRisksRequest;
  tip?: boolean;
  disabled?: boolean;
};
function Export({
  parameter,
  renderTrigger,
  onOpenChange,
  disabled,
  tip = true,
}: IExport) {
  const intl = useIntl();
  return (
    <ExportModal
      // tip={
      //   tip
      //     ? intl.formatMessage(
      //         { id: 'unStand.exportTypeTip' },
      //         { name: intl.formatMessage({ id: 'complianceInformation' }) },
      //       )
      //     : ''
      // }
      onOpenChange={(open, form) => {
        if (open) {
          form.setFieldsValue({
            file_name: mixFileName(
              intl.formatMessage({
                id: 'complianceReport',
              }),
            ),
          });
          // refreshRiskServiceTreeData();
        }
        onOpenChange?.(open, form);
      }}
      onSubmit={({ file_name: filename }) =>
        exportTask({
          task_type: 'excel',
          execute_type: 'compliance',
          filename,
          parameter: {
            compliance_search: parameter,
          },
        })
      }
      renderTrigger={
        renderTrigger ?? (
          <TzButton
            size="small"
            className="mt-[3px]"
            disabled={disabled}
            icon={<i className="icon iconfont icon-daochu1" />}
            type="text"
          >
            {intl.formatMessage({ id: 'export' })}
          </TzButton>
        )
      }
    />
  );
}

export default memo(Export);
