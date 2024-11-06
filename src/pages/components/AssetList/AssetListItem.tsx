import { TzButton } from '@/components/lib/tz-button';
import AssetExport from '@/pages/Asset/List/AssetExport';
import { getAssets } from '@/services/cspm/Assets';
import { assetsScan } from '@/services/cspm/CloudPlatform';
import { proxy, useIntl } from '@umijs/max';
import { useCreation, useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import classNames from 'classnames';
import { isArray, isUndefined, omitBy, set } from 'lodash';
import { memo, useMemo, useRef, useState } from 'react';
import PlatformTableTit from '../PlatformTableTit';
import AssetTable, { AssetTableProps, AssetTableRef } from './AssetTable';
import ScanSingleAsset from './ScanSingleAsset';
import { IAssetTableFilterProps } from './interface';
import useAssetListItem from './useAssetListItem';

export const assetStore = proxy<Record<string, any>>({});
export type IAssetListItem = AssetTableProps & {
  filters?: Omit<API_ASSETS.AssetsRequest, 'page' | 'size'>;
  isInDetail?: boolean;
  modalOpen?: boolean;
  setModalOpen?: (open: boolean) => void;
  renderActionType?: ('scan' | 'export')[] | 'scan' | 'export';
  filterItems?: Partial<IAssetTableFilterProps>;
};
function AssetListItem(props: IAssetListItem) {
  const {
    filterItems,
    filters,
    renderActionType,
    setModalOpen,
    modalOpen,
    optionals: _optionals,
    ...restProps
  } = props;
  const { platform } = filters ?? {};
  const [expanded, setExpandedExpanded] = useState<boolean>(true);
  const ref = useRef<AssetTableRef>(null);
  const { optionals } = useAssetListItem({
    filterItems,
    optionals: _optionals,
    platform,
  });
  const intl = useIntl();

  const _filters = useCreation(() => omitBy(filters, isUndefined), [filters]);

  const onScanOk = useMemoizedFn(async (params) => {
    try {
      await assetsScan(params as unknown as API.AssetsScanRequest);
      message.success(intl.formatMessage({ id: 'unStand.startScan' }));
      return true;
    } catch (e) {
      console.error(e);
    }
  });

  const actionFn = useMemoizedFn((record) => {
    if (!platform) {
      return null;
    }
    const _renderActionType = isArray(renderActionType)
      ? renderActionType
      : [renderActionType];
    return (
      <div className="-ml-2 flex gap-1">
        {_renderActionType.map((type) => {
          if (type === 'scan') {
            if (record.agentless_scannable) {
              return (
                <ScanSingleAsset
                  key={record.hash_id}
                  btnPops={{
                    type: 'text',
                    size: 'small',
                  }}
                  scanParams={{
                    platforms: [platform],
                    instance_hash_ids: [record.hash_id],
                  }}
                  onOpenChange={setModalOpen}
                  onFinish={(vals) => {
                    return onScanOk({
                      credential_ids: [record.credential_id],
                      instance_hash_ids: [record.hash_id],
                      ...vals,
                    });
                  }}
                />
              );
            } else {
              return (
                <TzButton
                  type="text"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onScanOk({
                      scan_types: ['config'],
                      credential_ids: [record.credential_id],
                      instance_hash_ids: [record?.hash_id],
                    });
                  }}
                >
                  {intl.formatMessage({ id: 'scan' })}
                </TzButton>
              );
            }
          }
          if (type === 'export') {
            return (
              <AssetExport
                tip={false}
                fileName={`${record.instance_name}`}
                assetSearch={[{ platform, instance_id: record.hash_id }]}
                onOpenChange={setModalOpen}
                renderTrigger={
                  <TzButton
                    type="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen?.(true);
                    }}
                  >
                    {intl.formatMessage({ id: 'export' })}
                  </TzButton>
                }
              />
            );
          }
        })}
      </div>
    );
  });
  const renderActionfn = useMemo(
    () => (renderActionType ? (_, record) => actionFn(record) : undefined),
    [renderActionType],
  );
  return (
    <>
      <div className="mt-2 flex items-center">
        <div
          className={classNames(
            'w-6 h-6 mr-1 inline-flex justify-center items-ceter rounded cursor-pointer hover:bg-[#2177D1]/5 ',
            {
              '-rotate-90': !expanded,
            },
          )}
          onClick={(e) => {
            setExpandedExpanded((prev) => !prev);
            e.stopPropagation();
            e.preventDefault;
          }}
        >
          <i
            className={classNames(
              'icon iconfont icon-arrow text-base text-[#8e97a3]',
            )}
          />
        </div>
        <PlatformTableTit platform={platform} />
      </div>
      <AssetTable
        ref={ref}
        className={classNames('', {
          hidden: !expanded,
        })}
        params={_filters}
        optionals={optionals}
        request={async (dp, sort, filter) => {
          const queryData = {
            ...dp,
            ...filter,
            ...sort,
          } as API_ASSETS.AssetsRequest;
          const { credential_ids, ...rest } = queryData ?? {};
          const _queryData = credential_ids
            ? { ...rest, credential_ids: credential_ids.map((v) => +v) }
            : rest;

          const { platform: p, size, page, ...retQueryData } = _queryData;

          const { total, items } = await getAssets(_queryData);
          set(assetStore, ['filterParams', p], retQueryData);
          return { total, data: items || [] };
        }}
        {...restProps}
        renderActionBtns={renderActionfn}
      />
    </>
  );
}

export default memo(AssetListItem);
