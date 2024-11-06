import { getTags } from '@/services/cspm/Tags';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';

export default function useTags(search?: string) {
  const [tags, setTags] = useState<API_TAG.TagsDatum[]>();

  const refreshTags = useMemoizedFn((search?: string) => {
    getTags({ search }).then(setTags);
  });
  useEffect(() => {
    refreshTags(search);
  }, [search]);

  return { tags, refreshTags };
}
