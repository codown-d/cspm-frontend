import { useModel } from '@umijs/max';
import { FloatButton, Image, Popover } from 'antd';
import classNames from 'classnames';
import { memo, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import AiGptContent from './AiGptContent';
import aiImg from './ai.png';
import './index.less';

function AiGpt() {
  const { open, setOpen, setType, closeSocket } = useModel('aiGptModel');
  const [isDrag, setIsDrag] = useState<boolean>();
  const dragRef = useRef<number>();
  const draggableTimeRef = useRef<number>();

  return (
    <Popover
      arrow={false}
      overlayClassName="ai-overlay"
      content={
        <AiGptContent
          onClose={() => {
            setOpen(false);
            closeSocket();
          }}
        />
      }
      trigger={[]}
      open={open}
      onOpenChange={setOpen}
    >
      <Draggable
        axis="y"
        bounds="body"
        onStart={() => {
          dragRef.current = 1;
          draggableTimeRef.current = +new Date();
          setIsDrag(true);
        }}
        onStop={() => {
          setTimeout(() => (dragRef.current = 0));
          setIsDrag(false);
        }}
      >
        <FloatButton
          onClick={(e) => {
            if (+new Date() - (draggableTimeRef.current ?? 0) < 200) {
              setOpen(true);
              setType('list');
            }
            e.stopPropagation();
          }}
          icon={<Image draggable={false} preview={false} src={aiImg} />}
          type="primary"
          className={classNames('ai-gpt-icon', { active: open, drag: isDrag })}
          style={{ right: 0, bottom: 80 }}
        />
      </Draggable>
    </Popover>
  );
}

export default memo(AiGpt);
