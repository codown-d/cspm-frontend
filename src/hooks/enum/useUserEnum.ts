import { USER_STATUS_MAP } from '@/utils';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useUserEnum = () => {
  const { commonConst, getTagInfo } = useModel('global') ?? {};
  const { user_status } = commonConst ?? {};

  const getUserTagInfoByStatus = useMemoizedFn((status: API.UserStatus) =>
    getTagInfo(user_status, status, USER_STATUS_MAP),
  );

  return {
    userStatusEnum: user_status,
    getUserTagInfoByStatus,
  };
};
