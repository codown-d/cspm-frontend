import TzDrawer, { TzDrawerProps } from '@/components/lib/TzDrawer';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getVulnRisksById } from '@/services/cspm/CloudPlatform';
import { useIntl } from '@umijs/max';
import { useEffect, useState } from 'react';
import InfoContext, { IInfoContext } from './InfoContext';

type IRiskDrawer = IInfoContext &
  Pick<TzDrawerProps, 'onClose' | 'open'> & {
    record?: API.VulnRisksDatum;
  };
function VulnRiskDrawer(props: IRiskDrawer) {
  const { open, onClose, dataSource, record } = props;
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>();
  const [info, setInfo] = useState<API.VulnRiskInfoResponse>();
  const { unique_id: id, name } = record ?? {};
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();

  useEffect(() => {
    setLoading(true);
    if (!id) {
      return;
    }
    // 漏洞详情不区分是否是快照，直接用unique_id查询
    getVulnRisksById(id)
      .then(setInfo)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <TzDrawer
      width={560}
      title={
        <div className="flex">
          <span>{info?.name ?? name ?? '-'}</span>
          <div className="h-7 ml-3 inline-flex items-center">
            {renderCommonStatusTag(
              {
                getTagInfoByStatus,
                status: info?.severity,
              },
              true,
            )}
          </div>
        </div>
      }
      open={open}
      onClose={onClose}
      styles={{ body: { paddingInline: 16 } }}
    >
      <InfoContext
        className="mt-1"
        column={1}
        dataSource={info}
        loading={loading}
      />
    </TzDrawer>
  );
}

export default VulnRiskDrawer;
