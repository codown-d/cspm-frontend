import TzTypography from '@/components/lib/TzTypography';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import { EN_LANG } from '@/locales';
import { getLocale, useIntl } from '@umijs/max';
import { useClickAway, useHover, useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { Dispatch, SetStateAction, memo, useMemo, useRef } from 'react';
import RenderAssignTag from '../../../../components/RenderAssignTag';
import RenderLists from '../../components/RenderLists';
import { numberToChinese, numberToEnTh } from '../../util';
import TitleEdit from './TitleEdit';
import TitleToolbar from './TitleToolbar';
import useNodeEvent from './useNodeEvent';

type RenderTitleProps = {
  nodeData: API_COMPLIANCE.ComplianceInfoData;
  policyexpanded?: boolean;
  handleNodeSelect: Dispatch<
    SetStateAction<API_COMPLIANCE.ComplianceInfoData | undefined>
  >;
};
function RenderTitle(props: RenderTitleProps) {
  const intl = useIntl();
  const { nodeData, policyexpanded, handleNodeSelect } = props;
  const ref = useRef(null);
  const editRef = useRef(null);

  const {
    type = 'catalog',
    key,
    title,
    policy_count,
    level = 0,
    policies,
    tags,
  } = nodeData;

  const {
    handleTagAssign,
    deleteTag,
    editNode,
    setEditNode,
    selectedKeys,
    validateFail,
    setValidateFail,
    isEditDefalut,
    tagList,
  } = useNodeEvent();
  const isHovering = useHover(ref);
  useUpdateEffect(() => {
    setValidateFail(false);
  }, [title]);

  const onBlur = useMemoizedFn((sucFn?: VoidFunction) => {
    if (!editNode) {
      sucFn?.();
      return;
    }
    if (!editNode.title) {
      setValidateFail(true);
      return;
    }
    setEditNode(undefined);
    setValidateFail(false);
    sucFn?.();
  });

  useClickAway(() => {
    onBlur();
  }, editRef);

  const catalogName = useMemo(
    () => {
      const isEn = getLocale() === EN_LANG;
      const fn = isEn ? numberToEnTh : numberToChinese;
      return intl.formatMessage(
        { id: 'unStand.catalogue' },
        { level: fn(1 + level) },
      );
    },
    // () => `${numberToChinese(1 + level)}级目录`,
    [level],
  );

  const titleIsHover = useMemo(
    () => isHovering || selectedKeys?.includes(key),
    [isHovering, selectedKeys, key],
  );
  const Node = useMemo(
    () => (
      <div
        className={classNames(
          'text-[#3E4653] inline-block px-[6px] whitespace-nowrap',
          {
            'hover:bg-[#FFF8E6]': !isEditDefalut,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
          onBlur(() => setEditNode(nodeData));
        }}
      >
        {type === 'catalog'
          ? catalogName
          : intl.formatMessage({ id: 'complianceRequirement' })}
        &nbsp;|&nbsp;
        {title ? (
          <span className={`inline-block max-w-[48vw]`}>
            <TzTypography.Text ellipsis={{ tooltip: title }}>
              {title}
            </TzTypography.Text>
          </span>
        ) : (
          '-'
        )}
      </div>
    ),
    [isEditDefalut, editNode, nodeData, type, catalogName, title],
  );
  return (
    <div>
      {!!policies?.length && (
        <div
          className={classNames(
            'compliance-tree-arrow w-6 h-6 inline-flex justify-center items-ceter rounded mr-1',
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
      )}
      <div className="h-7 flex items-center title-row px-[3px]" ref={ref}>
        {editNode?.key === key && !isEditDefalut ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            ref={editRef}
            className="inline-block"
          >
            <TitleEdit
              onBlur={() => onBlur()}
              // handleChange={handleChange}
              type={type}
              catalog={catalogName}
              title={title}
              validateFail={validateFail}
              hasPolicy={!!policy_count}
              nodeKey={key}
            />
          </div>
        ) : isEditDefalut ? (
          Node
        ) : (
          <TzTooltip title={intl.formatMessage({ id: 'tapToEdit' })}>
            {Node}
          </TzTooltip>
        )}
        {!!policy_count && !titleIsHover && editNode?.key != key && (
          <span className="text-[#2177D1] font-medium px-1">
            {policy_count}
          </span>
        )}

        <TitleToolbar
          isEditDefalut={isEditDefalut}
          show={titleIsHover}
          nodeData={nodeData}
          handleNodeSelect={(v) => {
            !policyexpanded && handleNodeSelect(v);
          }}
        />
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {!!tags?.length && (
          <RenderAssignTag
            onChange={(v: API_COMPLIANCE.DatumTag[]) => handleTagAssign(key, v)}
            removeTag={(v) => deleteTag(key, v)}
            className="mt-1"
            nodeTags={tags}
            tagList={tagList}
          />
        )}
        {type === 'requirement' && policyexpanded && (
          <RenderLists
            noActionCol={isEditDefalut}
            policies={policies}
            nodeKey={key}
          />
        )}
      </div>
    </div>
  );
}

export default memo(RenderTitle);
