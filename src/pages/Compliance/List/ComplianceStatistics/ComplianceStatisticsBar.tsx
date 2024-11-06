import { TzRadio } from '@/components/lib/tz-radio';
import TzTypography from '@/components/lib/TzTypography';
import translate from '@/locales/translate';
import { renderTitle } from '@/pages/components/AssetList/RenderRiskType';
import { useIntl } from '@umijs/max';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { ceil, get, isEmpty, isFunction, keys, omitBy } from 'lodash';
import { Key, useMemo } from 'react';

type IComplianceStatisticsBar = {
  value?: Key;
  showTip?: boolean;
  onChange?: (key: Key) => void;
  onRow?: (key: Key) => void;
  data?: API_COMPLIANCE.ComplianceOverviewItem[];
  className?: string;
};
const GREEN_CLR = 'bg-[#52C41A]';
const RED_CLR = 'bg-[#E95454]';
const ORIGE_CLR = 'bg-[#F9A363]';
const GRAY_CLR = 'bg-[#B3BAC6]';
const CIRCLE_CLS = 'inline-block w-2 h-2 mr-[6px] rounded-[50%]';
const BAR_CLS = 'h-1';

const STATUS_MAP = {
  passed: {
    color: GREEN_CLR,
    label: translate('compliance'),
  },
  unpassed: {
    color: RED_CLR,
    label: translate('nonCompliance'),
  },
  warn: {
    color: ORIGE_CLR,
    label: translate('toWarning'),
  },
  unscan: {
    color: GRAY_CLR,
    label: translate('undetected'),
  },
};

const RenderStatisticsNumber = (props: {
  showTip?: boolean;
  statisticsItems: Pick<
    API_COMPLIANCE.ComplianceOverviewItemValue,
    'passed' | 'unpassed' | 'warn' | 'unscan'
  >;
}) => {
  const { showTip, statisticsItems } = props;
  const nodeItem = useMemo(
    () => (
      <div className="inline-flex gap-5">
        {keys(statisticsItems)?.map((key) => {
          const { color, label } = get(STATUS_MAP, key);
          return (
            <div key={label}>
              <span className={classNames(color, CIRCLE_CLS)} />
              {!showTip && (
                <span className="text-[#6C7480] mr-[6px]">{label}</span>
              )}
              {get(statisticsItems, key) ?? '-'}
            </div>
          );
        })}
      </div>
    ),
    [props],
  );

  return showTip ? (
    <Tooltip title={() => renderTitle(statisticsItems, STATUS_MAP)}>
      {nodeItem}
    </Tooltip>
  ) : (
    nodeItem
  );
};
function ComplianceStatisticsBar(props: IComplianceStatisticsBar) {
  const { data, value, onChange, className, onRow, showTip } = props;
  const showRadio = isFunction(onChange);
  const len = data?.length ?? 0;
  const intl = useIntl();

  return (
    <div
      className={classNames(
        className,
        'grid gap-y-3 max-h-[202px] overflow-y-auto',
      )}
    >
      {data?.map(({ key, label, value: itemValue, updated_at }) => {
        const {
          passed,
          unpassed,
          warn,
          unscan,
          manual_scanned,
          manual_total,
          program_scanned,
          program_total,
        } = itemValue ?? {};
        const total =
          (passed ?? 0) + (unpassed ?? 0) + (warn ?? 0) + (unscan ?? 0);
        const passNum = total ? 100 * ceil(passed / total, 2) : 0;
        const failNum = total ? 100 * ceil(unpassed / total, 2) : 0;
        const alertNum = total ? 100 * ceil(warn / total, 2) : 0;
        const unscanNum = total ? 100 * ceil(unscan / total, 2) : 0;
        const nums = {
          passed: passNum,
          unpassed: failNum,
          warn: alertNum,
          unscan: unscanNum,
        };
        const statisticsItems = omitBy(
          { passed, unpassed, warn, unscan },
          (x) => !x,
        );
        const noStatus = isEmpty(statisticsItems);
        return (
          <div
            key={`${updated_at}${key}`}
            className={classNames(
              'flex items-center gap-2 hover:bg-[rgba(33,119,209,0.05)] cursor-pointer',
            )}
            onClick={() => {
              onRow?.(key);
              showRadio && onChange?.(key);
            }}
          >
            {showRadio && (
              <TzRadio
                onChange={(e) => {
                  e.target.checked && onChange?.(key);
                }}
                checked={value === key}
              />
            )}
            <div
              onClick={() => onRow?.(key)}
              className={classNames('flex flex-col flex-1 px-1')}
            >
              <div className="flex justify-between gap-4">
                <div className="flex-1 w-0">
                  <TzTypography.Text
                    //   className="text-base title-txt"
                    ellipsis={{ tooltip: label }}
                  >
                    {label}
                  </TzTypography.Text>
                </div>
                <div className="inline-flex items-center">
                  {intl.formatMessage({ id: 'finishingRate' })}：
                  {intl.formatMessage({ id: 'programPolicy' })}&nbsp;
                  {program_scanned ?? '-'}/{program_total ?? '-'}
                  <span className="ml-5">
                    {intl.formatMessage({ id: 'manualPolicy' })}&nbsp;
                    {manual_scanned ?? '-'}/{manual_total ?? '-'}
                  </span>
                  {!noStatus && (
                    <span className="ml-5 inline-block w-[1px] h-3 bg-[#E7E9ED]"></span>
                  )}
                </div>
                <RenderStatisticsNumber
                  statisticsItems={statisticsItems}
                  showTip={showTip}
                />
              </div>

              <div
                className={classNames(
                  BAR_CLS,
                  'w-full mt-[2px] rounded-[2px] overflow-hidden flex bg-[rgba(33,119,209,0.05)]',
                )}
              >
                {keys(statisticsItems)?.map((key) => (
                  <div
                    key={key}
                    style={{ width: `${get(nums, key)}%` }}
                    className={classNames(BAR_CLS, get(STATUS_MAP, key)?.color)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ComplianceStatisticsBar;
