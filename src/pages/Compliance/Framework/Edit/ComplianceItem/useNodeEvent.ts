import { useMemoizedFn } from 'ahooks';
import { Key, useContext } from 'react';
import { ComplianceBack, ComplianceContext } from './useCompliance';

type EventBack = ComplianceBack & {
  deleteNode: (key: Key) => void;
  newNode: ComplianceBack['addNode'];
  handleTagAssign: (key: Key, tags: API_COMPLIANCE.DatumTag[]) => void;
  handleTypeChange: (key: Key, type: string) => void;
  handleTitleChange: (
    key: Key,
    data: Pick<API_COMPLIANCE.ComplianceInfoData, 'title' | 'type'>,
  ) => void;
};
const useNodeEvent = (): EventBack => {
  const obj = useContext(ComplianceContext);
  const {
    setEditNode,
    expandedKeys = [],
    onExpand,
    addNode,
    editNode,
    updateNodeTags,
    setSelectedKeys,
    removeNode,
    selectedKeys,
    updateNode,
    clearPolicy,
  } = obj;

  // 添加新节点
  const newNode = useMemoizedFn(
    (node: API_COMPLIANCE.ComplianceInfoData, key?: Key) => {
      if (editNode && !editNode?.title) {
        return;
      }
      addNode(node, key);
      setTimeout(() => {
        !!key &&
          onExpand?.([...expandedKeys, key], {
            expanded: true,
            node,
          });
        setEditNode(node);
        setSelectedKeys([node.key]);
      });
    },
  );

  const handleTagAssign = useMemoizedFn(
    (key: Key, tags: API_COMPLIANCE.DatumTag[]) => {
      updateNodeTags(key, tags);
    },
  );

  const deleteNode = useMemoizedFn((key: Key) => {
    removeNode(key);
    editNode?.key === key && setEditNode(undefined);
    selectedKeys?.includes(key) && setSelectedKeys(undefined);
  });
  // 新增自定义检测项
  const handleCusPolicy = useMemoizedFn(
    (Key: Key, policy: API_COMPLIANCE.ChildPolicy) => {},
  );
  const handleTitleChange = useMemoizedFn((key: Key, data) => {
    if (editNode && editNode?.key === key) {
      setEditNode((prev) => ({ ...prev, ...data }));
      updateNode?.(key as string, data);
    }
  });
  const handleTypeChange = useMemoizedFn((key: Key, type: string) => {
    handleTitleChange(key, { type });
    type === 'catalog' && clearPolicy(key);
  });

  return {
    ...obj,
    newNode,
    deleteNode,
    handleTagAssign,
    handleTitleChange,
    handleTypeChange,
  };
};
export default useNodeEvent;
