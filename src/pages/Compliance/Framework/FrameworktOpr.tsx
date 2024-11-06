import { TzButton } from '@/components/lib/tz-button';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Space } from 'antd';
import classNames from 'classnames';
import React from 'react';
import useEvent from './useEvent';

type IOperate = {
  record: API_COMPLIANCE.ComplianceDatum;
  refreshTable?: VoidFunction;
};

const Operate: React.FC<IOperate> = ({ record, refreshTable }) => {
  const intl = useIntl();
  const { handleOprClick } = useEvent();

  const handleFn = useMemoizedFn((type, calFn?: VoidFunction) =>
    handleOprClick(type, {
      ...record,
      backFn: calFn,
    }),
  );
  return (
    <Space
      size={4}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {['edit', 'createCopy'].map((key, index) => (
        <TzButton
          className={classNames({ '-ml-2': !index })}
          size="small"
          type="text"
          onClick={() => handleFn(key)}
        >
          {intl.formatMessage({ id: key })}
        </TzButton>
      ))}
      {!record.built_in && (
        <TzButton
          danger
          size="small"
          type="text"
          onClick={() => handleFn('delete', refreshTable)}
        >
          {intl.formatMessage({ id: 'delete' })}
        </TzButton>
      )}

      {/* <TzDropdown
        trigger={['hover', 'click']}
        menu={{
          items: [
            {
              label: (
                <CExportModal
                  renderTrigger={
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {intl.formatMessage({ id: 'export' })}
                    </span>
                  }
                  // todo
                  exportInfo={{ name: 'xxxx', key: 'xxxx' }}
                />
              ),
              key: 'export',
            },
            {
              label: (
                <span className="text-[#E95454]">
                  {intl.formatMessage({ id: 'delete' })}
                </span>
              ),
              key: 'delete',
            },
          ].filter((v) => v.key !== 'delete' || !record.built_in),
          onClick: (e) => {
            handleFn(e.key, e.key === 'delete' ? refreshTable : undefined);
          },
        }}
        overlayClassName={'drop-down-menu'}
        destroyPopupOnHide={true}
        getPopupContainer={(triggerNode) => triggerNode}
      >
        <TzButton className="more-icon" type="text">
          <i className={'icon iconfont icon-gengduo1 f20 cabb'} />
        </TzButton>
      </TzDropdown> */}
    </Space>
  );
};

export default Operate;
