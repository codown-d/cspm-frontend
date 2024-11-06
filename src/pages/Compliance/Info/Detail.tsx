import NoData from '@/components/NoData';
import { useIntl } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { isUndefined } from 'lodash';
import { useMemo, useRef } from 'react';
import { useImmer } from 'use-immer';
import RiskList, { RiskListRefFn } from '../../Risks/List/RiskList';
import Demand from './Demand';
import styles from './detail.less';

type DetailProps = {
  data?: API.ComplianceInfoChild;
  id?: string;
  boxH?: number;
  credential_ids?: number[];
};
function Detail({ data, id, boxH = 0, credential_ids }: DetailProps) {
  const intl = useIntl();
  const filterToRef = useRef<HTMLDivElement>(null);
  const RiskListRef = useRef<RiskListRefFn>(null);
  const defaultParam = useMemo(() => {
    if (!data) {
      return;
    }
    if (data.isLeaf) {
      return {
        compliance_key: id,
      };
    }
    if (data.children?.length) {
      return {
        compliance_catalog_prefix: `${data.key}`,
        compliance_key: id,
      };
    }
    return { compliance_id: data?.key };
  }, [data, id]);
  const [fetchParams, setFetchParams] = useImmer<any>(defaultParam);

  useUpdateEffect(() => {
    setFetchParams({ ...defaultParam, credential_ids });
  }, [defaultParam]);

  useUpdateEffect(() => {
    RiskListRef.current?.resetFilterForm();
    document.querySelector('.tz-container')?.scrollTo({
      top: 0,
    });
  }, [defaultParam]);
  return (
    <div
      className={classNames('flex-1 pl-6 w-0', styles.complianceInfoItem)}
      style={{ minHeight: boxH - 10 }}
    >
      {data ? (
        <>
          <div>
            {!data.isLeaf && !data?.children?.length && (
              <Demand key={data.key} dataSource={data} />
            )}
          </div>
          {!isUndefined(credential_ids) && (
            <RiskList
              extra={
                <div className="flex justify-between items-center mb-3">
                  <div className="card-tit">
                    {intl.formatMessage({ id: 'riskList' })}
                  </div>
                  <div ref={filterToRef}></div>
                </div>
              }
              filterToRef={filterToRef}
              tableAnchorStyle={{ top: -104 }}
              fetchParams={fetchParams}
              setFilters={(v) =>
                setFetchParams({ ...defaultParam, credential_ids, ...v })
              }
              className="mt-2"
              ref={RiskListRef}
            />
          )}
        </>
      ) : (
        <NoData className="mt-[152px]" />
      )}
    </div>
  );
}

export default Detail;
