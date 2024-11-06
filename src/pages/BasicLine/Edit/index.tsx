import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProForm from '@/components/lib/ProComponents/TzProForm';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { TzConfirm } from '@/components/lib/tzModal';
import useJump from '@/hooks/useJump';
import { usePolicy } from '@/hooks/usePolicy';
import {
  addBaseline,
  editBaselines,
  getBaselineById,
} from '@/services/cspm/CloudPlatform';
import { clearEmptyValInObj } from '@/utils';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import {
  history,
  useIntl,
  useLocation,
  useParams,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { Form, message } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import classNames from 'classnames';
import { flatten, keys, set } from 'lodash';
import {
  Suspense,
  lazy,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SelectedRowKeysProps } from '../ScannerConfig';
import styles from './index.less';

const ScannerConfig = lazy(() => import('../ScannerConfig'));
function EditBasicLine() {
  const { breadcrumb } = useRouteProps();
  const pluginEditIsInit = useRef<boolean>(true);
  const { nextTo } = useJump();
  const [form] = Form.useForm();
  const formValueIsChanged = useRef<boolean>(false);
  const { id } = useParams();
  const [infoErrors, setInfoErrors] = useState<string[]>();
  const [scannerError, setScannerError] = useState<boolean | number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<SelectedRowKeysProps>(
    {},
  );
  const l = useLocation();
  const state = l.state as API.BaselineResponse;
  const [policy] = usePolicy();
  const intl = useIntl();

  const setData = useMemoizedFn((res: API.BaselineResponse) => {
    form.setFieldsValue(res.basic);
    let obj = {};
    res.policies?.forEach(
      ({ key, policy_items }) =>
        key &&
        policy_items?.length &&
        set(
          obj,
          key,
          policy_items.map((v) => v.id),
        ),
    );
    setSelectedRowKeys(obj);
  });
  useEffect(() => {
    id && getBaselineById(id).then(setData);
  }, [id]);

  useEffect(() => {
    if (state?.basic?.name) {
      const { name, ...rest } = state.basic;
      setData({ ...state, basic: rest });
    }
  }, [state]);

  const isEdit = !!id;

  const platform = Form.useWatch('platforms', form);

  useUpdateEffect(() => {
    if (pluginEditIsInit.current) {
      pluginEditIsInit.current = false;
    } else {
      formValueIsChanged.current = true;
    }

    let p = keys(selectedRowKeys);
    const allKeys = flatten(p?.map((key) => selectedRowKeys?.[key]));
    const scannerValidFail = !allKeys?.length;
    setScannerError(scannerValidFail);
  }, [JSON.stringify(selectedRowKeys)]);

  const { title, saveSucTips, saveTxt } = useMemo(() => {
    const oprEdit = intl.formatMessage({ id: 'edit' });
    const oprNew = intl.formatMessage({ id: 'add' });
    const oprSave = intl.formatMessage({ id: 'save' });
    return {
      title: intl.formatMessage(
        { id: 'oprBaseline' },
        { name: isEdit ? oprEdit : oprNew },
      ),
      saveSucTips: intl.formatMessage(
        { id: 'oprSuc' },
        { name: isEdit ? oprSave : oprNew },
      ),
      saveTxt: isEdit ? oprSave : oprNew,
      baselineName: intl.formatMessage({ id: 'baselineName' }),
    };
  }, [isEdit]);

  const saveCalFn = useMemoizedFn((res?: number) => {
    message.success(saveSucTips);
    nextTo(`/risks/basic-line/info/${id ?? res}`);
  });

  return (
    <TzPageContainer
      key={id}
      className={classNames('info-card-box', styles.editBasicLine)}
      header={{
        title: <PageTitle formChanged={formValueIsChanged} title={title} />,
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
          key="save"
          onClick={() => {
            scannerError === 0 && setScannerError(true);
            form
              .validateFields()
              .then((vals) => {
                if (scannerError || scannerError === 0) {
                  return;
                }
                const newData = clearEmptyValInObj(selectedRowKeys);
                let p = keys(newData);
                const allKeys = flatten(
                  p?.map((key) => selectedRowKeys?.[key]),
                );
                const _vals = {
                  ...vals,
                  platforms: p,
                  policies: allKeys,
                };

                if (isEdit) {
                  editBaselines(id, _vals).then(() => saveCalFn());
                  return;
                }
                addBaseline(_vals).then((res) => saveCalFn(res.id));
                return;
              })
              .catch((e: { errorFields: NamePath[] }) => {
                setInfoErrors(
                  e.errorFields
                    ?.filter((item) => item.errors?.[0] === '')
                    ?.map((v) => v?.name?.[0]),
                );
              });
          }}
          type="primary"
        >
          {saveTxt}
        </TzButton>,
      ]}
    >
      <TzCard
        headStyle={{ paddingBottom: 0 }}
        bodyStyle={{ paddingBlock: '4px' }}
        className={classNames({ [styles.hasError]: !!infoErrors?.length })}
        title={
          <span className={styles.errorInfo}>
            {intl.formatMessage({ id: 'basicInfo' })}
            {infoErrors?.length ? (
              <span className={styles.errorInfoTxt}>
                <i>*</i>
                {infoErrors.includes('name') &&
                  intl.formatMessage({ id: 'baselineName' })}
                {infoErrors?.length === 2 && intl.formatMessage({ id: 'and' })}
                {infoErrors.includes('platforms') &&
                  intl.formatMessage({ id: 'platformType' })}
                {intl.formatMessage({ id: 'requiredTips' }, { name: '' })}
              </span>
            ) : null}
          </span>
        }
        id={id}
      >
        <TzProForm
          onValuesChange={(v) => (formValueIsChanged.current = true)}
          onFieldsChange={(_, all) => {
            setInfoErrors(
              all
                .filter((item) => item.errors?.[0] === '')
                .map((v) => v.name?.[0]),
            );
          }}
          form={form}
          submitter={false}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: '',
              },
            ]}
            fieldProps={{ maxLength: 50 }}
            name="name"
            label={intl.formatMessage({ id: 'baselineName' })}
            placeholder={intl.formatMessage(
              { id: 'txtTips' },
              { name: intl.formatMessage({ id: 'baselineName' }) },
            )}
          />
          <ProFormTextArea
            fieldProps={{ maxLength: 100 }}
            name="description"
            label={intl.formatMessage({ id: 'remark' })}
            placeholder={intl.formatMessage(
              { id: 'maxLengthTips' },
              { name: intl.formatMessage({ id: 'remark' }), len: 100 },
            )}
          />
        </TzProForm>
      </TzCard>
      <Suspense>
        <ScannerConfig
          scannerError={scannerError}
          platform={platform}
          setScannerError={setScannerError}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          baseData={policy}
        />
      </Suspense>
    </TzPageContainer>
  );
}

export default memo(EditBasicLine);
