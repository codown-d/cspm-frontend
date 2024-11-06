import { getTaskDetailById } from '@/services/cspm/Task';
import { useParams } from '@umijs/max';
import { useEffect, useState } from 'react';

export enum TaskDetailType {
  AssetsScan = 'assets_scan',
  ComplianceScan = 'compliance_scan',
}
export default function useDetail(type: TaskDetailType) {
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<API_TASK.TaskDetailResponse>();

  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    if (!id || !type) {
      return;
    }
    getTaskDetailById({ id, type })
      .then(setInfo)
      .finally(() => setLoading(false));
  }, [id, type]);

  return { info, loading };
}
