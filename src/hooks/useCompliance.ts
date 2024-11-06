import { TzSelectProps } from '@/components/lib/tzSelect';
import { getCompliance } from '@/services/cspm/Compliance';
import { useEffect, useState } from 'react';

export default function useCompliance(
  params?: API_COMPLIANCE.ComplianceRequest,
) {
  const [data, setData] = useState<TzSelectProps['options']>();

  useEffect(() => {
    getCompliance(params).then((res) => {
      setData(res?.map((item) => ({ label: item.name, value: item.id })));
    });
  }, []);
  return data;
}
