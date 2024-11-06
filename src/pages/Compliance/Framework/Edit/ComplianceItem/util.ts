import { flatten, get, isNumber, toString, uniqueId } from 'lodash';
import { Key } from 'react';
import {
  AddAction,
  UpdateNodeTagsAction,
  UpdatePolicyCountAction,
  deleteTagAction,
} from './interface';

export const SPLIT_KEY_REG = '-';
// export const getNewKey = (idx: number = 0, parentKey?: string) => {
//   const level = parentKey?.split(SPLIT_KEY_REG).length ?? 0;
//   const prefix = `${idx}.`;
//   return uniqueId(
//     parentKey ? `${parentKey}${SPLIT_KEY_REG}${prefix}` : `${prefix}`,
//   );
// };
export const getNewKey = (parentKey?: Key) => {
  // const level = parentKey?.split(SPLIT_KEY_REG).length ?? 0;
  // const prefix = `${idx}.`;
  return uniqueId(parentKey ? `${parentKey}${SPLIT_KEY_REG}` : ``);
};
export const getNode = (
  key: Key,
  nodes: API_COMPLIANCE.ComplianceInfoData[],
) => {
  const pathItems = toString(key).split(SPLIT_KEY_REG);
  const len = pathItems.length;
  let node: API_COMPLIANCE.ComplianceInfoData | undefined;
  function loop(data?: API_COMPLIANCE.ComplianceInfoData[], idx = 0) {
    if (!data?.length) {
      return;
    }
    const path = pathItems.slice(0, idx + 1).join(SPLIT_KEY_REG);
    data.forEach((item) => {
      if (item.key === path) {
        idx === len - 1 && (node = item);
        loop(item?.children, ++idx);
      }
    });
  }
  loop(nodes);
  return node;

  // return node;
};

export const getPath = (key: Key) => {
  const pathItems = toString(key).split(SPLIT_KEY_REG);
  const path = flatten(
    pathItems.map((item, level) => {
      const [idx] = item.split('.');
      return [idx, 'children'];
    }),
  );
  path.pop();
  return path;
};
export const getParentPath = (key: Key) => {
  const pathItems = toString(key).split(SPLIT_KEY_REG);
  if (pathItems.length < 2) {
    return undefined;
  }
  pathItems.pop();
  const path = getPath(pathItems.join(SPLIT_KEY_REG));
  return path;
};
export const addNode = (
  nodes: API_COMPLIANCE.ComplianceInfoData[],
  payload: AddAction['payload'],
) => {
  const { node, parentKey, index } = payload;
  const { tags } = node;

  if (!parentKey) {
    isNumber(index) ? nodes.splice(index, 0, node) : nodes.push(node);
    return;
  }
  const parentNode = getNode(parentKey, nodes);
  if (!parentNode) {
    return;
  }
  const pTags = parentNode.tags?.map((v) => v.key);
  const _tags =
    tags
      ?.filter((v) => !pTags?.includes(v.key))
      .map((v) => ({ ...v, user_set: true })) ?? [];
  const extendTags =
    parentNode.tags?.map((v: API_COMPLIANCE.DatumTag) => ({
      ...v,
      user_set: false,
    })) ?? [];
  const withTags = {
    ...node,
    tags: [...extendTags, ..._tags],
  };
  if (parentNode.children) {
    const len = parentNode.children?.length;
    parentNode.children.splice(index ?? len, 0, withTags);
    return;
  }
  parentNode.children = [withTags];
};
const updateChildrenData = (
  nodes: API_COMPLIANCE.ComplianceInfoData[],
  key: string,
  newData: Partial<API_COMPLIANCE.ComplianceInfoData>,
) => {
  for (const node of nodes) {
    if (node.key === key) {
      if (node.children) {
        node.children.forEach((child) => {
          Object.assign(child, newData);
        });
      }
      return;
    }
    if (node.children) {
      updateChildrenData(node.children, key, newData);
    }
  }
};

