import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import { PwdStrengthLabel } from '@/components/PwdStrengthBar';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzInput } from '@/components/lib/TzInput';
import { TzButton } from '@/components/lib/tz-button';
import { TzForm } from '@/components/lib/tz-form';
import { TzInputNumber } from '@/components/lib/tz-input-number';
import { TzInputPassword } from '@/components/lib/tz-input-password';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import { TzConfirm } from '@/components/lib/tzModal';
import TzSelect from '@/components/lib/tzSelect';
import useJump from '@/hooks/useJump';
import { useLoginConf } from '@/hooks/useLoginConf';
import { getCredentials } from '@/services/cspm/CloudPlatform';
import { getRoleList } from '@/services/cspm/RoleManage';
import {
  addUser,
  editUser,
  getResidueCredit,
  getSysUser,
} from '@/services/cspm/UserController';
import {
  calculatePsStrength,
  getPwdLevelLabel,
  pwdIsMeetStrength,
  pwdReg,
} from '@/utils/password';
import { useEmailRule, usePhoneRule } from '@/utils/rule';
import { useModel } from '@@/plugin-model';
import {
  history,
  useIntl,
  useNavigate,
  useParams,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import { int2str, str2int } from './tool';

interface IOptItem {
  label: string;
  value: string | number;
}

interface AccountFormItemProps {
  value?: any;
  onChange?: any;
  className?: string;
  primary_username: string;
  [k: string]: any;
}

function AccountFormItem(props: AccountFormItemProps) {
  const { className, primary_username } = props;
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  return (
    <div className={className}>
      <TzInput
        {...props}
        style={{ width: '512px' }}
        allowClear
        placeholder={translate('unStand.pleaseInputPassword')}
      />
      <span className="ml-3 text-[#6C7480]">@{primary_username}.com</span>
    </div>
  );
}

function EditUser() {
  // primary_username
  const _userInfo: any =
    useModel('@@initialState')?.initialState?.userInfo ?? {};
  const primaryUsername = _userInfo.primary_username || '';
  const { breadcrumb } = useRouteProps();
  const { nextTo } = useJump();
  const { id } = useParams();
  const formValueIsChanged = useRef<boolean>(false);
  const [form] = Form.useForm();
  const [strength, setStrength] = useState(-1);
  const [roleOpts, setRoleOpts] = useState<IOptItem[]>([]);
  const [cloudAccountOpts, setCloudAccountOpts] = useState<IOptItem[]>([]);
  // 可分配点数
  const [residueCredit, setResidueCredit] = useState(0);
  const emailRule = useEmailRule();
  const phoneRule = usePhoneRule();
  const navigate = useNavigate();
  const isEdit = !!id;
  const intl = useIntl();
  const loginConf = useLoginConf([]);
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const fetchInfo = useMemoizedFn(async () => {
    const res: API.SysUserDatum = await getSysUser(id!);
    form.setFieldsValue({
      ...res,
      credential_ids: (res.credentials || []).map((ite) => ite.id),
      usernameReal: (res.username || '').replace(
        new RegExp(`@${primaryUsername}\\.com$`),
        '',
      ),
    });
  });

  const onSearchRole = useMemoizedFn((v) => {
    getRoleList({
      size: 0,
      name: v,
    }).then((res) => {
      const opts = (res.items || []).map((_item) => ({
        label: _item.name,
        value: _item.id,
      }));
      setRoleOpts(opts);
    });
  });

  const onSearchCloudAccount = useMemoizedFn((v) => {
    getCredentials({
      size: 0,
      name: v,
    }).then((res) => {
      const opts = (res.items || []).map((_item) => ({
        label: _item.name || '-',
        value: +_item.id,
      }));
      setCloudAccountOpts(opts);
    });
  });

  useEffect(() => {
    if (isEdit) {
      fetchInfo();
    } else {
      getResidueCredit().then((res) => {
        setResidueCredit(res.credit ?? 0);
      });
    }
    onSearchRole('');
    onSearchCloudAccount('');
  }, []);

  const onSubmit = useMemoizedFn(async () => {
    const saveCb = () => {
      message.success(translate('saveSuccess'));
      nextTo(`/sys/user-management/detail/${id}`);
    };
    if (isEdit && !formValueIsChanged.current) {
      saveCb();
      return;
    }
    const vals: API.AddUserRequest & {
      usernameReal: string;
    } = await form.validateFields();
    try {
      const { password, usernameReal, credit_limit, credential_ids, ...rest } =
        vals;
      const cloudAccountIds = (credential_ids || []).map(Number);
      if (isEdit) {
        editUser({
          ...rest,
          credential_ids: cloudAccountIds,
          uid: id,
        }).then((res) => {
          saveCb();
        });
        return;
      }
      addUser({
        ...rest,
        credential_ids: cloudAccountIds,
        username: usernameReal + `@${primaryUsername}.com`,
        password,
        credit_limit,
      }).then((res) => {
        message.success(translate('newSuccess'));
        nextTo(`/sys/user-management/detail/${res.id}`);
      });
    } catch (e) {
      console.error(e);
    }
  });

  const accountMaxLength = useMemo(
    () => 35 - `@${primaryUsername}.com`.length,
    [primaryUsername],
  );

  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            formChanged={formValueIsChanged}
            title={translate(isEdit ? 'editUser' : 'addUser')}
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
                content: translate('unStand.cancelTips'),
                cancelText: translate('back'),
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
          {translate('cancel')}
        </TzButton>,
        <TzButton key="edit" onClick={onSubmit} type="primary">
          {translate(isEdit ? 'save' : 'add')}
        </TzButton>,
      ]}
    >
      <TzForm
        autoComplete="off"
        layout="vertical"
        form={form}
        className="edit-user"
        onValuesChange={(field) => {
          // console.debug('onValuesChange', field);
          formValueIsChanged.current = true;
          if (Object.hasOwn(field, 'password')) {
            setStrength(calculatePsStrength(field.password));
          }
        }}
      >
        <Form.Item
          style={{ position: 'fixed', zIndex: -1, left: -100, top: -100 }}
          name="username"
        >
          <TzInput />
        </Form.Item>
        <Form.Item
          name="usernameReal"
          label={translate('account')}
          rules={[
            {
              required: true,
              whitespace: true,
              message: translate('requiredTips', {
                name: translate('account'),
              }),
            },
            {
              pattern: /^[\w-]+$/,
              message: translate('unStand.onlyEnglishlettersNumbers'),
            },
          ]}
        >
          <AccountFormItem
            maxLength={accountMaxLength}
            primary_username={primaryUsername}
            disabled={isEdit}
            className={'inline-flex items-center'}
            placeholder={translate('unStand.pleaseInputPassword')}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="role_id"
          colon={false}
          className={'label-w100'}
          label={
            <span className={'flex flex-1 justify-between'}>
              <span>{translate('role')}:</span>
              <TzButton
                type="text"
                size="small"
                className="-mr-[22px]"
                onClick={() => {
                  navigate('/sys/user-management/role-add');
                }}
              >
                {translate('addRole')}
              </TzButton>
            </span>
          }
          rules={[
            {
              required: true,
              message: translate('requiredTips', { name: translate('role') }),
            },
          ]}
        >
          <TzSelect
            showSearch
            className="w-full"
            options={roleOpts}
            filterOption={true}
            onDropdownVisibleChange={(open: boolean) =>
              open && onSearchRole('')
            }
            placeholder={translate('selectTips', {
              name: translate('userRole'),
            })}
          />
        </Form.Item>
        {!isEdit && (
          <>
            <Form.Item
              name="password"
              colon={false}
              className={'label-w100'}
              label={
                <PwdStrengthLabel
                  label={translate('password')}
                  strength={strength}
                />
              }
              rules={[
                {
                  required: true,
                  validator(rule, value) {
                    if (!value) {
                      return Promise.reject(
                        translate('requiredTips', {
                          name: translate('password'),
                        }),
                      );
                    }
                    if (!pwdReg(value)) {
                      return Promise.reject(
                        translate('unStand.pwdRegErrorTip'),
                      );
                    }
                    if (loginConf?.password_rating) {
                      if (pwdIsMeetStrength(value, loginConf.password_rating)) {
                        return Promise.resolve();
                      }
                      const _label = getPwdLevelLabel(
                        loginConf.password_rating,
                        false,
                      );
                      return Promise.reject(
                        translate('insufficientPwdStrength', { name: _label }),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <TzInputPassword
                placeholder={translate('unStand.pwdRegTip')}
                allowClear
              />
            </Form.Item>
          </>
        )}
        <Form.Item label={translate('phone')} name="tel" rules={[phoneRule]}>
          <TzInput
            allowClear
            placeholder={translate('txtTips', { name: translate('phone') })}
          />
        </Form.Item>
        <Form.Item label={translate('mail')} name="email" rules={emailRule}>
          <TzInput
            placeholder={translate('txtTips', { name: translate('mail') })}
            allowClear
          />
        </Form.Item>
        {!isEdit && (
          <Form.Item
            colon={false}
            label={
              <>
                <span>{translate('allocatePoints')}：</span>
                <span style={{ color: 'rgb(179, 186, 198)' }}>
                  ({`${translate('availablePoints')} ${residueCredit}`})
                </span>
              </>
            }
            name="credit_limit"
            rules={[
              {
                required: true,
                message: `${translate('requiredTips', {
                  name: translate('allocatePoints'),
                })}`,
              },
              {
                type: 'number',
                min: 0,
                message: translate('greaterThan', { n: 0 }),
              },
              {
                type: 'number',
                max: residueCredit,
                message: translate('unStand.inputNotGreaterAvailable'),
                // message: translate('lessThan', {
                //   n: Math.max(0, residueCredit - 1),
                // }),
              },
            ]}
          >
            <TzInputNumber
              type="number"
              placeholder={translate('txtTips', {
                name: translate('allocatePoints'),
              })}
              formatter={int2str}
              parser={str2int}
            />
          </Form.Item>
        )}
        <Form.Item
          colon={false}
          className={'label-w100'}
          name="credential_ids"
          label={
            <span>
              {translate('associatedCloudAccount')}：
              <TzTooltip
                title={
                  <p style={{ width: '210px' }}>
                    {intl.formatMessage({
                      id: 'unStand.associatedCloudAccountTip',
                    })}
                  </p>
                }
                placement="top"
              >
                <i className="icon iconfont icon-tishi" />
              </TzTooltip>
            </span>
          }
        >
          <TzSelect
            showSearch
            allowClear
            mode={'multiple'}
            className="w-full"
            options={cloudAccountOpts}
            filterOption={true}
            placeholder={translate('unStand.pleaseSelectAccounts')}
          />
        </Form.Item>
        <Form.Item label={translate('remark')} name="desc">
          <TzInput.TextArea
            placeholder={translate('txtTips', { name: translate('remark') })}
            maxLength={100}
          />
        </Form.Item>
      </TzForm>
    </TzPageContainer>
  );
}

export default EditUser;
