import TzTabs from '@/components/lib/TzTabs';
import { TzButton } from '@/components/lib/tz-button';
import { TzModal } from '@/components/lib/tzModal';
import useServiceFilterItem from '@/hooks/filterItems/useServiceFilterItem';
import { SelectedRowKeysProps } from '@/pages/BasicLine/ScannerConfig';
import PolicyFilters from '@/pages/components/PolicyList/PolicyFilters';
import PolicyTable from '@/pages/components/PolicyList/PolicyTable';
import RenderPIcon from '@/pages/components/RenderPIcon';
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { filter, flatten, get, invert, omitBy, values } from 'lodash';
import { Key, useMemo, useState } from 'react';
import { filterPolicies } from '../../Info/util';
import { classifyPolicies, classifyPolicies2Arr } from '../../util';

type PolicyProps = {
  onCancel?: () => void;
  onOk: (data: Key[]) => void;
  // record?: API.CommonPolicyItem;
  // baseData?: API.CommonPolicyDatum[];
  nodePolicyIds?: Key[];
  policies: API.CommonPolicyItem[];
};
const Policy = ({ onCancel, onOk, policies, nodePolicyIds }: PolicyProps) => {
  const intl = useIntl();
  const [selectedRowKeys, setSelectedRowKeys] =
    useState<SelectedRowKeysProps>(nodePolicyIds);
  const { initialState } = useModel('@@initialState');
  const { platformSequence } = initialState ?? {};
  const [tableFilter, setTableFilter] = useState({});

  const defaultClassifyPolicies = useMemo(() => {
    const arr = values(invert(omitBy(platformSequence, (x) => x < 0)));
    return classifyPolicies2Arr(policies, arr);
  }, [policies]);
  const [baseData, setBaseData] = useState<any>(() =>
    classifyPolicies(policies),
  );

  const handleChange = useMemoizedFn((values) => {
    const filterData = filterPolicies(policies, values);
    setBaseData(classifyPolicies(filterData));
  });
  const optionals = useMemo(
    () => [
      'service_ids',
      'asset_type_ids',
      'description',
      'mitigation',
      'references',
    ],
    [],
  );

  const serviceItem = useServiceFilterItem({ only_top: 1 });
  const assetTypeItem = useServiceFilterItem();
  const defaultFilterOpt = useMemo(
    () => ({
      serviceItem,
      assetTypeItem,
    }),
    [assetTypeItem, serviceItem],
  );
  const getDataBySingleFilter = useMemoizedFn((key) => {
    const severity = get(tableFilter, [key, 'severity']);
    return get(baseData, key)?.filter(
      (v) => !severity?.length || severity.includes(v.severity),
    );
  });
  return (
    <TzModal
      width={1000}
      title={intl.formatMessage({
        id: 'customDetectionItems',
      })}
      open
      footer={[
        <TzButton className="cancel-btn" key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'cancel' })}
        </TzButton>,
        <TzButton
          key="submit"
          type="primary"
          onClick={() => {
            onOk(flatten(values(selectedRowKeys)) as Key[]);
            onCancel?.();
          }}
        >
          <span>{intl.formatMessage({ id: 'ok' })}</span>
        </TzButton>,
      ]}
      maskClosable={false}
      destroyOnClose
      onCancel={onCancel}
    >
      <PolicyFilters {...defaultFilterOpt} onChange={handleChange} />

      <TzTabs
        className="common-type-bar mt-3 mb-6 relative"
        style={{ height: 'calc(80vh - 200px)' }}
        items={defaultClassifyPolicies?.map(
          ({ key, label, count, policies: _policies }) => {
            const dataSource = getDataBySingleFilter(key);
            return {
              key,
              label: (
                <div className="h-6 leading-6 inline-flex items-center">
                  {<RenderPIcon className="mr-[6px]" platform={key} />}
                  <span>{`${label}(${
                    filter(_policies, (v) => selectedRowKeys?.includes(v.id))
                      ?.length ?? 0
                  }/${count ?? 0})`}</span>
                </div>
              ),
              children: (
                <>
                  <PolicyTable
                    rowKey="id"
                    optionals={optionals}
                    dataSource={dataSource}
                    tableAlertRender={false}
                    onChange={(pagination, filters) =>
                      setTableFilter((prev) => ({
                        ...prev,
                        [key]: filters,
                      }))
                    }
                    rowSelection={{
                      columnWidth: '32px',
                      selectedRowKeys,
                      onSelect: (
                        record: API.CommonPolicyItem,
                        selected: boolean,
                        selectedRows: API.CommonPolicyItem[],
                      ) => {
                        setSelectedRowKeys((prev) =>
                          selected
                            ? [...(prev ?? []), record.id]
                            : prev?.filter((v) => v !== record.id),
                        );
                      },
                      onSelectAll: (selected, selectedRows, changeRows) => {
                        const ck = changeRows.map((v) => v.id);
                        setSelectedRowKeys((prev) =>
                          selected
                            ? [...(prev ?? []), ...ck]
                            : prev?.filter((k) => !ck.includes(k)),
                        );
                      },
                    }}
                    scroll={
                      dataSource?.length > 0
                        ? { y: 'calc(80vh - 300px)' }
                        : undefined
                    }
                  />
                </>
              ),
            };
          },
        )}
      />
    </TzModal>
  );
};
export default Policy;
