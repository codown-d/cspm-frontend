declare namespace API_TAG {
  export interface TagsRequest {
    search?: string;
  }
  export interface TagsDatum {
    desc?: string;
    key?: string;
    updated_at?: number;
    updater?: string;
    values?: Value[];
  }

  export interface DatumValue {
    key: string;
    user_set: boolean;
    values: Value[];
  }

  export interface AddTagsRequest {
    desc: string;
    key: string;
    values: string[];
  }
  export interface UpdateTagsRequest {
    desc: string;
    key: string;
    values: Value[];
  }
  export interface Value {
    id: number;
    value: string;
  }
}
