import { Affix } from 'antd';
import { ReactNode, useRef } from 'react';

type ServiceCatalogWithAnchorProps = {
  maxHeight: number;
  children: ReactNode;
};
function ServiceCatalogWithAnchor({
  maxHeight,
  children,
}: ServiceCatalogWithAnchorProps) {
  const affixRef = useRef(null);
  return (
    <Affix
      style={{ width: 220, maxHeight }}
      ref={affixRef}
      target={() => document.getElementById('tz-container') || document.body}
      offsetTop={74}
    >
      {children}
    </Affix>
  );
}

export default ServiceCatalogWithAnchor;
