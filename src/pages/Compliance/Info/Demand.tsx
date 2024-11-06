import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { renderPropmt } from '@/pages/components/renderPromt';
import { getAiDes } from '@/utils';
import { useIntl, useModel } from '@umijs/max';
import { memo } from 'react';

type DemandProps = {
  dataSource?: API.ComplianceInfoChild;
};
function Demand(props: DemandProps) {
  const intl = useIntl();
  const { newConversation } = useModel('aiGptModel');
  const { initialState } = useModel('@@initialState');
  const { aiPromptTemplates } = initialState ?? {};

  return (
    <div>
      <div className="card-tit mb-3">
        {intl.formatMessage({ id: 'complianceRequirement' })}
      </div>
      <TzProDescriptions
        {...props}
        style={{ marginInline: '-24px' }}
        column={1}
        columns={[
          {
            title: intl.formatMessage({ id: 'complianceId' }),
            key: 'key',
            dataIndex: 'key',
          },
          {
            title: intl.formatMessage({ id: 'riskPoint' }),
            key: 'scene',
            dataIndex: 'scene',
          },
          {
            title: intl.formatMessage({ id: 'requirement' }),
            key: 'requirement',
            dataIndex: 'requirement',
            render: (txt, record) =>
              renderPropmt({
                content: txt,
                onClick: () =>
                  newConversation({
                    prompt_by_id: +new Date(),
                    ...getAiDes(
                      record,
                      aiPromptTemplates?.compliance_requirement,
                    ),
                  }),
              }),
          },
          {
            title: intl.formatMessage({ id: 'recommendations' }),
            key: 'suggestion',
            dataIndex: 'suggestion',
            render: (txt, record) =>
              renderPropmt({
                content: txt,
                onClick: () =>
                  newConversation({
                    prompt_by_id: +new Date(),
                    ...getAiDes(
                      record,
                      aiPromptTemplates?.compliance_suggestion,
                    ),
                  }),
              }),
          },
        ]}
      />
    </div>
  );
}

export default memo(Demand);
