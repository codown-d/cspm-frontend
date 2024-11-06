import Loading from '@/loading';
import translate from '@/locales/translate';
import { getAiHistoryById } from '@/services/cspm/Socket';
import { SyncOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useUnmount } from 'ahooks';
import classNames from 'classnames';
import { isNumber, isObject, isUndefined, last } from 'lodash';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useImmer } from 'use-immer';
import TzAlert from '../lib/TzAlert';
import { TzInput } from '../lib/TzInput';
import TzTypography from '../lib/TzTypography';
import { TzButton } from '../lib/tz-button';
const CONNET_STATUS_ENUM = [
  translate('AiGpt.connectionDown'),
  '',
  translate('AiGpt.reconnecting'),
];
export type AiGptConversationProps = {
  onClose: VoidFunction;
};
type TA = {
  id?: number | string;
  msg?: string;
  status: 0 | 1 | 2 | 3 | 4; //0: 待回答，1:回答中，2:完成，3:中断，4:失败
};
type TQ = {
  msg?: string;
  status: 0 | 1 | 2; //0: 未发送，1:已发送，2:已发送但回答中断;
  aId?: number; //消息未发出时 手动标记id
};
type TConversationItem = [TQ, TA];
function Conversation(props: AiGptConversationProps) {
  const { onClose } = props;
  const {
    setType,
    conversationParam,
    setConversationParam,
    socket,
    socketConnect,
    networkOnline,
    socketInit,
  } = useModel('aiGptModel');
  const {
    conversation_id: conversationId,
    user_questions,
    confirm,
  } = conversationParam ?? {};
  const [message, setMessage] = useState<any>();
  const [hisLoading, setHisLoading] = useState<boolean>();
  const [info, setInfo] = useState<API.AiHistoryByIdResponse>();
  const [loading, setLoading] = useState<boolean>();
  const prevQRef = useRef<API.AiConversationReq>();
  const newConversationIdRef = useRef<string | number | undefined>(
    conversationId,
  );
  const [list, setList] = useImmer<TConversationItem[]>([]);
  // 0: 断开，1: 连接，2: 重连中
  const [connetStatus, setConnetStatus] = useState<number>(
    +(socket?.connected ?? false),
  );
  const intl = useIntl();

  const toEnd = useMemoizedFn(() => {
    if (isObject(document.querySelector('.end-anchor'))) {
      (document.querySelector('.end-anchor') as any).scrollIntoView({
        behavior: 'auto',
        block: 'end',
      });
    }
  });

  useEffect(toEnd, [info]);

  useEffect(() => {
    newConversationIdRef.current = conversationId;
    if (!conversationId) {
      return;
    }
    setHisLoading(true);
    getAiHistoryById(conversationId)
      .then((res) => {
        setInfo(res);
        setList((draft) => {
          if (!draft?.length) {
            const draft1 = res.items?.map(([q, a]) => [
              { status: 1, msg: q },
              { status: 2, msg: a, id: conversationId },
            ]);
            return draft1;
          }
          const data: TConversationItem[] = [];
          const resD = res.items;
          let redIdx = 0;
          draft.forEach((item, idx) => {
            if (item?.[0]?.aId) {
              data.push(item);
            } else {
              const cur = resD[redIdx++];
              data.push([
                { status: 1, msg: cur?.[0] },
                { status: 2, msg: cur?.[1], id: conversationId },
              ]);
            }
          });
          return data;
        });
      })
      .finally(() => setHisLoading(true));
  }, [conversationId, connetStatus]);

  useEffect(() => {
    setConnetStatus(+(!networkOnline ? 0 : socket?.connected ?? false));
    if (!socket || !networkOnline) {
      return;
    }

    socket.on('connect', () => {
      setLoading(false);
      setConnetStatus(+(socket?.connected ?? false));
    });
    socket.on('disconnect', (reason: string) => {
      setConnetStatus(0);
    });
    socket.io.on('reconnect_failed', () => {
      setConnetStatus(0);
      setList((draft) => {
        let cur = last(draft) || [];
        const curQS = cur[0]?.status ?? 0;
        const curAS = cur[1]?.status ?? 0;
        if ([2, 3, 4].includes(curAS)) {
          return;
        }
        let AsNext = curAS;
        if (curAS === 0) {
          AsNext = 4;
        } else if (curAS === 1) {
          AsNext = 3;
        }
        cur[0] = { ...cur[0], status: curQS === 1 && curAS === 1 ? 2 : curQS };
        cur[1] = { ...cur[1], status: AsNext };
      });
    });
    socket.on('chat', function (chat: string) {
      const data = JSON.parse(chat);
      newConversationIdRef.current = data.conversation_id;

      if (data.is_end == true) {
        setLoading(false);
      }

      setList((draft) => {
        let cur = last(draft) || [];
        const aMsg = cur[1]?.msg || '';
        cur[0] = { ...cur[0], status: 1 };
        cur[1] = {
          status: 1 + data.is_end,
          msg: `${aMsg}${data.message || ''}`,
        };
      });
      setTimeout(() => {
        flushSync(toEnd);
      });
    });
  }, [socket]);

  const connectIsNormal = connetStatus === 1;

  const handSend = useMemoizedFn(
    (params: API.AiConversationReq, id?: number) => {
      if (params.type === 'query') {
        setLoading(true);
        prevQRef.current = params;
        setConversationParam((prev) => ({
          ...prev,
          user_questions: undefined,
          actual_questions: undefined,
        }));

        //
        setList((draft) => {
          if (id && connectIsNormal) {
            const sendMsg = draft.find((item) => item[0].aId === id)?.[0]?.msg;
            const index = draft.findIndex((item) => item[0].aId === id);
            index !== -1 && draft.splice(index, 1);
            draft.push([
              {
                status: 1,
                msg: sendMsg,
              },
              {
                status: 0,
                msg: '',
              },
            ]);
            return;
          }
          draft.push([
            {
              status: connectIsNormal ? 1 : 0,
              msg: params.user_questions,
              aId: connectIsNormal ? undefined : +new Date(),
            },
            {
              status: connectIsNormal ? 0 : 4,
              msg: connectIsNormal ? '' : undefined,
            },
          ]);
        });
        setTimeout(() => {
          flushSync(toEnd);
        });
      }
      setTimeout(() => {
        setMessage(undefined);
      });

      if (socket) {
        socket.emit('chat', JSON.stringify(params));
      } else {
        console.error(
          'Not connected to the socket server. Please login first.',
        );
      }
    },
  );

  const stop = () => {
    handSend({
      type: 'action',
      action: 'STOP',
    });
  };
  const onBack = () => {
    setType('list');
    stop();
  };

  useUnmount(stop);

  useEffect(() => {
    if (!networkOnline) {
      setConnetStatus(0);
    }
  }, [networkOnline]);

  const sendMsg = useMemoizedFn(
    () =>
      !loading &&
      handSend({
        type: 'query',
        user_questions: message,
        actual_questions: message,
        conversation_id: newConversationIdRef.current || 0, //#继续一个历史对话的上下文，若是新对话则为0
      }),
  );

  const abnormalTip = CONNET_STATUS_ENUM[connetStatus];
  const title = conversationId
    ? info?.title
    : intl.formatMessage({ id: 'AiGpt.conversation' });

  return (
    <div className={classNames('box conversation relative')}>
      <div className="ai-gpt-content-title flex justify-between items-center">
        <div className="title-txt leading-[26px]">
          <span
            onClick={onBack}
            className="icon iconfont icon-arrow text-2xl back cursor-pointer align-text-bottom leading-6"
          />
          <span className="ml-1 inline-block w-[354px]">
            <TzTypography.Text
              className="text-base title-txt"
              ellipsis={{ tooltip: title }}
            >
              {title}
            </TzTypography.Text>
          </span>
        </div>
        <span
          onClick={onClose}
          className="icon iconfont icon-close text-2xl cursor-pointer leading-6"
        />
      </div>
      <div className="flex flex-col ai-gpt-content-box">
        {abnormalTip && (
          <TzAlert
            type="error"
            message={CONNET_STATUS_ENUM[connetStatus]}
            className="disconnect-alert"
            action={
              <SyncOutlined
                onClick={() => {
                  setConnetStatus(2);
                  if (!networkOnline) {
                    setTimeout(() => setConnetStatus(0));
                  } else socketConnect?.(true);
                }}
                spin={connetStatus === 2}
                className={classNames('text-[#2177d1] reconnect-btn', {
                  disabled: connetStatus === 2,
                })}
              />
            }
          />
        )}
        <div className="ai-gpt-content-main flex-1 h-0 relative">
          {!!user_questions && (
            <div className="prompt-message" style={{ whiteSpace: 'pre-wrap' }}>
              {confirm}
              <p>
                <TzButton
                  className="ai-yes"
                  size="small"
                  onClick={() =>
                    handSend({
                      type: 'query',
                      user_questions,
                      actual_questions: user_questions,
                      conversation_id: 0, //#继续一个历史对话的上下文，若是新对话则为0
                    })
                  }
                >
                  {intl.formatMessage({ id: 'AiGpt.yes' })}
                </TzButton>
                <TzButton
                  className="ai-yes ml-2"
                  size="small"
                  onClick={onClose}
                >
                  {intl.formatMessage({ id: 'AiGpt.clickedWrong' })}
                </TzButton>
              </p>
            </div>
          )}
          {list?.length ? (
            list?.map(([q, a], index) => (
              <Fragment key={`${q}${a}-${a}`}>
                {q && (
                  <div className="row q">
                    {connectIsNormal && [3, 4].includes(a.status) && (
                      <SyncOutlined
                        onClick={() =>
                          handSend(
                            {
                              ...prevQRef.current,
                              conversation_id:
                                newConversationIdRef.current || 0, //#继续一个历史对话的上下文，若是新对话则为0
                            },
                            q.aId,
                          )
                        }
                        className="no-send-tip retry"
                      />
                    )}
                    {!connectIsNormal && q.status === 0 && (
                      <i className="icon iconfont icon-banben no-send-tip" />
                    )}
                    <p
                      key={`${q}${a}-${q}`}
                      className="content"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {q.msg}
                    </p>
                  </div>
                )}
                {isUndefined(a.msg) ? null : (
                  <div className="row a">
                    <p
                      key={`${q}${a}-${a}`}
                      className="content"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {a.msg ||
                        (a.status === 0 &&
                          intl.formatMessage({ id: 'AiGpt.answering' })) ||
                        (a.status === 4 &&
                          intl.formatMessage({ id: 'AiGpt.answerFailure' }))}
                    </p>
                  </div>
                )}
              </Fragment>
            ))
          ) : hisLoading ? (
            <Loading />
          ) : null}
          <div className="end-anchor h-5"></div>
        </div>
        {connetStatus === 1 && loading && (
          <div className="m-auto -mt-2 pb-5 w-full bg-[#f7fafc] flex justify-center items-center">
            <TzButton
              onClick={stop}
              size="small"
              danger
              className="conversation-stop-btn"
            >
              {intl.formatMessage({ id: 'AiGpt.stop' })}
            </TzButton>
          </div>
        )}

        <div className="ai-gpt-content-footer flex justify-around px-6 py-5 basis-16">
          <TzInput.TextArea
            autoSize={{ minRows: 1, maxRows: 6 }}
            className="send-input"
            placeholder={intl.formatMessage({ id: 'AiGpt.inputTip' })}
            onChange={(e) => {
              const val = e.target.value;
              setMessage(val);
              setTimeout(() => {
                flushSync(toEnd);
              });
            }}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                // 阻止默认行为，避免提交表单
                e.preventDefault();
                // 在当前光标位置插入换行符
                const cursorPosition = e.target.selectionStart;
                const newValue =
                  message.slice(0, cursorPosition) +
                  '\n' +
                  message.slice(cursorPosition);
                setMessage(newValue);
              } else if (e.code === 'Enter') {
                e.stopPropagation();
                e.preventDefault();
                sendMsg();
              }
            }}
            value={message}
          />
          <div className="h-full inline-flex justify-center items-center">
            <span
              className={classNames(
                'icon iconfont icon-fasong text-2xl cursor-pointer send-btn ml-3',
                { disabled: loading || !message },
              )}
              onClick={sendMsg}
            />
          </div>
        </div>
      </div>
      {isNumber(socketInit) && (
        <div className="w-full h-[467px] bg-white absolute top-[59px] left-0">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default memo(Conversation);
