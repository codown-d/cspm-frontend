import { TASK_STATUS_MAP } from '@/utils';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { get } from 'lodash';
const scopeMaps = {
  asset: 'sync',
  risk: 'progress',
  export: 'generate',
  risks_scan: 'progress',
  risks_scan_schedule: 'progress',
  risks_scan_task: 'progress',

  assets_scan_schedule: 'assetsScan',
  compliance_scan_task: 'complianceScan',
  assets_scan_task: 'assetsScan',
  assets_scan: 'assetsScan',
  compliance_scan: 'complianceScan',
  reports_export: 'reportsExport',
};
export const useTaskEnum = () => {
  const { commonConst, getTagInfo } = useModel('global') ?? {};
  const { task_status } = commonConst ?? {};

  const getTaskStatus = useMemoizedFn((scope: API.ITaskScopeType) => {
    return task_status
      ?.filter((item) => 'unscheduled' !== item.value)
      .map((item) => ({
        ...item,
        label:
          'running' === item.value
            ? get(item, ['label', scopeMaps[scope]])
            : item.label,
      }));
  });

  const getLabel = useMemoizedFn(
    (scope: API.ITaskScopeType) =>
      task_status?.map((item) => {
        return {
          ...item,
          label:
            'running' === item.value
              ? get(item, ['label', scopeMaps[scope]])
              : item.label,
        };
      }),
  );
  const getTaskTagInfoByStatus = useMemoizedFn(({ status, scope }) =>
    getTagInfo(getLabel(scope), status, TASK_STATUS_MAP),
  );

  return {
    getTaskStatus,
    getTaskTagInfoByStatus,
  };
};
