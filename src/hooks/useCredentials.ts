import { TzSelectProps } from '@/components/lib/tzSelect';
import { getCredentials } from '@/services/cspm/CloudPlatform';
import { useEffect, useState } from 'react';

export default function useCredentials(use_case?: 'agentless') {
  const [account, setAccount] = useState<TzSelectProps['options']>();

  useEffect(() => {
    getCredentials({ size: 0, use_case }).then((res) => {
      setAccount(
        res.items.map((v) => ({
          label: v.name,
          platform: v.platform,
          value: +v.id,
          text: v.name,
        })),
      );
    });
  }, [use_case]);
  return account;
}
