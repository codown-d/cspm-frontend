import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import useBreadcrumb from '@/hooks/useBreadcrumb';
// import AssetsList from '@/pages/Asset/List';
import ExportModal, { mixFileName } from '@/components/ExportModal';
import { useTaskEnum } from '@/hooks/enum/useTaskEnum';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { exportTask } from '@/services/cspm/Home';
import { DATE_TIME } from '@/utils/constants';
import { useIntl, useLocation, useParams, useRouteProps } from '@umijs/max';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import { ExportFileMap } from '../../List/useList';
import TaskSteps from '../Asset/TaskSteps';
import styles from '../index.less';
import useDetail, { TaskDetailType } from '../useDetail';
import Info from './Info';
import OverView from './OverView';

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
      complianceStatistics: `complianceStatistics${pathKey}`,
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
        href: `#${AnchorIds.complianceStatistics}`,
        key: AnchorIds.complianceStatistics,
        title: intl.formatMessage({ id: 'complianceRes' }),
      },
    ],
    [AnchorIds],
  );
  const { loading, info } = useDetail(TaskDetailType.ComplianceScan) ?? {};
  const { basic, progress, fail_reason } = info ?? {};
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
              <div className="ml-3 -mt-[6px]">
                {renderCommonStatusTag(
                  {
                    getTagInfoByStatus: getTaskTagInfoByStatus,
                    status: basic?.status,
                    scope: 'assets_scan',
                  },
                  true,
                )}
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
                  file_name: mixFileName(ExportFileMap['compliance_scan'].name),
                });
            }}
            onSubmit={({ file_name: filename }) =>
              exportTask({
                task_type: 'excel',
                execute_type: 'compliance',
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
            dataSource={progress}
            fail_reason={fail_reason}
          />
          {isFinished && !!basic && (
            <>
              <OverView basic={basic} id={AnchorIds.complianceStatistics} />
              {/* <TzCard
                bodyStyle={{ padding: '12px 16px' }}
                id={AnchorIds.complianceStatistics}
                className={styles.statisticsCard}
                title={
                  <>
                    {intl.formatMessage({ id: 'complianceRes' })}
                    <CusSelectWithAll
                      placeholder={intl.formatMessage(
                        { id: 'selectTips' },
                        { name: '' },
                      )}
                      onChange={setCredentialIds}
                      value={credentialIds}
                      allLabel={intl.formatMessage({ id: 'fullAccount' })}
                      options={credentials}
                      bordered={false}
                      className="min-w-[100px] -ml-[10px]"
                      popupMatchSelectWidth={200}
                    />
                  </>
                }
              >
                <Compliance />
              </TzCard> */}
              {/* <TzCard
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
              </TzCard> */}
            </>
          )}
        </div>
        {/* {isFinished && <TzAnchor items={items} />} */}
      </div>
    </TzPageContainer>
  );
};

export default memo(TaskDetail);
