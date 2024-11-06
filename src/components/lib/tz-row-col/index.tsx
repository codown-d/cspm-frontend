import { Col, ColProps, Row, RowProps } from 'antd';
import { useMemo } from 'react';

import './index.less';

export const TzRow = (props: RowProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: `tz-row ${props.className || ''}`,
    };
  }, [props]);
  return <Row {...realProps} />;
};

export const TzCol = (props: ColProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: `tz-col ${props.className || ''}`,
    };
  }, [props]);
  return <Col {...realProps} />;
};
