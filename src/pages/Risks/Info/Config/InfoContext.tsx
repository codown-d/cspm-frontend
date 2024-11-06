import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import TzTypography from '@/components/lib/TzTypography';
import { useScanStatusEnum } from '@/hooks/enum/useScanStatusEnum';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import {
  renderCommonStatusTag,
  renderCommonTag,
} from '@/pages/components/RenderRiskTag';
import { renderPropmt } from '@/pages/components/renderPromt';
import { getAiDes } from '@/utils';
import { useIntl, useModel } from '@umijs/max';
export type IInfoContext = {
  dataSource?: API.PolicyInfoResponse;
  loading?: boolean;
  column?: number;
  optionals?: string[];
};
function InfoContext(props: IInfoContext) {
  const { optionals, ...restProps } = props;
  const intl = useIntl();
  const { newConversation } = useModel('aiGptModel');
  const { initialState } = useModel('@@initialState');
  const { aiPromptTemplates } = initialState ?? {};
  const { commonConst } = useModel('global') ?? {};
  const { type } = commonConst ?? {};
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();

  const { scanStatusEnum } = useScanStatusEnum();
  return (
    <TzProDescriptions
      column={1}
      {...restProps}
      columns={[
        {
          title: intl.formatMessage({ id: 'cloudPlatformBelongs' }),
          key: 'platform_name',
          dataIndex: 'platform_name',
          className: 'btn-row',
          render(txt, record) {
            return record.platform_name ? (
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
          title: intl.formatMessage({ id: 'cloudServices' }),
          key: 'service_name',
          dataIndex: 'service_name',
          // span: 2,
        },
        {
          title: intl.formatMessage({ id: 'assetClass' }),
          key: 'asset_type_name',
          dataIndex: 'asset_type_name',
          // span: 2,
        },

        {
          title: intl.formatMessage({ id: 'scanningMode' }),
          key: 'policy_type_name',
          dataIndex: 'policy_type_name',
        },
        // {
        //   title: intl.formatMessage({ id: 'testingResult' }),
        //   key: 'status',
        //   dataIndex: 'status',
        //   isOptional: true,
        //   render: (_, record) =>
        //     record.status ? (
        //       <span
        //         className={classNames(
        //           'status-txt',
        //           SCAN_STATUS_MAP[record.status],
        //         )}
        //       >
        //         {get(scanStatusEnum, [record.status, 'label']) ?? '-'}
        //       </span>
        //     ) : (
        //       '-'
        //     ),
        // },
        // {
        //   title: intl.formatMessage({ id: 'compliantPassedRate' }),
        //   key: 'assets_count',
        //   dataIndex: 'assets_count',
        //   isOptional: true,
        //   render: (_, { assets_count }) => {
        //     const { passed, total } = assets_count ?? {};
        //     const empty = passed ?? total ?? '-';
        //     return empty === '-' ? (
        //       empty
        //     ) : (
        //       <span>
        //         {passed ?? '-'} / {total ?? '-'}
        //       </span>
        //     );
        //   },
        // },
        {
          title: intl.formatMessage({ id: 'severityLevel' }),
          key: 'severity',
          dataIndex: 'severity',
          isOptional: true,
          className: 'btn-row',
          render: (_, record) =>
            renderCommonStatusTag({
              getTagInfoByStatus,
              status: record?.severity,
            }),
        },
        {
          title: intl.formatMessage({ id: 'complianceAssociated' }),
          key: 'compliances',
          dataIndex: 'compliances',
          render: (_, record) =>
            record.compliances?.length
              ? renderCommonTag(record.compliances)
              : '-',
        },
        {
          title: intl.formatMessage({ id: 'tag' }),
          key: 'tags',
          dataIndex: 'tags',
          render: (_, record) =>
            record.tags?.length ? renderCommonTag(record.tags) : '-',
        },
        {
          title: intl.formatMessage({ id: 'concreteContent' }),
          key: 'description',
          dataIndex: 'description',
          span: 2,
          render: (txt, record) =>
            renderPropmt({
              content: txt,
              onClick: () =>
                newConversation({
                  prompt_by_id: +new Date(),
                  ...getAiDes(record, aiPromptTemplates?.policy_description),
                }),
            }),
        },
        {
          title: intl.formatMessage({ id: 'suggestionRepair' }),
          key: 'mitigation',
          dataIndex: 'mitigation',
          span: 2,
          render: (txt, record) =>
            renderPropmt({
              content: txt,
              onClick: () =>
                newConversation({
                  prompt_by_id: +new Date(),
                  ...getAiDes(record, aiPromptTemplates?.policy_mitigation),
                }),
            }),
        },
        {
          title: intl.formatMessage({ id: 'referenceLinking' }),
          key: 'references',
          dataIndex: 'references',
          span: 2,
          contentStyle: { display: 'block' },
          //   render(dom, entity, index, action, schema) {
          //     return entity.references?.length ? (
          //       <EllipsisText texts={entity.references} />
          //     ) : (
          //       '-'
          //     );
          //   },
          render(dom, entity, index, action, schema) {
            return (
              <>
                {entity.references?.length
                  ? entity.references.map((item) => (
                      <div key={item}>
                        <TzTypography.Text ellipsis={{ tooltip: item }}>
                          <a
                            className="underline link"
                            target="_blank"
                            href={item}
                          >
                            {item}
                          </a>
                        </TzTypography.Text>
                      </div>
                    ))
                  : '-'}
              </>
            );
          },
        },
      ]
        .filter(
          (v) =>
            props?.dataSource?.platform !== 'Azure-China' ||
            !['references', 'mitigation'].includes(v.dataIndex),
        )
        .filter((v) => !v.isOptional || optionals?.includes(v.dataIndex))}
    />
  );
}

export default InfoContext;
