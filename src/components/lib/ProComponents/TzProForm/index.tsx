import { ProForm, ProFormItem, ProFormProps } from '@ant-design/pro-components';
import { Form } from 'antd';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import './index.less';
export type TzProFormProps = ProFormProps & {};
function TzProForm<T = Record<string, any>>(
  props: ProFormProps<T> & {
    children?: React.ReactNode | React.ReactNode[];
  },
) {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: classNames('tz-form', props.className),
    };
  }, [props]);
  return <ProForm {...realProps} />;
}
TzProForm.Group = ProForm.Group;
TzProForm.useForm = Form.useForm;
TzProForm.Item = ProFormItem;
TzProForm.useWatch = Form.useWatch;
TzProForm.ErrorList = Form.ErrorList;
TzProForm.Provider = Form.Provider;
TzProForm.useFormInstance = Form.useFormInstance;
TzProForm.EditOrReadOnlyContext = ProForm.EditOrReadOnlyContext;
export default TzProForm;
