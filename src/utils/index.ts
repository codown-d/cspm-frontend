import { TzProColumns } from '@/components/lib/ProComponents/TzProTable';
import {
  SingleValueType,
  TreeNode,
  TzCascaderProps,
  ValueType,
} from '@/components/lib/TzCascader/interface';
import { CASCADER_OPTION_ALL } from '@/components/lib/TzCascader/util';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TCommonPlatforms } from '@/interface';
import { EN_LANG } from '@/locales';
import translate from '@/locales/translate';
import { getEntityIsexists } from '@/services/cspm/Home';
import { getLocale } from '@umijs/max';
import { message } from 'antd';
import { cloneDeep, forEach, get, isArray, isObject, keyBy, set } from 'lodash';
import { ENTITY_NOT_EXISTS_TIPS } from './constants';
import { storage } from './tzStorage';

const { REACT_APP_ENV, PUBLIC_URL, SOCKET_URL, REACT_APP_SUBJECT } =
  process.env;
export const getJWT = () => `jwt=${storage.getCookie('token')}`;
export { PUBLIC_URL, REACT_APP_ENV, REACT_APP_SUBJECT, SOCKET_URL };
export const NONE_PLATFORM = 'NONE_PLATFORM';
export const getCascaderLabels = (
  options: TreeNode[],
  values: SingleValueType[],
) => {
  function val2Label(
    val: ValueType,
    opt: TzCascaderProps['options'],
  ): TreeNode | undefined {
    return (val && opt?.length ? opt.find((v) => v.value === val) : val) as
      | TreeNode
      | undefined;
  }
  return values
    ?.map((vals: SingleValueType) => {
      const st1 = val2Label(vals[0], options);
      const st2 = val2Label(vals[1], st1?.children);
      return [st1?.label, st2?.label].filter((v) => !!v).join(' / ');
    })
    .filter((v) => !!v)
    .join(' , ');
};

// export const RISK_STATUS_MAP = {
//   CRITICAL: { name: 'critical', color: '#9E0000' },
//   HIGH: { name: 'high', color: '#ED7676' },
//   MEDIUM: { name: 'medium', color: '#F9A363' },
//   LOW: { name: 'low', color: '#FAD264' },
//   UNKNOWN: { name: 'unknown', color: '#8E97A3' },
// };

