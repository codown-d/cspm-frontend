import { ModalForm, ModalFormProps } from '@ant-design/pro-components';
import classNames from 'classnames';
import { get } from 'lodash';
import { useMemo } from 'react';
import './index.less';
export type TzModalFormProps = ModalFormProps & {};
const TzModalForm = (props: TzModalFormProps) => {
  const realProps = useMemo(() => {
    const { className, modalProps, ...rest } = props;
    const { className: modalClassName, ...modalRest } = modalProps || {};
    const { submitter } = rest;
    return {
      ...rest,
      submitter: !!submitter
        ? {
            ...submitter,
            resetButtonProps: {
              ...submitter.resetButtonProps,
              className: classNames(
                'tz-button cancel-btn',
                get(submitter, ['resetButtonProps', 'className']),
              ),
            },
            submitButtonProps: {
              ...submitter.submitButtonProps,
              className: classNames(
                'tz-button',
                get(submitter, ['submitButtonProps', 'className']),
              ),
            },
          }
        : submitter,
      modalProps: {
        centered: true,
        maskClosable: false,
        closeIcon: <i className={'icon iconfont icon-close f24'} />,
        ...modalRest,
        className: classNames('tz-modal', className),
        wrapClassName: classNames('tz-modal-mask', modalClassName),
      },
    };
  }, [props]);
  return <ModalForm {...realProps} />;
};
export default TzModalForm;
