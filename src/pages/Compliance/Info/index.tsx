import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import useLayoutMainSearchWid from '@/components/hooks/useLayoutMainSearchWid';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import useCredentials from '@/hooks/useCredentials';
import CusSelectWithAll from '@/pages/components/CusSelectWithAll';
import { getComplianceById } from '@/services/cspm/Compliance';
import { useIntl, useLocation, useParams, useRouteProps } from '@umijs/max';
import { useSize } from 'ahooks';
import classNames from 'classnames';
import { get, isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import CExportModal from '../CExportModal';
import Catalog from './Catalog';
import Detail from './Detail';
import styles from './index.less';
function ComplianceInfo() {
  const [selectNode, setSelectNode] = useState<API.ComplianceInfoChild>();
  const { breadcrumb } = useRouteProps();
  const { id } = useParams();
  const { state } = useLocation();
  const intl = useIntl();
  const credentials = useCredentials();
  const [account, setAccount] = useState<number[]>();
  const fitlerWid = useLayoutMainSearchWid({ min: 300, max: 420, ratio: 0.28 });
  const { height = 200 } = useSize(document.body) ?? {};
  const boxH = height - 130;

  const [info, setInfo] = useState<API.ComplianceInfoResponse>();
  useEffect(() => {
    id &&
      !isUndefined(account) &&
      getComplianceById({
        key: id,
        credential_ids: account,
      }).then((res) => {
        setInfo(res);

        setSelectNode({
          isLeaf: true,
          key: id,
          title: res.compliance_type,
          risk_num: res.risk_num,
        });
      });
  }, [id, account]);

  useEffect(() => {
    setAccount(credentials?.map((v) => v.value));
  }, [credentials]);

  const curId = get(selectNode, ['key']);

  return (
    <TzPageContainer
      className="info-card-box"
      header={{
        title: <PageTitle title={info?.compliance_type ?? '-'} />,
        breadcrumb: <PageBreadCrumb items={state ?? breadcrumb} />,
      }}
      extra={[
        <CExportModal
          key="exportReport"
          renderTrigger={
            <TzButton disabled={!info || !account?.length} key="copy">
              {intl.formatMessage({ id: 'exportReport' })}
            </TzButton>
          }
          exportInfo={{
            credential_ids: account,
            name: info?.compliance_type || '',
            key: id || '',
          }}
        />,
      ]}
    >
      <TzCard
        bodyStyle={{ paddingBlock: '0 20px', overflow: 'hidden' }}
        title={
          <div className="flex">
            {intl.formatMessage({ id: 'complianceContent' })}
            <div
              className={classNames(
                'ml-3 text-[#6C7480] text-sm font-normal inline-flex items-center',
                styles.complianceInfo,
              )}
            >
              <span>{intl.formatMessage({ id: 'mappedRange' })}：</span>
              <CusSelectWithAll
                placeholder={intl.formatMessage(
                  { id: 'selectTips' },
                  { name: '' },
                )}
                onChange={setAccount}
                value={account}
                allLabel={intl.formatMessage({ id: 'fullAccount' })}
                options={credentials}
                bordered={false}
                size="small"
                className="min-w-[100px] -ml-[10px]"
                popupMatchSelectWidth={200}
              />
            </div>
          </div>
        }
      >
        <div className="flex relative min-h-[500px]">
          <div style={{ width: fitlerWid }} className={styles.catalog}>
            <Catalog
              boxH={boxH}
              onChange={setSelectNode}
              value={curId ? [curId] : undefined}
              treeData={
                info
                  ? [
                      {
                        title: info.compliance_type,
                        key: id,
                        isLeaf: true,
                        risk_num: info.risk_num,
                      },
                      ...info?.body,
                    ]
                  : undefined
              }
            />
          </div>
          {!isUndefined(account) && (
            <Detail
              id={id}
              boxH={boxH}
              data={selectNode}
              credential_ids={account}
            />
          )}
        </div>
      </TzCard>
    </TzPageContainer>
  );
}

export default ComplianceInfo;
