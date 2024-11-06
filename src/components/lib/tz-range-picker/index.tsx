import locale, { EN_LANG } from '@/locales';
import { getLocale, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { DatePicker } from 'antd';
import { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TzDatePicker } from '../tz-date-picker';
import './index.less';
const { RangePicker }: any = DatePicker;
export type TzRangePickerProps = RangePickerProps & {
  className?: string;
  label?: string;
  popupClassName?: string;
};
export const TzRangePicker = (props: TzRangePickerProps) => {
  const { ...otherProps } = props;
  const intl = useIntl();

  let [visible, setVisible] = useState(false);
  let [value, setValue] = useState<any>();
  let dropdownClass = useMemo(() => {
    let str = 'select-dropdown-close';
    if (visible || (value && value['length'])) {
      str = 'select-dropdown-open';
    }
    return str;
  }, [props, visible, value]);

  useEffect(() => {
    setValue(props.value || props.defaultValue);
  }, [props.value]);

  const onFocus = useMemoizedFn((e: React.FocusEvent<HTMLInputElement>) => {
    setVisible(true);
    realProps.onFocus?.(e);
  });
  const onBlur = useMemoizedFn((e: React.FocusEvent<HTMLInputElement>) => {
    setVisible(false);
    realProps.onBlur?.(e);
  });
  const lang = getLocale();
  const realProps = useMemo(() => {
    return {
      placeholder: [
        intl.formatMessage({ id: 'datePicker.startTime' }),
        intl.formatMessage({ id: 'datePicker.endTime' }),
      ],
      // onFocus,
      // onBlur,
      onChange: (date, dateString: [string, string]) => {
        setValue(date);
        !realProps.onChange || realProps.onChange(date as any, dateString);
      },
      ...otherProps,
      popupClassName: classNames(
        'tz-picker-dropdown-range',
        otherProps.popupClassName,
      ),
      label: dropdownClass === 'select-dropdown-open' ? props.label : '',
      className: `tz-date-picker ${otherProps.className || ''}`,
      suffixIcon: (
        <i className="icon iconfont icon-date" style={{ color: '#B3BAC6' }}></i>
      ),
    };
  }, [otherProps, dropdownClass]);
  return (
    <RangePicker
      locale={lang === EN_LANG ? locale.enUS_dayjs : locale.zhCN_dayjs}
      {...realProps}
    />
  );
};
type TzDatePickerCT = DatePickerProps & {
  className?: string;
  label?: [string, string];
  defaultRangeValue: Dayjs[];
  onChangeRangePicker: (value: Dayjs[], dateString?: string | number) => void;
  onInputKeyDown?: (value: Dayjs[]) => void;
};
export const TzDatePickerCT = (props: TzDatePickerCT) => {
  const { ...otherProps } = props;
  let [startTime, setStartTime] = useState<any>(props.defaultRangeValue[0]);
  let [endTime, setEndTime] = useState<any>(props.defaultRangeValue[1]);
  const intl = useIntl();
  let startDisabledDate = useCallback(
    (current) => {
      return current && current > endTime;
    },
    [endTime],
  );
  let endDisabledDate = useCallback(
    (current) => {
      return current && current < startTime;
    },
    [startTime],
  );

  const [focusMark, setFocusMark] = useState<boolean>(false);
  useEffect(() => {
    setStartTime(props.defaultRangeValue[0] || null);
    setEndTime(props.defaultRangeValue[1] || null);
  }, [props.defaultRangeValue]);
  const realProps = useMemo(() => {
    return {
      className: `${otherProps.className || ''}`,
    };
  }, [otherProps, focusMark]);

  return (
    <div className={classNames('tz-picker-case', realProps.className)}>
      <TzDatePicker
        showTime
        suffixIcon={<></>}
        {...realProps}
        bordered={false}
        style={{
          paddingRight: '0px',
          width: 'calc(50%)',
          float: 'left',
        }}
        onFocus={() => setFocusMark(true)}
        onBlur={() => setFocusMark(false)}
        label={props.label ? props.label[0] : ''}
        placeholder={
          props.label ? '' : intl.formatMessage({ id: 'datePicker.startTime' })
        }
        value={startTime}
        onChange={(date) => {
          setStartTime(date);
          props.onChangeRangePicker([date, endTime], date?.valueOf());
        }}
        disabledDate={endTime ? startDisabledDate : undefined}
      />
      <i
        className="icon iconfont icon-date-arrow f12"
        style={{ color: '#B3BAC6' }}
      ></i>
      <TzDatePicker
        showTime
        {...realProps}
        bordered={false}
        style={{
          paddingLeft: '0px',
          width: 'calc(50%)',
          float: 'left',
        }}
        onFocus={() => setFocusMark(true)}
        onBlur={() => setFocusMark(false)}
        label={props.label ? props.label[1] : ''}
        placeholder={
          props.label ? '' : intl.formatMessage({ id: 'datePicker.endTime' })
        }
        value={endTime}
        onChange={(date) => {
          setEndTime(date);
          props.onChangeRangePicker([startTime, date], date?.valueOf());
        }}
        disabledDate={startTime ? endDisabledDate : undefined}
      />
    </div>
  );
};
