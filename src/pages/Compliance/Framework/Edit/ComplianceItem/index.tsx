import { TzCard } from '@/components/lib/tz-card';
import { usePolicyTypeEnum } from '@/hooks/enum/usePolicyTypeEnum';
import { usePolicy } from '@/hooks/usePolicy';
import useTags from '@/hooks/useTags';
import { useIntl } from '@umijs/max';
import { useMount, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { get, sumBy } from 'lodash';
import {
  ForwardedRef,
  Key,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
} from 'react';
import AddNodeBtn from './AddNodeBtn';
import ComplianceTree from './ComplianceTree';
import styles from './index.less';
import useCompliance, { ComplianceContext } from './useCompliance';

type ComplianceItemProps = {
  editType?: string;
  isEditDefalut?: boolean;
  initialState?: API_COMPLIANCE.ComplianceInfoData[];
};
export type TComplianceItemRefFn = {
  validate: () => Promise<API_COMPLIANCE.ComplianceInfoData[] | undefined>;
  getData: () => undefined | API_COMPLIANCE.ComplianceInfoData[];
};
function ComplianceItem(
  props: ComplianceItemProps,

  ref: ForwardedRef<TComplianceItemRefFn>,
) {
  const { initialState, editType, isEditDefalut, hanleFormChange } = props;
  const policies = usePolicy();

  const intl = useIntl();
  const { tags, refreshTags } = useTags();
  const value = useCompliance({
    treeData: initialState,
    editNode: editType === 'new' ? initialState?.[0] : undefined,
  });
  const { treeData, validateFail, editNode, onExpand } = value;
  const { PolicyTypeEnum } = usePolicyTypeEnum();

  useImperativeHandle(ref, () => {
    return {
      getData() {
        return value.treeData;
      },
      async validate() {
        if (!value.editNode) {
          return Promise.resolve(value.treeData);
        }
        return !value.editNode?.title
          ? Promise.reject()
          : Promise.resolve(value.treeData);
      },
    };
  });

  const validateFailInfo = useMemo(() => {
    return intl.formatMessage({
      id:
        get(editNode, 'type') === 'requirement'
          ? 'complianceRequirementName'
          : 'directoryName',
    });
  }, [validateFail, editNode]);
  const sum = useMemo(
    () => sumBy(treeData, (node) => node?.policy_count ?? 0),
    [treeData],
  );

  useMount(() => {
    if (!treeData?.length) {
      return;
    }
    const keys: Key[] = [];
    function loop(nodes) {
      nodes.forEach((v) => {
        keys.push(v.key);
        if (v.children) {
          loop(v.children);
        }
      });
    }
    loop(treeData);
    onExpand(keys);
  });

  const manual_type_name = useMemo(
    () => get(PolicyTypeEnum, 'manual')?.label,
    [PolicyTypeEnum],
  );

  useUpdateEffect(() => {
    hanleFormChange?.();
  }, [value.treeData]);

  return (
    <ComplianceContext.Provider
      value={{
        ...value,
        policies,
        manual_type_name,
        isEditDefalut,
        tagList: tags,
        refreshTags,
      }}
    >
      <TzCard
        className={classNames('mt-3 pb-4', styles.complianceItem, {
          [styles.hasError]: validateFail,
        })}
        headStyle={{ paddingBottom: 0 }}
        bodyStyle={{ paddingBlock: '4px 0' }}
        title={
          <span
            className={classNames({ [styles.errorInfo]: !!validateFailInfo })}
          >
            {intl.formatMessage({ id: 'complianceItem' })}
            <span className="font-normal text-[#6C7480]">（{sum}）</span>
            {validateFail && (
              <span className={styles.errorInfoTxt}>
                {intl.formatMessage(
                  { id: 'requiredTips' },
                  { name: validateFailInfo },
                )}
              </span>
            )}
          </span>
        }
      >
        <ComplianceTree styles={styles} isEditDefalut={isEditDefalut} />
        <AddNodeBtn idx={treeData?.length} />
      </TzCard>
    </ComplianceContext.Provider>
  );
}

export default memo(forwardRef(ComplianceItem));
