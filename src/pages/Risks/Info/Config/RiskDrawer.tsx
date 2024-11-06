import TzDrawer, { TzDrawerProps } from '@/components/lib/TzDrawer';
import { IState } from '@/interface';
import { getPolicyById } from '@/services/cspm/CloudPlatform';
import { getPolicyHistory } from '@/services/cspm/Risks';
import { useIntl, useLocation } from '@umijs/max';
import { useEffect, useState } from 'react';
import InfoContext, { IInfoContext } from './InfoContext';

type IRiskDrawer = IInfoContext &
  Pick<TzDrawerProps, 'onClose' | 'open'> & {
    record?: API.RisksDatum;
  };
function RiskDrawer(props: IRiskDrawer) {
  const { open, onClose, dataSource, record } = props;
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>();
  const [info, setInfo] = useState<API.PolicyInfoResponse>();
  const { policy_id: id, policy_title, policy_type } = record ?? {};
  const { state } = useLocation();
  const { task_id, from } = (state as IState) ?? {};
  const isHistory = from === 'task';
  useEffect(() => {
    setLoading(true);
    if (!id) {
      return;
    }
    const apiUrl = isHistory ? getPolicyHistory : getPolicyById;
    apiUrl({ id, type: policy_type, task_id })
      .then(setInfo)
      .finally(() => setLoading(false));
  }, [id, task_id]);

  return (
    <TzDrawer
      width={560}
      title={info?.policy_title ?? policy_title ?? '-'}
      open={open}
      onClose={onClose}
      styles={{ body: { paddingInline: 16 } }}
    >
      <InfoContext
        optionals={['severity']}
        dataSource={info}
        loading={loading}
      />
    </TzDrawer>
  );
}

export default RiskDrawer;
