import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import useTagFilterItem from '@/hooks/filterItems/useTagFilterItem';
import useJump from '@/hooks/useJump';
import AssignTags, { IAssignTags } from '@/pages/components/AssignTags';
import {
  editCredentials,
  getCredentialById,
} from '@/services/cspm/CloudPlatform';
import {
  history,
  useIntl,
  useModel,
  useParams,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import useClodPlatformEvent from '../useClodPlatformEvent';
import InfoContext, { IInfoContext } from './InfoContext';
import styles from './inde.less';

type InfoProps = IInfoContext & {
  infoBreadcrumb?: ItemType[];
  className?: string;
  dataSource?: API.PolicyInfoResponse;
};
function Info({ infoBreadcrumb, className, ...restProps }: InfoProps) {
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<API.CredentialResponse>();
  const { id = 0 } = useParams();
  const [assignTagObj, setAssignTagObj] = useState<IAssignTags>();
  const { tags, refreshTags } = useTagFilterItem();
  const { handleOprClick } = useClodPlatformEvent();
  const { breadcrumb } = useRouteProps();
  const { nextTo } = useJump();
  const { refresh } = useModel('@@initialState');

  useEffect(() => {
    setLoading(true);
    id &&
      getCredentialById({ id })
        .then(setInfo)
        .finally(() => setLoading(false));
  }, [id]);
  const handleTagAssign = useMemoizedFn((v) => {
    editCredentials({ id: +id, tags: v })
      .then((res) => {
        message.success(intl.formatMessage({ id: 'saveSuccess' }));
        nextTo(`/sys/cloud-platform/info/${id}`);
      })
      .then(() => setAssignTagObj(undefined));
  });
  return (
    <TzPageContainer
      className={classNames('info-card-box', styles.platformInfo)}
      header={{
        title: <PageTitle title={info?.name ?? '-'} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={[
        <TzButton
          disabled={!info}
          key="tag"
          onClick={(e) => {
            e.stopPropagation();
            setAssignTagObj({
              tags: info?.tags?.map(({ user_set, ...rest }) => rest),
            });
          }}
        >
          {intl.formatMessage({ id: 'choiceTags' })}
        </TzButton>,
        <TzButton
          disabled={!info}
          key="edit"
          onClick={(e) => id && handleOprClick(e, 'edit', id)}
        >
          {intl.formatMessage({ id: 'edit' })}
        </TzButton>,
        <TzButton
          disabled={!info}
          key="delete"
          onClick={(e) =>
            info &&
            id &&
            handleOprClick(e, 'delete', { id, ...info }, () => {
              refresh();
              history.push('/sys/cloud-platform');
            })
          }
          danger
        >
          {intl.formatMessage({ id: 'delete' })}
        </TzButton>,
      ]}
    >
      <TzCard
        bodyStyle={
          restProps.loading
            ? { padding: '4px 16px 16px 16px' }
            : { paddingBlock: '4px 0' }
        }
        className={classNames('is-descriptions')}
        title={intl.formatMessage({ id: 'basicInfo' })}
      >
        <InfoContext loading={loading} dataSource={info} />
      </TzCard>

      {!!assignTagObj && (
        <AssignTags
          onCancel={() => setAssignTagObj(undefined)}
          onOk={handleTagAssign}
          tagList={tags}
          refreshTags={refreshTags}
          {...assignTagObj}
        />
      )}
    </TzPageContainer>
  );
}

export default Info;
