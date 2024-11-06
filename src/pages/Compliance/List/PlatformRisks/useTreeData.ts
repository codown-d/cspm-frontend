import { getComplianceById } from '@/services/cspm/Compliance';
import { useParams } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';
import useEvent, { IEventExtra, IEventType, IOprData } from '../useEvent';

const useInfo = () => {
  const { id } = useParams();
  const [info, setInfo] = useState<API_COMPLIANCE.ComplianceInfoResponse>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    getComplianceById(id)
      .then(setInfo)
      .finally(() => setLoading(false));
  }, []);
  const { handleOprClick: handleOprClickProps } = useEvent();

  const handleOprClick = useMemoizedFn(
    (type: IEventType, backFn?: IEventExtra['backFn']) =>
      handleOprClickProps(type, { ...info, backFn } as IOprData),
  );

  return { info, handleOprClick, loading };
};

export default useInfo;
