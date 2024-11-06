import { useEffect, useRef, useState } from 'react';
import './index.less';

const EllipsisText = ({ texts }) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const textContainerRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      const { scrollWidth, clientWidth } = textContainerRef.current ?? {};

      setIsOverflowed(scrollWidth > clientWidth);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <div className="ellipsis-text-container" ref={textContainerRef}>
      <div className={`ellipsis-text ${isOverflowed ? 'overflowed' : ''}`}>
        {texts.join(', ')}
      </div>
      {isOverflowed && (
        <span className="read-more">
          ... <a href="#">Read More</a>
        </span>
      )}
    </div>
  );
};

export default EllipsisText;
