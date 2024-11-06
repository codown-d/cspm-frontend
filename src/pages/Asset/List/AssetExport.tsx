import ExportModal, {
  ExportModalProps,
  mixFileName,
} from '@/components/ExportModal';
import { assetStore } from '@/pages/components/AssetList/AssetListItem';
import { exportTask } from '@/services/cspm/Home';
import { useIntl, useSnapshot } from '@umijs/max';
import { get, keys } from 'lodash';
import { RefObject } from 'react';
import { AssetListRefFn } from '../OldList/AssetsList';

type AssetExportProps = Pick<ExportModalProps, 'onOpenChange'> & {
  assetListRef: RefObject<AssetListRefFn>;
  disabled?: boolean;
  tip?: boolean;
  assetSearch?: any;
  fileName?: string;
};
function AssetExport({
  assetListRef,
  disabled,
  onOpenChange,
  tip = true,
  assetSearch,
  platformIds,
  fileName,
  ...rest
}: AssetExportProps) {
  const intl = useIntl();
  const { filterParams } = useSnapshot(assetStore) ?? {};

  return (
    <ExportModal
      tip={
        tip
          ? intl.formatMessage(
              { id: 'unStand.exportTypeTip' },
              { name: intl.formatMessage({ id: 'assetInformation' }) },
            )
          : undefined
      }
      onOpenChange={(open, form) => {
        open &&
          form.setFieldsValue({
            file_name: mixFileName(
              fileName ??
                intl.formatMessage({
                  id: 'assetReport',
                }),
            ),
            //   `${
            //   fileName ??
            //   intl.formatMessage({
            //     id: 'assetReport',
            //   })
            // }_${getExportNameTimeSuffix()}`.replaceAll(' ', '_'),
          });
        onOpenChange?.(open, form);
      }}
      disabled={disabled}
      onSubmit={({ file_name: filename }) => {
        const q =
          assetSearch ??
          keys(filterParams)
            .filter((platform) => platformIds.includes(platform))
            .map((platform) => ({
              platform,
              ...get(filterParams, platform),
            }));
        return exportTask({
          task_type: 'excel',
          execute_type: 'asset',
          filename,
          parameter: {
            asset_search: q,
          },
        });
      }}
      {...rest}
    />
  );
}

export default AssetExport;
