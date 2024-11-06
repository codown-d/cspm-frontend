import TzTypography from '@/components/lib/TzTypography';
import NoData from '@/components/NoData';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import Loading from '@/loading';
import { RISK_COLORS_MAP } from '@/pages/components/Chart/constans';
import { getVulnAssetsTop } from '@/services/cspm/Agentless';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { get, keys, sum, values } from 'lodash';
import { useEffect, useState } from 'react';

type IProps = {
  platforms?: string[];
  title?: string;
  type?: string;
  apiUrl?: (params?: API_AGENTLESS.VulnAssetsTopRequest) => Promise<unknown>;
};
function TopRisk(props: IProps) {
  const { platforms, title, apiUrl, type } = props ?? {};
  const intl = useIntl();
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { severityEnum, secretSeverityEnum } = useSeverityEnum();
  const [data, setData] = useState<API_AGENTLESS.VulnAssetsTopResponse[]>();
  useEffect(() => {
    if (!platforms?.length) {
      setIsEmpty(true);
      return;
    }
    const fetchUrl = apiUrl ?? getVulnAssetsTop;
    setLoading(true);
    fetchUrl({
      platforms,
    })
      .then((res) => {
        setData(res);
        setIsEmpty(!res?.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [platforms]);

  const onZrClick = useMemoizedFn((key) => history.push(`/asset/info/${key}`));
  return (
    <div className="w-full relative">
      <div className="mb-2">
        <span className="head-tit-1 ml-1">
          {title ?? intl.formatMessage({ id: 'topVulnAssets' })}
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
              const { label, value: itemV, key } = item;
              const total = sum(values(itemV));
              const keyMaps = keys(
                type === 'secret' ? secretSeverityEnum : severityEnum,
              );
              return (
                <div
                  className={classNames(
                    'hover:bg-[rgba(33,119,209,0.05)] px-1 cursor-pointer',
                    label,
                  )}
                  onClick={() => onZrClick(key)}
                >
                  <div className="flex gap-3 text-[#6C7480] mb-[2px]">
                    <div className="flex-1 w-0 ">
                      <TzTypography.Text ellipsis={{ tooltip: label }}>
                        {label}
                      </TzTypography.Text>
                    </div>
                    <div className="flex gap-3">
                      {keyMaps.map((key) => (
                        <div className="flex gap-1 items-center" key={key}>
                          <span
                            className="w-2 h-2 rounded"
                            style={{
                              background: `${get(RISK_COLORS_MAP, key)}`,
                            }}
                          />
                          <span>
                            {get(severityEnum, [key, 'label']) as string}
                          </span>
                          <span>{get(itemV, key)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex rounded-[3px] overflow-hidden">
                    {total > 0
                      ? keyMaps.map((key) => (
                          <div
                            key={key}
                            className="h-1 rounded-e-[3px]"
                            style={{
                              background: `${get(RISK_COLORS_MAP, key)}`,
                              width: `${(100 * get(itemV, key)) / total}%`,
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
