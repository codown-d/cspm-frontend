import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzInput } from '@/components/lib/TzInput';
import { TzButton } from '@/components/lib/tz-button';
import { TzForm } from '@/components/lib/tz-form';
import { TzConfirm } from '@/components/lib/tzModal';
import useJump from '@/hooks/useJump';
import { addRole, getRoleDetail, updateRole } from '@/services/cspm/RoleManage';
import {
  history,
  useIntl,
  useLocation,
  useParams,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import React, { useEffect, useRef } from 'react';
import PermisionTable from '../components/PermisionTable';

interface TState {
  fromFormPage?: boolean; //如果从表单页跳转来的，新增成功后原路返回
}
const RoleForm: React.FC<unknown> = () => {
  const { breadcrumb } = useRouteProps();
  const { id } = useParams();
  const { state } = useLocation();
  const { nextTo } = useJump();
  const formUpdate = useRef(false);
  const permisionTableRef = useRef<any>({});
  const [formIns] = Form.useForm();
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  const countRef = useRef(0);
  const isEdit = !!id;
  const { fromFormPage } = (state as TState) ?? {};

  const fetchInfo = useMemoizedFn(async () => {
    const res: API.RoleListResponse = await getRoleDetail(id!);
    const { permissions, ...rest } = res;
    const permis = (permissions || []).reduce(
      (acc: Record<string, any>, _item: API.Permision) => {
        acc[_item.key] = _item.action;
        return acc;
      },
      {} as any,
    );
    formIns.setFieldsValue({ ...rest, permis, desc: res.desc || '' });
    permisionTableRef.current.refresh(permis);
  });
  useEffect(() => {
    isEdit && fetchInfo();
  }, []);

  const onSubmit = useMemoizedFn(async () => {
    try {
      const formVal = await formIns.validateFields();
      const permissions = Object.keys(formVal.permis).map((k) => {
        return {
          key: k,
          action: formVal.permis[k],
        };
      });
      const _param: API.AddRole = {
        desc: formVal.desc,
        name: formVal.name,
        permissions,
      };
      if (isEdit) {
        await updateRole({ ..._param, id: +id });
        message.success(translate('oprSuc', { name: translate('edit') }));
        nextTo(`/sys/user-management/role-detail/${id}`);
        return;
      }
      const res: any = await addRole(_param);

      if (fromFormPage) {
        message.success(
          intl.formatMessage({ id: 'oprSuc' }, { name: translate('addRole') }),
        );
        history.back();
        return;
      }

      message.success(translate('oprSuc', { name: translate('add') }));
      nextTo(`/sys/user-management/role-detail/${res.id}`);
    } catch (e) {}
  });

  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            formChanged={formUpdate}
            title={translate(isEdit ? 'editRole' : 'addRole')}
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      footer={[
        <TzButton
          key="cancel"
          className="cancel-btn"
          onClick={() => {
            if (formUpdate.current) {
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
        layout="vertical"
        form={formIns}
        autoComplete="off"
        onValuesChange={() => {
          ++countRef.current;
          if (
            (isEdit && countRef.current > 2) ||
            (!isEdit && countRef.current > 1)
          ) {
            formUpdate.current = true;
          }
        }}
      >
        <Form.Item
          required
          label={translate('roleName')}
          name={'name'}
          rules={[
            {
              required: true,
              message: translate('requiredTips', {
                name: translate('roleName'),
              }),
            },
            {
              type: 'string',
              max: 50,
              message: translate('maxLengthTips', {
                name: translate('roleName'),
                len: 50,
              }),
            },
          ]}
        >
          <TzInput
            showCount
            maxLength={50}
            placeholder={translate('txtTips', { name: translate('roleName') })}
          />
        </Form.Item>
        <Form.Item label={translate('remark')} name={'desc'}>
          <TzInput.TextArea
            showCount
            maxLength={150}
            placeholder={translate('txtTips', { name: translate('remark') })}
          />
        </Form.Item>
        <Form.Item
          required
          name={'permis'}
          label={translate('rolePermissions')}
          className="mb-0"
        >
          <PermisionTable
            ref={permisionTableRef}
            form={formIns}
            rowKey={'key'}
          />
        </Form.Item>
      </TzForm>
    </TzPageContainer>
  );
};

export default RoleForm;
