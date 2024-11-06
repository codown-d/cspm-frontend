import { TzConfirm } from '@/components/lib/tzModal';
import translate from '@/locales/translate';
import { useMemoizedFn } from 'ahooks';

function useCancelFormEdit() {
  const openConfirm = useMemoizedFn((dstBackFn: VoidFunction) => {
    return TzConfirm({
      content: translate('unStand.cancelTips'),
      cancelText: translate('cancel'),
      okButtonProps: {
        type: 'primary',
      },
      cancelButtonProps: {
        className: 'cancel-btn',
      },
      onOk: dstBackFn,
    });
  });

  return openConfirm;
}

export default useCancelFormEdit;
