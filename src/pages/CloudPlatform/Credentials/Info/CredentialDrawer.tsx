import TzDrawer, { TzDrawerProps } from '@/components/lib/TzDrawer';
import { IState } from '@/interface';
import {
  getCredentialById,
  getCredentialHistoryById,
} from '@/services/cspm/CloudPlatform';
import { useIntl, useLocation } from '@umijs/max';
import { useEffect, useState } from 'react';
import InfoContext, { IInfoContext } from './InfoContext';

type ICredentialDrawer = IInfoContext &
  Pick<TzDrawerProps, 'onClose' | 'open'> & {
    record?: API.CredentialsDatum;
  };
function CredentialDrawer(props: ICredentialDrawer) {
  const { open, onClose, record } = props;
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>();
  const [info, setInfo] = useState<API.CredentialResponse>();
  const { id } = record ?? {};
  const { state } = useLocation();
  const { task_id, from } = (state as IState) ?? {};
  useEffect(() => {
    setLoading(true);
    if (!id) {
      return;
    }

    let params = { id };
    let fetchUrl = getCredentialById;
    if (from === 'task') {
      params = { id, task_id };
      fetchUrl = getCredentialHistoryById;
    }
    fetchUrl(params)
      .then(setInfo)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <TzDrawer
      width={560}
      title={intl.formatMessage({ id: 'platformDetail' })}
      open={open}
      onClose={onClose}
      styles={{ body: { paddingInline: 16 } }}
    >
      <InfoContext
        column={1}
        optionals={['name']}
        dataSource={info}
        loading={loading}
      />
    </TzDrawer>
  );
}

export default CredentialDrawer;
