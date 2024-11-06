import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import { TzTag } from '@/components/lib/tz-tag';
import { getAuthLicense } from '@/services/cspm/UserController';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import classNames from 'classnames';
import { isBoolean } from 'lodash';
import { useRef, useState } from 'react';
import LicenseModal from '../Login/LicenseModal';

const TableList = () => {
  const [showLicense, setShowLicense] = useState<boolean>();
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const columns: TzProColumns<API.AuthLicenseResponse>[] = [
    {
      title: 'License',
      dataIndex: 'license',
    },
    {
      title: intl.formatMessage({ id: 'expireAt' }),
      dataIndex: 'expire_at',
      valueType: 'dateTime',
      width: '25%',
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'valid',
      align: 'center',
      width: '25%',
      render(dom, entity, index, action, schema) {
        if (!isBoolean(entity.valid)) {
          return '-';
        }
        return (
          <TzTag
            closable={false}
            className={classNames(
              'status-tag',
              ['error', 'success'][+entity.valid],
            )}
          >
            {
              [
                intl.formatMessage({ id: 'expired' }),
                intl.formatMessage({ id: 'normal' }),
              ][+entity.valid]
            }
          </TzTag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'operate' }),
      width: 80,
      dataIndex: 'option',
      render: (_, record) => (
        <TzButton
          style={{ marginLeft: -8 }}
          size="small"
          type="text"
          onClick={(e) => setShowLicense(true)}
        >
          {intl.formatMessage({ id: 'update' })}
        </TzButton>
      ),
    },
  ];

  return (
    <TzPageContainer
      header={{
        title: intl.formatMessage({ id: 'license' }),
      }}
    >
      <TzProTable
        actionRef={actionRef}
        rowKey="license"
        className="no-hover-table"
        request={async () => {
          const data = await getAuthLicense();
          return { total: 1, data: [data] };
        }}
        columns={columns}
      />
      {showLicense && (
        <LicenseModal
          onCancel={() => setShowLicense(false)}
          open={showLicense}
          cal={() => actionRef.current?.reset?.()}
        />
      )}
    </TzPageContainer>
  );
};

export default TableList;
