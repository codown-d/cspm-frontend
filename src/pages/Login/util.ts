export function redirectTo(href?: string) {
  // debugger
  // storage.remove('userInfo');
  // storage.clearCookie();

  // const rt = window.location.hash.replace('#', '');
  // 保留path
  // window.sessionStorage.setItem(loginPreRoute, rt);
  // setUserToken('');
  const aTag: any = document.createElementNS(
    'http://www.w3.org/1999/xhtml',
    'a',
  );
  aTag.href = href ?? `${location.origin}/api/v1/auth/oidc/auth?state=oidc`;
  // aTag.href = 'http://192.168.110.25:9090/api/v1/passport/auth';
  aTag.click();
}