export const RISK_STATUS_MAP = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  UNKNOWN: 'unknown',
};
export const RISK_STATUS_LETTER_MAP = {
  CRITICAL: 'C',
  HIGH: 'H',
  MEDIUM: 'M',
  LOW: 'L',
  UNKNOWN: 'U',
};
export const CONFIG_STATUS_MAP = {
  open: 'primary',
  closed: 'no-active',
};
export const FS_STATUS_MAP = {
  success: 'success',
  failed: 'error',
};
export const USER_STATUS_MAP = {
  disabled: 'no-active',
  enabled: 'primary',
  locked: 'error',
};
export const TASK_STATUS_MAP = {
  failed: 'error',
  finished: 'success',
  pending: 'weak',
  running: 'primary',
  unscheduled: 'no-active',
};
// const intl = useIntl();
// export const RISK_OPT = [
//   {
//     label: translate('critical'),
//     value: 'CRITICAL',
//     name: 'critical',
//     color: '#9E0000',
//   },
//   { label: translate('high'), value: 'HIGH', name: 'high', color: '#ED7676' },
//   {
//     label: translate('medium'),
//     value: 'MEDIUM',
//     name: 'medium',
//     color: '#F9A363',
//   },
//   { label: translate('low'), value: 'LOW', name: 'low', color: '#FAD264' },
// ];
// export const VULN_RISK_OPT = [
//   ...RISK_OPT,
//   {
//     label: translate('unknown'),
//     value: 'UNKNOWN',
//     name: 'unknown',
//     color: '#8E97A3',
//   },
// ];
// export const FULL_RISK_OPT = VULN_RISK_OPT;
export const getTaskStatusOptions = (
  taskType: API.ITaskType = 'risks_scan',
  myTask = false,
) => {
  const type =
    {
      assets_scan_task: 'assetsScan',
      compliance_scan_task: 'complianceScan',
      reports_export: 'reportsExport',
      assets_scan_schedule: 'assetsScan',
    }[taskType] || 'assetsScan';
  const opts = [
    { label: translate('failed'), value: 'failed', name: 'error' },
    { label: translate('finished'), value: 'finished', name: 'success' },
    { label: translate('pending'), value: 'pending', name: 'weak' },
    { label: translate(`running.${type}`), value: 'running', name: 'primary' },
    {
      label: translate('unscheduled'),
      value: 'unscheduled',
      name: 'no-active',
    },
  ];
  // 只有在【我的任务】中有 unscheduled
  return myTask ? opts : opts.filter((item) => item.value !== 'unscheduled');
};
export const SCAN_STATUS_MAP = {
  // unpassed、warn、passed
  failed: 'warning',
  passed: 'success',
  unpassed: 'error',
  unscan: 'no-active',
  warn: 'warning',
};
export const VULN_ATTR_MAP = {
  EXP: 'EXP',
  PoC: 'PoC',
  Weapon: 'Weapon',
};
export const SCAN_STATUS_OPT = [
  { label: translate('error'), value: 'failed', name: 'warning' },
  { label: translate('pass'), value: 'passed', name: 'success' },
  { label: translate('notPass'), value: 'unpassed', name: 'error' },
  { label: translate('undetected'), value: 'unscan', name: 'no-active' },
  { label: translate('warning'), value: 'warn', name: 'warning' },
];
export const RATIO_OPT = [
  { label: translate('weeklyCompare'), value: 'week' },
  { label: translate('monthCompare'), value: 'month' },
];
export const RATIO_OPT_VIEW = [
  ...RATIO_OPT,
  { label: translate('periodCompare'), value: 'period' },
];
export const CONFIG_OPT = [
  { label: translate('configRisk'), value: 'config' },
  { label: translate('vuln'), value: 'vuln' },
  { label: translate('sensitive'), value: 'sensitive' },
];
export const TASK_CONFIG_OPT = [
  { label: translate('cloudConfigScan'), key: 'risks_scan_config' },
  { label: translate('agentlessScan'), key: 'risks_scan_agentless' },
];
export enum CONFIG_RISK_STATIC {
  config = 'config',
  vuln = 'vuln',
  sensitive = 'sensitive',
}
// export const CONFIG_RISK_OPT = [
//   { label: translate('configRisk'), value: CONFIG_RISK_STATIC.config },
//   { label: translate('vuln'), value: CONFIG_RISK_STATIC.vuln },
//   { label: translate('sensitive'), value: CONFIG_RISK_STATIC.sensitive },
// ];

export const ISNO_OPT1 = [
  { label: translate('yes'), value: true },
  { label: translate('no'), value: false },
];
export const ISNO_TABLE_ENUM = {
  true: { text: translate('yes') },
  false: { text: translate('no') },
};
export const DEFAULT_PWD = '********************';

export const getSearchParams = (
  searchParams: Iterable<[string, string]>,
): Record<string, string> => {
  const params: any = {};
  // @ts-ignore
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
};
type TAiDes = Pick<
  API.AiConversationReq,
  'actual_questions' | 'user_questions' | 'confirm'
>;
export const getAiDes = (record: any, temp?: any): TAiDes | undefined => {
  if (!temp) {
    return;
  }
  function getStr(str: string = '') {
    return str.replace(
      /([\{]{2})(.+?)([\}]{2})/g,
      (match: string, p1: string, p2: string) => record?.[p2] ?? '-',
    );
  }
  return {
    confirm: getStr(temp.confirm),
    actual_questions: getStr(temp.prompt),
    user_questions: getStr(temp.ui_question),
  };
};

export function getLeaf(treeData?: Record<string, any>[]): string[] {
  let result: string[] = [];
  if (!treeData?.length) {
    return result;
  }
  function loop(data: Record<string, any>[]) {
    data.forEach((item) => {
      if (!item.children) {
        result.push(item.value ?? item.id);
      } else {
        loop(item.children);
      }
    });
  }
  loop(treeData);
  return result;
}

export const ITEM_ALL = CASCADER_OPTION_ALL; //'_all';
export const isSelectAll = (v: SingleValueType[]) =>
  v?.some((v: any) => v?.includes(ITEM_ALL));
export const allItem = { label: translate('all'), value: ITEM_ALL };

