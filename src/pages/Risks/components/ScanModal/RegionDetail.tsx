import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import { useIntl, useModel } from '@umijs/max';
import { Form } from 'antd';
type RegionDetailProps = {
  setScanVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};

function RegionDetail({ setScanVisible }: RegionDetailProps) {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const { text } = initialState ?? {};

  const columns: TzProColumns<API.AgentlessRegionsInfo>[] = [
    {
      title: intl.formatMessage({ id: 'cPlatform' }),
      dataIndex: 'key',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'supportRegion' }),
      dataIndex: 'value',
      render(dom, entity, index, action, schema) {
        return <div style={{ whiteSpace: 'pre-wrap' }}>{entity.value}</div>;
      },
    },
  ];
  const [form] = Form.useForm();

  return (
    <TzModalForm
      form={form}
      width={560}
      submitter={{
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
        searchConfig: { resetText: intl.formatMessage({ id: 'back' }) },
      }}
      onFinish={async () => true}
      modalProps={{ closable: false }}
      onOpenChange={(open) => setScanVisible?.(!open)}
      title={
        <div className="flex leading-7">
          <span
            onClick={() => {
              setScanVisible?.(true);
              form.submit();
            }}
            className="icon iconfont icon-arrow inline-flex items-center justify-center title-back rotate-90 text-lg cursor-pointer w-7 h-7 hover:text-[#2177d1] hover:bg-[rgba(33,119,209,0.05)]"
          />
          <span className="ml-2">
            {intl.formatMessage({ id: 'unStand.agentlessSupport' })}
          </span>
        </div>
      }
      trigger={
        <a className="underline mx-1">
          {intl.formatMessage({ id: 'viewDetails' })}
        </a>
      }
    >
      <TzProTable<API.AgentlessRegionsInfo>
        className="no-hover-table mb-2"
        dataSource={text?.agentless_regions_info}
        rowKey="key"
        columns={columns}
        pagination={false}
      />
    </TzModalForm>
  );
}

export default RegionDetail;
