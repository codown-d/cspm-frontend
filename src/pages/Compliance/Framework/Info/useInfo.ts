import { getComplianceById } from '@/services/cspm/Compliance';
import { useParams } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';
import useEvent, { IEventExtra, IEventType, IOprData } from '../useEvent';
import { getPolicies } from './util';

const useInfo = () => {
  const { id } = useParams();
  const [info, setInfo] = useState<API_COMPLIANCE.ComplianceInfoResponse>();
  const [coplianceTreeData, setCoplianceTreeData] =
    useState<API_COMPLIANCE.ComplianceInfoData[]>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    getComplianceById(id)
      .then((res) => {
        setInfo(res);
        setCoplianceTreeData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);
  const { handleOprClick: handleOprClickProps } = useEvent();

  const handleOprClick = useMemoizedFn(
    (type: IEventType, backFn?: IEventExtra['backFn']) =>
      handleOprClickProps(type, { ...info, backFn } as IOprData),
  );

  const filterCompliancePolicies = useMemoizedFn((filter, services) => {
    const data = getPolicies(info?.data, filter, services);
    setCoplianceTreeData(data);
  });

  return {
    info,
    handleOprClick,
    loading,
    coplianceTreeData,
    filterCompliancePolicies,
  };
};

export default useInfo;
