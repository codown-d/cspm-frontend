import InfoAlert from '@/components/InfoAlert';
import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProForm from '@/components/lib/ProComponents/TzProForm';
import TzSegmented from '@/components/lib/TzSegmented';
import { TzButton } from '@/components/lib/tz-button';
import { TzConfirm } from '@/components/lib/tzModal';
import TzSelect from '@/components/lib/tzSelect';
import useEffectivePlatform from '@/hooks/useEffectivePlatform';
import useJump from '@/hooks/useJump';
import useTags from '@/hooks/useTags';
import AssignTags, { IAssignTags } from '@/pages/components/AssignTags';
import RenderAssignTag from '@/pages/components/RenderAssignTag';
import {
  addCredentials,
  editCredentials,
  getCredentialById,
} from '@/services/cspm/CloudPlatform';
import { DEFAULT_PWD } from '@/utils';
import { ProFormDependency, ProFormText } from '@ant-design/pro-components';
import {
  Link,
  history,
  useIntl,
  useModel,
  useParams,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import { cloneDeep, get, hasIn, set } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import AKSteps from './AKSteps';
function EditAccount() {
  const intl = useIntl();
  const { breadcrumb } = useRouteProps();
  const [form] = Form.useForm();
  const formValueIsChanged = useRef<boolean>(false);
  const valuesInNull = useRef<{
    secret: boolean;
    access: boolean;
    isWatched: boolean;
  }>({
    secret: true,
    access: true,
    isWatched: true,
  });
  const { id } = useParams();
  const platformsOpt = useEffectivePlatform();
  const { nextTo } = useJump();
  const { refreshTags, tags } = useTags();
  const { refresh } = useModel('@@initialState');
  const [assignTagObj, setAssignTagObj] = useState<IAssignTags>();
  const [formTags, setFormTags] = useState<API_TAG.DatumValue[]>();
  const [dimension, setDimension] = useState<string>();
  const infoRef = useRef<API.CredentialResponse>();
  const extraOptRef = useRef<API.LableValue[]>();

  useEffect(() => {
    id &&
      getCredentialById({ id }).then((res) => {
        form.setFieldsValue({
          ...res,
          // access: DEFAULT_PWD,
          secret: DEFAULT_PWD,
        });
        infoRef.current = res;
        !!res.tags?.length &&
          setFormTags(
            res.tags.map((v) => ({ ...v, user_set: true, id: v.key })),
          );
      });
  }, [id]);
  const isEdit = !!id;

  const getFieldProps = useMemoizedFn((fieldName: 'secret') => {
    if (!isEdit) {
      return;
    }
    return {
      onFocus: () => {
        valuesInNull.current.isWatched &&
          form.setFieldValue(fieldName, undefined);
      },
      onBlur: () => {
        if (!valuesInNull.current.isWatched) {
          return;
        }
        if (!form.getFieldValue(fieldName)) {
          valuesInNull.current[fieldName] = true;
          form.setFields([
            {
              name: fieldName,
              errors: [],
              value: DEFAULT_PWD,
            },
          ]);
        } else {
          valuesInNull.current[fieldName] = false;
        }
      },
    };
  });

  const onTagItemChange = useMemoizedFn((item) => {
    const _item = item[0];
    setFormTags((prev) => prev?.map((v) => (v.key === _item.key ? _item : v)));
  });

  const platform = Form.useWatch(['platform'], form);
  const getRules = (required: boolean, label: string) =>
    required
      ? [
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: label },
            ),
          },
        ]
      : undefined;

  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            showBack
            formChanged={formValueIsChanged}
            title={intl.formatMessage(
              { id: 'accountOpr' },
              { name: intl.formatMessage({ id: isEdit ? 'edit' : 'add' }) },
            )}
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      footer={[
        <TzButton
          key="cancel"
          className="cancel-btn"
          onClick={() => {
            if (formValueIsChanged.current) {
              TzConfirm({
                content: intl.formatMessage({ id: 'unStand.cancelTips' }),
                cancelText: intl.formatMessage({ id: 'back' }),
                okButtonProps: {
                  type: 'primary',
                },
                cancelButtonProps: {
                  className: 'cancel-btn',
                },
                onOk() {
                  history.back();
                },
              });
            } else {
              history.back();
            }
          }}
        >
          {intl.formatMessage({ id: 'cancel' })}
        </TzButton>,
        <TzButton
          key="edit"
          onClick={() => {
            form.validateFields().then((formVals) => {
              const vals = { tags: formTags, ...formVals };
              const { secret: _secret } = valuesInNull.current;
              if (isEdit) {
                const _vals = cloneDeep(vals);
                if (valuesInNull.current.isWatched) {
                  _secret && delete _vals.secret;
                  // _access && delete _vals.access;
                }
                delete _vals.platform;
                const { extra, ...rest } = _vals;
                const hasE = hasIn(infoRef.current, 'extra');
                let params = { id: +id, ...rest };
                if (hasE) {
                  let obj = {};
                  extraOptRef.current?.map((k) => {
                    set(obj, k.value, get(extra, k.value));
                  });
                  params = { ...params, extra: obj };
                }
                editCredentials(params).then((res) => {
                  message.success(intl.formatMessage({ id: 'saveSuccess' }));
                  nextTo(`/sys/cloud-platform/info/${id}`);
                });
              } else {
                addCredentials(vals).then((res) => {
                  refresh();
                  message.success(intl.formatMessage({ id: 'newSuccess' }));
                  nextTo(`/sys/cloud-platform/info/${res.id}`);
                });
              }
            });
          }}
          type="primary"
        >
          {intl.formatMessage({ id: isEdit ? 'save' : 'add' })}
        </TzButton>,
      ]}
    >
      <InfoAlert
        className="mb-5 "
        tip={
          <>
            {intl.formatMessage({ id: 'unStand.addAccountTipPrev' })}
            <Link to="/task" className="underline mx-1">
              {intl.formatMessage({ id: 'taskLisk' })}
            </Link>
            {intl.formatMessage({ id: 'unStand.addAccountTipNext' })}
          </>
        }
      />
      <TzProForm
        onValuesChange={() => (formValueIsChanged.current = true)}
        form={form}
        submitter={false}
        className="mx-6"
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: intl.formatMessage(
                { id: 'requiredTips' },
                { name: intl.formatMessage({ id: 'name' }) },
              ),
            },
          ]}
          fieldProps={{ maxLength: 50 }}
          name="name"
          label={intl.formatMessage({ id: 'name' })}
          placeholder={intl.formatMessage(
            { id: 'txtTips' },
            { name: intl.formatMessage({ id: 'name' }) },
          )}
        />

        <TzProForm.Item
          rules={[
            {
              required: true,
              message: intl.formatMessage(
                { id: 'requiredTips' },
                { name: intl.formatMessage({ id: 'cloudPlatformBelongs' }) },
              ),
            },
          ]}
          label={intl.formatMessage({ id: 'cloudPlatformBelongs' })}
          name="platform"
        >
          <TzSelect
            disabled={isEdit}
            showSearch={false}
            className="w-full"
            options={platformsOpt}
            placeholder={intl.formatMessage(
              { id: 'selectTips' },
              { name: intl.formatMessage({ id: 'platformType' }) },
            )}
            onChange={() => {
              form.setFieldsValue({
                access: undefined,
                secret: undefined,
              });
              valuesInNull.current.isWatched = false;
            }}
          />
        </TzProForm.Item>
        <ProFormDependency name={['platform']}>
          {({ platform }) => {
            if (!platform) {
              return null;
            }
            const item = platformsOpt?.find((i) => i.key === platform);
            if (!item?.secret_key_names) {
              return null;
            }
            const {
              secret_key_names: [access, secret],
              extra,
            } = item;
            return (
              <TzProForm.Item key={platform} noStyle>
                <ProFormText
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(
                        { id: 'requiredTips' },
                        { name: access },
                      ),
                    },
                  ]}
                  // fieldProps={getFieldProps('access')}
                  name="access"
                  label={access}
                  placeholder={intl.formatMessage(
                    { id: 'txtTips' },
                    { name: access },
                  )}
                />
                <ProFormText
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(
                        { id: 'requiredTips' },
                        { name: secret },
                      ),
                    },
                  ]}
                  fieldProps={getFieldProps('secret')}
                  name="secret"
                  label={secret}
                  placeholder={intl.formatMessage(
                    { id: 'txtTips' },
                    { name: secret },
                  )}
                />
                {!!extra?.length &&
                  extra.map(({ component_type, key, required, options }) => {
                    if (component_type === 'input_text') {
                      return (
                        <ProFormText
                          rules={getRules(required, key)}
                          name={['extra', key]}
                          label={key}
                          placeholder={intl.formatMessage(
                            { id: 'txtTips' },
                            { name: key },
                          )}
                        />
                      );
                    }
                    if (component_type === 'segmented') {
                      const secV = get(options, [1, 'value']);
                      const firV = get(options, [0, 'value']);
                      extraOptRef.current = options;

                      const secD = get(infoRef.current, ['extra', secV]);

                      !dimension && setDimension(secD ? secV : firV);
                      return (
                        <>
                          <TzSegmented
                            value={dimension}
                            onChange={setDimension}
                            options={options}
                            className="mb-1"
                          />
                          {options?.map(
                            (v) =>
                              v.value === dimension && (
                                <ProFormText
                                  rules={getRules(required, v.value)}
                                  name={['extra', v.value]}
                                  label={v.value}
                                  placeholder={intl.formatMessage(
                                    { id: 'txtTips' },
                                    { name: v.value },
                                  )}
                                />
                              ),
                          )}
                        </>
                      );
                    }
                  })}
                {/* {!!extra && (
                  <>
                    <ProFormText
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage(
                            { id: 'requiredTips' },
                            { name: extra },
                          ),
                        },
                      ]}
                      // fieldProps={{ ...getFieldProps('extra'), maxLength: 150 }}
                      name="extra"
                      label={extra}
                      placeholder={intl.formatMessage(
                        { id: 'txtTips' },
                        { name: extra },
                      )}
                    />
                    <TzSegmented
                      value={dimension}
                      onChange={setDimension}
                      options={extraOpt}
                      className="mb-1"
                    />
                    {extraOpt?.map(
                      (v) =>
                        v.value === dimension && (
                          <ProFormText
                            // fieldProps={{ ...getFieldProps('extra'), maxLength: 150 }}
                            name={v.value}
                            label={v.value}
                            placeholder={intl.formatMessage(
                              { id: 'txtTips' },
                              { name: v.label },
                            )}
                          />
                        ),
                    )}
                  </>
                )} */}
              </TzProForm.Item>
            );
          }}
        </ProFormDependency>
        {!!platform && (
          <TzProForm.Item label={intl.formatMessage({ id: 'tag' })}>
            <div className="inline-flex items-center relative h-6">
              <TzButton
                onClick={() => {
                  setAssignTagObj({
                    tags: formTags,
                  });
                }}
              >
                {intl.formatMessage({ id: 'choiceTags' })}
              </TzButton>
            </div>
            {!!formTags?.length && (
              <RenderAssignTag
                tagList={tags}
                className="ml-1"
                removeTag={(key) =>
                  setFormTags(formTags.filter((v) => v.key !== key))
                }
                onChange={onTagItemChange}
                nodeTags={formTags}
              />
            )}
          </TzProForm.Item>
        )}
      </TzProForm>
      {!!platform && (
        <AKSteps
          className="mx-6"
          {...(platformsOpt?.find(
            (v) => v.key === platform,
          ) as API.CommonPlatformsResponse)}
        />
      )}
      {!!assignTagObj && (
        <AssignTags
          onCancel={() => setAssignTagObj(undefined)}
          onOk={(v) => {
            setFormTags(v.map((item) => ({ ...item, user_set: true })));
            setAssignTagObj(undefined);
          }}
          tagList={tags}
          refreshTags={refreshTags}
          {...assignTagObj}
        />
      )}
    </TzPageContainer>
  );
}

export default EditAccount;
