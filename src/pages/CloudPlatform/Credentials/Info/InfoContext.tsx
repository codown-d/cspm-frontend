import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import { renderCommonTag } from '@/pages/components/RenderRiskTag';
import { DEFAULT_PWD } from '@/utils';
import { useIntl, useModel } from '@umijs/max';
import { get } from 'lodash';
import { useMemo } from 'react';
export type IInfoContext = {
  dataSource?: API.CredentialResponse;
  loading?: boolean;
  column?: number;
  optionals?: string[];
};
function InfoContext(props: IInfoContext) {
  const { optionals, dataSource, ...restProps } = props;
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};

  const [access, secret, extra] = useMemo(() => {
    const { secret_key_names, extra } =
      commonPlatforms?.find((v) => v.key === dataSource?.platform) ?? {};
    const secret_key_names_val = secret_key_names ?? ['-', '-'];
    return [...secret_key_names_val, extra];
  }, [commonPlatforms, dataSource]);

  const extraItem = useMemo(() => {
    const a = extra?.map((item) => {
      let title = item.key;
      let dataIndex = ['extra', item.key];
      if (item.component_type === 'segmented') {
        const optionItem = item.options.find(
          (v) => !!get(get(dataSource, 'extra'), v.value),
        );
        title = `${optionItem?.value}（${optionItem?.label}）`;
        dataIndex = ['extra', optionItem?.value];
        if (!optionItem) {
          return;
        }
      }
      return {
        title,
        key: dataIndex,
        dataIndex: dataIndex,
      };
    });
    return a ?? [];
  }, [extra]);
  return (
    <TzProDescriptions
      {...restProps}
      dataSource={dataSource}
      columns={[
        {
          title: intl.formatMessage({ id: 'accountName' }),
          key: 'name',
          dataIndex: 'name',
          isOptional: true,
        },
        {
          title: intl.formatMessage({ id: 'cloudPlatformBelongs' }),
          key: 'platform_name',
          dataIndex: 'platform_name',
          className: 'btn-row',
          render(txt, record) {
            return record.platform ? (
              <RenderColWithIcon
                platform={record.platform}
                name={txt as string}
              />
            ) : (
              '-'
            );
          },
        },
        {
          title: access,
          key: 'access',
          dataIndex: 'access',
        },
        {
          title: secret,
          key: 'secret',
          dataIndex: 'secret',
          render: () => DEFAULT_PWD,
        },
        // {
        //   title: extra,
        //   key: 'extra',
        //   dataIndex: 'extra',
        // },
        ...extraItem,
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
          tzEllipsis: 2,
        },
        {
          title: intl.formatMessage({ id: 'turnoverTime' }),
          key: 'updated_at',
          dataIndex: 'updated_at',
          valueType: 'dateTime',
          span: 2,
        },
        {
          title: intl.formatMessage({ id: 'tag' }),
          key: 'tags',
          dataIndex: 'tags',
          render: (_, record) =>
            record.tags?.length ? renderCommonTag(record.tags) : '-',
        },
      ]
        .filter((v) => !!v)
        .filter((v) => !v.isOptional || optionals?.includes(v.dataIndex))}
    />
  );
}

export default InfoContext;
