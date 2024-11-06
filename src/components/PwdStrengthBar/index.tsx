import React from 'react';
import classNames from 'classnames';
import { PWD_LEVEL } from '@/utils/password';
import './index.less';

type TPwdStrengthBar = {
  strength: number;
};

export default function PwdStrengthBar({ strength }: TPwdStrengthBar) {
  if (strength > -1) {
    return (
      <div className="pwd-strength-bar">
        <span className="pwd-strength-bar-name">{PWD_LEVEL[strength].label}</span>
        {PWD_LEVEL.map((item, index) => (
          <div key={item.value}
            className={classNames('pwd-strength-bar-item', {
              [item.class]: strength > index - 1,
            })}
          />
        ))}
      </div>
    );
  }
  return null;
}

interface IPwdStrengthLabel extends TPwdStrengthBar {
  label: string;
}
export function PwdStrengthLabel({label, strength}: IPwdStrengthLabel) {
  return (
    <div className="flex justify-between flex-1">
      <span>{label}：</span>
      <PwdStrengthBar strength={strength} />
    </div>
  );
}
