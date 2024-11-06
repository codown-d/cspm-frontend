import { FS_STATUS_MAP } from '@/utils';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useSucFailEnum = () => {
  const { commonConst, getTagInfo } = useModel('global') ?? {};
  const { audit_status } = commonConst ?? {};

  const getSucFailTagInfoByStatus = useMemoizedFn((status: API.SucFailStatus) =>
    getTagInfo(audit_status, status, FS_STATUS_MAP),
  );

  return {
    sucFailOption: audit_status,
    getSucFailTagInfoByStatus,
  };
};
