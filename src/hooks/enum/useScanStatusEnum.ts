import { SCAN_STATUS_MAP } from '@/utils';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { keyBy } from 'lodash';
import { useMemo } from 'react';

export const useScanStatusEnum = () => {
  const { commonConst, getTagInfo } = useModel('global') ?? {};
  const { config_detect_status } = commonConst ?? {};

  const getScanTagInfoByStatus = useMemoizedFn((status) =>
    getTagInfo(config_detect_status, status, SCAN_STATUS_MAP),
  );

  const scanStatusEnum = useMemo(
    () =>
      keyBy(
        config_detect_status?.map((v) => ({
          ...v,
          text: v.label,
          status: v.value,
        })),
        'value',
      ),
    [config_detect_status],
  );

  return {
    scanStatusOption: config_detect_status,
    scanStatusEnum,
    getScanTagInfoByStatus,
  };
};
