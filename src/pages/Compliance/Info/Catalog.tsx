import NoData from '@/components/NoData';
import TzBadge from '@/components/lib/TzBadge';
import TzTree from '@/components/lib/TzTree';
import TzTypography from '@/components/lib/TzTypography';
import { useParams } from '@umijs/max';
import { Affix } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import classNames from 'classnames';
import { Key, memo, useState } from 'react';
import styles from './catalog.less';

type CatalogProps = {
  value?: string[];
  onChange?: (v: API.ComplianceInfoChild) => void;
  treeData?: API.ComplianceInfoChild[];
  boxH: number;
};
function Catalog({ value, onChange, treeData, boxH }: CatalogProps) {
  const [expand, setExpand] = useState<Key[]>();
  const { id } = useParams();
  const onSelect: DirectoryTreeProps['onSelect'] = (val, info) => {
    onChange?.(info.node as unknown as API.ComplianceInfoChild);
  };

  return (
    <Affix
      target={() => document.getElementById('tz-container') || document.body}
      offsetTop={104}
    >
      <div className={classNames(styles.catalog)} style={{ maxHeight: boxH }}>
        {treeData?.length ? (
          <TzTree
            blockNode
            selectedKeys={value}
            expandedKeys={expand}
            defaultExpandAll
            onSelect={onSelect}
            onExpand={setExpand}
            treeData={treeData}
            titleRender={({ title, risk_num, key }: any) => {
              return (
                <div
                  key={key}
                  className={classNames({ [styles.isAll]: key === id })}
                >
                  <TzTypography.Text
                    className="w-full"
                    ellipsis={{
                      tooltip: title,
                      // @ts-ignore
                      suffix: (
                        <TzBadge
                          key={key}
                          className="ml-1"
                          size="small"
                          count={risk_num || 0}
                        />
                      ),
                    }}
                  >
                    {title}
                  </TzTypography.Text>
                </div>
              );
            }}
            switcherIcon={({ expanded }: any) => (
              <i
                className={classNames(
                  'icon iconfont icon-arrow',
                  !expanded ? '-rotate-90' : '',
                )}
              />
            )}
          />
        ) : (
          <NoData className="mt-32" />
        )}
      </div>
    </Affix>
  );
}

export default memo(Catalog);
