import { TasksFutureType } from '@/pages/Dashboard/MyTask';
import {
  IRenderTagNew,
  renderCommonStatusTag,
} from '@/pages/components/RenderRiskTag';
import { DATE_TIME } from '@/utils/constants';
import { useIntl } from '@umijs/max';
import classNames from 'classnames';
import dayjs from 'dayjs';
import TzTypography from '../lib/TzTypography';

type IRecord = {
  id?: number;
  name?: string;
  type?: TasksFutureType;
  time?: number;
  status?: string;
  timeLabel?: string;
};
export type ITaskList = {
  list?: IRecord[];
  onRow?: (arg: IRecord) => void;
  timeLabel: string;
  tagParams: IRenderTagNew;
};
function TaskList({ list, timeLabel, tagParams, onRow }: ITaskList) {
  const intl = useIntl();
  return (
    <div className="max-h-[238px] bg-[rgba(33,119,209,0.02)] rounded overflow-y-auto">
      {list?.map(
        ({
          name,
          status,
          time,
          id,
          type,
          timeLabel: itemtimeLabel,
          ...rest
        }) => (
          <div
            onClick={() => onRow?.({ ...rest, type, id })}
            key={id}
            className={classNames(
              'px-4 py-2 first-of-type:mt-1 last-of-type:mb-1',
              {
                'cursor-pointer hover:bg-[rgba(33,119,209,0.05)]':
                  type !== TasksFutureType.ReportsExport,
              },
            )}
          >
            <div className="text-[13px] flex gap-2">
              <TzTypography.Text ellipsis={{ tooltip: name }}>
                {name || '-'}
              </TzTypography.Text>
              <span>
                {renderCommonStatusTag(
                  { ...tagParams, status, scope: type },
                  { size: 'small' },
                )}
              </span>
            </div>
            <div className="text-[#8E97A3] mt-1">
              {itemtimeLabel ??
                timeLabel ??
                intl.formatMessage({ id: 'createdAt' })}
              ：{time ? dayjs(time).format(DATE_TIME) : '-'}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export default TaskList;
