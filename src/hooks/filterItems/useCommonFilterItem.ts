import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useIntl, useModel } from '@umijs/max';
import { useMemo } from 'react';

function useCommonFilterItem() {
  const { commonConst } = useModel('global') ?? {};
  const { initialState } = useModel('@@initialState');
  const { commonEffectPlatforms, commonPlatforms } = initialState ?? {};

  const intl = useIntl();
  const scanResItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'testingResult' }),
        name: 'status',
        type: 'select',
        icon: 'icon-yunhangzhuangtai',
        props: {
          mode: 'multiple',
          options: commonConst?.config_detect_status,
          // options: SCAN_STATUS_OPT,
        },
      }) as FilterFormParam,
    [commonConst],
  );

  const riskTypesItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'securityRisk' }),
        name: 'risk_types',
        type: 'select',
        icon: 'icon-mingmingkongjian',
        props: {
          mode: 'multiple',
          options: commonConst?.risk_type,
        },
      }) as FilterFormParam,
    [commonConst],
  );
  const effectPlatformItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'cPlatform' }),
        name: 'platforms',
        type: 'select',
        icon: 'icon-yunpingtai',
        props: {
          mode: 'multiple',
          options: commonEffectPlatforms,
        },
      }) as FilterFormParam,
    [commonConst],
  );
  const platformItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'cPlatform' }),
        name: 'platforms',
        type: 'select',
        icon: 'icon-yunpingtai',
        props: {
          mode: 'multiple',
          options: commonPlatforms,
        },
      }) as FilterFormParam,
    [commonConst],
  );

  const policyTypeItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'scanningMode' }),
        name: 'policy_type',
        type: 'select',
        icon: 'icon-chakanxiangqing',
        props: {
          mode: 'multiple',
          options: commonConst?.policy_type,
        },
      }) as FilterFormParam,
    [commonPlatforms],
  );

  const attackPathItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'attackPath' }),
        name: 'attack_path',
        type: 'select',
        icon: 'icon-lujing',
        props: {
          mode: 'multiple',
          options: commonConst?.attack_path,
        },
      }) as FilterFormParam,
    [commonPlatforms],
  );
  const vulnAttrItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'attribute' }),
        name: 'vuln_attr',
        type: 'select',
        icon: 'icon-shuxing_1',
        props: {
          mode: 'multiple',
          options: commonConst?.vuln_attr,
        },
      }) as FilterFormParam,
    [commonPlatforms],
  );
  return {
    scanResItem,
    riskTypesItem,
    platformItem,
    effectPlatformItem,
    policyTypeItem,
    attackPathItem,
    vulnAttrItem,
  };
}

export default useCommonFilterItem;
