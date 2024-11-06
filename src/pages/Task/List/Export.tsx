import ExportModal, {
  ExportModalProps,
  mixFileName,
} from '@/components/ExportModal';
import { TzButton } from '@/components/lib/tz-button';
import { exportTask } from '@/services/cspm/Home';
import { useIntl } from '@umijs/max';

type ExportProps = Pick<ExportModalProps, 'onOpenChange'> & {
  task_id: number;
  file_name: string;
  execute_type: string;
};
function Export({
  task_id,
  file_name,
  execute_type,
  onOpenChange,
}: ExportProps) {
  const intl = useIntl();
  return (
    <ExportModal
      renderTrigger={
        <TzButton
          style={{ marginLeft: -8 }}
          size="small"
          type="text"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {intl.formatMessage({ id: 'export' })}
        </TzButton>
      }
      onOpenChange={(open, form) => {
        open &&
          form.setFieldsValue({
            file_name: mixFileName(file_name),
          });
        onOpenChange?.(open, form);
      }}
      onSubmit={({ file_name }) => {
        return exportTask({
          execute_type,
          filename: file_name,
          parameter: {
            task_id,
          },
          task_type: 'excel',
        });
      }}
    />
  );
}

export default Export;
