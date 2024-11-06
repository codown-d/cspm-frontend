import TextHoverCopy from '@/components/TextHoverCopy';
import { TzForm, TzFormItem } from '@/components/lib/tz-form';
import { TzInputNumber } from '@/components/lib/tz-input-number';
import { TzInputPassword } from '@/components/lib/tz-input-password';
import { TzModal, TzSuccess } from '@/components/lib/tzModal';
import {
  allotcredit,
  deleteSysUser,
  enableDisable,
  getResidueCredit,
  resetPwd,
  unlockUser,
} from '@/services/cspm/UserController';
import { copyText } from '@/utils';
import { history, useIntl, useLocation } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { int2str, str2int } from './tool';

interface IProps {
  actionRef?: any;
}

export type ActTypeEnum =
  | 'delete'
  | 'resetPwd'
  | 'enabled'
  | 'disabled'
  | 'unlock'
  | 'point'
  | '';

const ActionModal = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { actionRef } = props;
  const prevModalPropsRef = useRef({});
  const isUserDetail = useLocation().pathname.includes(
    'user-management/detail/',
  );
  const [formIns] = Form.useForm();
  const [type, setType] = useState<ActTypeEnum>('');
  // 可分配点数
  const [residueCredit, setResidueCredit] = useState(0);
  // const [strength, setStrength] = useState(-1);
  const [curRecord, setRecord] = useState<any>({});
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const refreshTable = actionRef?.current?.reload ?? (() => {});

  const fetchCredit = useMemoizedFn(() => {
    getResidueCredit().then((res) => {
      setResidueCredit(res.credit ?? 0);
    });
  });

  const onClose = useMemoizedFn(() => {
    setType('');
    setRecord({});
  });
  // 必须使用引用数据方式
  const onDialogOk = useMemoizedFn(async (type: ActTypeEnum) => {
    const _useId = curRecord.uid;
    if (type === 'delete') {
      deleteSysUser(_useId).then(() => {
        onClose();
        message.success(translate('oprSuc', { name: translate('delete') }));
        if (isUserDetail) {
          history.back();
        } else {
          refreshTable();
        }
      });
      return;
    }
    if (type === 'resetPwd') {
      try {
        const { password } = await formIns.validateFields();
        resetPwd({
          uid: _useId,
          password,
        }).then((res) => {
          onClose();
          message.success(translate('resetSuccess'));
          TzSuccess({
            width: 560,
            title: translate('resetSuccess'),
            okText: translate('disable'),
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
        });
      } catch (_) {}
      return;
    }
    if (['enabled', 'disabled'].includes(type)) {
      enableDisable({
        uid: _useId,
        disable: type === 'disabled',
      }).then((res) => {
        onClose();
        const _msg = translate('oprSuc', {
          name: translate(`action.${type}`),
        });
        message.success(_msg);
        refreshTable();
      });
      return;
    }
    if (type === 'unlock') {
      unlockUser(_useId).then(() => {
        onClose();
        const _msg = translate('oprSuc', {
          name: translate(`action.${type}`),
        });
        message.success(_msg);
        refreshTable();
      });
      return;
    }
    if (type === 'point') {
      try {
        const { point } = await formIns.validateFields();
        allotcredit({
          uid: _useId,
          credit: +point,
        }).then((res) => {
          if (!res) {
            onClose();
            message.success(
              translate('oprSuc', { name: translate('allocatePoints') }),
            );
            refreshTable();
          }
        });
      } catch (_) {}
      return;
    }
  });

  const actionFn = useMemoizedFn((type: ActTypeEnum, record: any) => {
    if (type === 'point') {
      fetchCredit();
    }
    setType(type);
    setRecord(record);
    formIns.resetFields();
  });
  useImperativeHandle(ref, () => actionFn);

  const modalProps: any = useMemo(() => {
    const modalV = {
      open: true,
      title: '',
      width: '420px',
      onOk: () => onDialogOk(type),
    };
    if (['enabled', 'disabled'].includes(type)) {
      return {
        ...modalV,
        className: 'tz-confirm-modal',
        okText: translate(`action.${type}`),
        childNode:
          type === 'enabled' ? (
            <p>{translate('unStand.enableUserTip')}</p>
          ) : (
            <p>{translate('unStand.disableUserTip')}</p>
          ),
      };
    }
    if (type === 'delete') {
      return {
        ...modalV,
        className: 'tz-confirm-modal',
        okButtonProps: {
          danger: true,
        },
        okText: translate('delete'),
        childNode: (
          <p
            style={{
              marginTop: '20px',
              marginBottom: '12px',
              wordBreak: 'break-all',
            }}
          >
            {translate('unStand.deleteUserTip', {
              username: curRecord.username,
            })}
          </p>
        ),
      };
    }
    if (type === 'unlock') {
      return {
        ...modalV,
        className: 'tz-confirm-modal',
        okText: translate('action.unlock'),
        childNode: (
          <p style={{ marginTop: '20px', marginBottom: '12px' }}>
            {translate('unStand.unlockUserTip')}
          </p>
        ),
      };
    }
    if (type === 'resetPwd') {
      return {
        ...modalV,
        width: undefined,
        title: translate('resetPwd'),
        okText: translate('reset'),
      };
    }
    if (type === 'point') {
      return {
        ...modalV,
        width: undefined,
        // credit_used
        title: (
          <p>
            <span className="font-semibold">{translate('allocatePoints')}</span>
            <span
              style={{ color: '#B3BAC6', fontSize: '14px', marginLeft: '8px' }}
            >
              {`${translate('availablePoints')} (${residueCredit})`}
            </span>
          </p>
        ),
        okText: translate('allocate'),
      };
    }
    return prevModalPropsRef.current;
  }, [type, curRecord, residueCredit]);

  useEffect(() => {
    !!type && (prevModalPropsRef.current = modalProps);
  }, [modalProps, type]);

  return (
    <TzModal
      {...modalProps}
      keyboard={false}
      open={!!type}
      maskClosable={false}
      onCancel={onClose}
    >
      {['resetPwd', 'point'].includes(type) ? (
        <TzForm layout={'vertical'} form={formIns}>
          {type === 'resetPwd' ? (
            <TzFormItem
              name={'password'}
              className={'label-w100'}
              required
              label={translate('identityVerification')}
              rules={[
                {
                  required: true,
                  message: translate('unStand.pleaseInputAurrentAccountPwd'),
                },
              ]}
            >
              <TzInputPassword
                placeholder={translate('unStand.pleaseInputAurrentAccountPwd')}
                allowClear
              />
            </TzFormItem>
          ) : (
            <TzFormItem
              name={'point'}
              required
              label={translate('allocatePoints')}
              rules={[
                {
                  required: true,
                  message: translate('unStand.pleaseInputAllocatedpoin'),
                },
                {
                  type: 'number',
                  min: 1,
                  // message: translate('greaterThan', { n: 1 }),
                },
                {
                  type: 'number',
                  max: residueCredit,
                  message: translate('unStand.inputNotGreaterAvailable'),
                },
              ]}
            >
              <TzInputNumber
                type={'number'}
                style={{ width: '100%' }}
                placeholder={translate('unStand.pleaseInputAllocatedpoin')}
                formatter={int2str}
                parser={str2int}
              />
            </TzFormItem>
          )}
        </TzForm>
      ) : (
        modalProps.childNode
      )}
    </TzModal>
  );
});

export default memo(ActionModal);
