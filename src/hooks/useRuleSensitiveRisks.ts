import { getSensitiveCategory } from '@/services/cspm/Agentless';
import { useEffect, useState } from 'react';

export default function useRuleSensitiveRisks() {
  const [data, setData] = useState<API_AGENTLESS.SensitiveCategoryResponse[]>();

  useEffect(() => {
    getSensitiveCategory().then(setData);
  }, []);
  return data;
}
