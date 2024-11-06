import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useIntl } from '@umijs/max';
import { useMemo } from 'react';
import useTags from '../useTags';

type RegionFilterItemProps = {};

function useTagFilterItem(props?: RegionFilterItemProps) {
  const { tags, refreshTags } = useTags();
  const intl = useIntl();
  const tagFilterItem = useMemo(() => {
    const _tags = tags?.map((tag) => ({
      label: tag.key,
      //   value: tag.values?.map((v) => v.id).join('-'),
      value: tag.key,
      children: tag.values?.map((child) => ({
        label: child.value,
        value: child.id,
      })),
    }));
    return {
      label: intl.formatMessage({ id: 'tag' }),
      name: 'tag_ids',
      type: 'cascader',
      icon: 'icon-biaoqian',
      props: {
        multiple: true,
        options: _tags,
      },
    } as FilterFormParam;
  }, [tags]);

  return { tagFilterItem, tags, refreshTags };
}

export default useTagFilterItem;
