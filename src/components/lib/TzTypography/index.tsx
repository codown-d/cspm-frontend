import { Typography, TypographyProps } from 'antd';
import { ParagraphProps } from 'antd/lib/typography/Paragraph';
import { TextProps } from 'antd/lib/typography/Text';
import classNames from 'classnames';
import { isBoolean, isObject } from 'lodash';
import { forwardRef, useMemo } from 'react';
import './index.less';

const TzTypography = (
  props: TypographyProps & {
    className?: string;
  },
) => {
  return <Typography {...props} />;
};

const TzText = forwardRef<
  HTMLSpanElement,
  TextProps & {
    className?: string;
  }
>((props, ref) => {
  const { ellipsis, className, ...restProps } = props;

  const _ellipsis = useMemo(() => {
    const defaultItem = { destroyTooltipOnHide: true };
    if (!ellipsis || isBoolean(ellipsis)) {
      return {
        tooltip: defaultItem,
      };
    }
    return {
      ...ellipsis,
      tooltip: {
        ...defaultItem,
        ...(isObject(ellipsis.tooltip)
          ? ellipsis.tooltip
          : { title: ellipsis.tooltip }),
      },
    };
  }, [ellipsis]);
  return (
    <Typography.Text
      ref={ref}
      className={classNames('tz-typography-text', className)}
      ellipsis={_ellipsis}
      {...restProps}
    />
  );
});
const TzParagraph = forwardRef<
  HTMLSpanElement,
  ParagraphProps & {
    className?: string;
  }
>((props, ref) => {
  const { ellipsis, className, ...restProps } = props;

  const _ellipsis = useMemo(() => {
    const defaultItem = { destroyTooltipOnHide: true };
    if (!ellipsis || isBoolean(ellipsis)) {
      return {
        tooltip: defaultItem,
      };
    }
    return {
      ...ellipsis,
      tooltip: {
        ...defaultItem,
        ...(isObject(ellipsis.tooltip)
          ? ellipsis.tooltip
          : { title: ellipsis.tooltip }),
      },
    };
  }, [ellipsis]);
  return (
    <Typography.Paragraph
      ref={ref}
      className={classNames('tz-typography-paragraph', className)}
      ellipsis={_ellipsis}
      {...restProps}
    />
  );
});
TzTypography.Text = TzText;
TzTypography.Paragraph = TzParagraph;
TzTypography.Link = Typography.Link;
TzTypography.Title = Typography.Title;

export default TzTypography;
