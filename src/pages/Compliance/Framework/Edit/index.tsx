import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import useJump from '@/hooks/useJump';
import {
  addCompliance,
  editCompliance,
  getComplianceById,
} from '@/services/cspm/Compliance';
import { useIntl, useParams, useRouteProps } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import classNames from 'classnames';
import { Key, useEffect, useMemo, useRef, useState } from 'react';

import useCancelFormEdit from '@/hooks/useCancelFormEdit';
import { useLocation, useModel } from '@umijs/max';
import styles from '../index.less';
import { getData2TreeData, TreeData2SendData } from '../util';
import ComplianceItem, { TComplianceItemRefFn } from './ComplianceItem';
import { getNewKey } from './ComplianceItem/util';
import EditBasicInfo from './EditBasicInfo';

type IState = {
  copyId?: Key;
};
function Edit() {
  const { id } = useParams();
  const intl = useIntl();
  const { nextTo } = useJump();
  const complianceItemRef = useRef<TComplianceItemRefFn>(null);
  const [form] = Form.useForm();
  const { state } = useLocation();
  const { breadcrumb } = useRouteProps();
  const [formValueIsChanged, setFormValueIsChanged] = useState<boolean>();
  const [isEditDefalut, setIsEditDefalut] = useState<boolean>();
  const [complianceItem, setComplianceItem] =
    useState<API_COMPLIANCE.ComplianceInfoData[]>();
  const { copyId } = (state ?? {}) as IState;

  const cancelTipFn = useCancelFormEdit();
  const editType = useMemo(() => {
    if (!id) {
      return copyId ? 'copy' : 'new';
    }
    return 'edit';
  }, [id, copyId]);
  const isNew = ['copy', 'new'].includes(editType);

  const { title, saveSucTips, saveTxt } = useMemo(() => {
    const oprEdit = intl.formatMessage({ id: 'edit' });
    const oprNew = intl.formatMessage({ id: 'add' });
    const oprSave = intl.formatMessage({ id: 'save' });
    return {
      title: intl.formatMessage(
        { id: 'oprFramework' },
        { name: !isNew ? oprEdit : oprNew },
      ),
      saveSucTips: intl.formatMessage(
        { id: 'oprSuc' },
        { name: !isNew ? oprSave : oprNew },
      ),
      saveTxt: !isNew ? oprSave : oprNew,
      frameworkName: intl.formatMessage({ id: 'frameworkName' }),
    };
  }, [isNew]);

  const { commonConst } = useModel('global') ?? {};
  const hanleFormChange = useMemoizedFn(() => setFormValueIsChanged(true));
  const { type: policyTypeOption } = commonConst ?? {};
  const initialItems = useMemo(
    () =>
      [
        {
          key: getNewKey(),
          title: '',
          type: 'catalog',
        },
      ] as API_COMPLIANCE.ComplianceInfoData[],
    [],
  );
  useEffect(() => {
    if (editType === 'new') {
      setComplianceItem(initialItems);
      return;
    }

    getComplianceById(copyId ?? id).then((res) => {
      const { data, name, built_in, ...rest } = res;
      setIsEditDefalut(built_in && editType === 'edit');
      form.setFieldsValue(copyId ? rest : { name, ...rest });
      setComplianceItem(
        getData2TreeData(data) as API_COMPLIANCE.ComplianceInfoData[],
      );
      // complianceItemRef.current?.setData(res.data);
    });
  }, [editType, copyId, id]);

  const saveCalFn = useMemoizedFn((res?: number) => {
    message.success(saveSucTips);
    nextTo(`/compliance/framework/info/${id ?? res}`);
  });
  const handleOk = useMemoizedFn(async () => {
    const basicInfo = await form.validateFields();
    complianceItemRef.current?.validate().then((treeData) => {
      const data = TreeData2SendData(treeData, policyTypeOption);
      const _vals = { ...basicInfo, data };
      if (!isNew) {
        editCompliance({ ..._vals, id }).then(() => saveCalFn());
        return;
      }
      addCompliance(_vals).then((res) => saveCalFn(res.id));
      return;
    });
  });

  const platform = Form.useWatch(['platform'], form);
  return (
    <TzPageContainer
      header={{
        title: <PageTitle formChanged={formValueIsChanged} title={title} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      className={classNames(styles.frameworkPage, '')}
      footer={[
        <TzButton
          key="cancel"
          className="cancel-btn"
          onClick={() => {
            if (formValueIsChanged) {
              cancelTipFn(() => history.back());
            } else {
              history.back();
            }
          }}
        >
          {intl.formatMessage({ id: 'cancel' })}
        </TzButton>,
        <TzButton key="edit" onClick={handleOk} type="primary">
          {intl.formatMessage({ id: isNew ? 'add' : 'save' })}
        </TzButton>,
      ]}
    >
      <EditBasicInfo
        form={form}
        hanleFormChange={hanleFormChange}
        disabledName={isEditDefalut}
      />
      {complianceItem && (
        <ComplianceItem
          isEditDefalut={isEditDefalut}
          editType={editType}
          initialState={complianceItem}
          ref={complianceItemRef}
          hanleFormChange={hanleFormChange}
        />
      )}
    </TzPageContainer>
  );
}

export default Edit;
