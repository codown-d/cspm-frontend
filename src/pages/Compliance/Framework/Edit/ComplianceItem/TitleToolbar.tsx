import { TzButton } from '@/components/lib/tz-button';
import { EN_LANG } from '@/locales';
import AssignTags, { IAssignTags } from '@/pages/components/AssignTags';
import { getLocale, useIntl } from '@umijs/max';
import { Space } from 'antd';
import { memo, useMemo, useState } from 'react';
import CusPolicy from '../Policy/CusPolicy';
import Policy from '../Policy/index';
import TitleDelete from './TitleDelete';
import useNodeEvent from './useNodeEvent';
import { getNewKey, isRootOnlyNode } from './util';

type ITitleToolbar = {
  nodeData: API_COMPLIANCE.ComplianceInfoData;
  show?: boolean;
  isEditDefalut?: boolean;
  handleNodeSelect?: (arg: API_COMPLIANCE.ComplianceInfoData) => void;
};
function TitleToolbar({
  nodeData,
  show,
  isEditDefalut,
  handleNodeSelect,
}: ITitleToolbar) {
  const {
    type = 'catalog',
    key,
    level = 0,
    tags,
    policies: nodePolicies,
  } = nodeData;
  const intl = useIntl();
  const [assignTagObj, setAssignTagObj] = useState<IAssignTags>();
  const [cusPolicyObj, setCusPolicyObj] =
    useState<API_COMPLIANCE.ChildPolicy>();
  const [policyObj, setPolicyObj] = useState<API_COMPLIANCE.ChildPolicy>();

  const {
    newNode,
    handleTagAssign,
    updatePolicy,
    policies,
    setSelectedKeys,
    treeData,
    updatePolicyCount,
    editNode,
    setValidateFail,
    deleteNode,
    hideNodeDeleteTip,
    setHideNodeDeleteTip,
    refreshTags,
    tagList,
    manual_type_name,
    onExpand,
  } = useNodeEvent();
  const programPolicyIds = useMemo(() => {
    return nodePolicies
      ?.filter((v) => v.policy_type !== 'manual')
      .map((v) => v.id);
  }, [nodePolicies]);
  const btnCls = useMemo(() => {
    const isEn = getLocale() === EN_LANG;
    return isEn ? '!max-w-[86px] text-wrap !h-[26px] mt-1 leading-[13px]' : '';
  }, []);
  return (
    <div
      key={key}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {show && (
        <div
          onClick={() => setSelectedKeys([key])}
          className="inline-flex ml-3"
        >
          <Space size={4}>
            {type === 'catalog' && !isEditDefalut && (
              <TzButton
                size="small"
                type="text"
                className={btnCls}
                onClick={() => {
                  newNode(
                    {
                      key: getNewKey(key as string),
                      level: level + 1,
                      type: 'catalog',
                    },
                    key as string,
                  );
                }}
              >
                {intl.formatMessage({ id: 'addSubdirectory' })}
              </TzButton>
            )}
            <TzButton
              size="small"
              type="text"
              className={btnCls}
              onClick={() => {
                setAssignTagObj({
                  tags,
                  disabledTags: tags?.filter((v) => !v.user_set),
                  // .map((v) => v.key),
                });
              }}
            >
              {intl.formatMessage({ id: 'choiceTags' })}
            </TzButton>
            {type === 'requirement' && !isEditDefalut && (
              <>
                <TzButton
                  className={btnCls}
                  size="small"
                  type="text"
                  onClick={() => {
                    setCusPolicyObj({});
                  }}
                >
                  {intl.formatMessage({ id: 'customDetectionItems' })}
                </TzButton>
                <TzButton
                  size="small"
                  type="text"
                  className={btnCls}
                  onClick={() => {
                    setPolicyObj({});
                  }}
                >
                  {intl.formatMessage({ id: 'choicePolicies' })}
                </TzButton>
              </>
            )}
            {!isRootOnlyNode(key, treeData) && !isEditDefalut && (
              <TitleDelete
                onOk={() => {
                  deleteNode(key);
                  key === editNode?.key && setValidateFail(false);
                }}
                hideDeleteTip={hideNodeDeleteTip}
                setHideDeleteTip={setHideNodeDeleteTip}
              />
            )}
          </Space>
        </div>
      )}
      {!!assignTagObj && (
        <AssignTags
          onCancel={() => setAssignTagObj(undefined)}
          // onOk={(v) => handleTagAssign(key, v)}
          onOk={(v) => {
            handleTagAssign(key, v);
            setAssignTagObj(undefined);
          }}
          tagList={tagList}
          refreshTags={refreshTags}
          {...assignTagObj}
        />
      )}
      {!!cusPolicyObj && (
        <CusPolicy
          onOk={(vals) => {
            updatePolicy({
              policies: [
                {
                  ...vals,
                  id: `${+new Date()}`,
                  policy_type: 'manual',
                  policy_type_name: manual_type_name,
                },
              ],
              key,
            });
            updatePolicyCount(key, 1);
            handleNodeSelect?.(nodeData);
          }}
          onCancel={() => setCusPolicyObj(undefined)}
        />
      )}
      {!!policyObj && (
        <Policy
          onOk={(vals) => {
            updatePolicy({
              policies: vals.map((item) => policies.find((v) => v.id === item)),
              key,
            });
            updatePolicyCount(
              key,
              vals.length - (programPolicyIds?.length ?? 0),
            );
            handleNodeSelect?.(nodeData);
          }}
          nodePolicyIds={programPolicyIds}
          policies={policies}
          onCancel={() => setPolicyObj(undefined)}
        />
      )}
    </div>
  );
}

export default memo(TitleToolbar);
