import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import TzTypography from '@/components/lib/TzTypography';
import { useIntl } from '@umijs/max';
import { isNumber } from 'lodash';
import Radar from './Radar';

export type IInfoContext = {
  dataSource?: API.VulnRiskInfoResponse;
  loading?: boolean;
  column?: number;
};
function InfoContext(props: IInfoContext) {
  const { dataSource } = props ?? {};
  const intl = useIntl();

  const { cnnvd_name, title, cvssv3_score } = dataSource ?? {};

  return (
    <div>
      <Radar title={dataSource?.name} dataSource={dataSource?.attr} />
      <TzProDescriptions column={1}>
        <TzProDescriptions.Item
          valueType="text"
          label={intl.formatMessage({ id: 'cvssv3Score' })}
        >
          {!isNumber(cvssv3_score) ? (
            '-'
          ) : (
            <span className="text-[#E95454]">{cvssv3_score}</span>
          )}
        </TzProDescriptions.Item>
        {!!cnnvd_name && (
          <TzProDescriptions.Item
            valueType="text"
            ellipsis
            label={intl.formatMessage({ id: 'cnvd' })}
          >
            {cnnvd_name}
          </TzProDescriptions.Item>
        )}
        {!!title && (
          <TzProDescriptions.Item
            valueType="text"
            contentStyle={{
              maxWidth: '80%',
            }}
            ellipsis
            label={intl.formatMessage({ id: 'vulnCategory' })}
          >
            {title}
          </TzProDescriptions.Item>
        )}
      </TzProDescriptions>
      <TzProDescriptions
        {...props}
        // column={2}
        columns={[
          {
            title: intl.formatMessage({ id: 'vulnDesc' }),
            key: 'description',
            dataIndex: 'description',
            span: 3,
            // render: (txt, record) =>
            //   renderPropmt({
            //     content: txt,
            //     onClick: () =>
            //       newConversation({
            //         prompt_by_id: +new Date(),
            //         ...getAiDes(record, aiPromptTemplates?.policy_description),
            //       }),
            //   }),
          },
          {
            title: intl.formatMessage({ id: 'referenceLinking' }),
            key: 'references',
            dataIndex: 'references',
            span: 3,
            contentStyle: { display: 'block' },
            render(dom, entity) {
              return (
                <>
                  {entity.references?.length
                    ? entity.references.map((item) => (
                        <div key={item}>
                          <TzTypography.Text ellipsis={{ tooltip: item }}>
                            <a
                              className="underline link mx-1"
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
        ]}
      />
    </div>
  );
}

export default InfoContext;
