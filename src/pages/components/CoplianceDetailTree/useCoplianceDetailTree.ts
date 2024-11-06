import { useMemoizedFn } from 'ahooks';
import { Key, useState } from 'react';

function CoplianceDetailTree() {
  const [policyexpanded, setPolicyExpanded] = useState<Key[]>();

  const handleNodeSelect = useMemoizedFn((node) => {
    node?.type === 'requirement' &&
      !!node.policy_count &&
      setPolicyExpanded((prev) => {
        if (prev?.includes(node.key)) {
          return prev?.filter((v) => v !== node.key);
        } else {
          1;
          return [...(prev || []), node.key];
        }
      });
  });

  return { handleNodeSelect, policyexpanded };
}
export default CoplianceDetailTree;
