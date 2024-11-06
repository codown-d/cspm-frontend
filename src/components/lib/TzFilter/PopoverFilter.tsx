import NoData from '@/components/NoData';
import { storage } from '@/utils/tzStorage';
import { useIntl } from '@umijs/max';
import { useSize } from 'ahooks';
import { Popover, PopoverProps } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { isArray, merge, upperCase } from 'lodash';
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import RenderItem from '../TzFilterForm/RenderItem';
import {
  FilterDatePicker,
  FilterFormParam,
  FilterFormParamCommon,
  FilterSelect,
} from '../TzFilterForm/filterInterface';
import { DATES, SELECTS, getDefaultFormat } from '../TzFilterForm/utils';
import { TzInput } from '../TzInput';
import { TzTooltip } from '../tz-tooltip';
import { TzSelectProps } from '../tzSelect';
import './index.less';
import { FilterContext } from './useTzFilter';

type TPopoverFilter = {
  Popoverprops?: PopoverProps;
  icon: ReactNode;
  className?: string;
  addTipPlacement?: TooltipPlacement | undefined;
};
const PopoverFilter = ({
  Popoverprops,
  className,
  icon,
  addTipPlacement,
}: TPopoverFilter) => {
  const context = useContext?.(FilterContext);
  const {
    addFilter: onChange,
    popoverFilterData: data,
    updateEnumLabels,
  } = context;
  const [fitlerItem, setFitlerItem] = useState<FilterFormParamCommon>();
  const [value, setValue] = useState<any>();
  const [open, setOpen] = useState(false);
  const filterOverRef = useRef<any>();
  const [search, setSearch] = useState<string>();
  const [titleVal, setTitleVal] = useState<string>();

  const { height: containerH = 0 } =
    useSize(document.querySelector('body')) || {};

  const triggerChange = useCallback(
    (value: any) => {
      if (isArray(value) ? value.length : value) {
        fitlerItem &&
          onChange({
            ...fitlerItem,
            value: value,
          });
      }
    },
    [fitlerItem, onChange],
  );

  const initState = () => {
    setValue(undefined);
    setFitlerItem(undefined);
    setSearch(undefined);
    setTitleVal(undefined);
  };

  const handleOpenChange = useCallback(
    (arg: boolean) => {
      if (arg) {
        setOpen(arg);
        return;
      }
      triggerChange(value);
      setOpen(false);
      initState();
    },
    [value, fitlerItem, triggerChange],
  );

  const onOk = useCallback(
    (val: any) => {
      triggerChange(val);
      setOpen(false);
      initState();
    },
    [triggerChange],
  );

  // todo： 业务代码参与了，tz组件库里需要优化处理
  useEffect(() => {
    setTimeout(() => {
      storage.set('filterPopOver', open);
    }, 500);
  }, [open]);

  const handleListItemClick = useCallback(
    ({ value, ...rest }: FilterFormParam) => {
      setFitlerItem(rest as FilterFormParamCommon);
    },
    [],
  );

  const handleChange = useCallback(
    (val: any) => {
      if (fitlerItem?.type === 'rangePicker') {
        const format = getDefaultFormat(fitlerItem);
        setTitleVal(val?.map((v: Dayjs) => (v ? dayjs(v).format(format) : '')));
      }
    },
    [fitlerItem],
  );

  const handleItemChange = useCallback(
    (val: any) => {
      handleChange(val);
      if (fitlerItem?.type === 'rangePickerCt') {
        onOk(formatTriggerValue(val));
      } else {
        setValue(formatTriggerValue(val));
      }
    },
    [fitlerItem],
  );

  const formatTriggerValue = useCallback(
    (val: any) => {
      if (fitlerItem?.type === 'rangePickerCt') {
        return [val, null];
      }
      return val;
    },
    [fitlerItem],
  );

  const mergeProps = useCallback(
    (fitlerItem: FilterFormParamCommon) => {
      if (DATES.includes(fitlerItem.type)) {
        let mergeItem = merge({}, fitlerItem) as FilterDatePicker;
        merge(mergeItem, {
          ...mergeItem,
          props: {
            ...mergeItem.props,
            autoFocus: true,
            onOk: (e: FilterDatePicker['value']) => {
              if (fitlerItem?.type === 'rangePicker') {
                if (isArray(e) && e[0] && e[1]) {
                  onOk(formatTriggerValue(e));
                }
              } else if (fitlerItem?.type !== 'rangePickerCt') {
                onOk(formatTriggerValue(e));
              }
              (fitlerItem as FilterDatePicker).props?.onOk?.(e as Dayjs);
            },
          },
        });
        return mergeItem;
      }
      if (
        fitlerItem.type === 'select' &&
        (fitlerItem as FilterSelect).props?.mode !== 'multiple'
      ) {
        let mergeItem = merge({}, fitlerItem) as FilterSelect;
        merge(mergeItem, {
          onChange: (val: TzSelectProps['value'], valStr: any) => {
            onOk(formatTriggerValue(val));
          },
        });
        return mergeItem;
      }

      return fitlerItem;
    },
    [handleChange],
  );

  const filtered = useMemo(
    () =>
      search
        ? data.filter(
            (item) => upperCase(item.label).indexOf(upperCase(search)) > -1,
          )
        : data,
    [data, search],
  );

  const content = useMemo(() => {
    if (fitlerItem) {
      return (
        <RenderItem
          aa={`${fitlerItem.name}-${fitlerItem.type}`}
          key={`${fitlerItem.name}-${fitlerItem.type}`}
          value={value}
          onChange={handleItemChange}
          updateEnumLabels={updateEnumLabels}
          {...mergeProps(fitlerItem)}
          isFilter
          overRef={filterOverRef.current}
        />
      );
    }

    return filtered.length ? (
      <ul className="tz-filter-list-ul" style={{ maxHeight: containerH - 81 }}>
        {filtered.map((item: FilterFormParam) => (
          <li
            key={item.name}
            className="tz-filter-list-li"
            onClick={() => handleListItemClick(item)}
          >
            {item.icon ? (
              <i
                className={classNames(
                  'tz-filter-form-item-label-icon icon iconfont',
                  item.icon,
                )}
              ></i>
            ) : null}
            <span className="ml-2">{item.label}</span>
          </li>
        ))}
      </ul>
    ) : (
      <NoData small />
    );
  }, [
    filtered,
    fitlerItem,
    value,
    handleItemChange,
    search,
    onOk,
    mergeProps,
    containerH,
  ]);
  const intl = useIntl();

  const title = useMemo(
    () => (
      <TzInput
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        className="tz-filter-overlay-search"
        placeholder={intl.formatMessage({ id: 'input.search' })}
      />
    ),
    [setSearch],
  );

  const titleRender = useMemo(() => {
    if (!open) {
      return '';
    }

    if (
      fitlerItem?.type &&
      (SELECTS.includes(fitlerItem.type) || DATES.includes(fitlerItem?.type))
    ) {
      return '';
    }

    return fitlerItem?.label ?? title;
  }, [titleVal, fitlerItem, open, title]);
  return (
    <div className={classNames('tz-filter-popover', className)}>
      <Popover
        key={+open}
        getPopupContainer={(n) => n}
        open={open}
        content={
          <div
            style={{ visibility: open ? 'visible' : 'hidden' }}
            className={classNames(
              'tz-filter-overlay-popcontent',
              `tz-filter-overlay-popcontent-${fitlerItem?.type}`,
            )}
            ref={filterOverRef}
          >
            {content}
          </div>
        }
        trigger="click"
        overlayClassName={classNames('tz-filter-overlay', {
          'tz-filter-overlay-item-panel': !!fitlerItem,
          'tz-filter-overlay-item-panel-list-overflow':
            !fitlerItem && containerH - (36 * filtered.length + 16 + 81) < 0,
        })}
        title={titleRender}
        onOpenChange={handleOpenChange}
        placement="bottomRight"
        {...Popoverprops}
      >
        <TzTooltip
          title={intl.formatMessage({ id: 'filter.addCondition' })}
          placement={addTipPlacement}
          autoAdjustOverflow
        >
          <div
            className={classNames('tz-filter-button', {
              'tz-filter-button-active': open,
            })}
          >
            {icon}
          </div>
        </TzTooltip>
      </Popover>
    </div>
  );
};

export default PopoverFilter;
