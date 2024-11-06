import { TzButton } from '@/components/lib/tz-button';
import { useIntl } from '@umijs/max';
import useNodeEvent from './useNodeEvent';
import { getNewKey } from './util';
type IAddNodeBtn = {
  idx?: number;
};
function AddNodeBtn({ idx = 0 }: IAddNodeBtn) {
  const { newNode } = useNodeEvent();
  const intl = useIntl();
  return (
    <TzButton
      className="mt-3"
      onClick={() =>
        newNode({
          key: getNewKey(),
          type: 'catalog',
        })
      }
    >
      {intl.formatMessage({ id: 'add' })}
    </TzButton>
  );
}

export default AddNodeBtn;
