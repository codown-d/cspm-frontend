import { NONE_PLATFORM } from '@/utils';
import { BaseOptionType } from 'antd/lib/select';
import { cloneDeep, flatten, get, hasIn, keys, set, sortBy } from 'lodash';
import { Key } from 'react';
import { getNewKey } from './Edit/ComplianceItem/util';

const upperCaseNumber = [
  '零',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
];

const upperCaseUnit = ['', '十', '百', '千'];

export const numberToChinese = (num: number): string => {
  if (num < 1 || num > 100) {
    throw new Error('数字必须在1到100之间');
  }

  if (num === 100) {
    return '一百';
  }

  const digits = num.toString().split('').map(Number);
  let result = '';

  if (digits.length === 2) {
    if (digits[0] === 1) {
      result += '十';
    } else {
      result += upperCaseNumber[digits[0]] + '十';
    }
    if (digits[1] !== 0) {
      result += upperCaseNumber[digits[1]];
    }
  } else {
    result += upperCaseNumber[digits[0]];
  }

  return result;
};
export const numberToEn = (num: number): string => {
  if (num < 1 || num > 20) {
    throw new Error('The number must be between 1 and 20.');
  }
  const numWords = [
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
    'Twenty',
  ];

  if (num >= 1 && num <= 20) {
    return numWords[num - 1];
  } else {
    return 'Invalid number';
  }
};
export const numberToEnTh = (num: number): string => {
  if (num < 1 || num > 20) {
    throw new Error('The number must be between 1 and 20.');
  }
  const numWords = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
    'Ninth',
    'Tenth',
    'Eleventh',
    'Twelfth',
    'Thirteenth',
    'Fourteenth',
    'Fifteenth',
    'Sixteenth',
    'Seventeenth',
    'Eighteenth',
    'Nineteenth',
    'Twentieth',
  ];

  if (num >= 1 && num <= 20) {
    return numWords[num - 1];
  } else {
    return 'Invalid number';
  }
};
export const classifyPolicies = (
  policies: API.CommonPolicyItem[],
  onlyId?: boolean,
) => {
  if (!policies?.length) {
    return;
  }
  let obj: Record<string, (string | API.CommonPolicyItem)[]> = {};
  const _policies = sortBy(
    policies.filter((v) => !!v),
    (item) => item.platform,
  );

  _policies.forEach((item) => {
    const { platform } = item;
    if (!obj[platform]) {
      obj[platform] = [];
    }
    obj[platform].push(onlyId ? item.id : item);
  });
  if (hasIn(obj, NONE_PLATFORM)) {
    let { NONE_PLATFORM, ...rest } = obj;
    obj = { NONE_PLATFORM, ...rest };
  }
  return obj;
};
export const classifyPolicies2Arr = (
  policies: API.CommonPolicyItem[],
  platforms,
) => {
  const _policies = classifyPolicies(policies);
  const arr = platforms?.length ? platforms : keys(_policies);
  return arr
    .map((key) => {
      const items = _policies?.[key];
      const label = get(items, [0, 'platform_name']);
      return items
        ? {
            label,
            platform: key,
            key,
            count: items?.length,
            policies: items,
          }
        : undefined;
    })
    .filter((v) => !!v);
};
const flattenClassifyPolicies = (policies?: API_COMPLIANCE.ChildPolicy[]) => {
  if (!policies?.length) {
    return;
  }
  return flatten(
    policies.map((item) => {
      return item.policies?.map((v) => {
        return {
          ...v,
          platform: item.platform,
        };
      });
    }),
  );
};
export const TreeData2SendData = (
  values?: API_COMPLIANCE.ComplianceInfoData[],
  policyTypeOption?: BaseOptionType[],
) => {
  if (!values?.length) {
    return undefined;
  }

  function loop(node: API_COMPLIANCE.ComplianceInfoData) {
    if (node.policies?.length) {
      node.policies = node.policies.map((item) => {
        const { id, policy_type, ...rest } = item;
        if (policy_type === 'manual') {
          const { _id, ...restM } = rest;
          const restItem = _id ? { ...restM, id: _id } : restM;
          return {
            ...restItem,
            policy_type,
            // type_name: policyTypeOption?.find((v) => v.value === type)?.label,
          };
        }
        return { id, policy_type };
      });
    }
    const _key = get(node, '_key');
    node.key && delete node.key;
    node._key && delete node._key;
    set(node, 'key', _key);
    if (!!node.children?.length) {
      node.children.forEach((child) => {
        loop(child);
      });
    }
  }
  const _vales = cloneDeep(values);
  _vales?.forEach(loop);
  return _vales;
};
export const getData2TreeData = (data: API_COMPLIANCE.ComplianceInfoData[]) => {
  if (!data?.length) {
    return;
  }
  function loop(
    node: API_COMPLIANCE.ComplianceInfoData,
    level = 0,
    parentKey?: Key,
  ) {
    const key = get(node, 'key');
    set(node, '_key', key);
    const newKey = getNewKey(parentKey);
    set(node, 'key', newKey);
    set(node, 'level', level);

    if (node.type === 'requirement' && node.policies?.length) {
      node.policies = node.policies.map((p) => {
        if (p.policy_type === 'manual') {
          return {
            ...p,
            _id: p.id,
          };
        }
        return p;
      });
    }
    if (!!node.children?.length) {
      node.children.forEach((child) => {
        loop(child, level + 1, newKey);
      });
    }
  }
  const _vales = cloneDeep(data);
  _vales?.forEach((n) => loop(n));
  return _vales;
};