// 更新检测项计数,参数中的policy_count为增量数
export const updatePolicyCount = (
  nodes: API_COMPLIANCE.ComplianceInfoData[],
  payload: UpdatePolicyCountAction['payload'],
) => {
  const { policy_count, key: nodeKey } = payload;
  const keys = toString(nodeKey).split(SPLIT_KEY_REG);
  let path: string;
  keys.map((key, idx) => {
    path = path ? `${path}-${key}` : key;
    const node = getNode(path, nodes);
    if (!node) {
      return;
    }
    const _policy_count = get(node, 'policy_count') ?? 0;
    node.policy_count = _policy_count + policy_count;
  });
};
const getExtraTags = (
  tags: API_COMPLIANCE.DatumTag[],
  draftTags: API_COMPLIANCE.DatumTag[],
) => {
  return tags.filter((v) => !draftTags.some((i) => i.key === v.key));
};
const updateChildrenNodeTags = (
  node: API_COMPLIANCE.ComplianceInfoData,
  tags: API_COMPLIANCE.DatumTag[],
) => {
  if (!node.tags?.length) {
    node.tags = tags;
  } else {
    node.tags?.forEach((element) => {
      const newTag = tags.find((v) => v.key === element.key);
      newTag && Object.assign(element, newTag);
    });

    const extraTags = getExtraTags(tags, node.tags);
    extraTags?.length && node.tags?.push(...extraTags);
  }
};
// 继承tags
const updateChildrenTags = (
  nodes: API_COMPLIANCE.ComplianceInfoData[],
  tags: API_COMPLIANCE.DatumTag[],
) => {
  nodes?.map((item) => {
    updateChildrenNodeTags(item, tags);
    if (item.children?.length) {
      updateChildrenTags(item.children, tags);
    }
  });
};
// 更新tag
export const updateNodeTags = (
  nodes: API_COMPLIANCE.ComplianceInfoData[],
  payload: UpdateNodeTagsAction['payload'],
) => {
  const tags = payload.tags?.map((v) => ({
    ...v,
    user_set: typeof v['user_set'] !== 'boolean' || v['user_set'] === true,
  }));
  const curNode = getNode(payload.key, nodes);
  if (!curNode) {
    return;
  }
  updateChildrenNodeTags(curNode, tags);

  if (curNode.children?.length) {
    updateChildrenTags(
      curNode.children,
      payload.tags.map((v) => ({ ...v, user_set: false })),
    );
  }
};

