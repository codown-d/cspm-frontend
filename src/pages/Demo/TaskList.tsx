import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzTag } from '@/components/lib/tz-tag';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import { useScanStatusEnum } from '@/hooks/enum/useScanStatusEnum';
import LoadingCover from '@/loadingCover';
import { getTaskList } from '@/services/cspm/Task';
import { SCAN_STATUS_MAP } from '@/utils';
import { useIntl, useModel } from '@umijs/max';
import { useInfiniteScroll } from 'ahooks';
import { Button, Space, Spin } from 'antd';
import classNames from 'classnames';
import { get, isEmpty, keys } from 'lodash';
import { useEffect, useRef } from 'react';
const mockData = [
  {
    domain: 'task',
    scene: 'status',
    type: 'data',
    data: {
      status: 'running', // pending-等待中; running-执行中; finished-已完成; failed-已失败;
      type: 'risk_verify', // risk_verify-验证任务; assets_scan-资产检测; compliance_scan-合规检测; reports_export-导出;
      task_id: 123,
    },
    timestamp: 1725356358205,
    username: 'owen-1',
    id: '123',
  },
];
const PAGE_SIZE = 4;
function TaskList(props) {
  const { onClose } = props;
  const ref = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const pageRef = useRef(0);
  const { scanStatusEnum } = useScanStatusEnum();
  const { riskVerifyItem } = useModel('global');

  const { data, loading, loadMore, loadingMore, noMore, mutate } =
    useInfiniteScroll(
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
        item.id === riskVerifyItem.id
          ? { ...item, status: riskVerifyItem.status }
          : item,
      );
    } else {
      newData = [riskVerifyItem, ...data.list];
    }
    mutate({ ...data, list: newData });
  }, [riskVerifyItem]);

  return (
    <div
      ref={ref}
      className="global-task-list overflow-auto w-[400px] max-h-[556px] top-0 right-0"
    >
      <LoadingCover loading={loading} />
      {data?.list?.map((item) => (
        <div key={item.id} className="global-task-list-item">
          <div className="tit">
            {item.status === 'running' && (
              <>
                <Spin className="pr-2" />
                验证中......
              </>
            )}
            {item.status === 'pending' && (
              <>
                <Button className="pr-2 p-0 h-[22px]" type="text" loading />
                等待中......
              </>
            )}
            {item.status === 'failed' && (
              <>
                <i className="h-[22px] icon iconfont pr-2 inline-block text-[#52C41A] icon-chenggong"></i>
                验证失败
              </>
            )}
            {item.status === 'finished' && (
              <>
                <i className="h-[22px] icon iconfont pr-2 inline-block text-[#52C41A] icon-chenggong"></i>
                验证成功
              </>
            )}
          </div>
          <TzProDescriptions
            column={1}
            dataSource={item}
            columns={[
              {
                title: intl.formatMessage({ id: '结果' }),
                key: 'verify_result',
                dataIndex: 'verify_result',
                className: 'btn-row',
                render: (text, { verify_result }) => {
                  if (isEmpty(verify_result)) {
                    return '-';
                  }
                  // const {passed,unpassed,failed} = verify_result??{}
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
                title: intl.formatMessage({ id: '检测项' }),
                key: 'content',
                dataIndex: 'content',
              },

              {
                title: intl.formatMessage({ id: '实例名称' }),
                key: 'instance_name',
                dataIndex: 'instance_name',
                ellipsis: true,
              },
              {
                title: intl.formatMessage({ id: '验证时间' }),
                key: 'created_at',
                dataIndex: 'created_at',
                valueType: 'dateTime',
              },
              {
                title: intl.formatMessage({ id: '操作人' }),
                key: 'creator',
                dataIndex: 'creator',
              },
            ]}
          />
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        {!noMore && (
          <button type="button" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading more...' : 'Click to load more'}
          </button>
        )}

        {noMore && <span>No more data</span>}
      </div>
    </div>
  );
}

export default TaskList;
