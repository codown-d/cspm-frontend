import useTzFilter from '@/components/lib/TzFilter/useTzFilter';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useTaskEnum } from '@/hooks/enum/useTaskEnum';
import useCompliance from '@/hooks/useCompliance';
import translate from '@/locales/translate';
import { downloadExportFile, taskRetry } from '@/services/cspm/Task';
import { getFilterPannelOpenStatus, getStandardOptionals } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { message } from 'antd';
import { get } from 'lodash';
import { useMemo, useRef } from 'react';

export const ExportFileMap: Record<
  API_TASK.ITaskScopeType,
  { type: 'scanAsset' | 'compliance' | ''; name: string }
> = {
  assets_scan: {
    type: 'scanAsset',
    name: translate('assetScanTaskReport'),
  },
  compliance_scan: {
    type: 'compliance',
    name: translate('complianceScanTaskReport'),
  },
  reports_export: {
    type: '',
    name: '',
  },
};
export const useList = (tab: API.ITaskScopeType) => {
  const actionRef = useRef<ActionType>();
  const { commonConst } = useModel('global') ?? {};
  const { export_type, task_create_type, risk_type } = commonConst ?? {};
  const complianceOptions = useCompliance();
  const { getTaskStatus, getTaskTagInfoByStatus } = useTaskEnum();
  const intl = useIntl();

  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const _optionals = useMemo(() => {
    const optionals = {
      assets_scan: ['type_name', 'content'],
      compliance_scan: ['scope', 'compliance_names'],
      reports_export: [
        'type_name',
        {
          name: 'content',
          label: translate('fileName'),
        },
      ],
    };
    return getStandardOptionals(get(optionals, tab));
  }, [tab]);

  const assetsItem = useMemo(
    () => [
      {
        label: translate('taskType'),
        name: 'sub_type',
        type: 'select',
        icon: 'icon-leixing',
        props: {
          mode: 'multiple',
          options: task_create_type,
        },
      },
      {
        label: translate('detectContent'),
        name: 'scan_types',
        type: 'select',
        icon: 'icon-yanzheng',
        props: {
          mode: 'multiple',
          options: risk_type,
        },
      },
    ],
    [],
  );

  const complianceItem = useMemo(
    () => [
      {
        label: translate('complianceFramework'),
        name: 'compliance_ids',
        type: 'select',
        icon: 'icon-leixing',
        props: {
          mode: 'multiple',
          options: complianceOptions,
        },
      },
    ],
    [complianceOptions],
  );
  const exportItem = useMemo(
    () => [
      {
        label: translate('taskType'),
        name: 'sub_type',
        type: 'select',
        icon: 'icon-leixing',
        props: {
          mode: 'multiple',
          options: export_type,
        },
      },
    ],
    [],
  );
  const defaultItem = useMemo(
    () => ({
      label: translate('status'),
      name: 'status',
      type: 'select',
      icon: 'icon-yunhangshicelve',
      props: {
        mode: 'multiple',
        // options: getTaskStatusOptions(PathMap[tab]),
        options: getTaskStatus(tab),
      },
    }),
    [],
  );

  const filterData = useMemo(() => {
    if (tab === 'assets_scan') {
      return [...assetsItem, defaultItem];
    }
    if (tab === 'compliance_scan') {
      return [...complianceItem, defaultItem];
    }
    if (tab === 'reports_export') {
      return [...exportItem, defaultItem];
    }
    return [];
  }, [assetsItem, complianceItem, exportItem]) as FilterFormParam[];

  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [complianceOptions]);

  const oprFn = useMemoizedFn((type: 'reTry' | 'download', record) => {
    if (getFilterPannelOpenStatus()) {
      return;
    }
    if (type === 'reTry') {
      taskRetry({
        task_id: record.id,
        type: tab,
      }).then((res) => {
        if (!res?.error) {
          const _msg = translate('oprSuc', {
            name: translate(`action.${type}`),
          });
          message.success(_msg);
          actionRef.current?.reload();
        }
      });
      return;
    }
    if (type === 'download') {
      downloadExportFile(record.id).then((res) => {
        if (res) {
          // const aTag: any = document.createElementNS(
          //   'http://www.w3.org/1999/xhtml',
          //   'a',
          // );
          // aTag.href = res.url;
          // aTag.download = record.content;
          // aTag.click();

          var iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          iframe.src = res.url;
          iframe.onload = function () {
            document.body.removeChild(iframe);
          };
        }
      });
    }
  });

  return {
    optionals: _optionals,
    dataFilter,
    actionRef,
    getTaskTagInfoByStatus,
    translate,
    ExportFileMap,
    oprFn,
  };
};
