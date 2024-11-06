import { Form } from 'antd';
import React, { cloneElement, useRef } from 'react';

const FormItemWithToolTip = ({
  children,
  formItemProps,
  ...rest
}: {
  formItemProps?: any;
  className?: string;
  children: React.ReactElement;
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  return (
    <Form.Item>
      <div className="tz-filter-form-item-value-tooltip">
        <div
          className="tz-filter-form-item-value-tooltip-content"
          ref={tooltipRef}
        ></div>
      </div>
      <Form.Item {...formItemProps}>
        {cloneElement(children, { tooltipOver: tooltipRef.current, ...rest })}
      </Form.Item>
    </Form.Item>
  );
};

export default FormItemWithToolTip;
