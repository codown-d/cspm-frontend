import TagSelect, { TagSelectProps } from '@/components/TagSelect';
import TzTypography from '@/components/lib/TzTypography';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import './index.less';

type IRenderAssignTag = Pick<TagSelectProps, 'removeTag'> & {
  nodeTags: API_COMPLIANCE.DatumTag[];
  className?: string;
  tagList?: API_TAG.TagsDatum[];
  onChange?: (value: API_COMPLIANCE.DatumTag[]) => void;
};
function RenderAssignTag({
  tagList,
  nodeTags,
  className,
  onChange,
  removeTag,
}: IRenderAssignTag) {
  const getOptions = useMemoizedFn(
    (key) =>
      tagList
        ?.find((v) => v.key === key)
        ?.values?.map((v: API_TAG.Value) => ({
          value: v.id,
          label: v.value,
        })),
  );
  return (
    <div
      className={classNames(
        'render-assign-tag inline-flex gap-[6px]',
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {nodeTags.map((item) => {
        let value = item.values?.map((ite) => ite.id);
        let values = item.values;
        let lastVal = value?.slice(-1)[0];
        let options = getOptions(item.key);
        return (
          <TagSelect
            key={item.id}
            label={item.key}
            value={value as number[]}
            allowClear={false}
            showSearch={false}
            mode="multiple"
            tagRender={(node) => {
              return (
                <span className="whitespace-nowrap">
                  <TzTypography.Text>{node.label}</TzTypography.Text>
                  {lastVal != node.value ? <span>，</span> : null}
                </span>
              );
            }}
            // dropdownStyle={{ minWidth: '100px' }}
            // popupClassName="min-w-100"
            popupMatchSelectWidth={240}
            options={options}
            // getPopupContainer={(n) => n}
            removeTag={item.user_set ? removeTag : undefined}
            onChange={(v) => {
              let selectedVal = values;
              if (v.length != 0) {
                selectedVal = options
                  ?.filter((item) => v.includes(item.value))
                  .map((ite) => {
                    return { id: ite.value, value: ite.label };
                  });
              }
              onChange?.([
                {
                  ...item,
                  values: selectedVal,
                },
              ]);
            }}
          />
        );
      })}
    </div>
  );
}

export default RenderAssignTag;