export const getOptWithAll = (
  opts: TzCascaderProps['options'],
  curVal: SingleValueType[],
) => {
  opts?.length ? [allItem, ...opts] : [];
  if (!opts?.length) {
    return [];
  }
  function loop(data: any[]) {
    data.forEach((v: any) => {
      v.disabled = true;
      if (v.children?.length) {
        loop(v.children);
      }
    });
  }
  if (isSelectAll(curVal)) {
    const _opts = cloneDeep(opts);
    loop(_opts);
    return [allItem, ..._opts];
  }
  return [allItem, ...opts];
};

// isUrl:是否是复制url, iframe禁用url copy方法
export function copyText(text: string) {
  const textarea = document.createElement('textarea');
  textarea.style.position = 'fixed';
  textarea.style.left = '-1000px';
  textarea.style.top = '0px';
  textarea.style.opacity = '0';
  const currentFocus = document.activeElement as any;
  const toolBoxwrap = document.body;
  toolBoxwrap.appendChild(textarea);
  textarea.defaultValue = text;
  textarea.focus();
  if (textarea.setSelectionRange) {
    textarea.setSelectionRange(0, textarea.value.length);
  } else {
    textarea.select();
  }
  let flag: boolean;
  try {
    flag = document.execCommand('copy');
  } catch (eo) {
    flag = false;
  }
  toolBoxwrap.removeChild(textarea);
  currentFocus && currentFocus.focus({ preventScroll: true });
  if (flag) {
    message.success(translate('copySuc'));
  } else {
    message.error(translate('copyFail'));
  }
  return flag;
}

export const getTableColTimeW = (lang: string, windowW?: number) => {
  if (!windowW || windowW > 1280) {
    return 168;
  }
  return lang === EN_LANG ? 130 : 116;
};

export const clearEmptyValInObj = (data: Record<string, any>) =>
  Object.keys(data)
    .filter(
      (key) =>
        // data[key] !== null && data[key] !== undefined && !!data[key]?.length,
        data[key] !== null && data[key] !== undefined,
    )
    .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});

export const getFilterPannelOpenStatus = () => storage.get('filterPopOver');

export const toDetailIntercept = async (
  queryParam: API.EntityIsExistsRequest,
  linkFn: Function,
) => {
  const { exists } = (await getEntityIsexists(queryParam)) ?? {};
  const lang = getLocale();
  if (!exists) {
    message.error(
      `${get(ENTITY_NOT_EXISTS_TIPS, queryParam.type)}${
        lang === EN_LANG ? ' ' : ''
      }${translate('deleted')}`,
    );
    return;
  }
  return linkFn?.();
};

export const getPlatformItem = (
  p: string,
  data?: TCommonPlatforms[],
): TCommonPlatforms | undefined => {
  if (!data?.length || !p) {
    return;
  }
  return data.find((v) => v.key === p);
};

export const getValueEnumByFilterOption = (
  filterItem?: FilterFormParam,
  platform?: string,
) => {
  if (!filterItem) {
    return;
  }
  const type = get(filterItem, 'type');
  const options = get(filterItem, 'props.options');
  let arr;
  if (type === 'select') {
    arr = options
      ?.filter((item) => !platform || item.platform === platform)
      .map((item) => ({
        ...item,
        text: item.label,
        status: item.value,
      }));
  } else {
    arr = options
      ?.find((item) => item.value === platform)
      ?.children?.map((item) => ({
        ...item,
        text: item.label,
        status: item.value,
      }));
  }

  return keyBy(arr, 'value');
};

export type IPolicyTableOptionals = (
  | string
  | { name: string; label?: string; valueEnum?: TzProColumns['valueEnum'] }
)[];
export const getStandardOptionals = (optionals?: IPolicyTableOptionals) => {
  const obj: Record<string, any> = {};
  optionals?.map((item) => {
    if (isObject(item)) {
      set(obj, [item.name], item);
    } else {
      set(obj, item, { name: item });
    }
  });
  return obj;
};
export function traverseTree(
  tree: any[],
  callback: (node: any, parent: any) => void,
) {
  function traverse(node: { children: any[] }, parent: any) {
    callback(node, parent);
    if (isArray(node.children)) {
      forEach(node.children, (item) => traverse(item, node));
    }
  }

  forEach(tree, (item) => traverse(item, null));
}
