import InfoAlert from '@/components/InfoAlert';
import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzInput } from '@/components/lib/TzInput';
import { TzButton } from '@/components/lib/tz-button';
import { TzForm } from '@/components/lib/tz-form';
import { TzSwitch } from '@/components/lib/tz-switch';
import { TzConfirm } from '@/components/lib/tzModal';
import useCredentials from '@/hooks/useCredentials';
import useEffectivePlatform from '@/hooks/useEffectivePlatform';
import useJump from '@/hooks/useJump';
import { useRegion } from '@/hooks/useRegion';
import useServiceTree from '@/hooks/useServiceTree';
import { ZH_LANG } from '@/locales';
import ScanTypeFormItem from '@/pages/Asset/ScanModal/ScanTypeFormItem';
import RegionDetail from '@/pages/Risks/components/ScanModal/RegionDetail';
import DetectType from '@/pages/components/DetectType';
import SyncPeriod from '@/pages/components/SyncPeriod';
import {
  addPeriodTask,
  editPeriodTask,
  getPeriodTask,
} from '@/services/cspm/Task';
import { ISchedule, cronToDay, dayToCron } from '@/utils/cron';
import {
  getLocale,
  history,
  useIntl,
  useLocation,
  useParams,
  useRouteProps,
  useSearchParams,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import { get, keys } from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './index.less';

const DETECT_TYPE_MAP = {
  platforms: 'platform',
  credential_ids: 'credential',
  region_ids: 'region',
  service_ids: 'service',
};
const TYPE_MAP = {
  platform: 'platforms',
  credential: 'credential_ids',
  region: 'region_ids',
  service: 'service_ids',
};
// 检测范围
interface IDetectScope {
  credential_ids?: number[];
  platforms?: string[];
  region_ids?: string[];
  service_ids?: string[];
  select_all?: boolean;
}

// 配置检测
interface IConfDetect extends IDetectScope {
  // 基线
  benchmark_id: number;
}

// 无代理检测范围
interface INoProxyDetect extends IDetectScope {
  // 漏洞 | 凭证密钥
  type: ('sensitive' | 'vuln')[];
}

// interface IReqConfig {
//   risks_scan_config?: {
//     select_all?: 'platform' | 'credential' | 'region service';
//     platforms?: IDetectScope['platforms'];
//     credential_ids?: IDetectScope['credential_ids'];
//     region_ids?: IDetectScope['region_ids'];
//     service_ids?: IDetectScope['service_ids'];
//   };
//   risks_scan_agentless?: {
//     select_all?: 'platform' | 'credential' | 'region service';
//     sub_types: INoProxyDetect['type'];
//     platforms?: IDetectScope['platforms'];
//     credential_ids?: IDetectScope['credential_ids'];
//     region_ids?: IDetectScope['region_ids'];
//   };
//   assets_sync?: {
//     select_all?: 'platform' | 'credential' | 'region service';
//     platforms?: IDetectScope['platforms'];
//     credential_ids?: IDetectScope['credential_ids'];
//     region_ids?: IDetectScope['region_ids'];
//     service_ids?: IDetectScope['service_ids'];
//   };
// }

interface IForm extends IDetectScope {
  name: string;
  status: boolean;
  note: string;
  schedule: ISchedule;
  // 资产发现同步范围
  detect_type: 'credential_ids' | 'platforms' | 'region_ids' | 'service_ids';
  // 风险检测内容: 配置检测 | 无代理检测
  scan_type: ('config' | 'agentless')[];
  config_config: IConfDetect;
  agentless_config: INoProxyDetect;
}

const RoleForm: React.FC<unknown> = () => {
  const intl = useIntl();
  const { nextTo } = useJump();
  const { breadcrumb } = useRouteProps();
  let { id } = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  const [urlQuery] = useSearchParams();
  const formUpdate = useRef(false);
  const [formIns] = Form.useForm();
  const countRef = useRef(0);
  const agentlessRegions = useRegion(undefined, 'agentless');
  const agentlessPlatforms = useEffectivePlatform('agentless');
  const agentlessCredentials = useCredentials('agentless');
  const regions = useRegion();
  const services = useServiceTree(undefined, 1);
  const platforms = useEffectivePlatform('user');
  const credentials = useCredentials();
  const isZh = getLocale() === ZH_LANG;

  const isEdit = pathname.includes('/edit');
  const isRisk = pathname.includes('/risks');
  const taskType = isRisk ? 'risks_scan' : 'assets_scan';
  const urlPrefix = isRisk ? '/risks/list' : '/asset';
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  // 创建副本
  // console.debug('location', location);
  const isCopy = urlQuery.get('copy');
  if (isCopy) {
    id = urlQuery.get('id')!;
  }

  const cascaderMap = useMemo(
    () => ({
      region_ids: regions,
      service_ids: services,
      platforms,
      credential_ids: credentials,
    }),
    [regions, services, platforms, credentials],
  );
  const agentlessCascaderMap = useMemo(
    () => ({
      region_ids: agentlessRegions,
      platforms: agentlessPlatforms,
      credential_ids: agentlessCredentials,
    }),
    [agentlessRegions, agentlessPlatforms, agentlessCredentials],
  );

  const fetchInfo = useMemoizedFn(async () => {
    const res: API_TASK.PeriodTaskInfo = await getPeriodTask({
      id: id!,
      type: taskType,
    });
    function transScope(scope) {
      if (!scope) {
        return;
      }
      const detect_type = get(TYPE_MAP, scope.type);
      if (scope.select_all) {
        return { ...scope, detect_type };
      } else {
        // const {items:_itemVal} = scope
        let itemIds: any = scope.select_all
          ? []
          : (scope.items || []).map(({ key, platform }) => {
              // 是2级，区域或云服务
              if (['region_ids', 'service_ids'].includes(detect_type)) {
                // 没有id代表一级全选
                return key === platform ? [key] : [platform, key];
              }
              const id = detect_type === 'credential_ids' ? +key : key;
              return id;
            });

        return {
          detect_type,
          select_all: !!scope.select_all,
          [detect_type]: itemIds,
        };
      }
    }

    formIns.setFieldsValue({
      ...res,
      scope: transScope(res.scope),
      // scan_types: scan_type2,
      name: isCopy ? '' : res.name,
      schedule: cronToDay(res.cron),
    });
  });
  useEffect(() => {
    if (id) {
      fetchInfo();
    } else {
      formIns.setFieldValue('status', true);
    }
  }, []);

  const onSubmit = useMemoizedFn(async () => {
    const saveCb = (detailId?: string) => {
      message.success(translate(isEdit ? 'saveSuccess' : 'newSuccess'));
      nextTo(`${urlPrefix}/periodic-task/detail/${isEdit ? id : detailId}`);
    };
    if (isEdit && !formUpdate.current) {
      saveCb();
      return;
    }
    try {
      const formVal: IForm = await formIns.validateFields();
      const { scope: _scope, ...restVals } = formVal;

      // const sub_type = (() => {
      //   if (!isRisk) {
      //     return ['assets_sync'];
      //   }
      //   const arr = [];
      //   scan_type.includes('config') && arr.push('risks_scan_config');
      //   scan_type.includes('agentless') && arr.push('risks_scan_agentless');
      //   return arr;
      // })();
      const path = 'assets_scan';
      const _schedule = dayToCron(formVal.schedule);
      // const req = {
      //   name,
      //   status,
      //   note,
      //   sub_type,
      //   schedule: _schedule,
      // };

      // let scopeKey: any[] = [],
      //   scopeVal: any[] = [];
      // if (isRisk) {
      //   // 配置检测
      //   if (scan_type.includes('config')) {
      //     scopeKey = ['risks_scan_config'];
      //     scopeVal = [config_config];
      //   }
      //   if (scan_type.includes('agentless')) {
      //     scopeKey.push('risks_scan_agentless');
      //     scopeVal.push({
      //       ...agentless_config,
      //       type: undefined,
      //       sub_types: agentless_config.type,
      //       // _isAgentless: true,
      //     });
      //   }
      // } else {
      //   scopeKey = ['assets_sync'];
      //   scopeVal = [
      //     {
      //       ...formVal,
      //       name: undefined,
      //       note: undefined,
      //       status: undefined,
      //       schedule: undefined,
      //     },
      //   ];
      // }
      // // console.debug('scopeVal 0', JSON.stringify(scopeVal, null, 2));
      // scopeVal.forEach((_item, idx) => {
      //   // 检测、同步范围
      //   const scopeType = _item.detect_type;
      //   if (_item.select_all) {
      //     _item.select_all = scopeType;
      //     // 后端要求
      //     scopeVal[idx][scopeType] = undefined;
      //     return undefined;
      //   }
      //   _item.select_all = false;
      //   // 所选的id
      //   scopeVal[idx][scopeType] = _item[scopeType].reduce(
      //     (acc: any, cur: string | [string] | [string, string]) => {
      //       let id3 = cur;
      //       // 全选
      //       if (id3 === CASCADER_OPTION_ALL) {
      //         _item.select_all = scopeType;
      //         return null;
      //       }
      //       const id2s = (() => {
      //         // id3: string
      //         if (!['region_ids', 'service_ids'].includes(scopeType)) {
      //           return [id3];
      //         }
      //         // id3: [parent, child]
      //         if (id3.length > 1) {
      //           return [id3[id3.length - 1]];
      //         }
      //         // id3: [parent]  某个一级全选
      //         return [id3[0]];
      //         /**
      //         const _store = _item._isAgentless
      //           ? agentlessCascaderMap
      //           : cascaderMap;
      //         return get(_store, scopeType)
      //           .find((el: any) => el.value === id3[0])
      //           ?.children?.map((obj: any) => obj.value);
      //         ***/
      //       })();
      //       return [...acc, ...id2s];
      //     },
      //     [],
      //   );
      // });
      // console.debug('scopeVal 1', JSON.stringify(scopeVal, null, 2));

      const { select_all, detect_type, ...rest } = _scope;
      let scopeConf;
      const type = get(DETECT_TYPE_MAP, detect_type);
      if (!_scope.select_all) {
        const key = keys(rest);
        const i = get(rest, key).reduce(
          (acc: any, cur: string | [string] | [string, string]) => {
            let id3 = cur;
            const id2s = (() => {
              // id3: string
              if (!['region_ids', 'service_ids'].includes(detect_type)) {
                return [id3];
              }
              // id3: [parent, child]
              if (id3.length > 1) {
                return [id3[id3.length - 1]];
              }
              // id3: [parent]  某个一级全选
              return [id3[0]];
              /**
              const _store = _item._isAgentless
                ? agentlessCascaderMap
                : cascaderMap;
              return get(_store, scopeType)
                .find((el: any) => el.value === id3[0])
                ?.children?.map((obj: any) => obj.value);
              ***/
            })();
            return [...acc, ...id2s];
          },
          [],
        );
        scopeConf = {
          type,
          // [key[0]]: i,
          items: i?.map((key) => ({ key: `${key}` })),
        };
      } else {
        scopeConf = {
          select_all: true,
          type,
        };
      }
      // const scopeConf: IReqConfig = scopeKey.reduce((acc, k, idx) => {
      //   acc[k] = scopeVal[idx];
      //   return acc;
      // }, {} as any);
      // // console.debug('scopeConf', JSON.stringify(scopeConf, null, 2));
      let res: any = null;
      const _vals = {
        ...restVals,
        scope: scopeConf,
        schedule: _schedule,
      };
      if (isEdit) {
        res = await editPeriodTask({
          type: path,
          id: id!,
          ..._vals,
        });
      } else {
        res = await addPeriodTask(path, {
          ...restVals,
          ..._vals,
        });
      }
      if (!res?.error) {
        saveCb(res.id);
      }
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <TzPageContainer
      className={styles.periodicTaskForm}
      header={{
        title: (
          <PageTitle
            formChanged={formUpdate}
            title={translate(isEdit ? 'editTask' : 'addTask')}
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      footer={[
        <TzButton
          key="cancel"
          className="cancel-btn"
          onClick={() => {
            if (formUpdate.current) {
              TzConfirm({
                content: translate('unStand.cancelTips'),
                cancelText: translate('back'),
                okButtonProps: {
                  type: 'primary',
                },
                cancelButtonProps: {
                  className: 'cancel-btn',
                },
                onOk() {
                  history.back();
                },
              });
            } else {
              history.back();
            }
          }}
        >
          {translate('cancel')}
        </TzButton>,
        <TzButton key="edit" onClick={onSubmit} type="primary">
          {translate(isEdit ? 'save' : 'add')}
        </TzButton>,
      ]}
    >
      {isRisk && (
        <InfoAlert
          className="mb-4"
          tip={
            <>
              {intl.formatMessage({ id: 'unStand.periodDetectInfoPrev' })}
              <RegionDetail key={+new Date()} />
              {intl.formatMessage({ id: 'unStand.periodDetectInfoNext' })}
            </>
          }
        />
      )}
      <TzForm
        layout="vertical"
        form={formIns}
        autoComplete="off"
        onValuesChange={(field) => {
          ++countRef.current;
          formUpdate.current = countRef.current > 2;
          // console.debug('onValuesChange', field);
        }}
      >
        <Form.Item required label={translate('taskStatus')} name={'status'}>
          <TzSwitch size="small" />
        </Form.Item>

        <Form.Item
          required
          label={translate('taskName')}
          name={'name'}
          rules={[
            {
              required: true,
              message: translate('requiredTips', {
                name: translate('taskName'),
              }),
            },
            {
              type: 'string',
              max: 50,
              message: translate('maxLengthTips', {
                name: translate('taskName'),
                len: 50,
              }),
            },
          ]}
        >
          <TzInput
            showCount
            maxLength={50}
            placeholder={translate('txtTips', { name: translate('taskName') })}
          />
        </Form.Item>

        {!isRisk && (
          <DetectType
            isIncrementAll
            label={translate('scanRange')}
            cascaderMap={cascaderMap}
            form={formIns}
            formItemPrev="scope"
          />
        )}
        <ScanTypeFormItem />
        {/* <ScanConfig
          showAddBaseLine
          agentlessCascaderMap={agentlessCascaderMap}
          form={formIns}
          cascaderMap={cascaderMap}
          isIncrementAll
        /> */}

        <Form.Item
          required
          label={translate('executionPeriod')}
          name={'schedule'}
          // rules={[
          //   {
          //     required: true,
          //     message: translate('requiredTips', {
          //       name: translate(
          //         isRisk ? 'detectionCycle' : 'synchronizationCycle',
          //       ),
          //     }),
          //   },
          // ]}
          rules={[
            {
              message: translate('requiredTips', {
                name: translate('executionPeriod'),
              }),
              validator(rule, value) {
                const { period, time, week, day } = value;

                if (!(period && time)) {
                  return Promise.reject();
                }
                if (period === 'everyMonth') {
                  return day?.length ? Promise.resolve() : Promise.reject();
                }
                if (period === 'everyWeek') {
                  return week?.length ? Promise.resolve() : Promise.reject();
                }
                // 每天
                return Promise.resolve();
              },
            },
          ]}
        >
          <SyncPeriod />
        </Form.Item>

        <Form.Item label={translate('remark')} name={'note'}>
          <TzInput.TextArea showCount maxLength={150} />
        </Form.Item>
      </TzForm>
    </TzPageContainer>
  );
};

export default RoleForm;
