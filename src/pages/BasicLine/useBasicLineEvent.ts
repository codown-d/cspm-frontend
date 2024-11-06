import { TzConfirm } from '@/components/lib/tzModal';
import { deleteBaselines } from '@/services/cspm/CloudPlatform';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import { isObject } from 'lodash';
import { Key } from 'react';

export type OprEditType = ['edit', Key | API.BaselineResponse];
export type OprCopyType = ['copy', API.BaselineResponse];
export type OprDeleteType = [
  'delete',
  Pick<API.BaselinesDatum, 'name' | 'id'>,
  () => void,
];
export type OprType = OprEditType | OprDeleteType | OprCopyType;
const useBasicLineEvent = () => {
  const intl = useIntl();
  const handleOprClick = useMemoizedFn(
    (...arg: [React.MouseEvent<HTMLElement, MouseEvent>, ...OprType]) => {
      const [e, type, param, cal] = arg;
      e.stopPropagation();
      if (type === 'edit') {
        isObject(param)
          ? history.push(`/risks/basic-line/edit/${param.basic.id}`, param)
          : history.push(`/risks/basic-line/edit/${param}`);
        return;
      }
      if (type === 'copy') {
        history.push(`/risks/basic-line/add`, param);
        return;
      }
      if (type === 'delete') {
        TzConfirm({
          title: false,
          content: intl.formatMessage(
            { id: 'unStand.deleteBaseLine' },
            { type: intl.formatMessage({ id: 'baseline' }), name: param.name },
          ),
          okButtonProps: {
            danger: true,
          },
          onOk: () => {
            deleteBaselines({ ids: [param.id] }).then(() => {
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
export default useBasicLineEvent;
