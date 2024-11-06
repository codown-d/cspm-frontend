import locale, { EN_LANG } from '@/locales';
import { getLocale } from '@umijs/max';
import { ConfigProvider, Modal, ModalFuncProps, ModalProps } from 'antd';
// import Modal, { ModalFuncProps, ModalProps } from 'antd';
import classNames from 'classnames';
import { get } from 'lodash';
import { createElement, useMemo } from 'react';
import './index.less';

const { confirm, warning, success } = Modal;

export interface TzModalProps extends ModalProps {
  children?: any;
}

export const TzModal = (props: TzModalProps) => {
  const realProps = useMemo(() => {
    return {
      focusTriggerAfterClose: false,
      closeIcon: <i className={'icon iconfont icon-close f24'}></i>,
      width: props.width || 560,
      centered: true,
      ...props,
      okButtonProps: {
        ...props.okButtonProps,
        className: classNames(
          'tz-button',
          get(props, ['okButtonProps', 'className']),
        ),
      },
      cancelButtonProps: {
        ...props.cancelButtonProps,
        className: classNames(
          'tz-button cancel-btn',
          get(props, ['cancelButtonProps', 'className']),
        ),
      },
      className: `tz-modal ${props.className || ''}`,
    };
  }, [props]);
  return <Modal {...realProps} />;
};

export const TzConfirm = (props: ModalFuncProps) => {
  const lang = getLocale();

  return Modal.confirm({
    closeIcon: <i className={'icon iconfont icon-close f24'} />,
    closable: true,
    width: 520,
    icon: <></>,
    focusTriggerAfterClose: false,
    centered: true,
    ...props,
    okButtonProps: {
      ...props.okButtonProps,
      className: classNames(
        'tz-button',
        get(props, ['okButtonProps', 'className']),
      ),
    },
    cancelButtonProps: {
      ...props.cancelButtonProps,
      className: classNames(
        'tz-button cancel-btn',
        get(props, ['cancelButtonProps', 'className']),
      ),
    },
    wrapClassName: `tz-confirm-modal ${props.className || ''}`,
    content: createElement(
      ConfigProvider,
      { locale: lang === EN_LANG ? locale.enUS_antd : locale.zhCN_antd },
      props.content,
    ),
    // okText: props.okText || translations.confirm_modal_sure,
    // cancelText: props.cancelText || translations.cancel,
  });
};

export const TzWarning = (props: ModalFuncProps) => {
  return warning(
    Object.assign({}, props, {
      okButtonProps: {
        ...props.okButtonProps,
        className: classNames(
          'tz-button',
          get(props, ['okButtonProps', 'className']),
        ),
      },
      cancelButtonProps: {
        ...props.cancelButtonProps,
        className: classNames(
          'tz-button cancel-btn',
          get(props, ['cancelButtonProps', 'className']),
        ),
      },
      className: `tz-confirm-modal ${props.className || ''}`,
    }),
  );
};
export const TzSuccess = (props: ModalFuncProps) => {
  return success(
    Object.assign({}, props, {
      okButtonProps: {
        ...props.okButtonProps,
        className: classNames(
          'tz-button',
          get(props, ['okButtonProps', 'className']),
        ),
      },
      cancelButtonProps: {
        ...props.cancelButtonProps,
        className: classNames(
          'tz-button cancel-btn',
          get(props, ['cancelButtonProps', 'className']),
        ),
      },
      icon: <></>,
      style: { top: '50%', marginTop: '-165px' },
      className: `tz-confirm-modal ${props.className || ''}`,
    }),
  );
};
