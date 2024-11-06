import { TzButton } from '@/components/lib/tz-button';
import { PUBLIC_URL } from '@/utils';
import { history, useIntl } from '@umijs/max';
import { Image, Result } from 'antd';
import type { FC } from 'react';

const _503: FC = () => {
  const intl = useIntl();
  return (
    <Result
      className="page-result page-result-503"
      title={
        <Image
          width={356}
          preview={false}
          src={`${PUBLIC_URL}/503.png`}
          alt="503"
        />
      }
      status="500"
      subTitle={
        <div className="mt-[174px] text-[#3E4653]">
          {intl.formatMessage({ id: 'request.code.503' })}
          <p className="mt-5">
            <TzButton type="primary" onClick={() => history.replace('/login')}>
              返回登录页
            </TzButton>
          </p>
        </div>
      }
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

export default _503;
