import { storage } from '@/utils/tzStorage';
import { useMemoizedFn } from 'ahooks';
import { Form, Space } from 'antd';
import classNames from 'classnames';
import { keys } from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import PopoverFilter from '../TzFilter/PopoverFilter';
import Reset from '../TzFilter/Reset';
import { FilterContext } from '../TzFilter/useTzFilter';
import TzSelect from '../tzSelect';
import FormItemWithToolTip from './FormItemWithToolTip';
import RederValueTxt, { TWids } from './RederValueTxt';
import RenderItem, { SELECT_DEFAULT_PROPS } from './RenderItem';
import {
  FilterDatePicker,
  FilterFormParam,
  FilterRangePicker,
  FilterSelect,
  FilterTimePicker,
} from './filterInterface';
import './index.less';
import { DATES, getDefaultFormat } from './utils';

export interface FilterFormProps {
  formFieldData?: FilterFormParam[];
  className?: string;
  hideToolBar?: boolean;
  onChange?: (values: any, formFieldData: FilterFormParam[]) => void;
}
const NotInitTypes = [
  'datePicker',
  'timePicker',
  'rangePicker',
  'rangePickerCt',
];
const NotShowTypes = ['input'];
const TzFilterForm = ({
  onChange,
  className,
  hideToolBar,
}: FilterFormProps) => {
  const [form] = Form.useForm();
  const context = useContext(FilterContext);
  const [wids, setWids] = useState<TWids>({});
  const {
    state: { filterFormItems, fitlerFormValues, enumLabels },
    removeFilter,
    updateFormItemValue,
    updateEnumLabels,
    popoverFilterData,
  } = context;

  const formFields = useMemo(
    () =>
      filterFormItems?.filter(
        (item) =>
          !NotShowTypes.includes(item.type) &&
          (fitlerFormValues?.[item.name] ?? !NotInitTypes.includes(item.type)),
      ),
    [filterFormItems, fitlerFormValues],
  );

  const [focusItem, setFocusItem] = useState<string>();
  useEffect(
    () => () =>
      formFields.forEach(
        ({ name }) => form?.setFieldValue?.([name], undefined),
      ),
    [JSON.stringify(formFields)],
  );

  useEffect(() => {
    form?.setFieldsValue?.({ ...fitlerFormValues });
    onChange?.(fitlerFormValues, formFields);
  }, [form, fitlerFormValues, formFields]);

  // todo： 业务代码参与了，tz组件库里需要优化处理
  useEffect(() => {
    setTimeout(() => {
      storage.set('filterPopOver', !!focusItem);
    }, 500);
  }, [focusItem]);

  const RenderCondition = ({
    props,
    name,
  }: Pick<FilterSelect, 'props' | 'name'>) => {
    return (
      <TzSelect
        onDropdownVisibleChange={(open: boolean) => {
          open ? setFocusItem(name) : setFocusItem(undefined);
        }}
        popupClassName="tz-filter-form-second-dropdown"
        {...props}
        {...SELECT_DEFAULT_PROPS}
      />
    );
  };

  const renderItem = useMemoizedFn((formFields: FilterFormParam[]) =>
    formFields.map((item) => {
      return (
        <Form.Item
          key={`${item.name}-${item.type}`}
          label={
            <div className="flex gap-x-1">
              {item.icon ? (
                <i
                  className={classNames(
                    'tz-filter-form-item-label-icon icon iconfont',
                    item.icon,
                  )}
                ></i>
              ) : null}
              <span className="whitespace-nowrap">{item.label}</span>
            </div>
          }
          colon={false}
          className={classNames('tz-filter-form-item', {
            'is-initial': !item.value,
          })}
        >
          <Space.Compact>
            {item.type === 'select' && item.condition ? (
              <Form.Item
                name={item.condition.name}
                className={classNames(
                  'tz-filter-form-item-value tz-filter-form-second',
                  {
                    'tz-filter-form-item-value-active':
                      item.condition.name === focusItem,
                  },
                )}
              >
                {RenderCondition(item.condition)}
              </Form.Item>
            ) : (
              <span className="tz-filter-form-second">:</span>
            )}
            {/* {JSON.stringify(item.value)} */}
            <FormItemWithToolTip
              formItemProps={{
                name: item.name,
                className: classNames('tz-filter-form-item-value', {
                  'tz-filter-form-item-value-active': item.name === focusItem,
                }),
              }}
            >
              <RenderItem
                key={`${item.name}-${item.type}`}
                {...item}
                // className={classNames(item.className,{})}
                // value={value}
                wids={wids}
                enumLabels={enumLabels}
                updateEnumLabels={updateEnumLabels}
                setFocusItem={setFocusItem}
              />
            </FormItemWithToolTip>
            {!item.fixed && (
              <Form.Item
                name={item.name}
                className="tz-filter-form-item-delete"
              >
                <div
                  onClick={() => {
                    removeFilter(item.name);
                  }}
                >
                  <i className="icon iconfont tz-icon icon-close tz-close-icon" />
                </div>
              </Form.Item>
            )}
          </Space.Compact>
        </Form.Item>
      );
    }),
  );

  const FormContent = useMemo(() => {
    if (!formFields?.length) {
      return null;
    }

    return (
      <>
        {formFields.some((item) => DATES.includes(item.type)) &&
        !keys(wids).length
          ? null
          : renderItem(formFields)}
        {formFields
          // .filter((item) => DATES.includes(item.type))
          .map((item) => {
            return (
              <RederValueTxt
                key={item.name}
                className="tz-filter-extra-item"
                name={item.name}
                value={fitlerFormValues?.[item.name]}
                type={item.type}
                valueText={enumLabels?.[item.name]}
                format={getDefaultFormat(
                  item as
                    | FilterDatePicker
                    | FilterTimePicker
                    | FilterRangePicker,
                )}
                setWids={setWids}
              />
            );
          })}
      </>
    );
  }, [formFields, fitlerFormValues, enumLabels, wids, focusItem, renderItem]);

  return (
    <Form
      size="small"
      form={form}
      className={classNames(
        'tz-filter-form',
        {
          'tz-filter-form-no-item': !formFields?.length,
        },
        className,
      )}
      layout="inline"
      onValuesChange={(changedValues: any, values: any) => {
        updateFormItemValue(changedValues);
      }}
    >
      {FormContent}
      {!hideToolBar && (
        <>
          <PopoverFilter
            icon={
              <i className="icon iconfont tz-filter-icon tz-add-icon icon-jiahao" />
            }
            className="tz-form-filter-popover"
            Popoverprops={{ placement: 'bottomLeft' }}
          />
          <Reset />
        </>
      )}
    </Form>
  );
};
export default TzFilterForm;
