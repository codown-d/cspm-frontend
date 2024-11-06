import { VULN_ATTR_MAP } from '@/utils';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { keyBy } from 'lodash';
import { useMemo } from 'react';

export const useVulnAttrEnum = () => {
  const { commonConst, getTagInfo } = useModel('global') ?? {};
  const { vuln_attr } = commonConst ?? {};

  const getVulnAttrInfoByStatus = useMemoizedFn((status) =>
    getTagInfo(vuln_attr, status, VULN_ATTR_MAP),
  );

  const vulnAttrEnum = useMemo(
    () =>
      keyBy(
        vuln_attr?.map((v) => ({
          ...v,
          text: v.label,
          status: v.value,
        })),
        'value',
      ),
    [vuln_attr],
  );

  return {
    vulnAttrOption: vuln_attr,
    vulnAttrEnum,
    getVulnAttrInfoByStatus,
  };
};
