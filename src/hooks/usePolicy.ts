import { getCommonPolicyList } from '@/services/cspm/CloudPlatform';
import { useEffect, useState } from 'react';
type PolicyRe = [
  API.CommonPolicyDatum[]?,
  Record<string, API.CommonPolicyItem[]>?,
];
export function usePolicy() {
  const [policy, setPolicy] = useState<API.CommonPolicyDatum[]>();
  // const [policyObj, setPolicyObj] =
  //   useState<Record<string, API.CommonPolicyItem[]>>();
  useEffect(() => {
    // todo
    getCommonPolicyList().then((res) => {
      // const obj = {};
      // res.forEach((v) => v.key && set(obj, v.key, v.policy_items));
      // setPolicy(
      //   flatten(res.map((v) => v.policy_items)) as API.CommonPolicyDatum[],
      // );
      setPolicy(res);
    });
  }, []);

  return policy;
}