const deleteChildrenTag = (
  node: API_COMPLIANCE.ComplianceInfoData,
  tagKey: string,
) => {
  if (node.children?.length) {
    node.children.forEach((item) => {
      const index =
        item?.tags?.findIndex(
          (v: API_COMPLIANCE.DatumTag) => v.key === tagKey,
        ) ?? -1;
      index !== -1 && item.tags?.splice(index, 1);
      deleteChildrenTag(item, tagKey);
    });
  }
};
//删除tag
export const deleteTag = (
  nodes: API_COMPLIANCE.ComplianceInfoData[],
  payload: deleteTagAction['payload'],
) => {
  const { nodeKey, tagKey } = payload;
  // const curNodePath = getPath(nodeKey);

  // const curNode: API_COMPLIANCE.ComplianceInfoData = get(nodes, curNodePath);
  const curNode = getNode(nodeKey, nodes);
  if (!curNode) {
    return;
  }
  const curTag = get(curNode, 'tags');
  const index = curTag.findIndex(
    (v: API_COMPLIANCE.DatumTag) => v.key === tagKey,
  );
  index !== -1 && curTag.splice(index, 1);

  deleteChildrenTag(curNode, tagKey);
};
export const removeNode = (
  key: Key,
  nodes: API_COMPLIANCE.ComplianceInfoData[],
) => {
  // const parentPath = getParentPath(key);
  const pathItems = toString(key).split(SPLIT_KEY_REG);
  const len = pathItems.length;

  if (len > 1) {
    const parentPathNode = getNode(
      pathItems.slice(0, len - 1).join(SPLIT_KEY_REG),
      nodes,
    );

    const parentNodeChildren = parentPathNode?.children;
    const index =
      parentNodeChildren?.findIndex(
        (v: API_COMPLIANCE.ComplianceInfoData) => v.key === key,
      ) ?? -1;
    const curPolicyCount =
      get(parentNodeChildren, [index, 'policy_count']) ?? 0;
    index !== -1 && parentNodeChildren?.splice(index, 1);

    const { key: pKey } = parentPathNode ?? {};
    pKey &&
      curPolicyCount &&
      updatePolicyCount(nodes, { policy_count: 0 - curPolicyCount, key: pKey });
  } else {
    const index = nodes.findIndex((v) => v.key === key) ?? -1;
    index !== -1 && nodes?.splice(index, 1);
  }
  // if (parentPath) {
  //   const parentNodeChildren = get(nodes, parentPath)?.children;
  //   const index =
  //     parentNodeChildren?.findIndex(
  //       (v: API_COMPLIANCE.ComplianceInfoData) => v.key === key,
  //     ) ?? -1;
  //   index !== -1 && parentNodeChildren?.splice(index, 1);
  // } else {
  //   const index = nodes.findIndex((v) => v.key === key) ?? -1;
  //   index !== -1 && nodes?.splice(index, 1);
  // }
};
export const isRootOnlyNode = (
  key: Key,
  nodes: API_COMPLIANCE.ComplianceInfoData[],
) => {
  const pathItems = toString(key).split(SPLIT_KEY_REG);
  // const parentPath = getParentPath(key);
  return pathItems?.length === 1 && nodes.length < 2;
};
type UpdateNodePoliciesParamsType = {
  key: Key;
  policies: API.CommonPolicyItem[];
  idx?: number;
  nodes: API_COMPLIANCE.ComplianceInfoData[];
};
//更新检测项
export const updateNodePolicies = (params: UpdateNodePoliciesParamsType) => {
  const { key, policies, idx = -1, nodes } = params;

  // const curNode: API_COMPLIANCE.ComplianceInfoData = get(nodes, getPath(key));
  const curNode = getNode(key, nodes);
  if (!curNode) {
    return;
  }
  if (!curNode?.policies) {
    // set(curNode, 'policies', []);
    curNode['policies'] = [];
  }
  const curNodePolicies = curNode.policies;
  const policy_type = get(policies, [0, 'policy_type']);

  if (policy_type === 'manual') {
    const policyId = policies[0].id;
    const index =
      curNodePolicies?.findIndex(
        (v: API.CommonPolicyItem) => v.id === policyId,
      ) ?? -1;

    // 新增
    if (index === -1) {
      curNodePolicies?.unshift(...policies);
      return;
    }
    curNodePolicies[index] = policies[0];
    return;
  }
  const mData = curNodePolicies?.filter(
    (item) => item.policy_type === 'manual',
  );
  curNode.policies = [...policies, ...mData];
};
type RemoveNodePolicyParamsType = {
  key: Key;
  policyId: Key;
  nodes: API_COMPLIANCE.ComplianceInfoData[];
};
// 删除一项检测项
export const removeNodePolicy = (params: RemoveNodePolicyParamsType) => {
  const { key, policyId, nodes } = params;

  const curNode = getNode(key, nodes);
  if (!curNode) {
    return;
  }
  const curNodePolicies: API.CommonPolicyItem[] = get(curNode, 'policies');
  const index =
    curNodePolicies?.findIndex(
      (v: API.CommonPolicyItem) => v.id === policyId,
    ) ?? -1;
  index !== -1 && curNodePolicies?.splice(index, 1);
};
// 清空当前要求的检测项
export const clearNodePolicy = (
  nodes: API_COMPLIANCE.ComplianceInfoData[],
  key: Key,
) => {
  // const curNodePath = getPath(key);
  // const curNode: API_COMPLIANCE.ComplianceInfoData = get(nodes, curNodePath);
  // const curNodePolicies: API.CommonPolicyItem[] = get(nodes, [
  //   ...getPath(key),
  //   'policies',
  // ]);

  const curNode = getNode(key, nodes);
  if (!curNode) {
    return;
  }
  const curNodePolicies: API.CommonPolicyItem[] = get(curNode, 'policies');

  if (!!curNodePolicies?.length) {
    updatePolicyCount(nodes, { key, policy_count: -curNodePolicies?.length });
    // curNode.policies = undefined
    delete curNode.policies;
  }
};
// export const moveNode = (nodes,dragNode, targeNode) => {
//   if(isEmpty(dragNode) || isEmpty(targeNode)){
//     return nodes
//   }
//   const {key:dragNodeKey,children:dragNodeChildren} = dragNode
//   const {key,children,tags} = targeNode
//   let node: API_COMPLIANCE.ComplianceInfoData | undefined;
//   function loop(data?: API_COMPLIANCE.ComplianceInfoData, idx = 0) {
//     if (!data?.children?.length) {
//       return;
//     }
//     data?.children?.forEach(item => )

//   }
//   loop(dragNodeChildren);
//   return node;

// }
