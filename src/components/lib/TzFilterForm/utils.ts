import { keys, set } from 'lodash';
import {
  FilterDatePicker,
  FilterFormParam,
  FilterRangePicker,
  FilterTimePicker,
} from './filterInterface';

export const SELECTTYPE = 'select';

const validadVal = (v: string) => v !== undefined;
export const initFormFields = (
  formFields: FilterFormParam[],
): FilterFormParam[] => {
  if (!formFields?.length) {
    return [];
  }
  const itemVal = formFields
    .filter((item) => validadVal(item.value))
    .map((v) => v.name);
  return formFields.filter((t) => itemVal.includes(t.name));
};

// ===================== Format =====================
export function getDefaultFormat(
  param: FilterDatePicker | FilterTimePicker | FilterRangePicker,
) {
  const { type, props } = param;
  const { format, picker, showTime, use12Hours } = props || ({} as any);
  let mergedFormat = format;
  let mergedPicker =
    picker ??
    {
      datePicker: 'date',
      timePicker: 'time',
      rangePicker: 'date',
    }[type];
  if (!mergedFormat) {
    switch (mergedPicker) {
      case 'time':
        mergedFormat = use12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
        break;

      case 'week':
        mergedFormat = 'gggg-wo';
        break;

      case 'month':
        mergedFormat = 'YYYY-MM';
        break;

      case 'quarter':
        mergedFormat = 'YYYY-[Q]Q';
        break;

      case 'year':
        mergedFormat = 'YYYY';
        break;

      default:
        mergedFormat = showTime ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY-MM-DD';
    }
  }

  return mergedFormat;
}

export function toArray<T>(val: T | T[]): T[] {
  if (val === null || val === undefined) {
    return [];
  }

  return Array.isArray(val) ? val : [val];
}

export const DATES = [
  'rangePicker',
  'datePicker',
  'timePicker',
  'rangePickerCt',
];
export const SELECTS = ['cascader', 'select'];

export type NamePathMap = { name: string; path: (string | number)[] };
export function transFormData(
  changedValues: any,
  formFields: FilterFormParam[],
) {
  const fieldName = formFields.map((item: FilterFormParam, idx: number) => ({
    name: item.name,
    path: [idx],
  }));
  const conditionName = formFields
    .map((item: FilterFormParam, idx: number) =>
      item.type === SELECTTYPE && item.condition
        ? { name: item.condition.name, path: [idx, item.condition.name] }
        : undefined,
    )
    .filter((v) => v) as NamePathMap[];
  const effectiveVals: NamePathMap[] = [...fieldName, ...conditionName];
  keys(changedValues).forEach((key) => {
    const val = changedValues[key];
    const cur = effectiveVals.find((v) => v.name === key);
    if (!cur) {
      return formFields;
    }
    set(formFields, [...cur.path, 'value'], val);
  });
  return formFields;
}

export function displayTextWidth(text: string, font?: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }
  context.font = font || '14px';
  const dimension = context.measureText(text);
  return dimension.width;
}
