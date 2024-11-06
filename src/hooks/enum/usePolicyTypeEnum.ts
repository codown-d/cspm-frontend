import { useModel } from '@umijs/max';
import { keyBy } from 'lodash';

export const usePolicyTypeEnum = () => {
  const { commonConst } = useModel('global') ?? {};
  const { policy_type } = commonConst ?? {};

  const typeEnum = keyBy(policy_type, 'value');
  return {
    PolicyTypeEnum: typeEnum,
    PolicyTypeOption: policy_type,
  };
};
