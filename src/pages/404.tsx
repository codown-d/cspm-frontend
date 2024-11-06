import { PUBLIC_URL } from '@/utils';
import { useIntl } from '@umijs/max';
import { Image, Result } from 'antd';
import type { FC } from 'react';

const _404: FC = () => {
  const intl = useIntl();
  return (
    <Result
      className="page-result"
      title={
        <Image
          width={200}
          preview={false}
          src={`${PUBLIC_URL}/404.png`}
          alt="loading"
        />
      }
      status="404"
      subTitle={intl.formatMessage({ id: 'layout.404' })}
    />
  );
  // return (
  //   <div className="w-full pt-32 flex flex-col justify-center items-center">
  //     <img src={`${PUBLIC_URL}/404.png`} alt="loading" />
  //     <div className="text-[#7d8799]">
  //       <FormattedMessage id="layout.404" />
  //     </div>
  //   </div>
  // );
};

export default _404;
