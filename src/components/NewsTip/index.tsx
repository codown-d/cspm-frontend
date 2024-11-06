import React from 'react';
import './index.less';

interface IProps {
  number?: number;
}

const NewsTip: React.FC<IProps> = (props) => {
  const {number = 0} = props;
  if (!number) {
    return null;
  }
  return (
    <div className={'news-tips-wrap'}>
      {number}
    </div>
  )
};

export default NewsTip;
