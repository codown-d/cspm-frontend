import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { get } from 'lodash';
export const useTaskScanEnum = () => {
  const { commonConst } = useModel('global') ?? {};
  const { task_create_type } = commonConst ?? {};

  const getTaskScanStatus = useMemoizedFn((scope: API.ITaskScanType) => {
    return task_create_type?.map((item) => ({
      ...item,
      label: get(item, ['label', scope]),
    }));
  });

  return getTaskScanStatus;
};
