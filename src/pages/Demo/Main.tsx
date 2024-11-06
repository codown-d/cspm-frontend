import TzTabs, { TzTabsProps } from '@/components/lib/TzTabs';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';

function Main() {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TzTabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      children: <Page1 />,
    },
    {
      key: '2',
      label: 'Tab 2',
      children: <Page2 />,
    },
    {
      key: '3',
      label: 'Tab 3',
      children: <Page3 />,
    },
  ];
  return (
    <div>
      <TzTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}

export default Main;
