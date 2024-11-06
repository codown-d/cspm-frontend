import TzTabs from '@/components/lib/TzTabs';
import { TzButton } from '@/components/lib/tz-button';
import Loading from '@/loading';
import { getRisksStatic } from '@/services/cspm/Risks';
import { CONFIG_RISK_STATIC } from '@/utils';
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useSize } from 'ahooks';
import { Space } from 'antd';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import classNames from 'classnames';
import { get } from 'lodash';
import {
  CSSProperties,
  Suspense,
  lazy,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import RiskExport, { TfilterContainer } from '../components/RiskExport';
import ScanModal from '../components/ScanModal';
import useRiskStore from './useRiskStore';
const RisksWithService = lazy(() => import('./RisksWithService'));

type TDefaultParams = {
  risks_static?: API_RISK.RisksStaticResponse;
  credential_id?: number;
  task_id?: string;
  platform?: string;
};
type TProps = {
  affix?: boolean;
  boxH?: number;
  defaultParams?: TDefaultParams;
  showToolBar?: boolean;
  title?: string;
  infoBreadcrumb?: ItemType[];
  tableAnchorStyle?: CSSProperties;
};
function List(props: TProps) {
  const {
    affix = true,
    showToolBar,
    defaultParams,
    boxH: boxHprops,
    title,
    infoBreadcrumb,
    tableAnchorStyle,
  } = props;

  const intl = useIntl();
  const { commonConst } = useModel('global') ?? {};
  const { risks_static, platform, credential_id, task_id } =
    defaultParams ?? {};

  const [scan, setScan] = useState<boolean>(false);
  const [refreshAction, setRefreshAction] = useState<number>(0);
  const filterContainerRef = useRef<TfilterContainer>({});
  const [risksStatic, setRisksStatic] =
    useState<API_RISK.RisksStaticResponse>();
  const { height = 200 } = useSize(document.body) ?? {};
  const boxH = boxHprops ?? height - 100;
  // const tabIsOpend = useRef<TTabIsOpend>({
  //   vulnOpened: false,
  //   sensitiveOpened: false,
  // });

  const refreshRisksStatic = useMemoizedFn((id?: number) =>
    getRisksStatic(id).then(setRisksStatic),
  );

  useEffect(() => {
    if (risks_static) {
      setRisksStatic(risks_static);
      return;
    }
    if (!showToolBar) {
      return;
    }
    refreshRisksStatic();
  }, [showToolBar, task_id, credential_id, risks_static]);

  const { state, ...restStore } = useRiskStore({
    platform,
    credential_id,
    task_id,
  });

  return (
    <div>
      <div className="head-tit-1 mb-[10px] flex justify-between relative">
        {title ?? intl.formatMessage({ id: 'riskList' })}
        {!!showToolBar && (
          <div className="absolute top-4 right-0 z-[1]">
            <Space size={10}>
              <TzButton onClick={(e) => setScan(true)}>
                {intl.formatMessage({ id: 'scan' })}
              </TzButton>
              <RiskExport
                // tabIsOpend={tabIsOpend.current}
                filterContainerRef={filterContainerRef}
                state={state}
              />
              <TzButton
                onClick={() => {
                  refreshRisksStatic();
                  setRefreshAction((prev) => prev + 1);
                }}
              >
                {intl.formatMessage({ id: 'refreshRisk' })}
              </TzButton>
            </Space>
          </div>
        )}
      </div>
      <div className="mb-4">
        <Suspense fallback={<Loading />}>
          <TzTabs
            className={classNames('common-type-bar')}
            destroyInactiveTabPane={!showToolBar}
            items={[
              CONFIG_RISK_STATIC.config,
              CONFIG_RISK_STATIC.vuln,
              CONFIG_RISK_STATIC.sensitive,
            ].map((key) => {
              const val = get(risksStatic, key);
              const label = commonConst?.risk_type?.find((v) => v.value === key)
                ?.label;
              return {
                key,
                children: (
                  <RisksWithService
                    {...restStore}
                    // task_id={task_id}
                    platform={
                      get(state[key], ['service_data', 'platform']) ?? platform
                    }
                    state={state[key]}
                    affix={affix}
                    boxH={boxH}
                    riskType={key}
                    infoBreadcrumb={infoBreadcrumb}
                    refreshAction={refreshAction}
                    tableAnchorStyle={tableAnchorStyle}
                    total={val}
                  />
                ),
                label: `${label}(${val ?? 0})`,
              };
            })}
            onChange={(e) => {
              // e === 'vuln' && (tabIsOpend.current.vulnOpened = true);
              // e === 'sensitive' && (tabIsOpend.current.sensitiveOpened = true);

              !!credential_id && refreshRisksStatic(credential_id);
            }}
          />
        </Suspense>
      </div>
      {scan && <ScanModal onCancel={() => setScan(false)} open={scan} />}
    </div>
  );
}

export default memo(List);
