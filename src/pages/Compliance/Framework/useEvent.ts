import { TzConfirm } from '@/components/lib/tzModal';
import {
  deleteComplianceById,
  toggleCompliance,
} from '@/services/cspm/Compliance';
import { history, useIntl } from '@umijs/max';
import { message } from 'antd';
import { debounce } from 'lodash';

export type IEventExtra = {
  backFn?: () => void;
  //   tableRef?: React.MutableRefObject<ActionType | undefined>;
};
export type IOprData = (
  | API_COMPLIANCE.ComplianceDatum
  | API_COMPLIANCE.ComplianceInfoResponse
) &
  IEventExtra;
export type IEventType = 'switch' | 'createCopy' | 'edit' | 'delete';
const useEvent = () => {
  const intl = useIntl();
  const handleOprClick = debounce(
    (type: IEventType, record: IOprData) => {
      const { status, name, backFn, id } = record;
      switch (type) {
        case 'switch':
          const toggleText = intl.formatMessage({
            id: status ? 'disableFramework' : 'enableFramework',
          });

          TzConfirm({
            content: intl.formatMessage(
              {
                id: status
                  ? 'unStand.areYouSureDisableFragment'
                  : 'unStand.areYouSureEnableFragment',
              },
              { name },
            ),

            cancelText: intl.formatMessage({ id: 'cancel' }),
            okText: toggleText,
            okButtonProps: {
              type: 'primary',
            },
            cancelButtonProps: {
              className: 'cancel-btn',
            },
            onOk() {
              toggleCompliance({
                status: !status,
                id,
              }).then((res) => {
                if (!res) {
                  message.success(
                    intl.formatMessage({ id: 'oprSuc' }, { name: toggleText }),
                  );
                  backFn?.();
                  // tableRef?.current?.reload?.();
                }
              });
            },
          });
          break;
        case 'createCopy':
          history.push(`/compliance/framework/add`, { copyId: id });
          break;

        case 'edit':
          history.push(`/compliance/framework/edit/${id}`);
          break;

        case 'delete':
          TzConfirm({
            title: false,
            okButtonProps: {
              danger: true,
            },
            content: intl.formatMessage(
              { id: 'unStand.deleteFragment' },
              {
                name,
              },
            ),
            onOk: () => {
              deleteComplianceById(id).then((res) => {
                if (!res) {
                  message.success(intl.formatMessage({ id: 'deleteSuc' }));
                  backFn?.();
                }
              });
            },
            okText: intl.formatMessage({ id: 'delete' }),
          });
          break;

        default:
          break;
      }
    },
    300,
    { leading: false },
  );

  return { handleOprClick };
};

export default useEvent;
