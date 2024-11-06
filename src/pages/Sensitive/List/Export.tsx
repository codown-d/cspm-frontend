import ExportModal, {
  ExportModalProps,
  mixFileName,
} from '@/components/ExportModal';
import { TzButton } from '@/components/lib/tz-button';
import { exportTask } from '@/services/cspm/Home';
import { useIntl } from '@umijs/max';
import { get } from 'lodash';
import { memo } from 'react';

type IExport = Pick<ExportModalProps, 'renderTrigger' | 'onOpenChange'> & {
  parameter?: API_AGENTLESS.SensitiveRisksRequest;
  tip?: boolean;
  fileName?: string;
};
function Export({
  parameter,
  renderTrigger,
  onOpenChange,
  fileName,
  tip = true,
}: IExport) {
  const intl = useIntl();
  const disabledExport = !get(parameter, 'platforms')?.length;
  return (
    <ExportModal
      tip={
        tip
          ? intl.formatMessage(
              { id: 'unStand.exportTypeTip' },
              { name: intl.formatMessage({ id: 'certificateKey' }) },
            )
          : ''
      }
      onOpenChange={(open, form) => {
        if (open) {
          form.setFieldsValue({
            file_name: mixFileName(
              fileName ??
                intl.formatMessage({
                  id: 'secretExportInfo',
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
          execute_type: 'sensitive',
          filename,
          parameter: {
            sens_rule_search: parameter,
          },
        })
      }
      renderTrigger={
        renderTrigger ?? (
          <TzButton
            disabled={disabledExport}
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
