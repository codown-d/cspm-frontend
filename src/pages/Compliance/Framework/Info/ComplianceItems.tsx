import { TzCard } from '@/components/lib/tz-card';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useServiceFilterItem from '@/hooks/filterItems/useServiceFilterItem';
import ItemsTree, {
  IItemsTree,
} from '@/pages/components/CoplianceDetailTree/ItemsTree';
import { getAllNodeKey } from '@/pages/components/CoplianceDetailTree/util';
import PolicyFilters from '@/pages/components/PolicyList/PolicyFilters';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { sumBy } from 'lodash';
import { Key, memo, useMemo, useState } from 'react';
import RenderLists from '../components/RenderLists';

export type ICoplianceDetailTree = IItemsTree & {
  onlyCompliance?: boolean;
  setOnlyCompliance?: (arg: boolean) => void;
  filterCompliancePolicies?: (filter: any, services: any) => void;
};
function ComplianceItems(
  props: Pick<ICoplianceDetailTree, 'treeData' | 'filterCompliancePolicies'>,
) {
  const { treeData } = props;
  const intl = useIntl();
  const sum = useMemo(
    () => sumBy(treeData, (node) => node?.policy_count ?? 0),
    [treeData],
  );
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();
  useUpdateEffect(() => {
    setExpandedKeys(getAllNodeKey(treeData));
  }, [treeData]);

  const renderPolicyListFn = useMemoizedFn((policies, node) => (
    <RenderLists policies={policies} nodeKey={node.key} noActionCol />
  ));
  const assetTypeItem = useServiceFilterItem();
  const { platformItem, policyTypeItem } = useCommonFilterItem();
  const defaultFilterOpt = useMemo(
    () => ({
      platformItem,
      assetTypeItem,
      policyTypeItem,
    }),
    [platformItem, assetTypeItem, policyTypeItem],
  );

  const handleFilterChange = useMemoizedFn((data) => {
    props.filterCompliancePolicies?.(data, assetTypeItem?.props?.options);
  });
  return (
    <TzCard
      className="mt-3 pb-4"
      headStyle={{ paddingBottom: 0 }}
      bodyStyle={{ paddingBlock: '4px 0' }}
      title={
        <span>
          {intl.formatMessage({ id: 'complianceItem' })}
          <span className="font-normal text-[#6C7480]">（{sum}）</span>
        </span>
      }
    >
      <PolicyFilters {...defaultFilterOpt} onChange={handleFilterChange} />

      <ItemsTree
        renderPolicyList={renderPolicyListFn}
        {...props}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
      />
    </TzCard>
  );
}

export default memo(ComplianceItems);
