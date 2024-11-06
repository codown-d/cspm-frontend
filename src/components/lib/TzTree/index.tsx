import { Tree, TreeProps } from 'antd';
import { useMemo } from 'react';
import './index.less';

export type TzTreeProps = TreeProps & {};
const TzTree = (props: TzTreeProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: `tz-tree ${props.className || ''}`,
    };
  }, [props]);
  return <Tree {...realProps} />;
};
TzTree.DirectoryTree = Tree.DirectoryTree;
TzTree.TreeNode = Tree.TreeNode;
export default TzTree;
