import ExportModal, {
  ExportModalProps,
  getExportNameTimeSuffix,
} from '@/components/ExportModal';
import { exportTask } from '@/services/cspm/Home';
import { useIntl } from '@umijs/max';

export type ExportBasicInfo = ExportModalProps & {
  id: string;
  name?: string;
};
const CExportModal = ({
  name,
  id,
  onOpenChange,
  ...restProps
}: ExportBasicInfo) => {
  const intl = useIntl();
  return (
    <ExportModal
      onOpenChange={(open, form) => {
        open &&
          form.setFieldsValue({
            file_name: `${name}${intl.formatMessage({
              id: 'unStand.exportAccountName',
            })}${getExportNameTimeSuffix()}`.replaceAll(' ', '_'),
          });
        onOpenChange?.(open, form);
      }}
      onSubmit={({ file_name: filename }) =>
        exportTask({
          task_type: 'excel',
          execute_type: 'credential',
          filename,
          parameter: {
            credential_id: +id,
          },
        })
      }
      {...restProps}
    />
  );
};

export default CExportModal;
