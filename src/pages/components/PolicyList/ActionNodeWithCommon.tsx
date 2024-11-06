import { useIntl } from '@umijs/max';

type IActionNode = {
  record?: API_RISK.RiskItem;
  onEditOk?: (record?: API_RISK.RiskItem) => void;
  deleteProps?: any;
};
const ActionNodeWithCommon = ({
  record,
  onEditOk,
  deleteProps,
}: IActionNode) => {
  const intl = useIntl();

  if (!record) {
    return;
  }

  return <div className="-ml-2">ActionNodeWithCommon</div>;
};
export default ActionNodeWithCommon;
