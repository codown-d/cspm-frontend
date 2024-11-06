// 运行时配置
import { RuntimeAntdConfig, getLocale, history } from '@umijs/max';
import 'dayjs/locale/es-us';
import 'dayjs/locale/zh-cn';
import { merge } from 'lodash';
import 'nprogress/nprogress.css';
import './antd.less';
import './app.less';
import { TCommonPlatforms } from './interface';
import locale, { EN_LANG, ZH_LANG } from './locales';
import { changeLanguage } from './locales/translate';
import { requestConfig } from './requestConfig';
import {
  getCommonPlatforms,
  getSystemConfigs,
} from './services/cspm/CloudPlatform';
import { PUBLIC_URL, getJWT } from './utils';
import { SSO_STATE } from './utils/constants';
import { storage } from './utils/tzStorage';

export type TInitialState = {
  userInfo?: API.LoginResponse;
  aiPromptTemplates?: Record<string, API.AiPromptTemplate>;
  commonPlatforms?: TCommonPlatforms[];
  // 当前用户下的云平台列表
  commonEffectPlatforms?: TCommonPlatforms[];
  text: Record<string, API.AgentlessRegionsInfo[]>;
  servicesMap: Record<string, string[]>;
  platformSequence: Record<string, number>;
};
export async function getInitialState(): Promise<TInitialState> {
  const userInfo = storage.get('userInfo');
  const token = storage.getCookie('token');
  if (!storage.getCookie('lang')) {
    changeLanguage(ZH_LANG);
  }

  const params = new URL(document.location).searchParams;
  const state = params.get('state');
  if (state && SSO_STATE.includes(state)) {
    history.replace(`/ssoLogin?code=${params.get('code')}&state=${state}`);
    return null as any;
  }

  if (!token || token === '0') {
    history.replace('/login');
    return null as any;
  }

  const systemConfigRes = await getSystemConfigs();
  const { ai_prompt_templates, text, services, platform_sequence } =
    systemConfigRes;
  const aiPromptTemplates = ai_prompt_templates?.reduce(
    (t: Record<string, any>, v: API.AiPromptTemplate) => {
      t[v.key] = v;
      return t;
    },
    [],
  );

  // const commonPlatformsRes = await getCommonPlatforms({ use_case: 'user' });
  const commonPlatformsRes = await getCommonPlatforms();
  const commonEffectPlatformsRes = await getCommonPlatforms({
    use_case: 'user',
  });

  const commonPlatforms = commonPlatformsRes?.map(
    (v: API.CommonPlatformsResponse) =>
      ({
        ...v,
        label: v.name,
        value: v.key,
        icon: `${PUBLIC_URL}/api/v1/common/fs${v.icon}?${getJWT()}`,
      }) as TCommonPlatforms,
  );

  return {
    aiPromptTemplates,
    userInfo,
    commonPlatforms,
    commonEffectPlatforms: commonEffectPlatformsRes?.map(
      (v: API.CommonPlatformsResponse) =>
        ({
          ...v,
          label: v.name,
          value: v.key,
        }) as TCommonPlatforms,
    ),
    text,
    servicesMap: services,
    platformSequence: platform_sequence,
  };
}

export const antd: RuntimeAntdConfig = (memo) => {
  const lang = getLocale();
  merge(memo, {
    appConfig: {
      autoInsertSpaceInButton: false,
      locale: lang === EN_LANG ? locale.enUS_antd : locale.zhCN_antd,
    },
    theme: {
      // token: { fontSize: lang === EN_LANG ? 12 : 14 },
    },
  });

  return memo;
};

export const request = {
  // dataField: 'data',
  // request: {
  //   dataField: 'data',
  // },
  ...requestConfig,
};

// export function rootContainer(container: React.ReactElement) {
//   return React.createElement(
//     StyleProvider,
//     {
//       hashPriority: 'high',
//       transformers: [legacyLogicalPropertiesTransformer],
//     },
//     container,
//   );
// }
// const location = useLocation();
// const outlet = useOutlet();
// export function rootContainer(container: React.ReactElement) {
//   const res = useActivity({ action: history.action, location, outlet });
//   return React.createElement(
//     OffScreenContext.Provider,
//     {
//       value: res,
//     },
//     container,
//   );
// }
