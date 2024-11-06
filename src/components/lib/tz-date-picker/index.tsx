import locale, { EN_LANG } from '@/locales';
import { getLocale } from '@umijs/max';
import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';
import classNames from 'classnames';
import { useMemo } from 'react';
import './index.less';

export type TzDatePickerProps = DatePickerProps & {
  label?: string;
};
export const TzDatePicker = (props: TzDatePickerProps) => {
  const { ...otherProps } = props;
  const lang = getLocale();
  const realProps: any = useMemo(() => {
    return {
      style: { width: '100%' },
      suffixIcon: props.suffixIcon ? (
        props.suffixIcon
      ) : (
        <i className="icon iconfont icon-date" style={{ color: '#B3BAC6' }}></i>
      ),
      locale: lang === EN_LANG ? locale.enUS_dayjs : locale.zhCN_dayjs,
      ...otherProps,
      placeholder: props.label ? '' : props.placeholder,
      className: `tz-date-picker ${otherProps.className || ''}`,
      popupClassName: classNames(
        'tz-picker-dropdown',
        //@ts-ignore
        otherProps.popupClassName,
      ),
    };
  }, [otherProps]);
  // return createElement(
  //   ConfigProvider,
  //   { locale: lang === EN_LANG ? locale.enUS_dayjs : locale.zhCN_dayjs },
  //   [createElement(DatePicker, { ...realProps })],
  // );
  return <DatePicker {...realProps} />;
};
