import classNames from 'classnames';
import React, { CSSProperties, memo, useContext } from 'react';
import RenderTitle from './RenderTitle';
import { ComplianceContext } from './useCompliance';

import TzTree from '@/components/lib/TzTree';
import styles1 from '@/pages/components/CoplianceDetailTree/index.less';
import useCoplianceDetailTree from '@/pages/components/CoplianceDetailTree/useCoplianceDetailTree';
import useNodeDrag from './useNodeDrag';

type IComplianceTree = { styles?: CSSProperties; isEditDefalut?: boolean };
const ComplianceTree: React.FC<IComplianceTree> = ({
  styles,
  isEditDefalut,
}) => {
  const {
    treeData,
    expandedKeys,
    setSelectedKeys,
    selectedKeys,
    onExpand,
    addNode,
    updatePolicyCount,
    removeNode,
    editNode,
  } = useContext(ComplianceContext);
  const { handleNodeSelect, policyexpanded } = useCoplianceDetailTree();
  const { onDragEnter, onDrop } = useNodeDrag({
    addNode,
    updatePolicyCount,
    removeNode,
    treeData,
    editNode,
  });
  return (
    <TzTree.DirectoryTree<API_COMPLIANCE.ComplianceInfoData>
      className={classNames('draggable-tree', styles1.itemsTree)}
      defaultExpandedKeys={expandedKeys}
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      draggable={!isEditDefalut}
      blockNode
      // allowDrop={({ dropNode }) => dropNode?.type === 'catalog'}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      treeData={treeData}
      onSelect={(keys, { node }) => {
        handleNodeSelect(node);
        setSelectedKeys?.(keys);
      }}
      selectedKeys={selectedKeys}
      switcherIcon={({ expanded }: any) => (
        <i
          className={classNames(
            'icon iconfont icon-arrow w-6 h-6 rounded text-lg',
            !expanded ? '-rotate-90' : '',
          )}
        />
      )}
      titleRender={(nodeData) => (
        <RenderTitle
          key={nodeData.key}
          handleNodeSelect={handleNodeSelect}
          policyexpanded={policyexpanded?.includes(nodeData.key)}
          nodeData={nodeData}
        />
      )}
    />
  );
};

export default memo(ComplianceTree);
