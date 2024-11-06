import { PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzBadge from '@/components/lib/TzBadge';
import TzTabs from '@/components/lib/TzTabs';
import { ZH_LANG } from '@/locales';
import { getLocale, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useMemo, useState } from 'react';
import TabContent from './TabContent';
import './index.less';

type TAB_MAP = {
  count: number;
  label: string;
  key: string;
};
const TaskList = () => {
  const { taskCount } = useModel('global');
  const [tab, setTab] = useState<API.ITaskScopeType>('assets_scan');
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  const isZh = getLocale() === ZH_LANG;

  const LabelSty = useMemo(
    () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: isZh ? '100px' : '160px',
    }),
    [isZh],
  );

  const items = useMemo(() => {
    const { scanAsset = 0, complianceScan = 0, reportExport = 0 } = taskCount;
    return [
      {
        count: scanAsset,
        label: 'assetsScan',
        key: 'assets_scan',
      },
      {
        count: complianceScan,
        label: 'complianceScan',
        key: 'compliance_scan',
      },
      {
        count: reportExport,
        label: 'exportTask',
        key: 'reports_export',
      },
    ].map(({ count = 0, label, key }: TAB_MAP) => ({
      label: (
        <TzBadge overflowCount={99} count={count} offset={[0, 6]}>
          <div className="task-tab-label" style={LabelSty}>
            {translate(label)}
          </div>
        </TzBadge>
      ),
      key,
      children: <TabContent tab={tab} count={count} />,
    }));
  }, [taskCount, tab]);

  const onChangeTab = useMemoizedFn((v) => {
    setTab(v);
  });

  return (
    <TzPageContainer
      header={{
        title: <PageTitle title={translate('task')} />,
      }}
    >
      <TzTabs
        destroyInactiveTabPane
        className={'p-task-o9'}
        tabPosition={'left'}
        activeKey={tab}
        onChange={onChangeTab}
        items={items}
      />
    </TzPageContainer>
  );
};

export default TaskList;
