import { useEffect, useRef } from 'react';
import { TzTooltip, TzTooltipProps } from '../../tz-tooltip';

type TSelectWrapper = {
  onMouseEnter?: EventListenerOrEventListenerObject;
  onMouseLeave?: EventListenerOrEventListenerObject;
  children: any;
};

const SelectWrapper = ({
  onMouseEnter,
  onMouseLeave,
  ...rest
}: TSelectWrapper) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapRef = ref.current;
    onMouseEnter && wrapRef?.addEventListener('mouseenter', onMouseEnter);
    onMouseLeave && wrapRef?.addEventListener('mouseleave', onMouseLeave);
    return () => {
      onMouseEnter && wrapRef?.removeEventListener('mouseenter', onMouseEnter);
      onMouseLeave && wrapRef?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseEnter, onMouseLeave]);
  return (
    <div
      ref={ref}
      style={{ display: 'flex' }}
      //@ts-ignore
      {...rest}
    />
  );
};

const SelectTooltip = ({ children, ...rest }: TzTooltipProps) => {
  return (
    <TzTooltip {...rest}>
      <SelectWrapper>{children}</SelectWrapper>
    </TzTooltip>
  );
};

export default SelectTooltip;
