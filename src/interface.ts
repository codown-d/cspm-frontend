export type TCommonPlatforms = API.CommonPlatformsResponse & {
  label: string;
  value: string;
};

export type IState = {
  from?: string;
  task_id?: number;
};

export enum STATISTICS_CATEGORY_ENUM {
  Credential = 'credential',
  Platform = 'platform',
  Region = 'region',
  Service = 'service',
}
