import TzTypography from '@/components/lib/TzTypography';
import NoData from '@/components/NoData';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import Loading from '@/loading';
import { RISK_COLORS_MAP } from '@/pages/components/Chart/constans';
import { getVulnAssetsTop } from '@/services/cspm/Agentless';
import { useIntl } from '@umijs/max';
import { get, keys, sum, values } from 'lodash';
import { useEffect, useState } from 'react';

type IProps = {
  platforms: string[];
};
function TopRisk({ platforms }: IProps) {
  const intl = useIntl();
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { severityEnum } = useSeverityEnum();
  const [data, setData] = useState<API_AGENTLESS.VulnAssetsTopResponse[]>();
  useEffect(() => {
    if (!platforms?.length) {
      setIsEmpty(true);
      return;
    }
    setLoading(true);
    getVulnAssetsTop({
      platforms,
    })
      .then((res) => {
        setData(res);
        setIsEmpty(!res?.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [platforms]);

  return (
    <div className="w-full relative">
      <div className="mb-2">
        <span className="head-tit-1">
          {intl.formatMessage({ id: 'topRisk' })}
        </span>
      </div>
      <div className="chart-content h-[178px] chart-box">
        {loading ? (
          <Loading className="!pt-3" />
        ) : isEmpty ? (
          <NoData />
        ) : (
          <div className="flex flex-col gap-y-3">
            {data?.map((item) => {
              const { label, value } = item;
              const {} = value;
              const total = sum(values(value));

              return (
                <div>
                  <div className="flex gap-3 text-[#6C7480] mb-[2px]">
                    <div className="flex-1 w-0 ">
                      <TzTypography.Text ellipsis={{ tooltip: label }}>
                        {label}
                      </TzTypography.Text>
                    </div>
                    <div className="flex gap-3">
                      {keys(RISK_COLORS_MAP).map((key) => (
                        <div className="flex gap-1 items-center" key={key}>
                          <span
                            className="w-2 h-2 rounded"
                            style={{
                              background: `${get(RISK_COLORS_MAP, key)}`,
                            }}
                          />
                          <span>{get(severityEnum, [key, 'label'])}</span>
                          <span>{get(value, key)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex rounded-[3px] overflow-hidden">
                    {total > 0
                      ? keys(RISK_COLORS_MAP).map((key) => (
                          <div
                            key={key}
                            className="h-1 rounded-e-[3px]"
                            style={{
                              background: `${get(RISK_COLORS_MAP, key)}`,
                              width: `${(100 * get(value, key)) / total}%`,
                            }}
                          ></div>
                        ))
                      : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TopRisk;
