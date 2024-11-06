import {type TInitialState} from './app';

export default function (initialState: TInitialState) {
  const _userInfo = initialState?.userInfo;
  if (!_userInfo) {
    return;
  }
  // 是否是主账号
  const primary = _userInfo.primary;
  const _permissions = Object.values(PermisionMap).reduce((acc, k) => {
    acc[k] = primary;
    return acc;
  }, {} as any);
  if (!primary) {
    (_userInfo.permissions || []).forEach(item => {
      // 暂不实现只读权限
      _permissions[item.key] = item.action !== 'deny';
    });
  }
  return _permissions;
}
