import TzLayoutContext from '@/contexts/TzLayoutContext';
import { oidcLogin } from '@/services/cspm/UserController';
import { SSO_STATE } from '@/utils/constants';
import { useIntl, useSearchParams } from '@umijs/max';
import { useContext, useEffect, useState } from 'react';

function SSOLogin() {
  const [loading, setLoading] = useState<boolean>();
  const { signin } = useContext(TzLayoutContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const intl = useIntl();

  useEffect(() => {
    setSearchParams({});
    if (loading || !state || !SSO_STATE.includes(state)) {
      return;
    }
    setLoading(true);
    oidcLogin({ code })
      .then((res) => {
        signin(res, () => {
          window.location.href = '/';
        });
      })
      .then(() => setLoading(false));
  }, [code]);

  return (
    <div>
      {intl.formatMessage({
        id: 'unStand.authorizedLogin',
      })}
    </div>
  );
}

export default SSOLogin;
