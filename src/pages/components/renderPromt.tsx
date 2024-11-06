import { PUBLIC_URL } from '@/utils';
import { Image } from 'antd';
import { MouseEventHandler, ReactNode } from 'react';

type renderPropmtProps = {
  content: ReactNode;
  onClick: MouseEventHandler<HTMLSpanElement>;
};
export const renderPropmt = ({ content, onClick }: renderPropmtProps) => {
  if (!content) {
    return '-';
  }

  return (
    <span style={{ whiteSpace: 'pre-wrap' }} className="ai-link group no-color">
      {content}
      {/* <div
        onClick={onClick}
        className="ai-img group-hover:inline-block leading-3 ml-1 relative w-4 h-4 align-text-bottom mb-[2px]"
      > */}
      <Image
        onClick={onClick}
        className="ai-img hidden group-hover:inline-block leading-3 ml-1 relative w-4 h-4 align-text-bottom"
        preview={false}
        src={`${PUBLIC_URL}/ai_active.png`}
      />
      {/* </div> */}
    </span>
  );
};
