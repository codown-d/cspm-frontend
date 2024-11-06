// 全局共享数据
import { getCommonConst } from '@/services/cspm/CloudPlatform';
import { getJWT } from '@/utils';
import { storage } from '@/utils/tzStorage';
import { useModel } from '@umijs/max';
import {
  useBoolean,
  useInterval,
  useMemoizedFn,
  useUnmount,
  useUpdateEffect,
  useWebSocket,
} from 'ahooks';
import { Actions } from 'ahooks/lib/useBoolean';
import { get } from 'lodash';
import { useState } from 'react';
import { flushSync } from 'react-dom';

export type IGetTagInfoFnBack = {
  cusStyle: string | Object;
  label: string | Object;
};
export type BasicDataBack = {
  commonConst?: API.ICommonConst;
  getTagInfo: (
    enums: API.ICommonConstEnum[],
    status: string,
    enumsMap: any,
  ) => IGetTagInfoFnBack;
  // 运行中的任务数据
  taskCount: {
    scanAsset: number;
    complianceScan: number;
    reportExport: number;
  };
  riskVerifyItem?: API_TASK.TaskListResponse;
  taskSocketOpenState?: boolean;
  taskSocketAction?: Actions;
};
const DEFAULT_TIME = 30000;
const useBasicData = (): BasicDataBack => {
  const [commonConst, setCommonConst] = useState<API.ICommonConst>();
  const [taskSocketOpenState, taskSocketAction] = useBoolean();
  const { initialState } = useModel('@@initialState');
  const { userInfo } = initialState ?? {};
  const [riskVerifyItem, setRiskVerifyItem] =
    useState<API_TASK.TaskListResponse>();
  // 任务计数
  const [taskCount, setTaskCount] = useState<BasicDataBack['taskCount']>({
    scanAsset: 0,
    complianceScan: 0,
    reportExport: 0,
  });

  const [interval, setInterval] = useState<number | undefined>();
  const [latestMessage, setLatestMessage] = useState();

  let res = useWebSocket(`/api/v1/ws/biz?${getJWT()}`, {
    onOpen: (event, instance) => {
      setInterval(DEFAULT_TIME);
    },
    onClose: (e) => {
      setInterval(undefined);
    },
    onError: (e) => {
      setInterval(undefined);
    },
    onMessage: (message) => {
      const item = JSON.parse(message?.data ?? '{}');
      flushSync(() => setLatestMessage(item));
    },
  });
  const clear = useInterval(() => {
    const heatTime = +new Date();
    sendMessage?.(
      JSON.stringify({
        type: 'heartbeat',
        data: { token: storage.getCookie('token') },
        timestamp: heatTime,
      }),
    );
  }, interval);

  useUnmount(clear);

  const { sendMessage } = res;
  useUpdateEffect(() => {
    if (!latestMessage) {
      return;
    }

    if (latestMessage?.scene === 'count') {
      const { assets_scan, compliance_scan, reports_export } = get(
        latestMessage,
        'data',
      );
      setTaskCount({
        scanAsset: assets_scan,
        complianceScan: compliance_scan,
        reportExport: reports_export,
      });
    }
    if (
      latestMessage?.scene === 'status' &&
      get(latestMessage, 'data.type') === 'risk_verify'
    ) {
      setRiskVerifyItem(get(latestMessage, 'data'));
    }
  }, [latestMessage]);

  useUpdateEffect(() => {
    if (!storage.getCookie('token') || storage.getCookie('token') === '0') {
      return;
    }
    // 可根据权限来设置请求，是否有agentless相关权限
    getCommonConst().then((res) => setCommonConst(res));
  }, [userInfo]);

  const getTagInfo = useMemoizedFn((enums, status, enumsMap) => {
    const label = enums?.find((v: API.ICommonConstEnum) => v.value === status)
      ?.label;
    const cusStyle = get(enumsMap, status);
    return { cusStyle, label };
  });

  return {
    commonConst,
    taskCount,
    getTagInfo,
    riskVerifyItem,
    taskSocketOpenState,
    taskSocketAction,
  };
};

export default useBasicData;
