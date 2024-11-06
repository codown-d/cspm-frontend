import ExportModal, { mixFileName } from '@/components/ExportModal';
import TzProForm from '@/components/lib/ProComponents/TzProForm';
import TzProFormCheckbox from '@/components/lib/ProComponents/TzProFormCheckbox';
import { exportTask } from '@/services/cspm/Home';
import { clearEmptyValInObj } from '@/utils';
import { useIntl } from '@umijs/max';
import { flatten, keys, set } from 'lodash';
import { MutableRefObject, memo, useMemo } from 'react';
import { TRiskStore, TRiskStoreItem } from '../List/useRiskStore';

export type TfilterContainer = {
  sensitive_filter?: API.RuleSensitiveRisksRequest;
  vuln_filter?: API.VulnRisksRequest;
  config_filter?: API.RisksRequest;
};
export type TTabIsOpend = { vulnOpened: boolean; sensitiveOpened: boolean };
const getServiceTreeLeafId = (tree?: API.ServicetreeResponse[]) =>
  flatten(tree?.map((v) => v?.children?.map((x) => x.id)));
type RiskExportProps = {
  // tabIsOpend: TTabIsOpend;
  // refreshAction?: number;
  filterContainerRef?: MutableRefObject<TfilterContainer>;
  state: TRiskStore;
};
function RiskExport({
  filterContainerRef,
  // tabIsOpend,
  state,
  // refreshAction,
  ...restProps
}: RiskExportProps) {
  const intl = useIntl();

  // const { serviceTree, refreshRiskServiceTreeData } = useRiskServiceTreeData();

  // useEffect(refreshRiskServiceTreeData, [refreshAction]);

  const transData = (data: TRiskStoreItem) => {
    const {
      service_data: { service_ids },
      filters,
      ...restState
    } = data ?? {};
    return {
      ...restState,
      service_ids,
      ...filters,
    };
  };
  const fetchParams = useMemo(() => {
    const { config, vuln, sensitive } = state;
    return {
      config_filter: transData(config),
      vuln_filter: transData(vuln),
      sensitive_filter: transData(sensitive),
    };
  }, [state]);

  // const [serviceTree, setServiceTree] = useImmer({
  //   configServiceTree: undefined,
  //   vulnServiceTree: undefined,
  //   sensitiveServiceTree: undefined,
  // });

  // const refreshRiskServiceTreeData = useMemoizedFn(() => {
  //   ['config', 'vuln', 'sensitive'].forEach((risk_type) => {
  //     getRiskServicetree({ risk_type }).then((res) => {
  //       setServiceTree((draft) => set(draft, `${risk_type}ServiceTree`, res));
  //     });
  //   });
  // });

  return (
    <ExportModal
      formItem={
        <>
          <TzProFormCheckbox.Group
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'requiredTips' },
                  { name: intl.formatMessage({ id: 'exportDetectContent' }) },
                ),
              },
            ]}
            rowProps={{ gutter: 32 }}
            name="detect"
            label={intl.formatMessage({ id: 'exportDetectContent' })}
            options={[
              {
                label: intl.formatMessage({ id: 'configRisk' }),
                value: 'config',
              },
              {
                label: intl.formatMessage({ id: 'agentlessRisk' }),
                value: 'agentless',
              },
            ]}
          />
          <TzProForm.Item noStyle dependencies={['detect']}>
            {({ getFieldValue }) => {
              return getFieldValue('detect')?.includes('agentless') ? (
                <TzProFormCheckbox.Group
                  name={['agentless_config']}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(
                        { id: 'requiredTips' },
                        {
                          name: intl.formatMessage({
                            id: 'unStand.detectType',
                          }),
                        },
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
              ) : null;
            }}
          </TzProForm.Item>
        </>
      }
      tip={intl.formatMessage(
        { id: 'unStand.exportTypeTip' },
        { name: intl.formatMessage({ id: 'risk' }) },
      )}
      onOpenChange={(open, form) => {
        if (open) {
          form.setFieldsValue({
            file_name: mixFileName(
              intl.formatMessage({
                id: 'basicRiskInfo',
              }),
            ),
          });
          // refreshRiskServiceTreeData();
        }
      }}
      onSubmit={({ file_name: filename, detect, agentless_config }) => {
        let export_range = detect.includes('config') ? ['config'] : [];
        if (detect.includes('agentless')) {
          export_range = [...export_range, ...agentless_config];
        }

        const { config_filter, vuln_filter, sensitive_filter } = fetchParams;
        const obj = {};
        export_range.forEach((key) => set(obj, `${key}_search`, {}));
        const vuln = vuln_filter && clearEmptyValInObj(vuln_filter);
        const sensitive =
          sensitive_filter && clearEmptyValInObj(sensitive_filter);
        keys(vuln).length && set(obj, 'vuln_search', vuln);

        keys(sensitive).length && set(obj, 'sensitive_search', sensitive);

        const config = config_filter && clearEmptyValInObj(config_filter);
        keys(config).length && set(obj, 'config_search', config);

        // return true;
        return exportTask({
          task_type: 'excel',
          execute_type: 'riskAsset',
          filename,
          parameter: obj,
        });
      }}
      {...restProps}
    />
  );
}

export default memo(RiskExport);
