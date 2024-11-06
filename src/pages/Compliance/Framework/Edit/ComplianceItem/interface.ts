import { Key } from 'react';

export enum ActionType {
  ADD_NODE = 'ADD_NODE',
  UPDATE_NODE = 'UPDATE_NODE',
  REMOVE_NODE = 'REMOVE_NODE',
  UPDATE_NODE_POLICY_COUNT = 'UPDATE_NODE_POLICY_COUNT',
  UPDATE_NODE_TITLE = 'UPDATE_NODE_TITLE',
  DELETE_TAG = 'DELETE_TAG',
  UPDATE_NODE_TAGS = 'UPDATE_NODE_TAGS',
  UPDATE_NODE_AND_CHILDREN_DATA = 'UPDATE_NODE_AND_CHILDREN_DATA',
  MOVE_NODE = 'MOVE_NODE',
  UPDATE_NODE_POLICY = 'UPDATE_NODE_POLICY',
  CLEAR_NODE_POLICY = 'CLEAR_NODE_POLICY',
  REMOVE_NODE_POLICY = 'REMOVE_NODE_POLICY',
}

export type UpdateAction = {
  type: ActionType.UPDATE_NODE;
  payload: {
    key: Key;
    nodeData: Omit<API_COMPLIANCE.ComplianceInfoData, 'key'>;
  };
};

export type UpdateNodeTagsAction = {
  type: ActionType.UPDATE_NODE_TAGS;
  payload: {
    key: Key;
    tags: API_COMPLIANCE.DatumTag[];
  };
};
export type MoveNodeAction = {
  type: ActionType.MOVE_NODE;
  payload: {
    parentKey: Key;
    node: API_COMPLIANCE.ComplianceInfoData;
  };
};
export type UpdateNodeAndChildDataAction = {
  type: ActionType.UPDATE_NODE_AND_CHILDREN_DATA;
  payload: {
    key: Key;
  } & Record<string, any>;
};
export type deleteTagAction = {
  type: ActionType.DELETE_TAG;
  payload: {
    nodeKey: Key;
    tagKey: Key;
  };
};

export type UpdatePolicyCountAction = {
  type: ActionType.UPDATE_NODE_POLICY_COUNT;
  payload: {
    key: Key;
    policy_count: number;
  };
};
export type UpdateTitleAction = {
  type: ActionType.UPDATE_NODE_TITLE;
  payload: {
    key: Key;
    title: number;
    level: number;
  };
};
export type AddAction = {
  type: ActionType.ADD_NODE;
  payload: {
    parentKey?: Key;
    node: API_COMPLIANCE.ComplianceInfoData;
    index?: number;
  };
};
export type RemoveAction = {
  type: ActionType.REMOVE_NODE;
  //   父节点key
  payload: Key;
};
export type UpdateNodePolicyAction = {
  type: ActionType.UPDATE_NODE_POLICY;
  payload: { key: Key; policies?: API.CommonPolicyItem[]; idx?: number };
};
export type RemoveNodePolicyPolicyAction = {
  type: ActionType.REMOVE_NODE_POLICY;
  payload: { key: Key; policyId: Key };
};
export type ClearNodePolicyAction = {
  type: ActionType.CLEAR_NODE_POLICY;
  payload: Key;
};
