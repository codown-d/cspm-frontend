import ExportModal, { mixFileName } from '@/components/ExportModal';
import { TzButton } from '@/components/lib/tz-button';
import { riskStore } from '@/pages/components/PolicyList/PolicyListItem';
import { exportTask } from '@/services/cspm/Home';
import { useIntl, useSnapshot } from '@umijs/max';
import { get, keys } from 'lodash';
import { memo } from 'react';

function RiskExport({ disabled, platformIds }: { disabled?: boolean }) {
  const intl = useIntl();
  const { filterParams } = useSnapshot(riskStore) ?? {};

  return (
    <ExportModal
      tip={intl.formatMessage(
        { id: 'unStand.exportTypeTip' },
        { name: intl.formatMessage({ id: 'riskDiscovery' }) },
      )}
      onOpenChange={(open, form) => {
        if (open) {
          form.setFieldsValue({
            file_name: mixFileName(
              intl.formatMessage({
                id: 'misconfigurationReport',
              }),
            ),
          });
          // refreshRiskServiceTreeData();
        }
      }}
      onSubmit={({ file_name: filename }) => {
        const config_search = keys(filterParams)
          .filter((platform) => platformIds.includes(platform))
          .map((platform) => ({
            platform,
            ...get(filterParams, platform),
          }));
        return exportTask({
          task_type: 'excel',
          execute_type: 'config',
          filename,
          parameter: { config_search },
        });
      }}
      renderTrigger={
        <TzButton
          disabled={disabled}
          size="small"
          icon={<i className="icon iconfont icon-daochu1" />}
          type="text"
        >
          {intl.formatMessage({ id: 'export' })}
        </TzButton>
      }
    />
  );
}

export default memo(RiskExport);
