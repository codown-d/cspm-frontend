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
  onToggle: any;
};
function Export({ task_id, file_name, onToggle }: ExportProps) {
  const intl = useIntl();
  return (
    <ExportModal
      renderTrigger={
        <TzButton
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ marginLeft: -8 }}
          size="small"
          type="text"
          key={task_id}
        >
          {intl.formatMessage({ id: 'export' })}
        </TzButton>
      }
      onOpenChange={(open, form) => {
        onToggle(open);
        open &&
          form.setFieldsValue({
            file_name: mixFileName(file_name),
          });
      }}
      onSubmit={({ file_name }) => {
        return exportTask({
          execute_type: 'scanAsset',
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
