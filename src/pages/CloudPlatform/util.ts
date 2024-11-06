import { SingleValueType } from '@/components/lib/TzCascader/interface';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { isSelectAll } from '@/utils';
import { CascaderProps } from 'antd';
import { DefaultOptionType } from 'antd/es/cascader';
import {
  cloneDeep,
  flatten,
  get,
  isEmpty,
  isUndefined,
  keys,
  set,
} from 'lodash';
import { Key } from 'react';

export const trans2PluginFilterData = (
  filter_name: SingleValueType[],
  data?: CascaderProps['options'],
) => {
  let filter_ids: number[] = [];
  filter_name?.forEach(([fir, sec]: SingleValueType) => {
    if (sec) {
      filter_ids.push(sec as number);
    } else {
      filter_ids = filter_ids.concat(
        data
          ?.find((v) => v.value === fir)
          ?.children?.map((v: any) => v.value) ?? [],
      );
    }
  });
  return filter_ids;
};
export const trans2OptionVals = (
  ids?: Key[],
  fitlerItem?: FilterFormParam,
): SingleValueType[] | undefined => {
  if (!ids?.length) {
    return;
  }
  const data = get(fitlerItem, 'props.options');

  let filter_ids: Key[] = [];
  if (fitlerItem?.type === 'cascader') {
    data?.forEach(
      (v) =>
        v.children?.forEach(
          (x) => ids.includes(x.value) && filter_ids.push([v.key, x.value]),
        ),
    );
  } else {
    filter_ids = ids;
  }
  return filter_ids as unknown as SingleValueType[];
};

export const trans3PluginFilterData = (
  filter_name: SingleValueType[],
  data?: CascaderProps['options'],
) => {
  let filter_ids: number[] = [];
  filter_name?.forEach(([fir, sec, thr]: SingleValueType) => {
    if (thr) {
      filter_ids.push(thr as number);
    } else if (sec) {
      data
        ?.find((v) => v.value === fir)
        ?.children?.find((v: any) => v.value === sec)
        ?.children.forEach((v: any) => filter_ids.push(v.value));
    } else {
      data
        ?.find((v) => v.value === fir)
        ?.children?.forEach((v: any) =>
          v.children.forEach((j: any) => filter_ids.push(j.value)),
        );
    }
  });
  return filter_ids;
};

export function downFile(res: any, filename: string) {
  const blob = new Blob([res], {
    type: 'application/xls',
  });

  const link = document.createElement('a');
  // 下载后的文件名
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  //释放URL对象
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
  // message.success('导出成功!');
}

export const getCascaderIds = (
  formVals: SingleValueType[],
  cascaderOpt: CascaderProps['options'],
) => {
  return isSelectAll(formVals)
    ? flatten(
        cascaderOpt?.map(
          (v: DefaultOptionType) =>
            v?.children?.map((x: DefaultOptionType) => x.value),
        ),
      )
    : trans2PluginFilterData(formVals, cascaderOpt);
};
const cascaderNames = ['region_ids', 'service_ids', 'asset_type_ids'];
type CascaderFilterItem =
  | 'serviceItem'
  | 'regionItem'
  | 'assetTypeItem'
  | 'tagFilterItem';
type ITransFilterData2Params = Record<CascaderFilterItem, FilterFormParam>;
type TSetFilterVal = {
  key: string;
  formItem?: FilterFormParam;
  undefinedIsAll?: boolean;
  temp: Record<string, any>;
  _val: any;
};
const setFilterVal = ({
  key,
  formItem,
  undefinedIsAll,
  temp,
  _val,
}: TSetFilterVal) => {
  if (isUndefined(_val) && !undefinedIsAll) {
    set(temp, [key], _val);
    return;
  }
  const options = get(formItem, 'props.options', []);
  if (formItem?.type !== 'select') {
    if (undefinedIsAll && isUndefined(_val)) {
      set(
        temp,
        [key],
        flatten(options.map((v) => v.children.map((v) => v.value))),
      );
      return;
    }
    set(temp, [key], trans2PluginFilterData(_val, options));
    return;
  }
  if (undefinedIsAll && isUndefined(_val)) {
    set(
      temp,
      [key],
      options.map((v) => v.value),
    );
    return;
  }
  set(temp, [key], _val);
};
// undefinedIsAll 目前只针对资产发起检测的处理，功能扩展时可根据需求扩展
export const transFilterData2Params = (
  data: Record<string, any>,
  formItems?: Partial<ITransFilterData2Params>,
  undefinedIsAll = false,
) => {
  const temp = {};
  const {
    serviceItem,
    regionItem,
    assetTypeItem,
    credentialItem,
    tagFilterItem,
  } = formItems ?? {};
  keys(data).forEach((key) => {
    let _val = isEmpty(data[key]) ? undefined : cloneDeep(data[key]);

    const _obj = { key, undefinedIsAll, temp, _val };

    if (key === 'region_ids' && regionItem) {
      setFilterVal({ ..._obj, formItem: regionItem });
      return;
    }
    if (key === 'service_ids' && serviceItem) {
      setFilterVal({ ..._obj, formItem: serviceItem });
      return;
    }
    if (key === 'asset_type_ids' && assetTypeItem) {
      setFilterVal({ ..._obj, formItem: assetTypeItem });
      return;
    }
    if (key === 'credential_ids' && credentialItem) {
      setFilterVal({ ..._obj, formItem: credentialItem });
      return;
    }
    if (key === 'tag_ids' && tagFilterItem) {
      setFilterVal({ ..._obj, formItem: tagFilterItem });
      //   set(
      //     temp,
      //     [key],
      //     _val.map((v) => v[1]),
      //   );
      return;
    }
    set(temp, [key], _val);
  });
  return temp;
};
