import TzCheckCard from '@/components/lib/ProComponents/TzCheckCard';
import TzTypography from '@/components/lib/TzTypography';
import { EN_LANG, ZH_LANG } from '@/locales';
import RenderRiskTag from '@/pages/components/RenderRiskTag';
import { getCompliance } from '@/services/cspm/Compliance';
import { DATE_TIME } from '@/utils/constants';
import { getLocale, history, useIntl } from '@umijs/max';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import CExportModal from '../CExportModal';
import styles from './index.less';

const ComplianceList = () => {
  const [list, setList] = useState<API.ComplianceDatum[]>();
  const intl = useIntl();
  const lang = getLocale();
  const [exportOpent, setExportOpent] = useState<boolean>();
  useEffect(() => {
    getCompliance({}).then((res) => setList(res?.items));
  }, []);

  return (
    <div className={styles.platformClassifyList}>
      <TzCheckCard.Group>
        {list?.map(
          ({ key, severity, updated_at, name, policy_num, pass_rate }) => (
            <TzCheckCard
              onClick={() =>
                !exportOpent && history.push(`/compliance/info/${key}`)
              }
              value={key}
              key={key}
              title={
                <div className="flex items-center pb-3 px-3">
                  <div className="mr-3 w-[48px]">
                    <div className="bg-[#2177D1]/5 rounded-lg p-[10px] leading-none text-[#2177D1]">
                      <i className="icon iconfont icon-anquanzhuangtai text-[28px]" />
                    </div>
                  </div>
                  <div className={styles.titContent}>
                    <p className="text-base font-medium ">
                      <TzTypography.Text ellipsis={{ tooltip: name }}>
                        {name}
                      </TzTypography.Text>
                    </p>
                    <p className="text-[#8E97A3] leading-5 mt-1">
                      {intl.formatMessage({ id: 'lastUpdatedTime' })}：
                      {dayjs(updated_at).format(DATE_TIME)}
                    </p>
                  </div>
                </div>
              }
              description={
                <div className={styles.description}>
                  <div className="mt-3">
                    <span className="text-[#6C7480] mr-1">
                      {intl.formatMessage({ id: 'detectionNum' })}：
                    </span>
                    <span className="text-[#3E4653]">{policy_num}</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[#6C7480] mr-1">
                      {intl.formatMessage({ id: 'passingRate' })}：
                    </span>
                    <span
                      className={classNames('text-[#3E4653]', {
                        ['ml-[29px]']: lang === EN_LANG,
                        ['ml-[14px]']: lang === ZH_LANG,
                      })}
                    >
                      {pass_rate ? `${pass_rate}%` : '-'}
                    </span>
                  </div>
                  <div className="mt-3 flex leading-7">
                    <span className="text-[#6C7480] mr-1 inline-block whitespace-nowrap">
                      {intl.formatMessage({ id: 'statisticalRisk' })}：
                    </span>
                    <div>
                      <RenderRiskTag record={severity} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    {key && name && (
                      <CExportModal
                        exportInfo={{ key, name }}
                        onOpenChange={setExportOpent}
                      />
                    )}
                  </div>
                </div>
              }
            />
          ),
        )}
      </TzCheckCard.Group>

      {/* {exportInfo && <CExportModal ref={exportRef} exportInfo={exportInfo} />} */}
    </div>
  );
};

export default ComplianceList;
