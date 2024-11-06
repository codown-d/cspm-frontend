import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import useCredentials from '@/hooks/useCredentials';
import { useIntl } from '@umijs/max';
import { useMemo } from 'react';

function useCredentialFilterItem() {
  const credentials = useCredentials();
  const intl = useIntl();
  const credentialItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'cloudAccountLabel' }),
        name: 'credential_ids',
        type: 'select',
        icon: 'icon-yonghujiaose',
        props: {
          mode: 'multiple',
          options: credentials,
        },
      }) as FilterFormParam,
    [credentials],
  );
  return credentialItem;
}

export default useCredentialFilterItem;
