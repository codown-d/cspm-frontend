import AgentlessTop, { IAgentlessTop } from '@/components/AgentlessTop';
import NoData from '@/components/NoData';
import Loading from '@/loading';
import { getVulnRisks } from '@/services/cspm/Agentless';
import { history, useIntl } from '@umijs/max';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
type IVulnChart = {
  className?: string;
  chartClassName?: string;
  hiddenNoData?: boolean;
  platforms?: string[];
};
function Vuln(props?: IVulnChart) {
  const { className, chartClassName, platforms, hiddenNoData } = props ?? {};
  const [list, setList] = useState<IAgentlessTop['list']>();
  const [loading, setLoading] = useState<boolean>();
  const intl = useIntl();
  useEffect(() => {
    setLoading(true);
    getVulnRisks({ focus: true, platforms })
      .then((res) =>
        setList(
          res.items.map(({ vuln_name, unique_id, name, ...rest }) => ({
            ...rest,
            id: unique_id,
            sub_name: name,
            name: vuln_name,
          })),
        ),
      )
      .finally(() => setLoading(false));
  }, [platforms]);

  return (
    <div
      className={classNames({
        hidden: hiddenNoData && !loading && !list?.length,
      })}
    >
      <span className="head-tit-1">
        {intl.formatMessage({ id: 'topVuln' })}
      </span>
      <div
        className={classNames(
          'max-h-[238px] mt-2 overflow-y-auto relative',
          className,
        )}
      >
        {loading ? (
          <Loading className="!pt-3" />
        ) : list?.length ? (
          <AgentlessTop
            onRow={(id) => id && history.push(`/vuln/info/${id}`)}
            showSubName
            className={classNames('grid-cols-1 gap-3', chartClassName)}
            list={list}
            Icon={<i className="icon iconfont icon-loudong text-xl"></i>}
          />
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
}

export default Vuln;
