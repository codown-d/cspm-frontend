import enUS_dayjs from 'antd/es/date-picker/locale/en_US';
import zhCN_dayjs from 'antd/es/date-picker/locale/zh_CN';
import enUS_antd from 'antd/lib/locale/en_US';
import zhCN_antd from 'antd/lib/locale/zh_CN';
import enUS from './en-US';
import zhCN from './zh-CN';

// 设置语言
const locale: Record<string, any> = {
  zhCN,
  enUS,
  enUS_antd,
  zhCN_antd,
  enUS_dayjs,
  zhCN_dayjs,
};
export default locale;

export const ZH_LANG = 'zh-CN';
export const EN_LANG = 'en-US';
