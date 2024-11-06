import { useAccess } from '@umijs/max';

function WithAuth(Component) {
  const access = useAccess();

  // if (access.canReadSysAdmin) {
  //   return <Component />;
  // }

  return <div>WithAuth</div>;
}

export default WithAuth;
