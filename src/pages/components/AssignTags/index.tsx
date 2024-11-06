import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import { TzButton } from '@/components/lib/tz-button';
import TzSelect from '@/components/lib/tzSelect';
import TagModal from '@/pages/Setting/Tags/TagModal';
import {
  ProForm,
  ProFormCheckbox,
  ProFormDependency,
  ProFormGroup,
  ProFormList,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form } from 'antd';
import { get, omitBy, sortBy, values } from 'lodash';
import { useMemo } from 'react';
import './index.less';

export type IAssignTags = {
  isActive?: boolean;
  onCancel?: () => void;
  onOk?: (tags: API_COMPLIANCE.DatumTag[]) => void;
  cal?: VoidFunction;
  tagList?: API_TAG.TagsDatum[];
  refreshTags?: VoidFunction;
  tags?: API_COMPLIANCE.DatumTag[];
};
const AssignTags = ({
  tagList,
  refreshTags,
  onCancel,
  onOk,
  tags,
}: IAssignTags) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const getValues = useMemoizedFn(
    (key) =>
      tagList
        ?.find((item) => item.key === key)
        ?.values?.map(({ id, value }) => ({ label: value, value: id })),
  );
  const [editOpts, TagKeys] = useMemo(() => {
    const b = sortBy(tags, ['user_set'])?.map(({ user_set, ...rest }) => ({
      ...rest,
      disabled: !(user_set ?? true),
      id: rest.values?.map((ite) => ite.id),
    }));
    const c = tagList
      ?.filter(
        (item) =>
          !b
            ?.filter((x) => x.disabled)
            ?.map((x) => x.key)
            ?.includes(item.key),
      )
      ?.map(({ key }) => ({ label: key, value: key }));
    return [b, c];
  }, [tags, tagList]);

  let labels = Form.useWatch('labels', form);
  const labelOpt = useMemo(() => {
    const vm = labels?.map((v) => v.key);
    return values(omitBy(TagKeys, (v) => vm?.includes(v.value)));
  }, [TagKeys, labels]);
  return (
    <TzModalForm
      className="assign-tag"
      style={{
        display: 'flex',
        flexDirection: 'column',
        // gap: 16,
      }}
      form={form}
      width={800}
      title={intl.formatMessage({
        id: 'choiceTags',
      })}
      open
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({
            id: 'ok',
          }),
        },
        resetButtonProps: { className: 'cancel-btn' },
      }}
      modalProps={{
        // closable: !isActive,
        onCancel,
        destroyOnClose: true,
      }}
      onFinish={async (e) => {
        let labels = get(e, 'labels')
          ?.filter((item) => !item.disabled)
          .map(({ disabled, id, ...rest }) => {
            const node = tagList?.find((ite) => ite.key === rest.key);
            return {
              ...rest,
              values: node?.values?.filter((item) => id.includes(item.id)),
            };
          });
        return onOk?.(labels);
      }}
    >
      <div className="relative flex">
        <div className="absolute right-1 z-10">
          <TagModal
            calFn={() => refreshTags?.()}
            trigger={
              <TzButton
                className="-mr-[14px]"
                type="text"
                size="small"
                key="setting"
                onClick={(e) => e.stopPropagation()}
              >
                {intl.formatMessage({ id: 'newTag' })}
              </TzButton>
            }
          />
        </div>
      </div>
      <ProFormList
        name="labels"
        colon={false}
        creatorButtonProps={{
          icon: <i className="icon iconfont icon-tianjia" />,
          creatorButtonText: intl.formatMessage({ id: 'new' }),
          style: {
            width: labels?.length > 0 ? '100%' : 'calc(100% - 60px)',
          },
        }}
        initialValue={
          editOpts?.length ? editOpts : [{ id: undefined, value: undefined }]
        }
        copyIconProps={false}
        actionRender={(field, action) => {
          return [
            <TzButton
              danger
              size="small"
              type="text"
              disabled={get(editOpts, [field.key, 'disabled'])}
              onClick={(e) => {
                action.remove(field.name);
              }}
            >
              {intl.formatMessage({ id: 'delete' })}
            </TzButton>,
          ];
        }}
      >
        {(f, index, action) => {
          const disabled = get(editOpts, [index, 'disabled']);
          return (
            <ProFormGroup key="group">
              <ProFormCheckbox hidden name="disabled" />
              <ProForm.Item
                name="key"
                label={intl.formatMessage({ id: 'tagLabel' })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage(
                      { id: 'requiredTips' },
                      { name: intl.formatMessage({ id: 'tagLabel' }) },
                    ),
                  },
                  {
                    validator(rule, value) {
                      const labels = form
                        .getFieldValue('labels')
                        ?.filter((item) => item.key === value);
                      return labels.length > 1
                        ? Promise.reject()
                        : Promise.resolve();
                    },
                    message: intl.formatMessage({ id: 'unStand.tagRepeatTip' }),
                  },
                ]}
              >
                <TzSelect
                  disabled={disabled}
                  showSearch={false}
                  allowClear
                  placeholder={intl.formatMessage(
                    { id: 'selectTips' },
                    { name: intl.formatMessage({ id: 'tagLabel' }) },
                  )}
                  style={{ width: 320 }}
                  options={labelOpt}
                  onChange={() => {
                    action.setCurrentRowData({
                      id: undefined,
                    });
                  }}
                />
              </ProForm.Item>
              <ProFormDependency name={['key']}>
                {({ key }) => {
                  const values = getValues(key);
                  return (
                    <ProForm.Item
                      label={intl.formatMessage({ id: 'tagValue' })}
                      name="id"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage(
                            { id: 'requiredTips' },
                            { name: intl.formatMessage({ id: 'tagValue' }) },
                          ),
                        },
                      ]}
                    >
                      <TzSelect
                        allowClear
                        maxTagCount="responsive"
                        disabled={disabled}
                        showSearch={false}
                        mode={'multiple'}
                        placeholder={intl.formatMessage(
                          { id: 'selectTips' },
                          { name: intl.formatMessage({ id: 'tagValue' }) },
                        )}
                        style={{ width: 330 }}
                        options={values}
                      />
                    </ProForm.Item>
                  );
                }}
              </ProFormDependency>
            </ProFormGroup>
          );
        }}
      </ProFormList>
    </TzModalForm>
  );
};

export default AssignTags;
