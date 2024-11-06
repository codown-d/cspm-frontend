import Loading from '@/loading';
import {
  clearHistory,
  deleteHistoryById,
  getAiHistory,
} from '@/services/cspm/Socket';
import { PUBLIC_URL } from '@/utils';
import { DATE_TIME } from '@/utils/constants';
import { useIntl } from '@umijs/max';
import { useInfiniteScroll } from 'ahooks';
import { Image, Space, message } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { memo, useRef } from 'react';
import NoData from '../NoData';
import TzTypography from '../lib/TzTypography';
import { TzButton } from '../lib/tz-button';
import { TzTooltip } from '../lib/tz-tooltip';
export type AiGptListProps = {
  onClose: VoidFunction;
  toConversation: (id?: string) => void;
  show?: boolean;
};
const PAGE_SIZE = 10;
function List(props: AiGptListProps) {
  const { onClose, toConversation } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const onDelete = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
  };

  const { data, loading, mutate, reload } = useInfiniteScroll(
    (d) =>
      getAiHistory({ limit: PAGE_SIZE, start_id: d?.next_id }).then((res) => ({
        ...res,
        list: res.items,
      })),
    {
      target: contentRef,
      isNoMore: (d) => d?.data?.length < PAGE_SIZE || !d?.next_id,
    },
  );

  const handleClearHis = () => {
    clearHistory().then((res) => {
      message.success(intl.formatMessage({ id: 'AiGpt.clearAllSuc' }));
      reload();
    });
  };
  const deleteHistory = (id: string) => {
    deleteHistoryById(id).then((res) => {
      message.success(intl.formatMessage({ id: 'AiGpt.deleteSuc' }));
      if (data) {
        const index = data.list.findIndex((i) => i.conversation_id === id);
        data?.list.splice(index, 1);
        mutate({ ...data });
      }
    });
  };

  return (
    <div className={classNames('box list')}>
      <div className="ai-gpt-content-title flex justify-between items-center">
        <div className="title-txt leading-[26px]">
          {intl.formatMessage({ id: 'AiGpt.message' })}
        </div>
        <Space className="leading-[26px] h-[26px]" size={8}>
          <TzTooltip
            title={intl.formatMessage({ id: 'AiGpt.clearAllConversation' })}
            placement="top"
          >
            <span
              onClick={handleClearHis}
              className="icon iconfont icon-yijianqingkong font-medium text-2xl cursor-pointer"
            />
          </TzTooltip>
          <span
            onClick={onClose}
            className="icon iconfont icon-close text-2xl cursor-pointer"
          />
        </Space>
      </div>
      <div className="flex flex-col ai-gpt-content-box">
        <div className="ai-gpt-content-main flex-1" ref={contentRef}>
          <ul>
            {loading ? (
              <Loading />
            ) : (
              (data?.list?.length &&
                data.list.map(({ title, updated_at, conversation_id }) => (
                  <li
                    key={conversation_id}
                    onClick={() => {
                      toConversation(conversation_id);
                    }}
                  >
                    <div className="mr-3 w-7 h-7">
                      {/* <span className="icon iconfont icon-jiqiren row-icon text-[28px]" /> */}
                      <Image
                        className="row-icon"
                        preview={false}
                        src={`${PUBLIC_URL}/ai.png`}
                      />
                    </div>
                    <div className="flex-1 w-0">
                      <TzTypography.Text
                        className="row-tit text-base"
                        title={title}
                      >
                        {title}
                      </TzTypography.Text>
                      <p className="row-sub-tit">
                        {dayjs.unix(updated_at).format(DATE_TIME)}
                      </p>
                    </div>
                    <div className="ml-3 row-clear" onClick={onDelete}>
                      <TzTooltip
                        title={intl.formatMessage({ id: 'AiGpt.delete' })}
                        placement="top"
                      >
                        <span
                          onClick={() => deleteHistory(conversation_id)}
                          className="icon iconfont icon-lajitong text-base"
                        />
                      </TzTooltip>
                    </div>
                  </li>
                ))) || <NoData small className="mt-8" />
            )}
          </ul>
        </div>
        <div className="ai-gpt-content-footer py-5">
          <TzButton
            onClick={() => toConversation()}
            type="primary"
            icon={<span className="icon iconfont icon-tianjia" />}
          >
            {intl.formatMessage({ id: 'AiGpt.newSsession' })}
          </TzButton>
        </div>
      </div>
    </div>
  );
}

export default memo(List);
