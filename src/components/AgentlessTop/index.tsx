import classNames from 'classnames';
import { ReactNode } from 'react';
import TzTypography from '../lib/TzTypography';
import './index.less';

export type IAgentlessTop = {
  Icon?: ReactNode;
  className?: string;
  showSubName?: boolean;
  onRow?: (id?: string) => void;
  list: {
    id?: string;
    name?: string;
    sub_name?: string;
    severity?: API.SEVERITY_LEVEL;
    assets_count?: number;
  }[];
};
function AgentlessTop({
  Icon,
  list,
  className = 'grid-cols-2 gap-3',
  showSubName,
  onRow,
}: IAgentlessTop) {
  return (
    <div className={classNames('agentless-top grid', className)}>
      {list.map(({ id, name, sub_name, severity, assets_count }) => (
        <div
          key={id}
          className={classNames(
            severity,
            'flex items-center px-4 py-3 rounded cursor-pointer',
          )}
          onClick={() => onRow?.(id)}
        >
          <div className="basis-9 icon-box h-9 rounded flex items-center justify-center mr-3">
            {Icon ?? <i className="icon iconfont icon-loudong text-base" />}
          </div>
          <div className="flex-1 w-0">
            <div className="flex gap-2 justify-between">
              <TzTypography.Text ellipsis={{ tooltip: name }}>
                {name}
              </TzTypography.Text>
              <span className="num text-sm font-medium">{assets_count}</span>
            </div>
            <div className="text-[#6C7480]">
              {showSubName ? (
                sub_name ? (
                  <TzTypography.Text ellipsis={{ tooltip: sub_name }}>
                    {sub_name}
                  </TzTypography.Text>
                ) : (
                  '-'
                )
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AgentlessTop;
