import { useModel } from '@umijs/max';
import { useMemo } from 'react';
const usePlatformKeys = (isFull?: boolean) => {
  const { initialState } = useModel('@@initialState');
  const { commonEffectPlatforms, commonPlatforms } = initialState ?? {};

  const platformKeys = useMemo(
    () => (isFull ? commonPlatforms : commonEffectPlatforms)?.map((v) => v.key),
    [],
  );

  return {
    platformKeys,
    platformsOpt: isFull ? commonPlatforms : commonEffectPlatforms,
  };
};
export default usePlatformKeys;
