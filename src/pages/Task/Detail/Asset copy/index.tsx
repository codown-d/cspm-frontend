import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzCard } from '@/components/lib/tz-card';
import useBreadcrumb from '@/hooks/useBreadcrumb';
// import AssetsList from '@/pages/Asset/List';
import ExportModal, { getExportNameTimeSuffix } from '@/components/ExportModal';
import TzAnchor from '@/components/lib/TzAnchor';
import { useTaskEnum } from '@/hooks/enum/useTaskEnum';
import AssetsList from '@/pages/Asset/OldList';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import GrowthStatics from '@/pages/components/Statistics/GrowthStatics';
import { getAssetsPeriodicCompare } from '@/services/cspm/CloudPlatform';
import { exportTask } from '@/services/cspm/Home';
import { DATE_TIME } from '@/utils/constants';
import { useIntl, useLocation, useParams, useRouteProps } from '@umijs/max';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import styles from '../index.less';
import useDetail, { TaskDetailType } from '../useDetail';
import Info from './Info';
import TaskSteps from './TaskSteps';

const TaskDetail = () => {
  const intl = useIntl();
  const { breadcrumb } = useRouteProps();
  const { id } = useParams();
  const curBreadcrumb = useBreadcrumb();
  const { key: pathKey } = useLocation();

  const AnchorIds = useMemo(
    () => ({
      info: `info${pathKey}`,
      status: `status${pathKey}`,
      assetsStatistics: `assetsStatistics${pathKey}`,
      assetInfo: `assetInfo${pathKey}`,
    }),
    [pathKey],
  );

  const items = useMemo(
    () => [
      {
        href: `#${AnchorIds.info}`,
        key: AnchorIds.info,
        title: intl.formatMessage({ id: 'basicInfo' }),
      },
      {
        href: `#${AnchorIds.status}`,
        key: AnchorIds.status,
        title: intl.formatMessage({ id: 'taskProcessing' }),
      },
      {
        href: `#${AnchorIds.assetsStatistics}`,
        key: AnchorIds.assetsStatistics,
        title: intl.formatMessage({ id: 'assetsStatistics' }),
      },
      {
        href: `#${AnchorIds.assetInfo}`,
        key: AnchorIds.assetInfo,
        title: intl.formatMessage({ id: 'assetInfo' }),
      },
    ],
    [AnchorIds],
  );

  const { loading, info } = useDetail(TaskDetailType.AssetsSync) ?? {};
  const { basic, progress, fail_reason } = info ?? {};
  const { schedule_type } = basic ?? {};
  const isFinished = basic?.status === 'finished';
  const { getTaskTagInfoByStatus } = useTaskEnum();
  const tit = useMemo(
    () =>
      basic?.created_at ? dayjs(basic?.created_at).format(DATE_TIME) : '-',
    [basic?.created_at],
  );
  const growthStaticsDefaultParams = useMemo(() => ({ task_id: id }), [id]);
  return (
    <TzPageContainer
      className={classNames('info-card-box', styles.taskDetail)}
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
                    scope: 'assets_sync',
                  },
                  true,
                )}
                {/* {renderCommonStatusTag(
                  {
                    getTagInfoByStatus: getTaskTagInfoByStatus(
                      TASK_MAP.assets_sync,
                    ),
                    status: basic?.status,
                  },
                  true,
                )} */}
                {/* {renderTaskStatusTag(basic?.status, 'assets_sync', true)} */}
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
            // ref={exportRef}
            onOpenChange={(open, form) => {
              open &&
                form.setFieldsValue({
                  file_name: `${intl.formatMessage({
                    id: 'assetInformation',
                  })}${getExportNameTimeSuffix()}`.replaceAll(' ', '_'),
                });
            }}
            onSubmit={({ file_name: filename }) =>
              exportTask({
                task_type: 'excel',
                execute_type: 'assetSync',
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
            dataSource={progress?.assets_sync}
            fail_reason={fail_reason?.assets_sync}
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
                  title={intl.formatMessage({ id: 'assetsStatistics' })}
                  scheduleType={schedule_type}
                  showRiskType
                  defaultParams={growthStaticsDefaultParams}
                  fetchUrl={getAssetsPeriodicCompare}
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
                  scope="assetTaskDetail"
                  title={intl.formatMessage({ id: 'assetInfo' })}
                  defaultParams={{ task_id: id }}
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

export default memo(TaskDetail);
