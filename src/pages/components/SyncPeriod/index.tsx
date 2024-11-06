import TzSelect from '@/components/lib/tzSelect';
import { ZH_LANG } from '@/locales';
import { getLocale, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { TimePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useMemo } from 'react';
import './index.less';

/******
export const YearDays = (() => {
  let optionList: { value: string; label: string }[] = [];
  new Array(12).fill('').forEach((itme, index) => {
    let day30 = [4, 6, 9, 11],
      day28 = [2],
      day = 31;
    if (day30.includes(index + 1)) {
      day = 30;
    } else if (day28.includes(index + 1)) {
      day = 29;
    }
    new Array(day).fill('').forEach((it, i) => {
      optionList.push({
        value: `${index + 1}/${i + 1}`,
        label: dayjs(`${index + 1}/${i + 1}`, 'M/D').format(
          isZh ? 'M月D日' : 'MMM Do',
        ),
      });
    });
  });
  return optionList;
})();**/

const PeriodOptions = [
  { label: 'everyDay', value: 'everyDay' },
  { label: 'everyWeekly', value: 'everyWeek' },
  { label: 'everyMonthly', value: 'everyMonth' },
];

interface IProps {
  value?: {
    period: 'everyDay' | 'everyWeek' | 'everyMonth';
    day: number | string;
    week: string;
    time: Dayjs; // 时分秒
  };
  onChange?: any;
  timeFormat?: string;
  [k: string]: any;
}

const Weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function SyncPeriod(props: IProps) {
  const { onChange, ...restProps } = props;
  const intl = useIntl();
  const timeFormat = props.timeFormat || 'HH:mm';
  const value = props.value || {
    period: 'everyDay',
    time: dayjs('00:00', timeFormat),
  };
  const periodValue = value!.period;
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const isZh = getLocale() === ZH_LANG;

  const MonthDays = new Array(31).fill('').map((item, index) => {
    const _day = `00${index + 1}`.slice(-2);
    return {
      value: parseInt(_day),
      label: dayjs(`2022-01-${_day}`, 'YYYY-MM-DD').format(
        isZh ? 'D 日' : 'Do',
      ),
    };
  });

  const periodOptions = PeriodOptions.map((item) => ({
    ...item,
    label: translate(item.label),
  }));
  const firstLevel = useMemo(() => {
    let firstLevel: any = [];
    switch (periodValue) {
      case 'everyDay':
        firstLevel = [];
        break;
      case 'everyWeek':
        const weeks = (dayjs as any).weekdays();
        firstLevel = weeks.map((_txt: string, value: number) => ({
          label: isZh ? Weeks[value] : _txt,
          value,
        }));
        break;
      case 'everyMonth':
        firstLevel = MonthDays;
        break;
    }
    return firstLevel;
  }, [periodValue]);

  const onUpdate = useMemoizedFn((k, val) => {
    onChange?.({ ...value, [k]: val });
  });

  useEffect(() => {
    if (!props.value) {
      // @ts-ignore
      Object.keys(value).forEach((k) => onUpdate(k, value[k]));
    }
  }, []);

  return (
    <div className={'syncperiod-wrap'}>
      <TzSelect
        isNeedSort={false}
        options={periodOptions}
        value={value.period}
        onChange={(v) => onUpdate('period', v)}
        style={{ width: 144 }}
        defaultActiveFirstOption={false}
      />
      {periodValue === 'everyWeek' ? (
        <TzSelect
          style={{ maxWidth: 440 }}
          allowClear
          options={firstLevel}
          value={value!.week}
          onChange={(v) => onUpdate('week', v)}
          mode={'multiple'}
          maxTagCount="responsive"
          placeholder={translate('selectTips', {
            name: translate('everyWeekly'),
          })}
        />
      ) : periodValue === 'everyMonth' ? (
        <TzSelect
          style={{ maxWidth: 440 }}
          allowClear
          options={firstLevel}
          value={value!.day}
          onChange={(v) => onUpdate('day', v)}
          mode={'multiple'}
          maxTagCount="responsive"
          placeholder={translate('selectTips', {
            name: translate('everyMonthly'),
          })}
        />
      ) : null}
      <TimePicker
        format={timeFormat}
        value={value!.time}
        needConfirm={false}
        onChange={(v) => onUpdate('time', v)}
      />
    </div>
  );
}
