import { registerAuthLicense } from '@/services/cspm/UserController';
import { ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, message } from 'antd';
import classNames from 'classnames';
import TzModalForm from '../../../components/lib/ProComponents/TzModalForm';
import styles from './index.less';

type LicenseModalProps = {
  open: boolean;
  isActive?: boolean;
  onCancel?: () => void;
  cal?: VoidFunction;
};
const LicenseModal = ({ isActive, open, onCancel, cal }: LicenseModalProps) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({
        id: isActive ? 'softwareActivation' : 'updateLicense',
      })}
      open={open}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({
            id: isActive ? 'activate' : 'update',
          }),
        },
        resetButtonProps: { className: 'cancel-btn' },
      }}
      modalProps={{
        closable: !isActive,
        onCancel,
        destroyOnClose: true,
        className: classNames(styles.licenseModal, {
          [styles.isActive]: isActive,
        }),
      }}
      onFinish={async (val) => {
        try {
          await registerAuthLicense(val as API.RegisterAuthLicenseRequest);
          message.success(
            intl.formatMessage({
              id: isActive ? 'activateSuc' : 'saveSuccess',
            }),
          );
          cal?.();
          onCancel?.();
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      {/* <div className="mb-5">
        <p className="text-[#6c7480] mb-1">Environment key：</p>
        <div
          className="link group flex-1 min-w-0  flex"
          style={{ maxWidth: '100%' }}
          onClick={(e?: React.MouseEvent<HTMLDivElement>) => {
            copy(content);
            message.success(translate('TzProDescriptions.copySuc'));
            e?.stopPropagation();
          }}
        >
          <TzTypography.Text
            ellipsis={{
              tooltip: content,
            }}
          >
            {content}
          </TzTypography.Text>
          <i className="icon iconfont icon-fuzhi hidden group-hover:inline leading-3 ml-1 mt-1" />
        </div>
      </div> */}

      <ProFormText
        name="license"
        label="License"
        placeholder={intl.formatMessage({ id: 'txtTips' }, { name: 'License' })}
        allowClear
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: 'License' },
            ),
          },
        ]}
      />
    </TzModalForm>
  );
};
export default LicenseModal;
