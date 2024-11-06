import TzTypography from '@/components/lib/TzTypography';
import classNames from 'classnames';
import { get, hasIn } from 'lodash';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  memo,
  useContext,
  useMemo,
} from 'react';
import RenderAssignTag from '../RenderAssignTag';
import ComplianceDetailContext from './ComplianceDetailContext';

export type RenderTitleProps = {
  tagList?: API_TAG.TagsDatum[];
  renderPolicyList?: (
    items: API_COMPLIANCE.ChildPolicy[],
    node: API_COMPLIANCE.ComplianceInfoData,
  ) => ReactNode;
  nodeData:
    | API_COMPLIANCE.ComplianceInfoData
    | API_COMPLIANCE.ComplianceWithRisksDatum;
  policyexpanded?: boolean;
  handleNodeSelect: Dispatch<SetStateAction<API_COMPLIANCE.ComplianceInfoData>>;
};
const STATUS_ICON = {
  warn: 'text-[#FF8A34] icon-jinggao',
  passed: 'text-[#52C41A] icon-chenggong',
  unpassed: 'text-[#E95454] icon-shibai',
  unscan: 'text-[#B3BAC6] icon-weijiance',
};
function RenderTitle(props: RenderTitleProps) {
  const {
    nodeData,
    renderPolicyList,
    tagList,
    handleNodeSelect,
    policyexpanded,
  } = props;
  const {
    type = 'catalog',
    key,
    title,
    policy_count,
    policies,
    tags,
    risks_count,
    status,
  } = nodeData;
  const isRiskTree = hasIn(nodeData, 'risks_count');
  const noPolicies = status === 'invalid';
  const { filter } = useContext(ComplianceDetailContext);
  const RiskList = useMemo(() => {
    if (!(type === 'requirement' && policyexpanded)) {
      return null;
    }
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {renderPolicyList?.(policies, nodeData)}
      </div>
    );
  }, [filter, nodeData, policies, renderPolicyList, policyexpanded]);
  return (
    <div>
      {
        type === 'requirement' && (
          // (!!policies?.length || platforms?.length > 0) && (
          <div
            className={classNames(
              'compliance-tree-arrow w-6 h-6 inline-flex justify-center items-ceter rounded',
              {
                '-rotate-90': !policyexpanded,
              },
            )}
          >
            <i
              className={classNames('icon iconfont icon-arrow  text-lg')}
              onClick={(e) => {
                handleNodeSelect(nodeData);
                e.stopPropagation();
              }}
            />
          </div>
        )
        // )
      }
      <div className="h-7 flex items-center title-row px-[3px]">
        {isRiskTree &&
          (!noPolicies ? (
            <span
              className={classNames(
                'icon iconfont mr-2 inline-block text-[10px]',
                get(STATUS_ICON, status),
              )}
            />
          ) : (
            <span className="inline-block w-[10px] h-[10px] rounded-md bg-[#D7DBE2] mr-2" />
          ))}
        <div
          className={classNames('font-medium inline-block max-w-[60vw]', {
            'text-[#B3BAC6]': isRiskTree && noPolicies,
          })}
        >
          <TzTypography.Text
            ellipsis={{
              tooltip: title,
            }}
          >
            {title ? title : '-'}
          </TzTypography.Text>
        </div>
        {!isRiskTree && !!policy_count && (
          <span className="text-[#2177D1] font-medium px-1">
            {policy_count}
          </span>
        )}
        {isRiskTree && !!risks_count && type === 'catalog' && (
          <span className="text-[#E95454] font-medium px-1">{risks_count}</span>
        )}

        {!!tags?.length && (
          <RenderAssignTag
            tagList={tagList}
            className="ml-1"
            nodeTags={tags?.map(({ user_set, ...rest }) => rest)}
          />
        )}
      </div>
      {RiskList}
    </div>
  );
}

export default memo(RenderTitle);
