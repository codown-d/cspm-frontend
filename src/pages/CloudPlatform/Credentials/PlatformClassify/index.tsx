import NoData from '@/components/NoData';
import useRefreshTable from '@/hooks/useRefreshTable';
import LoadingCover from '@/loadingCover';
import BasicStatistics from '@/pages/components/Statistics/Basic';
import { getDashboardCredentials } from '@/services/cspm/CloudPlatform';
import { useEffect, useState } from 'react';
interface IProps {
  className?: string;
}

const PlatformClassify = (props: IProps) => {
  const { className } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<API.DashboardCredentialsResponse[]>();
  useRefreshTable(() => {
    getDashboardCredentials().then(setOptions);
  });
  useEffect(() => {
    setLoading(true);
    getDashboardCredentials()
      .then(setOptions)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <LoadingCover loading={loading} />
      {!options?.length ? (
        <NoData />
      ) : (
        <BasicStatistics className={className} data={options} />
      )}
    </div>
  );
};

export default PlatformClassify;
