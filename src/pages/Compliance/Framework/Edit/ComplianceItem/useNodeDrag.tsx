import { TreeProps } from 'antd';
import { toString } from 'lodash';
import { ComplianceBack } from './useCompliance';
import { getNewKey, getNode, SPLIT_KEY_REG } from './util';

const useNodeDrag = ({
  treeData,
  addNode,
  updatePolicyCount,
  removeNode,
  editNode,
}: Pick<
  ComplianceBack,
  'treeData' | 'addNode' | 'updatePolicyCount' | 'removeNode'
>) => {
  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    const { dropToGap, dragNode, node, dropPosition } = info;

    if (
      (node.type === 'requirement' && !dropToGap) ||
      (editNode && !editNode?.title)
    ) {
      return;
    }

    function loop(
      data: API_COMPLIANCE.ComplianceInfoData,
      pNode: API_COMPLIANCE.ComplianceInfoData,
    ) {
      const { level: pLevel = 0, key: pKey } = pNode;
      const { policy_count = 0, tags, type, title, _key, policies } = data;
      const v = {
        policy_count,
        tags,
        type,
        title,
        _key,
        key: getNewKey(pKey as string),
        level: pLevel + 1,
        policies,
      };

      addNode(v, pKey, dropPosition === -1 ? 0 : dropPosition);
      data?.children?.length &&
        data?.children?.forEach((item) => {
          loop(item, v);
        });
    }

    if (dropToGap) {
      const pathItems = toString(node.key).split(SPLIT_KEY_REG);
      const len = pathItems.length;
      if (len > 1) {
        const pNode =
          getNode(pathItems.slice(0, len - 1).join(SPLIT_KEY_REG), treeData) ??
          {};
        loop(dragNode, pNode);
        const { policy_count: curPolicyCount } = dragNode;
        updatePolicyCount(pNode.key, curPolicyCount);
      } else {
        loop(dragNode, { level: -1, key: undefined });
      }
      removeNode(dragNode.key);
      return;
    }

    const { policy_count: curPolicyCount } = dragNode;
    loop(dragNode, node);
    removeNode(dragNode.key);
    updatePolicyCount(node.key, curPolicyCount);
  };
  return { onDragEnter, onDrop };
};

export default useNodeDrag;
