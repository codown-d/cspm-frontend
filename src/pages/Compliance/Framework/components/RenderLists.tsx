import NoData from '@/components/NoData';
import { TzButton } from '@/components/lib/tz-button';
import PlatformTableTit from '@/pages/components/PlatformTableTit';
import { PolicyListProps } from '@/pages/components/PolicyList';
import PolicyTable from '@/pages/components/PolicyList/PolicyTable';
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Space } from 'antd';
import { keyBy, keys } from 'lodash';
import { Key, memo, useContext, useMemo, useState } from 'react';
import TitleDelete from '../Edit/ComplianceItem/TitleDelete';
import { ComplianceContext } from '../Edit/ComplianceItem/useCompliance';
import CusPolicy from '../Edit/Policy/CusPolicy';
import { classifyPolicies } from '../util';

type IRenderLists = {
  policies?: PolicyListProps['dataSource'];
  nodeKey: Key;
  noActionCol?: boolean;
};
function RenderLists({
  policies,
  nodeKey,
  noActionCol,
  ...rest
}: IRenderLists) {
  const lists = useMemo(() => classifyPolicies(policies), [policies]);
  const intl = useIntl();
  const [cusPolicyObj, setCusPolicyObj] = useState<API.CommonPolicyItem>();

  const {
    updatePolicy,
    updatePolicyCount,
    hidePolicyDeleteTip,
    setHidePolicyDeleteTip,
    removePolicy,
    manual_type_name,
  } = useContext(ComplianceContext);

  const optionals = useMemo(
    () => [
      'service_ids',
      'asset_type_ids',
      'description',
      'mitigation',
      'policy_type_name',
      'references',
      { name: 'severity', filters: false },
    ],
    [],
  );

  const { commonConst } = useModel('global') ?? {};
  const { type } = commonConst ?? {};
  const scanTypeEnum = useMemo(
    () =>
      keyBy(
        type?.map((item) => ({
          ...item,
          text: item.label,
          status: item.value,
        })),
        'value',
      ),
    [type],
  );
  const renderActionBtnsFn = useMemoizedFn((_, record) => (
    <div className="-ml-2">
      <Space size={4}>
        {record.policy_type === 'manual' && (
          <TzButton
            size="small"
            type="text"
            onClick={(e) => {
              setCusPolicyObj(record);
            }}
          >
            {intl.formatMessage({ id: 'edit' })}
          </TzButton>
        )}
        <TitleDelete
          hideDeleteTip={!!hidePolicyDeleteTip}
          setHideDeleteTip={setHidePolicyDeleteTip}
          onOk={() => {
            updatePolicyCount(nodeKey, -1);
            removePolicy({
              key: nodeKey,
              policyId: record.id,
            });
          }}
        />
      </Space>
    </div>
  ));
  const extraProps = useMemo(
    () => (noActionCol ? { isInDetail: true } : { pagination: false }),
    [],
  );
  return (
    <div className="mt-3">
      {!keys(lists)?.length ? (
        <NoData />
      ) : (
        <>
          {keys(lists).map((key) => {
            const dataSource = lists?.[key];
            return (
              <div key={key} className="mb-4">
                <PlatformTableTit
                  platform={key}
                  extra={dataSource?.length ? `(${dataSource?.length})` : ''}
                />
                <PolicyTable
                  rowKey="id"
                  optionals={optionals}
                  //   filterIsChange={filterIsChange}
                  dataSource={dataSource}
                  scanTypeEnum={scanTypeEnum}
                  className="no-hover-table"
                  {...extraProps}
                  {...rest}
                  renderActionBtns={
                    noActionCol ? undefined : renderActionBtnsFn
                  }
                />
              </div>
            );
          })}
          {!!cusPolicyObj && (
            <CusPolicy
              record={cusPolicyObj}
              onOk={(vals) => {
                updatePolicy({
                  policies: [
                    {
                      ...vals,
                      id: cusPolicyObj.id,
                      policy_type: 'manual',
                      policy_type_name: manual_type_name,
                    },
                  ],
                  key: nodeKey,
                });
              }}
              onCancel={() => setCusPolicyObj(undefined)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default memo(RenderLists);
