import ExportModal, { mixFileName } from '@/components/ExportModal';
import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzAnchor from '@/components/lib/TzAnchor';
import { TzCard } from '@/components/lib/tz-card';
import { useTaskEnum } from '@/hooks/enum/useTaskEnum';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import translate from '@/locales/translate';
import AssetsList from '@/pages/Asset/OldList';
import RiskList from '@/pages/Risks/List';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import GrowthStatics from '@/pages/components/Statistics/GrowthStatics';
import {
  getAssetsPeriodicCompare,
  getRisksPeriodicCompare,
} from '@/services/cspm/CloudPlatform';
import { exportTask } from '@/services/cspm/Home';
import { DATE_TIME } from '@/utils/constants';
import { useIntl, useLocation, useParams, useRouteProps } from '@umijs/max';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import styles from '../index.less';
import useDetail, { TaskDetailType } from '../useDetail';
import Info from './Info';
import TaskSteps from './TaskSteps';

const TaskDetail = () => {
  const intl = useIntl();
  const { id } = useParams();
  const curBreadcrumb = useBreadcrumb();
  const { breadcrumb } = useRouteProps();
  const { getTaskTagInfoByStatus } = useTaskEnum();
  const { loading, info } = useDetail(TaskDetailType.RisksScan) ?? {};
  const { basic, progress, fail_reason, risks_static } = info ?? {};
  const { schedule_type } = basic ?? {};
  const isFinished = basic?.status === 'finished';
  const tit = basic?.created_at
    ? dayjs(basic?.created_at).format(DATE_TIME)
    : '-';

  const { key: pathKey } = useLocation();

  const AnchorIds = useMemo(
    () => ({
      info: `info${pathKey}`,
      status: `status${pathKey}`,
      assetsStatistics: `assetsStatistics${pathKey}`,
      statisticalRisk: `statisticalRisk${pathKey}`,
      riskInfo: `riskInfo${pathKey}`,
      assetInfo: `assetInfo${pathKey}`,
    }),
    [pathKey],
  );

  const items = useMemo(
    () => [
      {
        href: `#${AnchorIds.info}`,
        key: AnchorIds.info,
        title: translate('basicInfo'),
      },
      {
        href: `#${AnchorIds.status}`,
        key: AnchorIds.status,
        title: translate('taskProcessing'),
      },
      {
        href: `#${AnchorIds.assetsStatistics}`,
        key: AnchorIds.assetsStatistics,
        title: translate('assetsStatistics'),
      },
      {
        href: `#${AnchorIds.statisticalRisk}`,
        key: AnchorIds.statisticalRisk,
        title: translate('statisticalRisk'),
      },
      {
        href: `#${AnchorIds.riskInfo}`,
        key: AnchorIds.riskInfo,
        title: translate('riskInfo'),
      },
      {
        href: `#${AnchorIds.assetInfo}`,
        key: AnchorIds.assetInfo,
        title: translate('assetInfo'),
      },
    ],
    [AnchorIds],
  );

  const taskDefaultParams = useMemo(() => ({ task_id: id }), [id]);
  const riskListDefaultParams = useMemo(
    () => ({ task_id: id, risks_static }),
    [id, risks_static],
  );
  return (
    <TzPageContainer
      className="info-card-box"
      header={{
        title: (
          <PageTitle
            showBack
            tag={
              <div className="ml-3">
                {renderCommonStatusTag(
                  {
                    getTagInfoByStatus: getTaskTagInfoByStatus,
                    status: basic?.status,
                    scope: 'risks_scan',
                  },
                  true,
                )}
                {/* {renderCommonStatusTag(
                  {
                    getTagInfoByStatus: getTaskTagInfoByStatus(
                      TASK_MAP.risks_scan,
                    ),
                    status: basic?.status,
                  },
                  true,
                )} */}
                {/* {renderTaskStatusTag(basic?.status, 'risks_scan', true)} */}
              </div>
            }
            title={tit}
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={
        isFinished && (
          <ExportModal
            onOpenChange={(open, form) => {
              open &&
                form.setFieldsValue({
                  file_name: mixFileName(
                    intl.formatMessage({
                      id: 'basicRiskInfo',
                    }),
                  ),
                });
            }}
            onSubmit={({ file_name: filename }) =>
              exportTask({
                task_type: 'excel',
                execute_type: 'scanAsset',
                filename,
                parameter: {
                  task_id: +id!,
                },
              })
            }
          />
        )
      }
    >
      <div className="flex">
        <div className="flex-1">
          <Info cardId={AnchorIds.info} dataSource={basic} loading={loading} />
          <TaskSteps
            cardId={AnchorIds.status}
            scan_types={basic?.scan_types}
            dataSource={progress}
            fail_reason={fail_reason}
          />

          {isFinished && (
            <>
              <TzCard
                bodyStyle={{ padding: '12px 16px 4px 16px' }}
                id={AnchorIds.assetsStatistics}
                className={styles.statisticsCard}
              >
                <GrowthStatics
                  showSegmented={false}
                  scheduleType={schedule_type}
                  title={intl.formatMessage({ id: 'assetsStatistics' })}
                  defaultParams={taskDefaultParams}
                  fetchUrl={getAssetsPeriodicCompare}
                />
              </TzCard>
              <TzCard
                bodyStyle={{ padding: '12px 16px 4px 16px' }}
                id={AnchorIds.statisticalRisk}
                className={styles.statisticsCard}
              >
                <GrowthStatics
                  showSegmented={false}
                  title={intl.formatMessage({ id: 'statisticalRisk' })}
                  scheduleType={schedule_type}
                  showRiskType
                  defaultParams={taskDefaultParams}
                  fetchUrl={getRisksPeriodicCompare}
                />
              </TzCard>
              <TzCard
                bodyStyle={{ padding: '12px 16px 4px 16px' }}
                id={AnchorIds.riskInfo}
                className={styles.statisticsCard}
              >
                <RiskList
                  title={intl.formatMessage({ id: 'riskInfo' })}
                  affix={false}
                  defaultParams={riskListDefaultParams}
                  infoBreadcrumb={[
                    ...curBreadcrumb,
                    {
                      title: 'assetInfo',
                    },
                  ]}
                />
              </TzCard>
              <TzCard
                bodyStyle={{ padding: '12px 16px 4px 16px' }}
                id={AnchorIds.assetInfo}
                className={styles.statisticsCard}
              >
                <AssetsList
                  infoBreadcrumb={[
                    ...curBreadcrumb,
                    {
                      title: 'assetInfo',
                    },
                  ]}
                  title={intl.formatMessage({ id: 'assetInfo' })}
                  defaultParams={taskDefaultParams}
                />
              </TzCard>
            </>
          )}
        </div>
        {isFinished && <TzAnchor items={items} />}
      </div>
    </TzPageContainer>
  );
};

export default TaskDetail;
