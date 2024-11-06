import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import TzTabs from '@/components/lib/TzTabs';
import { TzCard } from '@/components/lib/tz-card';
import ModelSteps from '@/pages/components/ModelSteps';
import { TASK_CONFIG_OPT } from '@/utils';
import { useIntl } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { get } from 'lodash';
import { memo, useMemo, useState } from 'react';

type TaskStepsProps = {
  dataSource?: API.TaskDetailProgressObj[];
  fail_reason?: API.TaskDetaiFailReason;
  scan_types?: API.ScanType[];
  cardId: string;
};
function TaskSteps({
  cardId,
  dataSource: dataSourceProps,
  fail_reason,
  scan_types,
}: TaskStepsProps) {
  const intl = useIntl();
  const [activeKey, setActiveKey] = useState<string>('risks_scan_config');

  useUpdateEffect(
    () =>
      setActiveKey(
        scan_types?.includes('config' as API.ScanType)
          ? 'risks_scan_config'
          : 'risks_scan_agentless',
      ),
    [scan_types],
  );
  const dataSource = useMemo(
    () => get(dataSourceProps, activeKey),
    [dataSourceProps, activeKey],
  );

  const failReason = useMemo(
    () => get(fail_reason, activeKey),
    [fail_reason, activeKey],
  );

  return (
    <TzCard
      id={cardId}
      bodyStyle={{ paddingBlock: '4px 0' }}
      title={intl.formatMessage({ id: 'taskProcessing' })}
    >
      {scan_types?.length === 2 && (
        <TzTabs
          className="common-type-bar mt-1"
          onChange={(key) => {
            setActiveKey(key);
          }}
          activeKey={activeKey}
          items={TASK_CONFIG_OPT}
        />
      )}

      <ModelSteps className="mt-4" dataSource={dataSource} />
      <TzProDescriptions
        className="mt-4"
        column={1}
        dataSource={{ fail_reason: failReason }}
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

export default memo(TaskSteps);
