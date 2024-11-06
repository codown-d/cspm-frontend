import { produce } from 'immer';
import { merge } from 'lodash';
import {
  Dispatch,
  Key,
  SetStateAction,
  createContext,
  useReducer,
  useState,
} from 'react';
import {
  ActionType,
  AddAction,
  ClearNodePolicyAction,
  MoveNodeAction,
  RemoveAction,
  RemoveNodePolicyPolicyAction,
  UpdateAction,
  UpdateNodeAndChildDataAction,
  UpdateNodePolicyAction,
  UpdateNodeTagsAction,
  UpdatePolicyCountAction,
  UpdateTitleAction,
  deleteTagAction,
} from './interface';
import {
  addNode,
  clearNodePolicy,
  deleteTag,
  getNode,
  // moveNode,
  removeNode,
  removeNodePolicy,
  updateNodePolicies,
  updateNodeTags,
  updatePolicyCount,
} from './util';

export const {
  UPDATE_NODE,
  ADD_NODE,
  REMOVE_NODE,
  UPDATE_NODE_POLICY_COUNT,
  UPDATE_NODE_TAGS,
  DELETE_TAG,
  UPDATE_NODE_AND_CHILDREN_DATA,
  MOVE_NODE,
  UPDATE_NODE_POLICY,
  REMOVE_NODE_POLICY,
  CLEAR_NODE_POLICY,
} = ActionType;

type ComplianceAction =
  | AddAction
  | UpdateAction
  | RemoveAction
  | UpdatePolicyCountAction
  | UpdateTitleAction
  | UpdateNodeAndChildDataAction
  | deleteTagAction
  | UpdateNodeTagsAction
  | UpdateNodePolicyAction
  | RemoveNodePolicyPolicyAction
  | ClearNodePolicyAction
  | MoveNodeAction;

