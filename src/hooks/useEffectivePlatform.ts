import { TCommonPlatforms } from '@/interface';
import { getCommonPlatforms } from '@/services/cspm/CloudPlatform';
import { useModel } from '@umijs/max';
import { useEffect, useState } from 'react';

// agentless ,用于查询该用户下的支持agentless的云平台
// user,用于查询该用户下的云平台
// 不填,查询cspm支持的所有云平台
export default function useEffectivePlatform(use_case?: 'agentless' | 'user') {
  const [platform, setPlatform] = useState<undefined | TCommonPlatforms[]>();
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};

  useEffect(() => {
    getCommonPlatforms({ use_case }).then(
      (res: API.CommonPlatformsResponse[]) => {
        setPlatform(res?.map((v) => ({ ...v, label: v?.name, value: v?.key })));
      },
    );
  }, [commonPlatforms, use_case]);

  return platform;
}
