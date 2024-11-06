import TzFilter from '@/components/lib/TzFilter';
import { FilterContext } from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import TzTabs from '@/components/lib/TzTabs';
import { TzCard } from '@/components/lib/tz-card';
import { TzCheckbox } from '@/components/lib/tz-checkbox';
import useServiceTree from '@/hooks/useServiceTree';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { flatten, get, intersection, keys, sum } from 'lodash';
import {
  Dispatch,
  SetStateAction,
  memo,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import PolicyList from '../components/PolicyList';
import RenderPIcon from '../components/RenderPIcon';
import styles from './Edit/index.less';
import usePlugin from './usePlugin';
export type SelectedRowKeysProps = Record<string, undefined | string[]>;
type TScanRecords = {
  scannerError?: boolean | number;
  selectedRowKeys?: SelectedRowKeysProps;
  setScannerError: Dispatch<boolean>;
  setSelectedRowKeys: Dispatch<SetStateAction<SelectedRowKeysProps>>;
  baseData?: API.CommonPolicyDatum[];
};
function ScannerConfig(props: TScanRecords) {
  const {
    scannerError,
    selectedRowKeys,
    setSelectedRowKeys,
    setScannerError,
    baseData,
  } = props;
  const intl = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const [platform, setPlatform] = useState<string>();
  const services = useServiceTree(undefined, 1);
  const { dataFilter, dataSource, setFilters, filterIsChange } = usePlugin({
    baseData,
    platform,
    services,
  });

  useUpdateEffect(() => setPlatform(get(baseData, [0, 'key'])), [baseData]);
  const total = useMemo(() => sum(baseData?.map((v) => v.count)), [baseData]);

  const fullIds = useMemo(() => dataSource?.map((v) => v.id), [dataSource]);
  const getStatus = useMemoizedFn((p: string) => {
    const len = fullIds?.length;
    const curPSelectedRowKeys = get(selectedRowKeys, p);
    if (!curPSelectedRowKeys?.length) {
      return 0;
    }
    if (intersection(curPSelectedRowKeys, fullIds)?.length === len) {
      return 1;
    }
    return -1;
  });
  const allCount = useMemo(
    () =>
      sum(
        flatten(
          keys(selectedRowKeys)?.map((key) => selectedRowKeys?.[key]?.length),
        ),
      ),
    [selectedRowKeys],
  );

  return (
    <TzCard
      headStyle={{ paddingBottom: 4 }}
      bodyStyle={{ paddingTop: 0 }}
      className={classNames({ [styles.hasError]: !!scannerError })}
      extra={<div ref={ref} />}
      title={
        <span className={styles.errorInfo}>
          {intl.formatMessage({ id: 'policies' })}
          <span className="font-normal">
            {intl.formatMessage(
              { id: 'unStand.selectedTip' },
              {
                selected: allCount ?? 0,
                total: total ?? 0,
              },
            )}
          </span>
          {scannerError ? (
            <span className={styles.errorInfoTxt}>
              <i>*</i>
              {intl.formatMessage({ id: 'unStand.selectedScanOptionsTip' })}
            </span>
          ) : null}
        </span>
      }
    >
      <FilterContext.Provider value={{ ...dataFilter }}>
        {ref.current && createPortal(<TzFilter />, ref.current)}
        <TzFilterForm onChange={setFilters} />
      </FilterContext.Provider>
      <TzTabs
        className="common-type-bar"
        // defaultActiveKey={platform}
        onChange={(key) => {
          setPlatform(key);
        }}
        items={baseData?.map(({ key, label, count }) => ({
          key,
          label: (
            <div className="h-6 leading-6 inline-flex items-center">
              {<RenderPIcon className="mr-2" platform={key} />}
              <span>{`${label}(${get(selectedRowKeys, key)?.length ?? 0}/${
                count ?? 0
              })`}</span>
            </div>
          ),
          children: (
            <>
              <TzCheckbox
                className="ml-4 mb-2 text-[#3e4653]"
                indeterminate={getStatus(key) === -1}
                checked={getStatus(key) > 0}
                onChange={(e) => {
                  e.target.checked
                    ? setSelectedRowKeys((prev) => ({
                        ...prev,
                        [key]: dataSource?.map((v) => v.id),
                      }))
                    : setSelectedRowKeys((prev) => ({
                        ...prev,
                        [key]: [],
                      }));
                }}
              >
                {intl.formatMessage({ id: 'fullPolicy' })}
              </TzCheckbox>
              <PolicyList
                filterIsChange={filterIsChange}
                dataSource={dataSource}
                rowSelection={{
                  columnWidth: '32px',
                  selectedRowKeys: get(selectedRowKeys, key),
                  onSelect: (
                    record: API.CommonPolicyItem,
                    selected: boolean,
                    selectedRows: API.CommonPolicyItem[],
                  ) => {
                    const _v = selectedRows?.map((v) => v?.id);
                    setScannerError(!_v?.length);
                    setSelectedRowKeys((prev) => {
                      const prevKeyValue = get(prev, key) ?? [];
                      return {
                        ...prev,
                        [key]: selected
                          ? [...prevKeyValue, record.id]
                          : prevKeyValue.filter((v) => v !== record.id),
                      };
                    });
                  },
                  onSelectAll: (
                    selected: boolean,
                    selectedRows: API.CommonPolicyItem[],
                    changeRows: API.CommonPolicyItem[],
                  ) => {
                    const changeRowsIds = changeRows.map((x) => x.id);

                    setScannerError(!selectedRows?.length);
                    setSelectedRowKeys((prev) => {
                      const prevKeyValue = get(prev, key) ?? [];
                      return {
                        ...prev,
                        [key]: selected
                          ? flatten([...prevKeyValue, ...changeRowsIds])
                          : prevKeyValue.filter(
                              (v) => !changeRowsIds.includes(v),
                            ),
                      };
                    });
                  },
                }}
              />
            </>
          ),
        }))}
      />
    </TzCard>
  );
}

export default memo(ScannerConfig);
