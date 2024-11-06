import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzTag } from '@/components/lib/tz-tag';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import { useScanStatusEnum } from '@/hooks/enum/useScanStatusEnum';
import LoadingCover from '@/loadingCover';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import { getTaskList } from '@/services/cspm/Task';
import { SCAN_STATUS_MAP } from '@/utils';
import { useIntl, useModel } from '@umijs/max';
import { useInfiniteScroll } from 'ahooks';
import { Button, Space, Spin } from 'antd';
import classNames from 'classnames';
import { get, isEmpty, keys, omitBy } from 'lodash';
import { useEffect, useRef } from 'react';
import NoData from '../NoData';
const PAGE_SIZE = 10;
function TaskList() {
  const ref = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const pageRef = useRef(0);
  const { scanStatusEnum } = useScanStatusEnum();
  const { riskVerifyItem } = useModel('global');

  const { data, loading, mutate } = useInfiniteScroll(
    async (d) => {
      pageRef.current = d ? pageRef.current + 1 : 1;
      const { total, items } = await getTaskList({
        path: 'risk_verify',
        page: pageRef.current,
        size: PAGE_SIZE,
      });
      return Promise.resolve({ total, items, list: items });
    },
    {
      target: ref,
      isNoMore: (d) => {
        return d?.items?.length < PAGE_SIZE;
      },
    },
  );
  useEffect(() => {
    if (!riskVerifyItem || !data?.list?.length) {
      return;
    }
    let newData;
    if (data.list.map((v) => v.id)?.includes(riskVerifyItem.id)) {
      newData = data.list.map((item) =>
        item.id === riskVerifyItem.id ? riskVerifyItem : item,
      );
    } else {
      newData = [riskVerifyItem, ...data.list];
    }
    mutate({ ...data, list: newData });
  }, [riskVerifyItem]);

  return (
    <div
      ref={ref}
      className="global-task-list overflow-auto max-h-[540px] top-0 right-0"
    >
      <LoadingCover loading={loading} />
      {data?.list?.length ? (
        data?.list?.map((item) => (
          <div key={item.id} className="global-task-list-item">
            <div className="tit">
              {item.status === 'running' && (
                <>
                  <Spin className="pr-2" />
                  {intl.formatMessage({ id: 'inVerification' })}......
                </>
              )}
              {item.status === 'pending' && (
                <>
                  <Button className="pr-2 p-0 h-[22px]" type="text" loading />
                  {intl.formatMessage({ id: 'waiting' })}......
                </>
              )}
              {item.status === 'failed' && (
                <>
                  <i className="h-[22px] icon iconfont pr-2 inline-block text-[#E95454] icon-shibai"></i>
                  {intl.formatMessage({ id: 'verificationFailed' })}
                </>
              )}
              {item.status === 'finished' && (
                <>
                  <i className="h-[22px] icon iconfont pr-2 inline-block text-[#52C41A] icon-chenggong"></i>
                  {intl.formatMessage({ id: 'verificationSucceed' })}
                </>
              )}
            </div>
            <TzProDescriptions
              column={1}
              dataSource={item}
              columns={[
                {
                  title: intl.formatMessage({ id: 'result' }),
                  key: 'verify_result',
                  dataIndex: 'verify_result',
                  className: 'btn-row',
                  render: (_, { verify_result }) => {
                    if (isEmpty(omitBy(verify_result, (x) => !x))) {
                      return '-';
                    }
                    return (
                      <Space size={4} wrap>
                        {keys(verify_result).map((key) => {
                          const label = get(scanStatusEnum, key)?.label;
                          const num = get(verify_result, key);
                          return (
                            <TzTooltip key={key} title={`${label}: ${num}`}>
                              <TzTag
                                size="small"
                                closable={false}
                                className={classNames(
                                  'status-tag',
                                  get(SCAN_STATUS_MAP, key),
                                )}
                              >
                                {num}
                              </TzTag>
                            </TzTooltip>
                          );
                        })}
                      </Space>
                    );
                  },
                },
                {
                  title: intl.formatMessage({ id: 'policies' }),
                  key: 'content',
                  dataIndex: 'content',
                  className: 'btn-row',
                  render(_, record) {
                    return (
                      <div className="w-full">
                        <RenderColWithIcon
                          ellipsisRows
                          name={record.content}
                          platform={record.platform as string}
                        />
                      </div>
                    );
                  },
                },

                {
                  title: intl.formatMessage({ id: 'instanceName' }),
                  key: 'instance_name',
                  dataIndex: 'instance_name',
                  ellipsis: true,
                },
                {
                  title: intl.formatMessage({ id: 'verificationTime' }),
                  key: 'created_at',
                  dataIndex: 'created_at',
                  valueType: 'dateTime',
                },
                {
                  title: intl.formatMessage({ id: 'operator' }),
                  key: 'creator',
                  dataIndex: 'creator',
                  ellipsis: true,
                },
              ]}
            />
          </div>
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default TaskList;
