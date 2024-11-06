import './index.less';
export interface IConfigItem {
  t: string;
  desc: string;
  isEdit: boolean;
  previewNode: React.ReactNode;
  editNode: React.ReactNode;
  style?: any;
  vertical?: boolean;
}
function ConfigItem(props: IConfigItem) {
  const { isEdit, t, desc, previewNode, editNode, style, vertical } = props;
  return (
    <div className={'config-item'} style={style}>
      <div className={'flex-r-c'} style={{ justifyContent: 'space-between' }}>
        {t}
        {!vertical && (isEdit ? editNode : previewNode)}
      </div>
      <p className="tips mt-1">{desc}</p>
      {vertical && (isEdit ? editNode : previewNode)}
    </div>
  );
}
export default ConfigItem;
