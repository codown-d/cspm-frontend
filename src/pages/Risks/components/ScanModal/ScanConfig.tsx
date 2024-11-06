import TzProForm from '@/components/lib/ProComponents/TzProForm';
import TzProFormCheckbox from '@/components/lib/ProComponents/TzProFormCheckbox';
import TzSelect from '@/components/lib/tzSelect';
import DetectType, { DetectTypeProps } from '@/pages/components/DetectType';
import { getBaselines } from '@/services/cspm/CloudPlatform';
import { Link, useIntl, useLocation } from '@umijs/max';
import { Form } from 'antd';
import { memo, useEffect, useState } from 'react';
type ScanConfigProps = Pick<
  DetectTypeProps,
  'cascaderMap' | 'form' | 'agentlessCascaderMap' | 'isIncrementAll'
> & { showAddBaseLine?: boolean };
function ScanConfig(props: ScanConfigProps) {
  const { cascaderMap, agentlessCascaderMap, showAddBaseLine, ...restProps } =
    props;
  const { form } = restProps;
  const intl = useIntl();
  const scan_type = Form.useWatch(['scan_type'], form);
  const [plugins, setPlugins] = useState<API.BaselinesDatum[]>();
  const l = useLocation();
  useEffect(() => {
    getBaselines({ page: 1, size: 10000 }).then((res) => {
      const d = res.items;
      setPlugins(d);
    });
  }, [l]);
  return (
    <>
      <TzProFormCheckbox.Group
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: intl.formatMessage({ id: 'detectContent' }) },
            ),
          },
        ]}
        rowProps={{ gutter: 32 }}
        name="scan_type"
        label={intl.formatMessage({ id: 'detectContent' })}
        options={[
          {
            label: intl.formatMessage({ id: 'configDetect' }),
            value: 'config',
          },
          {
            label: intl.formatMessage({ id: 'agentlessDetect' }),
            value: 'agentless',
          },
        ]}
      />
      {scan_type?.includes('config') && (
        <>
          <TzProForm.Item
            className="benchmark-row"
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'requiredTips' },
                  { name: intl.formatMessage({ id: 'timeBase' }) },
                ),
              },
            ]}
            label={
              <div className="flex justify-between flex-1">
                <span>
                  {intl.formatMessage({ id: 'configDetectBaseLine' })}
                  {showAddBaseLine && '：'}
                </span>
                {showAddBaseLine ? (
                  <Link
                    className="-mr-[10px]"
                    to="/risks/basic-line/add"
                    state={{ fromFormPage: true }}
                  >
                    {intl.formatMessage({ id: 'baselineAdd' })}
                  </Link>
                ) : (
                  <span></span>
                )}
              </div>
            }
            name={['config_config', 'benchmark_id']}
          >
            <TzSelect
              placeholder={intl.formatMessage(
                { id: 'selectTips' },
                {
                  name: intl.formatMessage({
                    id: 'unStand.configDetectBaseLinePlaceholder',
                  }),
                },
              )}
              allowClear
              className="w-full"
              fieldNames={{ label: 'name', value: 'id' }}
              options={plugins}
            />
          </TzProForm.Item>
          <DetectType
            {...restProps}
            cascaderMap={cascaderMap}
            formItemPrev="config_config"
            label={intl.formatMessage({ id: 'unStand.configType' })}
          />
        </>
      )}
      {scan_type?.includes('agentless') && (
        <>
          <TzProFormCheckbox.Group
            name={['agentless_config', 'type']}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'requiredTips' },
                  { name: intl.formatMessage({ id: 'unStand.detectType' }) },
                ),
              },
            ]}
            formItemProps={{ style: { marginTop: 20 } }}
            label={intl.formatMessage({ id: 'unStand.detectType' })}
            options={[
              {
                label: intl.formatMessage({ id: 'vuln' }),
                value: 'vuln',
              },
              {
                label: intl.formatMessage({ id: 'sensitive' }),
                value: 'sensitive',
              },
            ]}
          />
          <DetectType
            detectOmit={['service_ids']}
            formItemPrev="agentless_config"
            {...restProps}
            cascaderMap={agentlessCascaderMap}
            label={intl.formatMessage({ id: 'unStand.agentlessType' })}
          />
        </>
      )}
    </>
  );
}

export default memo(ScanConfig);
