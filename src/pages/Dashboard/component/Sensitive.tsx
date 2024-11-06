import AgentlessTop, { IAgentlessTop } from '@/components/AgentlessTop';
import NoData from '@/components/NoData';
import Loading from '@/loading';
import { getRuleSensitiveRisks } from '@/services/cspm/CloudPlatform';
import { history, useIntl } from '@umijs/max';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
type ISensitive = Pick<IAgentlessTop, 'onRow'> & {
  className?: string;
  chartClassName?: string;
  hiddenNoData?: boolean;
  platforms?: string[];
};
function Sensitive(props?: ISensitive) {
  const { className, chartClassName, platforms, hiddenNoData } = props ?? {};
  const [list, setList] = useState<IAgentlessTop['list']>();
  const [loading, setLoading] = useState<boolean>();
  const intl = useIntl();
  useEffect(() => {
    setLoading(true);
    getRuleSensitiveRisks({ focus: true, platforms })
      .then((res) =>
        setList(
          res.items.map(({ unique_id, title, assets_count, severity }) => ({
            name: title,
            assets_count,
            severity,
            id: unique_id,
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
        {intl.formatMessage({ id: 'topSensitive' })}
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
            onRow={(id) => id && history.push(`/secret/info/${id}`)}
            className={classNames('grid-cols-1 gap-3', chartClassName)}
            list={list}
            Icon={<i className="icon iconfont icon-minganwenjian1 text-xl"></i>}
          />
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
}

export default Sensitive;
