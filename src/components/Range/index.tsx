import {
  renderTextWithPropmt,
  renderWithLinkEllipsis,
} from '@/components/lib/ProComponents/TzProDescriptions';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import RenderPIcon from '@/pages/components/RenderPIcon';
import { toDetailIntercept } from '@/utils';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import React from 'react';
import './index.less';

interface IRangeProps {
  conf: API_TASK.PeriodTaskInfoConfInfo;
  needToDetail?: boolean;
}
// 检测范围
const Range: React.FC<IRangeProps> = ({ conf, needToDetail = true }) => {
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const itemList = conf?.items || [];
  const numOfItem = itemList.length;
  const remainNum = conf?.type === 'platform' ? 0 : Math.max(numOfItem - 1, 0);
  const needTooltip = remainNum > 0;

  const renderItems = useMemoizedFn(
    (itemType: string, items: any[], all = false) => {
      if (itemType === 'platform') {
        return <RenderPIcon noWrap platform={items?.map((v) => v.key)} />;
      }
      if (!all) {
        items = items.slice(0, 1);
      }
      const len = items?.length - 1;
      if (itemType === 'credential') {
        return (
          <div className={'items-wrap-z1 aksa-19 ml-2'}>
            {items.map((item, idx) => (
              <div key={item.key} className="inline-flex">
                {!needToDetail ? (
                  <RenderColWithIcon
                    className="w-full"
                    platform={item.platform}
                    name={idx === len ? item.label : `${item.label}，`}
                    ellipsisRows={!all}
                    tooltip={false}
                  />
                ) : (
                  <>
                    <RenderPIcon platform={[item.platform]} />
                    {renderWithLinkEllipsis(item.label, item, (_, e) => {
                      toDetailIntercept(
                        { type: 'credential', id: item.key },
                        () =>
                          history.push(`/sys/cloud-platform/info/${item.key}`),
                      );
                      e.stopPropagation();
                    })}
                    {idx === len ? '' : `，`}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      }

      if (itemType === 'instance') {
        return (
          <div className={'flex-1'}>
            {items.map((item, idx) => (
              <div key={item.key}>
                <span key={idx}>{idx ? ',' : ''}</span>
                {item.label && item.label !== '-'
                  ? renderTextWithPropmt(
                      item.label,
                      item,
                      (e?: React.MouseEvent<HTMLDivElement>) => {
                        copy(item.label as string);
                        message.success(
                          intl.formatMessage({
                            id: 'TzProDescriptions.copySuc',
                          }),
                        );
                      },
                      'icon-fuzhi',
                    )
                  : '-'}
                {/* {renderWithLinkEllipsis(item.label, item, () =>
              toDetailIntercept({ type: 'credential', id: item.key }, () =>
                history.push(`/sys/cloud-platform/info/${item.key}`),
              ),
            )} */}
              </div>
            ))}
          </div>
        );
      }
      // 区域或云服务
      // const restTypes = items.map((_item) =>
      //   String(_item.platform || (_item.id ?? _item.name)),
      // );
      // const restLabels = items.map((_item) => _item.name);
      return (
        <div className={'items-wrap-z1 akso_l31 ml-2'}>
          {items.map(({ label, key, platform }) => (
            <RenderColWithIcon
              ellipsisRows={1}
              tooltip={all}
              platform={platform}
              name={label}
              key={key}
            />
          ))}
        </div>
      );
    },
  );

  if (!conf) {
    return '-';
  }
  const itemNodes = conf?.select_all
    ? translate('all')
    : numOfItem === 0
      ? '-'
      : renderItems(conf?.type, itemList);

  return (
    <div className={`flex items-center alsk21 flex-wrap`}>
      <TzTooltip
        title={needTooltip ? renderItems(conf?.type, itemList, true) : ''}
        disabled={!needTooltip}
        placement={'bottom'}
        rootClassName={'hlskwp-k91a'}
      >
        <div
          className={classNames('tip-content', {
            'gap-x-2 gap-y-[6px] flex-wrap': conf?.type === 'platform',
          })}
        >
          <span className={'prek2'}>({conf?.type_name})</span>
          {itemNodes}
          {remainNum > 0 && (
            <span className={'remainIndex'}>
              <span className="-ml-1">，</span>+{remainNum}
            </span>
          )}
        </div>
      </TzTooltip>
    </div>
  );
};

export default Range;
