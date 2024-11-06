import TextHoverCopy from '@/components/TextHoverCopy';
import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import { TzSuccess } from '@/components/lib/tzModal';
import { resetPwd } from '@/services/cspm/UserController';
import { copyText } from '@/utils';
import { ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';

type TRestPwdPopup = {
  open: boolean;
  id: string;
  onCancel?: () => void;
};

const RestPwdPopup = ({ open, onCancel, id }: TRestPwdPopup) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  return (
    <TzModalForm
      form={form}
      width={560}
      title={translate('resetPwd')}
      open={open}
      submitter={{
        searchConfig: {
          submitText: translate('reset'),
          resetText: translate('cancel'),
        },
        resetButtonProps: { className: 'cancel-btn' },
      }}
      modalProps={{ onCancel, wrapClassName: 'u-pwd', destroyOnClose: true }}
      onFinish={async ({ ps }) => {
        try {
          const res = await resetPwd({
            uid: id,
            password: ps,
          });
          message.success(translate('resetSuccess'));
          onCancel?.();
          TzSuccess({
            width: 560,
            title: 'resetSuccess',
            okText: translate('switch.close'),
            onOk: () => {
              copyText(res.password);
            },
            content: (
              <div className="flex-r">
                <span style={{ marginRight: '12px' }}>
                  {translate('pwdModal.newPwd')}:
                </span>
                <TextHoverCopy text={res.password} style={{ width: '70%' }} />
              </div>
            ),
          });
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormText.Password
        name={'ps'}
        label={translate('identityVerification')}
        placeholder={translate('unStand.pleaseInputAurrentAccountPwd')}
        allowClear
        rules={[
          {
            required: true,
            message: translate('requiredTips', {
              name: translate('pwdModal.confirmPwd'),
            }),
          },
        ]}
      />
    </TzModalForm>
  );
};
export default RestPwdPopup;
