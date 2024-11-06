import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzCard } from '@/components/lib/tz-card';
import ModelSteps, { ModelStepsProps } from '@/pages/components/ModelSteps';
import { useIntl } from '@umijs/max';

type TaskStepsProps = Pick<ModelStepsProps, 'dataSource'> & {
  fail_reason?: string;
  cardId: string;
};
function TaskSteps({ dataSource, fail_reason, cardId }: TaskStepsProps) {
  const intl = useIntl();
  return (
    <TzCard
      id={cardId}
      bodyStyle={{ paddingBlock: '4px 0' }}
      //   className="is-descriptions"
      title={intl.formatMessage({ id: 'taskProcessing' })}
    >
      <ModelSteps className="mt-4" dataSource={dataSource} />
      <TzProDescriptions
        className="mt-4 -mx-3"
        dataSource={{ fail_reason }}
        column={1}
        columns={[
          {
            title: intl.formatMessage({ id: 'errorInfo' }),
            key: 'fail_reason',
            dataIndex: 'fail_reason',
            render(dom, entity, index, action, schema) {
              return (
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  {entity.fail_reason}
                </span>
              );
            },
          },
        ]}
      />
    </TzCard>
  );
}

export default TaskSteps;
