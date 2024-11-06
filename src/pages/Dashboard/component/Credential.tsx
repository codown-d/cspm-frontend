import NoData from '@/components/NoData';
import Loading from '@/loading';
import RenderPIcon from '@/pages/components/RenderPIcon';
import { getDashboardCredentials } from '@/services/cspm/CloudPlatform';
import { useIntl } from '@umijs/max';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

type IProps = {
  styles: any;
};
function Credential({ styles }: IProps) {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [credentials, setCredentials] =
    useState<API.DashboardCredentialsResponse[]>();

  useEffect(() => {
    setLoading(true);
    getDashboardCredentials()
      .then(setCredentials)
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const sum = useMemo(() => sumBy(credentials, (v) => v.value), [credentials]);
  const len = credentials?.length ?? 0;

  return (
    <div className={classNames('mb-6', styles.credentialStatistics)}>
      <span className="head-tit-1">
        {intl.formatMessage({ id: 'OverviewOfCloudAccounts' })}
      </span>
      {loading ? (
        <Loading />
      ) : !credentials?.length ? (
        <NoData />
      ) : (
        <div className="relative mt-2">
          <div
            className={classNames(
              'absolute left-0 top-0 w-full h-full rounded-lg z-0',
              styles.mainBoxBg,
            )}
          />
          <div
            className={classNames(
              'grid gap-3 pt-3',
              {
                'pb-3': len > 5,
              },
              styles.mainBox,
            )}
          >
            <div
              className={classNames(
                'row-span-2 flex flex-col  items-center',
                styles.sumBox,
                {
                  'h-fit': len < 6,
                  'justify-center': len > 5,
                },
              )}
            >
              <span className="text-[#1E222A] text-[28px] leading-7">
                {sum}
              </span>
              <span className="text-sm leading-[14px] mt-1">
                {intl.formatMessage({ id: 'total' })}
              </span>
            </div>
            {credentials?.map(({ platform, name, value }) => (
              <div className="flex items-center pl-2">
                <div>
                  <RenderPIcon platform={platform} />
                  {/* <img className="h-[42px]" alt={key} src={icon} /> */}
                </div>
                <div className="flex flex-col ml-4">
                  <div className="text-[#1E222A] text-xl font-medium">
                    {value}
                  </div>
                  <div>{name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Credential;
