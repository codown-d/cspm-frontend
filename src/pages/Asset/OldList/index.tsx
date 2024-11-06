import ServiceCatalog from '@/pages/components/ServiceCatalog';
import ServiceCatalogWithAnchor from '@/pages/components/ServiceCatalog/ServiceCatalogWithAnchor';
import useServiceCatalog from '@/pages/components/ServiceCatalog/useServiceCatalog';
import {
  getAssetsServicetree,
  getHistoryAssetsServicetree,
} from '@/services/cspm/CloudPlatform';
import { useIntl } from '@umijs/max';
import { useSize } from 'ahooks';
import { Space } from 'antd';
import { isUndefined, sum } from 'lodash';
import { useMemo, useRef } from 'react';
import AsyncModal from '../AsyncModal';
import AssetExport from '../List/AssetExport';
import AssetsList, { AssetListProps, AssetListRefFn } from './AssetsList';

type TProps = Pick<
  AssetListProps,
  'extra' | 'infoBreadcrumb' | 'defaultParams' | 'tableAnchorStyle' | 'scope'
> & {
  affix?: boolean;
  boxH?: number;
  title?: string;
};

function List(props: TProps) {
  const {
    affix,
    boxH: boxHprops,
    infoBreadcrumb,
    defaultParams,
    title,
    tableAnchorStyle,
    scope,
  } = props;
  const intl = useIntl();
  const { credential_id, task_id, platform } = defaultParams ?? {};
  const assetListRef = useRef<AssetListRefFn>(null);
  const { height = 200 } = useSize(document.body) ?? {};
  const boxH = boxHprops ?? height - 100;

  const {
    allValues,
    setSelectNode,
    servicesTree,
    selectNode,
    platformByServiceTree,
  } = useServiceCatalog({
    fetchUrl: !task_id ? getAssetsServicetree : getHistoryAssetsServicetree,
    platform,
    params: !task_id ? { credential_id } : { task_id },
  });

  const total = useMemo(
    () => sum(servicesTree?.map((v) => v.num ?? 0)),
    [servicesTree],
  );

  const serviceCatalogNode = useMemo(
    () => (
      <ServiceCatalog
        badgeClassName="blue"
        total={total}
        title={intl.formatMessage({ id: 'fullAssets' })}
        onChange={setSelectNode}
        value={selectNode}
        treeData={servicesTree}
        isAll={
          !!selectNode?.length &&
          allValues.current?.length === selectNode?.length
        }
        onAllCheck={(all) => setSelectNode(all ? allValues.current : [])}
        boxH={boxH}
      />
    ),
    [servicesTree, selectNode, setSelectNode, boxH, affix],
  );

  return (
    <div>
      <div className="head-tit-1 mb-3">
        {title ?? intl.formatMessage({ id: 'assetList' })}
      </div>
      <div className="flex">
        {affix ? (
          <ServiceCatalogWithAnchor maxHeight={boxH ?? 0}>
            {serviceCatalogNode}
          </ServiceCatalogWithAnchor>
        ) : (
          serviceCatalogNode
        )}
        {!isUndefined(selectNode) && (
          <AssetsList
            isFir={affix}
            tableAnchorStyle={tableAnchorStyle}
            ref={assetListRef}
            platform={platformByServiceTree}
            infoBreadcrumb={infoBreadcrumb}
            defaultParams={{
              task_id,
              credential_id,
              service_ids: selectNode,
            }}
            scope={scope}
            boxH={boxH}
            className="ml-6 flex-1 w-0"
            extra={
              !!affix && (
                <Space size={10}>
                  <AsyncModal />
                  <AssetExport
                    disabled={!selectNode?.length}
                    assetListRef={assetListRef}
                  />
                </Space>
              )
            }
          />
        )}
      </div>
    </div>
  );
}

export default List;
