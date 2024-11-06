import TzProTable, {
  TzProColumns,
  TzProTableProps,
} from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import { TzPopover } from '@/components/lib/TzPopover';
import TzTypography from '@/components/lib/TzTypography';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useTableAnchor from '@/hooks/useTableAnchor';
import {
  getSeverityTagWid,
  renderCommonStatusTag,
} from '@/pages/components/RenderRiskTag';
import { getAiDes } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { Space } from 'antd';
import { memo, useEffect, useMemo, useRef } from 'react';

export type PolicyListProps = TzProTableProps<API.CommonPolicyItem> & {
  filterIsChange?: boolean;
};
function PolicyList(props: PolicyListProps) {
  const { filterIsChange, ...restProps } = props;
  const { initialState } = useModel('@@initialState');
  const { aiPromptTemplates } = initialState ?? {};
  const { newConversation } = useModel('aiGptModel');
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();

  const pluginColumns: TzProColumns<API.CommonPolicyItem>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'cloudServices' }),
        dataIndex: 'service_name',
        tzEllipsis: 2,
        width: '17%',
      },
      {
        title: intl.formatMessage({ id: 'scanOptions' }),
        dataIndex: 'policy_title',
        tzEllipsis: 2,
        width: '17%',
      },
      {
        title: intl.formatMessage({ id: 'concreteContent' }),
        dataIndex: 'description',
        width: '30%',
        tzEllipsis: 2,
        withPrompt: (record) => {
          newConversation({
            prompt_by_id: +new Date(),
            ...getAiDes(record, aiPromptTemplates?.policy_description),
          });
        },
      },
      {
        title: intl.formatMessage({ id: 'suggestionRepair' }),
        dataIndex: 'mitigation',
        tzEllipsis: 2,
        withPrompt: (record) => {
          newConversation({
            prompt_by_id: +new Date(),
            ...getAiDes(record, aiPromptTemplates?.policy_mitigation),
          });
        },
      },
      {
        title: intl.formatMessage({ id: '检测方式' }),
        dataIndex: 'type',
        render: (type) => (type === 'manual' ? '手动检测' : '自动检测'),
      },
      {
        title: intl.formatMessage({ id: 'severityLevel' }),
        dataIndex: 'severity',
        align: 'center',
        width: getSeverityTagWid(),
        render: (_, { severity }) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus,
              status: severity,
            },
            { size: 'small' },
          ),
      },
      {
        title: intl.formatMessage({ id: 'referenceLinking' }),
        dataIndex: 'references',
        render(dom, entity) {
          return (
            <>
              {entity.references?.length
                ? entity.references.map((item) => (
                    <div key={item}>
                      <TzTypography.Text ellipsis={{ tooltip: item }}>
                        <a
                          className="underline link mx-1"
                          target="_blank"
                          href={item}
                        >
                          {item}
                        </a>
                      </TzTypography.Text>
                    </div>
                  ))
                : '-'}
            </>
          );
        },
      },

      {
        title: intl.formatMessage({ id: 'operate' }),
        dataIndex: 'option',
        render: (_, record) => (
          <Space size={4}>
            {record.type === 'manual' && (
              <TzButton
                style={{ marginLeft: -8 }}
                size="small"
                type="text"
                onClick={(e) => {
                  handleOprClick(e, 'edit', record.id);
                }}
              >
                {intl.formatMessage({ id: 'edit' })}
              </TzButton>
            )}
            <TzPopover
              overlayClassName="node-opr-tip"
              overlayStyle={{ width: 240 }}
              content={
                <div className="px-1">
                  <div className="flex items-center">
                    <i className="icon iconfont icon-jinggao mr-[6px] text-[#FF8A34]" />
                    <span>确定要删除吗？</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <TzCheckbox onChange={(e) => setTip(e.target.checked)}>
                      不再提醒
                    </TzCheckbox>
                    <Space size={6}>
                      <TzButton
                        className="cancel-btn"
                        size="small"
                        // type="text"
                        onClick={hide}
                      >
                        取消
                      </TzButton>
                      <TzButton
                        size="small"
                        type="primary"
                        danger
                        onClick={() => {
                          onOk();
                          setHideNodeDeleteTip(tip);
                        }}
                      >
                        删除
                      </TzButton>
                    </Space>
                  </div>
                </div>
              }
              //   title="Click title"
              trigger="click"
              open={!hideNodeDeleteTip && clicked}
              onOpenChange={handleClickChange}
              // getPopupContainer={(n) => n}
              //   getPopupContainer={}
            >
              <TzButton
                size="small"
                type="text"
                danger
                onClick={(e) =>
                  handleOprClick(
                    e,
                    'delete',
                    record,
                    () => actionRef.current?.reset?.(),
                  )
                }
              >
                {intl.formatMessage({ id: 'delete' })}
              </TzButton>
            </TzPopover>
          </Space>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    actionRef.current?.reloadAndRest?.();
  }, [filterIsChange]);

  return (
    <>
      <div className="absolute -top-[88px]" ref={anchorRef} />
      <TzProTable<API.CommonPolicyItem>
        onChange={listOffsetFn}
        actionRef={actionRef}
        {...restProps}
        className="no-hover-table"
        columns={pluginColumns}
        tableAlertRender={false}
      />
    </>
  );
}

export default memo(PolicyList);
