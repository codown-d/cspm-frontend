import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { FormattedMessage } from '@umijs/max';
import List from './Credentials/List';
import PlatformClassify from './Credentials/PlatformClassify';
import styles from './index.less';

const CloudPlatform = () => {
  return (
    <TzPageContainer
      header={{
        title: <FormattedMessage id="cloudPlatform" />,
      }}
      className={styles.cloudPlatformPage}
    >
      <PlatformClassify className="mb-5" />
      <List />
    </TzPageContainer>
  );
};
export default CloudPlatform;