const reducer = produce(
  (draft: API_COMPLIANCE.ComplianceInfoData[], action: ComplianceAction) => {
    const { type, payload } = action;
    switch (type) {
      case ADD_NODE: {
        addNode(draft, payload);
        break;
      }

      case UPDATE_NODE:
        const node = getNode(payload.key, draft);
        // const path = (payload.key as string).replaceAll(SPLIT_KEY_REG, '.');
        // const node = get(draft, getPath(payload.key));
        node && merge(node, payload.nodeData);

        // node.title = payload.nodeData.title;
        break;
      case REMOVE_NODE:
        removeNode(payload, draft);
        break;

      case UPDATE_NODE_POLICY_COUNT:
        updatePolicyCount(draft, payload);
        break;
      case UPDATE_NODE_TAGS:
        updateNodeTags(draft, payload);
        break;
      case DELETE_TAG:
        deleteTag(draft, payload);
        break;
      // case MOVE_NODE:
      //   moveNode(draft, payload);
      //   break;
      case UPDATE_NODE_POLICY:
        updateNodePolicies({
          nodes: draft,
          ...payload,
        });
        break;
      case REMOVE_NODE_POLICY:
        removeNodePolicy({
          nodes: draft,
          ...payload,
        });
        break;
      case CLEAR_NODE_POLICY:
        clearNodePolicy(draft, payload);
        break;
      default:
        break;
    }
  },
);
type ITitle = {
  level?: number;
  title?: string;
};
type IComplianceProps = {
  treeData?: API_COMPLIANCE.ComplianceInfoData[];
  defaultSelectedKeys?: Key[];
  defaultExpandedKeys?: Key[];
  expandedKeys?: Key[];
  selectedKeys?: Key[];
  editNode?: API_COMPLIANCE.ComplianceInfoData;
};
const useCompliance = (initialData?: IComplianceProps): ComplianceBack => {
  const [state, dispatch] = useReducer(reducer, initialData?.treeData ?? []);
  const [editNode, setEditNode] = useState(initialData?.editNode);
  const [selectedKeys, setSelectedKeys] = useState(
    initialData?.defaultSelectedKeys,
  );

  const [expandedKeys, onExpand] = useState(initialData?.defaultExpandedKeys);
  const [hideTypeSwitchTip, setHideTypeSwitchTip] = useState<boolean>();
  const [hideNodeDeleteTip, setHideNodeDeleteTip] = useState<boolean>();
  const [hidePolicyDeleteTip, setHidePolicyDeleteTip] = useState<boolean>();
  const [validateFail, setValidateFail] = useState<boolean>();

  //   编辑节点title数据
  const updateNode = (
    key: UpdateAction['payload']['key'],
    nodeData: UpdateAction['payload']['nodeData'],
  ) => {
    dispatch({
      type: UPDATE_NODE,
      payload: {
        key,
        nodeData,
      },
    });
  };
  // 更新检测项计数
  const updatePolicyCount = (key: Key, policy_count: number) => {
    dispatch({
      type: UPDATE_NODE_POLICY_COUNT,
      payload: {
        key,
        policy_count,
      },
    });
  };

  const updateNodeTags = (key: Key, tags: API_COMPLIANCE.DatumTag[]) => {
    dispatch({
      type: UPDATE_NODE_TAGS,
      payload: { key, tags },
    });
  };
  const deleteTag = (nodeKey: Key, tagKey: Key) => {
    dispatch({
      type: DELETE_TAG,
      payload: { nodeKey, tagKey },
    });
  };

  // 新增节点
  const addNode = (
    node: API_COMPLIANCE.ComplianceInfoData,
    parentKey?: Key,
    index?: number,
  ) => {
    dispatch({
      type: ADD_NODE,
      payload: { node, parentKey, index },
    });
  };
  // 删除节点
  const removeNode = (key: Key) => {
    dispatch({
      type: REMOVE_NODE,
      payload: key,
    });
  };

  // 移动树节点
  // const moveNode = (
  //   parentKey: Key,
  //   node: API_COMPLIANCE.ComplianceInfoData,
  // ) => {
  //   dispatch({
  //     type: MOVE_NODE,
  //     payload: {
  //       parentKey,
  //       node,
  //     },
  //   });
  // };
  const updatePolicy = (payload: UpdateNodePolicyAction['payload']) => {
    dispatch({
      type: UPDATE_NODE_POLICY,
      payload,
    });
  };
  const removePolicy = (payload: RemoveNodePolicyPolicyAction['payload']) => {
    dispatch({
      type: REMOVE_NODE_POLICY,
      payload,
    });
  };
  const clearPolicy = (key: Key) => {
    dispatch({
      type: CLEAR_NODE_POLICY,
      payload: key,
    });
  };

  return {
    treeData: state,
    editNode,
    setEditNode,
    selectedKeys,
    setSelectedKeys,
    expandedKeys,
    onExpand,
    updateNode,
    updatePolicyCount,
    updateNodeTags,
    deleteTag,
    addNode,
    // moveNode,
    removeNode,
    setHideNodeDeleteTip,
    setHidePolicyDeleteTip,
    setHideTypeSwitchTip,
    hideNodeDeleteTip,
    hideTypeSwitchTip,
    hidePolicyDeleteTip,
    updatePolicy,
    removePolicy,
    clearPolicy,
    validateFail,
    setValidateFail,
  };
};
export default useCompliance;
export type ComplianceBack = {
  policies?: API.CommonPolicyItem[];
  treeData?: API_COMPLIANCE.ComplianceInfoData[];
  editNode?: API_COMPLIANCE.ComplianceInfoData;
  setEditNode: Dispatch<
    SetStateAction<API_COMPLIANCE.ComplianceInfoData | undefined>
  >;
  selectedKeys?: Key[];
  isEditDefalut?: boolean;
  hideTypeSwitchTip?: boolean;
  setHideTypeSwitchTip: Dispatch<SetStateAction<boolean | undefined>>;
  hideNodeDeleteTip?: boolean;
  setHideNodeDeleteTip: Dispatch<SetStateAction<boolean | undefined>>;
  hidePolicyDeleteTip?: boolean;
  validateFail?: boolean;
  setValidateFail: Dispatch<SetStateAction<boolean | undefined>>;
  setHidePolicyDeleteTip: Dispatch<SetStateAction<boolean | undefined>>;
  setSelectedKeys: Dispatch<SetStateAction<Key[] | undefined>>;
  expandedKeys?: Key[];
  onExpand: (key: Key[]) => {};
  updateNode: (key: Key, data: ITitle) => void;
  updatePolicyCount: (key: Key, policy_count: number) => void;
  updateNodeTags: (key: Key, tag: API_COMPLIANCE.DatumTag[]) => void;
  deleteTag: (nodeKey: Key, tagKey: Key) => void;
  addNode: (
    node: API_COMPLIANCE.ComplianceInfoData,
    parentKey?: Key,
    index?: number,
  ) => void;
  // moveNode: (key: Key, node: API_COMPLIANCE.ComplianceInfoData) => void;
  removeNode: (key: Key) => void;
  updatePolicy: (payload: UpdateNodePolicyAction['payload']) => void;
  removePolicy: (payload: RemoveNodePolicyPolicyAction['payload']) => void;
  clearPolicy: (key: Key) => void;
  tagList?: API_TAG.TagsDatum[];
  refreshTags?: () => void;
  manual_type_name?: string;
};
export const ComplianceContext = createContext<ComplianceBack>({
  manual_type_name: undefined,
  policies: undefined,
  treeData: undefined,
  editNode: undefined,
  hideTypeSwitchTip: false,
  isEditDefalut: undefined,
  setHideTypeSwitchTip: () => null,
  hideNodeDeleteTip: false,
  hidePolicyDeleteTip: false,
  setHideNodeDeleteTip: () => null,
  setHidePolicyDeleteTip: () => null,
  selectedKeys: undefined,
  expandedKeys: undefined,
  setEditNode: () => null,
  setSelectedKeys: () => null,
  onExpand: () => null,
  updateNode: () => null,
  updatePolicyCount: () => null,
  updateNodeTags: () => null,
  deleteTag: () => null,
  addNode: () => null,
  // moveNode: () => null,
  removeNode: () => null,
  updatePolicy: () => null,
  removePolicy: () => null,
  clearPolicy: () => null,
  validateFail: undefined,
  setValidateFail: () => null,
  refreshTags: () => null,
  tagList: undefined,
});
