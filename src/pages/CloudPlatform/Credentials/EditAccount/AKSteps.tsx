import DownloadIcon from '@/assets/images/download.svg';
import fileIcon from '@/assets/images/uploadimg.png';
import TzTypography from '@/components/lib/TzTypography';
import { TzCol, TzRow } from '@/components/lib/tz-row-col';
import { PUBLIC_URL, getJWT } from '@/utils';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Image } from 'antd';
import classNames from 'classnames';
import { chunk } from 'lodash';
import { useCallback, useMemo } from 'react';
import styles from './AKSteps.less';
type AKStepsProps = API.CommonPlatformsResponse & { className?: string };
function AKSteps(props: AKStepsProps) {
  const { secret_key_names, name, steps, className, extra } = props;
  const [secret_id, secret_key] = secret_key_names ?? [];
  const intl = useIntl();
  const _extra = useMemo(() => {
    return extra?.find((item) => item.component_type === 'input_text')?.key;
  }, [extra]);

  const renderContent = useCallback((item: API.Step) => {
    const { type, data } = item;
    if (type === 'icon_url') {
      const [icon, url] = data;
      return (
        <div>
          {!!icon && (
            <div className="flex justify-center items-center mb-2">
              <Image
                width={42}
                height={42}
                preview={false}
                src={`${PUBLIC_URL}/api/v1/common/fs${icon}?${getJWT()}`}
              />
            </div>
          )}
          <a href={url} target="_blank" className="break-all">
            {url}
          </a>
        </div>
      );
    }
    if (type === 'file') {
      return (
        <div className={classNames(styles.fileWrap)}>
          {data.map((v) => {
            const _fileName = v.split('/').pop();
            return (
              <div key={v} className={classNames(styles.fileItem)}>
                <img src={fileIcon} alt="" />
                <TzTypography.Paragraph
                  ellipsis={{ rows: 2, tooltip: _fileName }}
                  className={classNames(styles.fileName)}
                >
                  {_fileName}
                </TzTypography.Paragraph>
                <a
                  href={`${PUBLIC_URL}/api/v1/common/fs${v}?${getJWT()}`}
                  target="_blank"
                  className="break-all"
                  download={_fileName}
                  key={v}
                >
                  <img src={DownloadIcon} alt="" />
                </a>
              </div>
            );
          })}
        </div>
      );
    }
    if (type === 'url') {
      return data.map((v) => (
        <div key={v}>
          <a href={v} target="_blank" className="break-all">
            {v}
          </a>
        </div>
      ));
    }
    if (type === 'image') {
      return data.map((v) => (
        <div
          key={v}
          className={styles.imgContent}
          // style={{
          //   height: `${100 / data.length}%`,
          // }}
        >
          <Image src={`${PUBLIC_URL}/api/v1/common/fs${v}?${getJWT()}`} />
        </div>
      ));
    }
    return null;
  }, []);

  const renderArrow = useCallback(
    (className?: string) => (
      <div className={classNames('flex flex-col', className)}>
        <span className="icon iconfont icon-jiantou1" />
      </div>
    ),
    [],
  );
  const renderSteps = useMemoizedFn((item: API.Step[]) => {
    if (!item?.length) {
      return;
    }
    const items = chunk(
      item.map((v, idx) => ({ ...v, idx })),
      4,
    );

    return items?.map((row, rowIdx) => (
      <TzRow
        key={rowIdx}
        gutter={0}
        className={styles[rowIdx % 2 === 1 ? 'rowReverse' : '']}
      >
        {row.map((col, colIdx) => (
          <TzCol span={6} key={col.title}>
            <div className="flex">
              <div className="flex-1 w-0">
                {
                  <div
                    className={classNames(
                      styles.topIcon,
                      col.idx
                        ? (1 + col.idx) % 4 !== 1 && styles.noFir
                        : styles.noFir,
                    )}
                  >
                    <div className={styles.colArrow}>
                      {renderArrow(styles.rowArrow)}
                    </div>
                  </div>
                }
                {/* <div className="mt-2 pl-11">
                  <p className=" bg-white">
                    {col.idx + 1}
                    .&nbsp;{col.title}
                  </p>
                </div> */}
                <div className={classNames(styles.itemContent)}>
                  {
                    <div
                      className={classNames(
                        styles.prevIcon,
                        ([0, 1].includes((1 + col.idx) % 8) ||
                          (rowIdx % 2 && col.idx === item.length - 1)) &&
                          styles.noFir,
                      )}
                    >
                      <div className={styles.colArrow}>
                        {renderArrow(styles.rowArrow)}
                      </div>
                    </div>
                  }
                  <div className={classNames(styles.itemBox)}>
                    <div className="bg-white mb-4 flex">
                      <div className="mr-2">
                        <span className="no inline-block text-white bg-[#2177D1] h-5 leading-5 min-w-5 text-center rounded-[10px] ">
                          {col.idx + 1}
                        </span>
                      </div>
                      <div className="break-all">{col.title}</div>
                    </div>
                    <div className={classNames(styles.item, styles[col.type])}>
                      {renderContent(col)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TzCol>
        ))}
      </TzRow>
    ));
  });

  return (
    <div className={classNames(styles.akSteps, className)}>
      <div className={styles.tips}>
        <span className="icon iconfont icon-xingzhuangjiehe mr-2 font-medium" />
        {extra
          ? intl.formatMessage(
              { id: 'unStand.getPlatformKeySteps1' },
              { secret_id, secret_key, extra: _extra, name },
            )
          : intl.formatMessage(
              { id: 'unStand.getPlatformKeySteps' },
              { secret_id, secret_key, name },
            )}
      </div>
      <div className="-ml-20 -mt-20">
        <Image.PreviewGroup>{renderSteps(steps)}</Image.PreviewGroup>
      </div>
    </div>
  );
}

export default AKSteps;
