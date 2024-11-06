import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import RenderPIcon from '@/pages/components/RenderPIcon';
import { getBaselineById } from '@/services/cspm/CloudPlatform';
import { history, useIntl, useParams, useRouteProps } from '@umijs/max';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import useBasicLineEvent from '../useBasicLineEvent';
import Plugins from './Plugins';
import './index.less';

function ScannerInfo() {
  const { breadcrumb } = useRouteProps();
  const { id } = useParams();
  const [info, setInfo] = useState<API.BaselineResponse>();
  const { handleOprClick } = useBasicLineEvent();
  const intl = useIntl();

  useEffect(() => {
    id && getBaselineById(id).then(setInfo);
  }, [id]);

  const { basic, policies } = info ?? {};

  return (
    <TzPageContainer
      className="scanner-record-info info-card-box"
      header={{
        title: <PageTitle title={basic?.name ?? '-'} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={
        basic
          ? [
              <TzButton
                key="copy"
                onClick={(e) => info && handleOprClick(e, 'copy', info)}
              >
                {intl.formatMessage({ id: 'createCopy' })}
              </TzButton>,
              !basic?.is_default && info && (
                <TzButton
                  key="edit"
                  onClick={(e) => handleOprClick(e, 'edit', info)}
                >
                  {intl.formatMessage({ id: 'edit' })}
                </TzButton>
              ),
              !basic?.is_default && (
                <TzButton
                  key="delete"
                  danger
                  disabled={!info}
                  onClick={(e) =>
                    id &&
                    handleOprClick(
                      e,
                      'delete',
                      { id, name: info?.basic.name ?? '-' },
                      () => {
                        history.back();
                        flushSync(() => {
                          history.replace('/risks/basic-line', {
                            keepAlive: true,
                          });
                        });
                      },
                    )
                  }
                >
                  {intl.formatMessage({ id: 'delete' })}
                </TzButton>
              ),
            ]
          : []
      }
    >
      <TzCard
        bodyStyle={{ paddingTop: 4 }}
        className="is-descriptions"
        title={intl.formatMessage({ id: 'basicInfo' })}
      >
        <TzProDescriptions
          dataSource={info?.basic}
          columns={[
            {
              title: intl.formatMessage({ id: 'overlayCloudPlatform' }),
              key: 'platforms',
              dataIndex: 'platforms',
              className: 'btn-row',
              render: (_, record) => (
                <RenderPIcon platform={record.platforms} />
              ),
              span: 3,
            },
            {
              title: intl.formatMessage({ id: 'creator' }),
              key: 'creator',
              dataIndex: 'creator',
              tzEllipsis: 2,
            },
            {
              title: intl.formatMessage({ id: 'creationTime' }),
              key: 'created_at',
              dataIndex: 'created_at',
              valueType: 'dateTime',
            },
            {
              title: intl.formatMessage({ id: 'updater' }),
              key: 'updater',
              dataIndex: 'updater',
            },
            {
              title: intl.formatMessage({ id: 'turnoverTime' }),
              key: 'updated_at',
              dataIndex: 'updated_at',
              valueType: 'dateTime',
            },
            {
              span: 2,
              tzEllipsis: 2,
              title: intl.formatMessage({ id: 'remark' }),
              key: 'description',
              dataIndex: 'description',
              valueType: 'text',
            },
          ]}
        />
      </TzCard>
      {!!policies?.length && !!basic?.platforms?.length && (
        <Plugins plugins={policies} />
      )}
    </TzPageContainer>
  );
}

export default ScannerInfo;
