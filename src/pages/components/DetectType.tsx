import TzProForm from '@/components/lib/ProComponents/TzProForm';
import TzProFormCheckbox from '@/components/lib/ProComponents/TzProFormCheckbox';
import TzProFormRadio from '@/components/lib/ProComponents/TzProFormRadio';
import TzCascader from '@/components/lib/TzCascader';
import { CASCADER_OPTION_ALL } from '@/components/lib/TzCascader/util';
import TzSelect from '@/components/lib/tzSelect';
import { TCommonPlatforms } from '@/interface';
import CusSelectWithAll from '@/pages/components/CusSelectWithAll';
import { ITEM_ALL, getOptWithAll, isSelectAll } from '@/utils';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import { BaseOptionType, DefaultOptionType } from 'antd/lib/select';
import { memo, useMemo } from 'react';

const ALL_FORM_ITEMS = [
  'select_all',
  'platforms',
  'credential_ids',
  'region_ids',
  'service_ids',
];
const getPathName = (curName: string, formItemPrev?: string) => {
  if (!formItemPrev) {
    return curName;
  }
  return [formItemPrev, curName];
};
export type DetectTypeCascaderMap = {
  region_ids?: API.RegionsResponse[];
  service_ids?: API.CommonServicetreeResponse[];
  platforms?: TCommonPlatforms[];
  credential_ids?: (BaseOptionType | DefaultOptionType)[];
};
export type DetectTypeProps = {
  form: FormInstance<any>;
  label?: string;
  formItemPrev?: string;
  cascaderMap?: DetectTypeCascaderMap;
  agentlessCascaderMap?: DetectTypeCascaderMap;
  isIncrementAll?: boolean;
  detectOmit?: string[];
};
const defaultStyle = { marginBottom: 4 };
function DetectType({
  form,
  label,
  formItemPrev,
  cascaderMap,
  isIncrementAll,
  detectOmit,
}: DetectTypeProps) {
  const intl = useIntl();
  const {
    region_ids: regions,
    service_ids: services,
    credential_ids: credentials,
    platforms,
  } = cascaderMap ?? {};
  const detect_type = Form.useWatch(
    getPathName('detect_type', formItemPrev),
    form,
  );
  const regionIds = Form.useWatch(
    getPathName('region_ids', formItemPrev),
    form,
  );
  const serviceIds = Form.useWatch(
    getPathName('service_ids', formItemPrev),
    form,
  );
  const selectIsAll = Form.useWatch(
    getPathName('select_all', formItemPrev),
    form,
  );
  const detectTypeLabel = label ?? intl.formatMessage({ id: 'scanningMode' });

  const SelectNode = useMemo(
    () => (isIncrementAll ? TzSelect : CusSelectWithAll),
    [isIncrementAll],
  );

  const rulesFn = useMemoizedFn((str) => [
    {
      message: intl.formatMessage(
        { id: 'requiredTips' },
        { name: intl.formatMessage({ id: str }) },
      ),
      validator(rule, value) {
        return value?.length || selectIsAll
          ? Promise.resolve()
          : Promise.reject();
      },
    },
  ]);

  return (
    <>
      <TzProFormRadio.Group
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: detectTypeLabel },
            ),
          },
        ]}
        initialValue="platforms"
        name={getPathName('detect_type', formItemPrev)}
        label={detectTypeLabel}
        formItemProps={{ style: defaultStyle }}
        options={[
          {
            label: intl.formatMessage({ id: 'byCloudPlatform' }),
            value: 'platforms',
          },
          {
            label: intl.formatMessage({ id: 'byCloudAccount' }),
            value: 'credential_ids',
          },
          {
            label: intl.formatMessage({ id: 'byRegion' }),
            value: 'region_ids',
          },
          {
            label: intl.formatMessage({ id: 'byService' }),
            value: 'service_ids',
          },
          // ].filter((v) => !isAgentless || v.value !== 'service_ids')}
        ].filter((v) => !detectOmit?.includes(v.value))}
        onChange={() =>
          ALL_FORM_ITEMS.map((v) =>
            form.setFieldValue(
              getPathName(v, formItemPrev) as string,
              undefined,
            ),
          )
        }
      />
      {!!isIncrementAll && (
        <TzProFormCheckbox
          noStyle
          name={getPathName('select_all', formItemPrev)}
          className="text-[#3e4653] mt-1"
          onChange={(v) =>
            v &&
            ALL_FORM_ITEMS.map((v) =>
              v === 'select_all'
                ? null
                : form.setFieldValue(
                    getPathName(v, formItemPrev) as string,
                    undefined,
                  ),
            )
          }
        >
          {intl.formatMessage({ id: 'all' })}
        </TzProFormCheckbox>
      )}
      {detect_type === 'platforms' && (
        <TzProForm.Item
          rules={rulesFn('byCloudPlatform')}
          name={getPathName('platforms', formItemPrev)}
          dependencies={[getPathName('select_all', formItemPrev)]}
        >
          <SelectNode
            disabled={selectIsAll}
            placeholder={intl.formatMessage(
              { id: 'selectTips' },
              { name: intl.formatMessage({ id: 'byCloudPlatform' }) },
            )}
            allowClear
            mode="multiple"
            allowAllClear
            className="w-full"
            options={platforms}
            maxTagCount={platforms?.length}
          />
        </TzProForm.Item>
      )}
      {detect_type === 'credential_ids' && (
        <TzProForm.Item
          rules={rulesFn('byCloudAccount')}
          name={getPathName('credential_ids', formItemPrev)}
          dependencies={[getPathName('select_all', formItemPrev)]}
        >
          <SelectNode
            disabled={selectIsAll}
            placeholder={intl.formatMessage(
              { id: 'selectTips' },
              { name: intl.formatMessage({ id: 'byCloudAccount' }) },
            )}
            allowClear
            mode="multiple"
            allowAllClear
            className="w-full"
            options={credentials}
          />
        </TzProForm.Item>
      )}
      {detect_type === 'region_ids' && (
        <TzProForm.Item
          rules={rulesFn('region')}
          name={getPathName('region_ids', formItemPrev)}
          dependencies={[getPathName('select_all', formItemPrev)]}
        >
          <TzCascader
            disabled={selectIsAll}
            multiple
            placeholder={intl.formatMessage(
              { id: 'selectTips' },
              { name: intl.formatMessage({ id: 'byRegion' }) },
            )}
            allowClear
            className="w-full"
            options={
              isIncrementAll ? regions : getOptWithAll(regions, regionIds)
            }
            displayRender={(label: any, selectedOptions: any) => {
              if (!selectedOptions[0]) return label;
              if (label?.length === 1) {
                const item = selectedOptions[0];
                return item.value === ITEM_ALL
                  ? item.label
                  : `${item.label}（${intl.formatMessage({
                      id: 'allRegion',
                    })}）`;
              }

              return selectedOptions
                .map((item: any) => (item ? item.label : ''))
                .join('/');
            }}
            onChange={(v, x) => {
              if (isSelectAll(v)) {
                form.setFieldValue(
                  getPathName('region_ids', formItemPrev) as string,
                  [[CASCADER_OPTION_ALL]],
                );
              }
            }}
          />
        </TzProForm.Item>
      )}
      {detect_type === 'service_ids' && (
        <TzProForm.Item
          rules={rulesFn('cloudServices')}
          name={getPathName('service_ids', formItemPrev)}
          dependencies={[getPathName('select_all', formItemPrev)]}
        >
          <TzCascader
            disabled={selectIsAll}
            multiple
            placeholder={intl.formatMessage(
              { id: 'selectTips' },
              { name: intl.formatMessage({ id: 'byService' }) },
            )}
            allowClear
            options={
              isIncrementAll ? services : getOptWithAll(services, serviceIds)
            }
            displayRender={(label: any, selectedOptions: any) => {
              if (!selectedOptions[0]) return label;

              if (label?.length === 1) {
                const item = selectedOptions[0];
                return item.value === ITEM_ALL
                  ? item.label
                  : `${item.label}（${intl.formatMessage({
                      id: 'allCloudServices',
                    })}）`;
              }
              return selectedOptions
                .map((item: any) => (item ? item.label : ''))
                .join('/');
            }}
            onChange={(v) => {
              if (isSelectAll(v)) {
                form.setFieldValue(
                  getPathName('service_ids', formItemPrev) as string,
                  [[CASCADER_OPTION_ALL]],
                );
              }
            }}
          />
        </TzProForm.Item>
      )}
    </>
  );
}

export default memo(DetectType);
