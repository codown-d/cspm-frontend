import { TzConfirm } from '@/components/lib/tzModal';
import { deleteCredentials } from '@/services/cspm/CloudPlatform';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';

export type OprEditType = ['edit', string];
export type OprDeleteType = [
  'delete',
  Pick<API.CredentialsDatum, 'name' | 'id'>,
  () => void,
];
export type OprType = OprEditType | OprDeleteType;
const useClodPlatformEvent = () => {
  const intl = useIntl();
  const handleOprClick = useMemoizedFn(
    (...arg: [React.MouseEvent<HTMLElement, MouseEvent>, ...OprType]) => {
      const [e, type, param, cal] = arg;
      e.stopPropagation();
      if (type === 'edit') {
        history.push(`/sys/cloud-platform/edit/${param}`);
        return;
      }
      if (type === 'delete') {
        TzConfirm({
          title: false,
          okButtonProps: {
            danger: true,
          },
          content: intl.formatMessage(
            { id: 'unStand.deleteBaseLine' },
            {
              type: intl.formatMessage({ id: 'cloudAccount1' }),
              name: param.name,
            },
          ),
          onOk: () => {
            deleteCredentials({ id: +param.id }).then(() => {
              message.success(
                intl.formatMessage(
                  { id: 'oprSuc' },
                  { name: intl.formatMessage({ id: 'delete' }) },
                ),
              );
              cal();
            });
          },
          okText: intl.formatMessage({ id: 'delete' }),
        });
        return;
      }
    },
  );
  return { handleOprClick };
};
export default useClodPlatformEvent;
