import { TzButton } from '@/components/lib/tz-button';
import { OffScreenContext } from '@tz/components/dist';
import { history, useIntl } from '@umijs/max';
import { Drawer } from 'antd';
import { memo, useContext, useEffect, useRef } from 'react';

type PluginsDrawerProps = {
  open?: boolean;
  onClose: () => void;
  name: string;
};
function PluginsDrawer(props: PluginsDrawerProps) {
  const { open, onClose, name } = props;
  const intl = useIntl();
  const ref = useRef<HTMLDivElement>(null);

  const { registryCompScroll } = useContext(OffScreenContext);
  useEffect(() => {
    setTimeout(() => {
      registryCompScroll(ref.current);
    }, 500);
  }, []);

  return (
    <Drawer
      width={1152}
      destroyOnClose
      open={open}
      onClose={onClose}
      title={name}
      className="plugins-drawer"
      styles={{ body: { padding: 0 } }}
    >
      <div ref={ref}>
        <TzButton
          onClick={() => {
            history.push(`/risks/info/510`);
            // console.log(
            //   'PluginsDrawer top',
            // ref.current?.querySelectorAll('*'),
            // console.log(ref.current?.parentNode.parentNode);
          }}
        >
          1111
        </TzButton>
        <div className="card-tit has-icon">
          <span className="tit-txt">
            {intl.formatMessage({ id: 'riskList' })}
          </span>
        </div>
        {/* <Main /> */}
      </div>
    </Drawer>
  );
}

export default memo(PluginsDrawer);
