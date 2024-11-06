import { Key } from 'react';

export const getAllNodeKey = (nodes: API_COMPLIANCE.ComplianceInfoData[]) => {
  const keys: Key[] = [];
  function loop(data: API_COMPLIANCE.ComplianceInfoData[]) {
    if (!data?.length) {
      return;
    }
    data.forEach((item) => {
      item.status !== 'invalid' && keys.push(item.key);
      if (item.children) {
        loop(item.children);
      }
    });
  }
  loop(nodes);

  return keys;
};
