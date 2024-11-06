import { useModel } from '@umijs/max';
import { keyBy } from 'lodash';

export const useRiskTypeEnum = () => {
  const { commonConst } = useModel('global') ?? {};
  const { risk_type } = commonConst ?? {};

  const typeEnum = keyBy(risk_type, 'value');
  return {
    RiskTypeEnum: typeEnum,
    RiskTypeOption: risk_type,
  };
};
