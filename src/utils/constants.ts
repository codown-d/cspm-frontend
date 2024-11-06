import translate from '@/locales/translate';

export const DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const CLOUD_HOST_ASSET_INFO = {
  public_ip: translate('publicIp'),
  private_ip: translate('privateIp'),
  vpc_id: translate('vpcId'),
  security_group: translate('securityGroup'),
  mac: translate('mac'),
  status: translate('assetStatus'),
  os_version: translate('osVersion'),
  cpu_arch: translate('cpuArch'),
  // os_kernel_version: translate('osKernelVersion'),
  memory: translate('memory'),
};

export const ENTITY_NOT_EXISTS_TIPS = {
  credential: translate('cloudAccountLabel'),
  asset: translate('asset'),
  benchmark: translate('baseline'),
  policy: translate('scanOptions'),
};
export const SSO_STATE = ['oidc'];
export const LOGIN_PATH = ['/ssoLogin', '/login'];
