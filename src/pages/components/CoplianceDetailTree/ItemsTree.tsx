import TzTree from '@/components/lib/TzTree';
import useTags from '@/hooks/useTags';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { Dispatch, Key, SetStateAction, memo, useState } from 'react';
import RenderTitle, { RenderTitleProps } from './RenderTitle';
import styles from './index.less';

export type IItemsTree = Pick<RenderTitleProps, 'renderPolicyList'> & {
  treeData: API_COMPLIANCE.ComplianceInfoData[];
  expandedKeys?: Key[];
  setExpandedKeys: Dispatch<SetStateAction<Key[] | undefined>>;
};
function ItemsTree(props: IItemsTree) {
  const { treeData, renderPolicyList, expandedKeys, setExpandedKeys } = props;
  const [policyexpanded, setPolicyExpanded] = useState<Key[]>();

  const { tags } = useTags();
  const handleNodeSelect = useMemoizedFn((node) => {
    node?.type === 'requirement' &&
      setPolicyExpanded((prev) => {
        if (prev?.includes(node.key)) {
          return prev?.filter((v) => v !== node.key);
        } else {
          return [...(prev || []), node.key];
        }
      });
  });
  const onSelectFn = useMemoizedFn((_, { node }) => handleNodeSelect(node));
  const titleRenderFn = useMemoizedFn((nodeData) => (
    <RenderTitle
      tagList={tags}
      handleNodeSelect={handleNodeSelect}
      policyexpanded={!!policyexpanded?.includes(nodeData.key)}
      nodeData={nodeData}
      renderPolicyList={renderPolicyList}
    />
  ));
  const switcherIconFn = useMemoizedFn(({ expanded }: any) => (
    <i
      className={classNames(
        'icon iconfont icon-arrow w-6 h-6 rounded text-lg',
        !expanded ? '-rotate-90' : '',
      )}
    />
  ));

  return (
    <TzTree.DirectoryTree
      expandedKeys={expandedKeys}
      onExpand={setExpandedKeys}
      multiple
      className={classNames('-mt-1', styles.itemsTree)}
      //   defaultExpandedKeys={expandedKeys}
      //   expandedKeys={expandedKeys}
      //   onExpand={onExpand}
      blockNode
      // onDrop={onDrop}
      treeData={treeData}
      onSelect={onSelectFn}
      selectedKeys={undefined}
      switcherIcon={switcherIconFn}
      titleRender={titleRenderFn}
    />
  );
}

export default memo(ItemsTree);
