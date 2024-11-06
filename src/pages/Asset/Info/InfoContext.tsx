import TzProDescriptions, {
  TzProDescriptionsItemProps,
} from '@/components/lib/ProComponents/TzProDescriptions';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import { toDetailIntercept } from '@/utils';
import { history, useIntl } from '@umijs/max';
export type IInfoContext = {
  dataSource?: API_ASSETS.AssetsInfoResponse;
  loading?: boolean;
  column?: number;
  optionals?: string[];
  // 不跳的有：任务模块，合规手动
  canbe2Detail?: boolean;
  from?: string;
};
function InfoContext(props: IInfoContext) {
  const {
    optionals,
    dataSource,
    canbe2Detail = true,
    from,
    ...restProps
  } = props;

  const intl = useIntl();
  const isTask = from === 'task';
  return (
    <TzProDescriptions
      {...restProps}
      dataSource={dataSource}
      columns={
        [
          {
            title: intl.formatMessage({ id: 'instanceName' }),
            key: 'instance_name',
            dataIndex: 'instance_name',
            isOptional: true,
            linkTo: canbe2Detail
              ? (record: API_ASSETS.AssetsInfoResponse) =>
                  toDetailIntercept({ type: 'asset', id: record.hash_id }, () =>
                    history.push(`/asset/info/${record?.hash_id}`),
                  )
              : undefined,
          },
          {
            title: intl.formatMessage({ id: 'instanceId' }),
            key: 'instance_id',
            dataIndex: 'instance_id',
            tzCopyable: true,
          },
          {
            title: intl.formatMessage({ id: 'cloudServices' }),
            key: 'platform',
            dataIndex: 'platform',
            // className: 'btn-row',
            render(txt: string, record: API_ASSETS.AssetsInfoResponse) {
              return (
                <RenderColWithIcon
                  name={record.service_name}
                  platform={txt as string}
                />
              );
            },
          },
          {
            title: intl.formatMessage({ id: 'assetClass' }),
            key: 'asset_type_name',
            dataIndex: 'asset_type_name',
            tzEllipsis: true,
          },
          {
            title: intl.formatMessage({ id: 'cloudAccount' }),
            key: 'credential_name',
            dataIndex: 'credential_name',
            className: 'btn-row',
            // render: (_, { platform, credential_id, credential_name }) => {
            //   if (!credential_name) {
            //     return '-';
            //   }
            //   return (
            //     <>
            //       {!!platform && <RenderPIcon platform={[platform]} />}
            //       {renderWithLinkEllipsis(credential_name, {}, () => {
            //         toDetailIntercept(
            //           { type: 'credential', id: credential_id },
            //           () =>
            //             history.push(
            //               `/sys/cloud-platform/info/${credential_id}`,
            //             ),
            //         );
            //       })}
            //     </>
            //   );
            // },
            linkTo: (record: API_ASSETS.AssetsInfoResponse) =>
              toDetailIntercept(
                { type: 'credential', id: record?.credential_id },
                () =>
                  history.push(
                    `/sys/cloud-platform/info/${record?.credential_id}`,
                  ),
              ),
          },
          {
            title: intl.formatMessage({ id: 'region' }),
            key: 'region_name',
            dataIndex: 'region_name',
            tzEllipsis: true,
          },
          {
            title: intl.formatMessage({ id: 'createdAt' }),
            key: 'created_at',
            dataIndex: 'created_at',
            valueType: 'dateTime',
          },
          {
            title: intl.formatMessage({ id: 'lastSeen' }),
            key: 'updated_at',
            dataIndex: 'updated_at',
            valueType: 'dateTime',
          },
        ]
          .filter((v) => !isTask || v.key !== 'updated_at')
          .filter(
            (v) => !v.isOptional || optionals?.includes(v.dataIndex),
          ) as TzProDescriptionsItemProps<
          API_ASSETS.AssetsInfoResponse,
          'text'
        >[]
      }
    />
  );
}

export default InfoContext;
