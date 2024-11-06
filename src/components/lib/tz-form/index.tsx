import React, { useMemo, cloneElement, isValidElement } from 'react';
import { Form, FormProps, FormItemProps } from 'antd';
import { merge, trim } from 'lodash';
import composeProps from 'rc-util/es/composeProps';
import './index.less';

export const TzForm = (props: FormProps) => {
  const realProps = useMemo(() => {
    return {
      labelAlign: 'left',
      layout: 'vertical',
      ...props,
      className: `tz-form ${props.className || ''}`,
    };
  }, [props]);
  return <Form {...realProps} />;
};

interface MyFormItemProps extends FormItemProps {
  render?: (children: React.ReactNode) => React.ReactElement;
}

interface MyFormItemChildrenProps {
  render?: MyFormItemProps['render'];
  children: React.ReactElement;
}

function MyFormItemChildren(props: MyFormItemChildrenProps) {
  const { render, children, ...rest } = props;
  // composeProps 合并执行 Form.Item 传的 onChange 以及组件本身的方法
  const _children = cloneElement(children, composeProps(children.props, rest, true));
  if (render) {
    return render(_children);
  }
  return _children;
}

export function MyFormItem(props: MyFormItemProps) {
  const { render, children, style, ...rest } = props;
  return (
    <Form.Item {...rest} style={merge({ color: '#3E4653' }, style)}>
      {isValidElement(children) ? (
        <MyFormItemChildren render={render}>{children}</MyFormItemChildren>
      ) : (
        children
      )}
    </Form.Item>
  );
}

export const TzFormItem = (props: FormItemProps) => {
  const realProps = useMemo(() => {
    return {
      colon: true,
      ...props,
      className: `tz-form-item ${props.className || ''}`,
    };
  }, [props]);
  return <Form.Item {...realProps} />;
};
