import TzDrawer, { TzDrawerProps } from '@/components/lib/TzDrawer';
import { IState } from '@/interface';
import {
  getAssetsById,
  getReportsDetailAssetsById,
} from '@/services/cspm/Assets';
import { useIntl, useLocation } from '@umijs/max';
import { useEffect, useState } from 'react';
import InfoContext, { IInfoContext } from './InfoContext';

type IAssetInfoDrawer = IInfoContext &
  Pick<TzDrawerProps, 'onClose' | 'open'> & {
    record?: API_ASSETS.AssetsDatum;
  };
function AssetInfoDrawer(props: IAssetInfoDrawer) {
  const { open, onClose, record, canbe2Detail, ...restProps } = props;
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>();
  const [info, setInfo] = useState<API_ASSETS.AssetsInfoResponse>();
  const { hash_id } = record ?? {};
  const { state, pathname } = useLocation();
  const { task_id, from } = (state as IState) ?? {};
  const isTask = from === 'task';
  useEffect(() => {
    setLoading(true);
    if (!hash_id) {
      return;
    }
    const Api = isTask ? getReportsDetailAssetsById : getAssetsById;
    hash_id &&
      Api({ hash_id, task_id })
        .then(setInfo)
        .finally(() => setLoading(false));
  }, [hash_id]);

  return (
    <TzDrawer
      width={560}
      title={intl.formatMessage({ id: 'assetInfo' })}
      open={open}
      onClose={onClose}
      styles={{ body: { paddingInline: 16 } }}
    >
      <InfoContext
        {...restProps}
        column={1}
        canbe2Detail={canbe2Detail}
        optionals={['instance_name']}
        dataSource={info}
        loading={loading}
        from={from}
      />
    </TzDrawer>
  );
}

export default AssetInfoDrawer;
