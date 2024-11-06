import { SOCKET_URL } from '@/utils';
import { storage } from '@/utils/tzStorage';
import { useMemoizedFn, useNetwork } from 'ahooks';
import { isNumber } from 'lodash';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useImmer } from 'use-immer';

type TAiGptPageType = 'list' | 'conversation';
export type TConversationParam = API.AiConversationReq & {
  prompt_by_id?: number | string;
};
export default function aiGptModel() {
  const [socket, setSocket] = useImmer<any>(undefined);
  const [socketInit, setSocketInit] = useState<number | boolean>(+new Date());

  const { online: networkOnline } = useNetwork();

  const closeSocket = useMemoizedFn(() => {
    setTimeout(() => {
      networkOnline && socket?.close();
    }, 1000);
  });

  const socketConnect = useMemoizedFn((isRefresh?: boolean) => {
    const token = storage.getCookie('token');
    if (!SOCKET_URL || !networkOnline) {
      console.error(
        'Not connected to the socket server. Please check login status or network.',
      );
    } else {
      const res = io(`${SOCKET_URL}/chat`, {
        reconnection: !isRefresh,
        reconnectionAttempts: 3,
        query: {
          token,
        },
      });
      setSocket(res);
    }
  });

  const sleepSetInit = useMemoizedFn((delay = 1000) => {
    setTimeout(() => {
      setSocketInit(true);
    }, delay);
  });

  const setSocketInitFn = useMemoizedFn(() => {
    setSocketInit((prev) => {
      if (!isNumber(prev)) {
        return true;
      }
      const cur = +new Date();
      if (cur - prev > 1000) {
        return true;
      } else {
        sleepSetInit(1000 - (cur - prev));
        return cur;
      }
    });
  });
  const [type, setType] = useState<TAiGptPageType>('list');
  // const aiIsConnet = useRef<boolean>();
  const [conversationParam, setConversationParam] =
    useState<TConversationParam>();
  const [open, setOpen] = useState<boolean>();
  const newConversation = useMemoizedFn((param?: TConversationParam) => {
    setOpen(true);
    setType('conversation');
    setConversationParam(param);
  });

  useEffect(() => {
    if (!open || socket?.connected) {
      return;
    }
    setSocketInit(+new Date());
    socketConnect?.(true);
    // 保证初始化最长超时3s
    setTimeout(() => setSocketInit(true), 3000);
  }, [open]);

  useEffect(() => {
    setSocketInitFn();
  }, [socket]);

  return {
    type,
    setType,
    conversationParam,
    setConversationParam,
    open,
    setOpen,
    newConversation,
    socket,
    socketConnect,
    networkOnline,
    closeSocket,
    socketInit,
  };
}
