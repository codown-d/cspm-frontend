import NoData from '@/components/NoData';
import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzButton } from '@/components/lib/tz-button';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useCredentialFilterItem from '@/hooks/filterItems/useCredentialFilterItem';
import useRegionFilterItem from '@/hooks/filterItems/useRegionFilterItem';
import useServiceFilterItem from '@/hooks/filterItems/useServiceFilterItem';
import { trans2OptionVals } from '@/pages/CloudPlatform/util';
import AssetList from '@/pages/components/AssetList';
import AssetFilters from '@/pages/components/AssetList/AssetFilters';
import { checkHost } from '@/services/cspm/Home';
import { toDetailIntercept } from '@/utils';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { Key, useMemo, useRef, useState } from 'react';
import ScanModal from '../ScanModal';
import AssetExport from './AssetExport';

type IList = {
  platformIds?: string[];
  credentialIds?: Key[];
  regionIds?: Key[];
  assetTypeIds?: Key[];
};
function List(props: IList) {
  const { platformIds, credentialIds, regionIds, assetTypeIds, riskTypeIds } =
    props;
  const [filters, setFilters] = useState<any>();
  const filterOriginData = useRef<Record<string, any>>();
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState<boolean>();
  const serviceItem = useServiceFilterItem({
    platform: platformIds,
    only_top: 1,
  }) as FilterFormParam;

  const regionItem = useRegionFilterItem({
    platform: platformIds,
  }) as FilterFormParam;

  const { riskTypesItem } = useCommonFilterItem();

  const credentialItem = useCredentialFilterItem();
  const assetTypeItem = useServiceFilterItem({
    platform: platformIds,
  });

  const [scan, setScan] = useState<boolean>();
  const [hostAssetExisted, setHostAssetExisted] = useState<boolean>();

  const defaultFilterOpt = useMemo(
    () => ({
      credentialItem: {
        ...credentialItem,
        value: credentialIds,
      },
      regionItem: {
        ...regionItem,
        value: trans2OptionVals(regionIds, regionItem),
      },
      serviceItem,
      assetTypeItem: {
        ...assetTypeItem,
        value: trans2OptionVals(assetTypeIds, assetTypeItem),
      },
      riskTypesItem: {
        ...riskTypesItem,
        value: riskTypeIds,
      },
    }),
    [
      credentialItem,
      regionItem,
      assetTypeItem,
      serviceItem,
      riskTypesItem,
      assetTypeIds,
      regionIds,
      credentialIds,
      riskTypeIds,
    ],
  );
  useUpdateEffect(() => {
    filterOriginData.current = undefined;
  }, [platformIds]);

  const scanPre = useMemoizedFn(async () => {
    try {
      const res = await checkHost({
        ...filterOriginData.current,
        platforms: platformIds,
      });
      setHostAssetExisted(res?.agentless_scannable);
    } catch (error) {
      setHostAssetExisted(false);
    }
    setScan(true);
  });
  const onRowFn = useMemoizedFn((record) => {
    return {
      onClick: (e) =>
        onRowClick(() => {
          if (modalOpen) {
            e.stopPropagation();
            return;
          }
          const _jump = () => {
            history.push(`/asset/info/${record.hash_id}`);
          };
          toDetailIntercept({ type: 'asset', id: record.hash_id }, _jump);
        }),
    };
  });
  const filtersMemo = useMemo(() => ({ ...filters, platformIds }), [filters]);
  return (
    <div>
      <div className="flex gap-4 justify-between mb-2">
        <AssetFilters
          key={platformIds?.join(',')}
          {...defaultFilterOpt}
          className="flex-1"
          onChange={(val, originData) => {
            setFilters(val);
            filterOriginData.current = originData;
          }}
        />
        <div className="mt-[3px] whitespace-nowrap">
          <TzButton
            size="small"
            disabled={!platformIds?.length}
            icon={<i className="icon iconfont icon-saomiaozhuangtai" />}
            type="text"
            onClick={scanPre}
          >
            {intl.formatMessage({ id: 'initiateScan' })}
          </TzButton>
          <AssetExport
            platformIds={platformIds}
            renderTrigger={
              <TzButton
                size="small"
                disabled={!platformIds?.length}
                icon={<i className="icon iconfont icon-daochu1" />}
                type="text"
              >
                {intl.formatMessage({ id: 'export' })}
              </TzButton>
            }
          />
        </div>
      </div>
      {!!platformIds?.length ? (
        <AssetList
          filters={filtersMemo}
          filterItems={defaultFilterOpt}
          onRow={onRowFn}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          renderActionType={['scan', 'export']}
          // renderActionType="scan"
        />
      ) : (
        <NoData />
      )}
      {scan && (
        <ScanModal
          ScanScopeObj={{
            filterItems: defaultFilterOpt,
            defaultValues: {
              ...filterOriginData.current,
              platforms: platformIds,
            },
          }}
          onCancel={() => setScan(false)}
          open={scan}
          hostAssetExisted={hostAssetExisted}
        />
      )}
    </div>
  );
}

export default List;
