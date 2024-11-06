import { cloneDeep, lowerCase } from 'lodash';

const calculatePolicyCount = (node: API_COMPLIANCE.ComplianceInfoData) => {
  if (node.type === 'requirement') {
    return node.policies?.length || 0;
  }
  if (node.children && node.children.length) {
    let totalPolicies = 0;
    for (const child of node.children) {
      totalPolicies += calculatePolicyCount(child);
    }
    return totalPolicies;
  }
  return 0;
};
const setPolicyCount = (nodes: API_COMPLIANCE.ComplianceInfoData[]) => {
  nodes.forEach((node) => {
    node.policy_count = calculatePolicyCount(node);
    if (node.children?.length) {
      setPolicyCount(node.children);
    }
  });
};
const policyFilterIsEmpty = (filters) => {
  const {
    search,
    service_ids,
    severity,
    policy_type,
    platforms,
    asset_type_ids,
  } = filters;
  if (
    !search &&
    !service_ids?.length &&
    !asset_type_ids?.length &&
    !severity?.length &&
    !policy_type?.length &&
    !platforms?.length
  ) {
    return true;
  }
  return false;
};
type policyFilterName =
  | 'search'
  | 'service_ids'
  | 'severity'
  | 'policy_type'
  | 'platforms'
  | 'asset_type_ids';
export const filterPolicies = (
  policies?: API.CommonPolicyDatum[],
  filters?: Record<policyFilterName, any>,
) => {
  if (!policies?.length || !policyFilterIsEmpty || !filters) {
    return policies;
  }
  const {
    search,
    service_ids,
    severity,
    policy_type,
    platforms,
    asset_type_ids,
  } = filters;
  return policies
    .filter(
      (v) =>
        !search ||
        lowerCase(v.policy_title).indexOf(lowerCase(search)) > -1 ||
        lowerCase(v.description).indexOf(lowerCase(search)) > -1,
    )
    .filter((v) => !service_ids?.length || service_ids.includes(v.service_id))
    .filter(
      (v) =>
        !asset_type_ids?.length || asset_type_ids.includes(v.asset_type_id),
    )
    .filter((v) => !platforms?.length || platforms.includes(v.platform))
    .filter((v) => !policy_type?.length || policy_type.includes(v.policy_type))
    .filter((v) => !severity?.length || severity.includes(v.severity));
};
export const getPolicies = (nodes, filters?: Record<string, any>) => {
  if (!nodes?.length || !policyFilterIsEmpty) {
    return nodes;
  }
  const _nodes = cloneDeep(nodes);
  function loop(nodes: API_COMPLIANCE.ComplianceInfoData[]) {
    if (!nodes?.length) {
      return;
    }
    nodes.forEach((node) => {
      let _policies: API_COMPLIANCE.ChildPolicy[] | undefined = node.policies;

      if (_policies?.length) {
        node.policies = filterPolicies(_policies, filters);
      }
      if (node.children?.length) {
        loop(node.children);
      }
    });
  }
  loop(_nodes);
  setPolicyCount(_nodes);
  return _nodes;
};
