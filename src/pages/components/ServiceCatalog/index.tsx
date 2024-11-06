import NoData from '@/components/NoData';
import TzBadge from '@/components/lib/TzBadge';
import TzTree from '@/components/lib/TzTree';
import TzTypography from '@/components/lib/TzTypography';
import { TzCheckbox } from '@/components/lib/tz-checkbox';
import type { DirectoryTreeProps } from 'antd/es/tree';
import classNames from 'classnames';
import { Key, memo, useState } from 'react';
import RenderPIcon from '../RenderPIcon';
import styles from './index.less';
export type ServiceCatalogProps = {
  value?: string[];
  onChange?: (v: string[]) => void;
  onAllCheck?: (v: boolean) => void;
  title?: string;
  total?: number;
  className?: string;
  badgeClassName?: string;
  treeData?: API.ServicetreeResponse[];
  isAll: boolean;
  boxH?: number;
};
function ServiceCatalog({
  value,
  onChange,
  title,
  total,
  className,
  badgeClassName,
  treeData,
  isAll,
  onAllCheck,
  boxH,
}: ServiceCatalogProps) {
  const [expand, setExpand] = useState<Key[]>();

  const onSelect: DirectoryTreeProps['onSelect'] = (val, info: any) => {
    const isLeaf = info.node.isLeaf;
    if (!isLeaf) {
      setExpand((prev) => {
        const key = info.node.key;
        return prev?.includes(key)
          ? prev.filter((v) => v !== key)
          : [...(prev ?? []), info.node.key];
      });
      return;
    }
    onChange?.(info.selectedNodes?.map((v) => v.id));
  };
  const onCheck: DirectoryTreeProps['onCheck'] = (val, info) => {
    onChange?.(
      info.checkedNodes?.filter((v) => v.isLeaf)?.map((v) => v.id) as string[],
    );
  };

  return (
    <div
      className={classNames(styles.catalog, className)}
      style={boxH ? { maxHeight: boxH } : {}}
    >
      {!!title && (
        <div className={styles.rowAll} onClick={() => onAllCheck?.(!isAll)}>
          <TzCheckbox
            className="mr-3"
            indeterminate={!isAll && !!value?.length}
            checked={isAll}
            onChange={(e) => onAllCheck?.(e.target.checked)}
          />
          <span className="font-medium">{title}</span>
          <TzBadge
            className={classNames(
              'ml-2 bg-white mb-[2px]',
              badgeClassName && styles[badgeClassName],
            )}
            size="small"
            count={total}
          />
        </div>
      )}
      {treeData?.length ? (
        <TzTree
          blockNode
          checkable
          multiple
          virtual={false}
          checkedKeys={value}
          selectedKeys={value}
          expandedKeys={expand}
          autoExpandParent
          defaultExpandAll
          onCheck={onCheck}
          onSelect={onSelect}
          onExpand={setExpand}
          fieldNames={{ title: 'label', key: 'id' }}
          // @ts-ignore
          treeData={treeData}
          titleHeight={36}
          switcherIcon={({ expanded }: any) => (
            <i
              className={classNames(
                'icon iconfont icon-arrow',
                !expanded ? '-rotate-90' : '',
              )}
            />
          )}
          titleRender={({ label, num, id, isPlatform }: any) => {
            return (
              <div key={id} className="flex items-center">
                {isPlatform ? (
                  <RenderPIcon
                    showTooltip={false}
                    className="mr-2"
                    platform={id}
                  />
                ) : null}
                {/* <div className="flex"> */}
                <TzTypography.Text
                  // style={{ width: isPlatform ? '78%' : '100%' }}
                  // style={{ maxWidth: 'calc(100% - 36px)' }}
                  ellipsis
                >
                  {label}
                </TzTypography.Text>
                <TzBadge
                  className={classNames(
                    'ml-1 max-w-10',
                    badgeClassName && styles[badgeClassName],
                  )}
                  size="small"
                  count={num || 0}
                  overflowCount={999}
                />
                {/* </div> */}
              </div>
            );
          }}
        />
      ) : (
        <NoData className="mt-4" />
      )}
    </div>
  );
}

export default memo(ServiceCatalog);
