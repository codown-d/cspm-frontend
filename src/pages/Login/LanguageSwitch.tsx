import chinaPng from '@/assets/images/china.png';
import enPng from '@/assets/images/usa.png';
import { TzButton } from '@/components/lib/tz-button';
import { EN_LANG, ZH_LANG } from '@/locales';
import { changeLanguage } from '@/locales/translate';
import { FormattedMessage, useLocation } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

function LanguageSwitch() {
  const { pathname, state } = useLocation();
  const switchLang = useMemoizedFn((lang) => {
    changeLanguage(lang, false);
    // history.replace({ pathname }, state);
    // window.location.reload();
  });
  return (
    <div className="flex justify-around mt-[10px] language-bar">
      <TzButton
        type="text"
        size="small"
        onClick={() => switchLang(ZH_LANG)}
        className="hover:!text-[#2177d1]"
      >
        <img className="w-5 h-4 mr-1 mb-1" alt="icon" src={chinaPng} />
        简体中文
      </TzButton>
      <TzButton
        type="text"
        size="small"
        onClick={() => switchLang(EN_LANG)}
        className="hover:!text-[#2177d1]"
      >
        <img className="w-5 h-4 mr-1 mb-1" alt="icon" src={enPng} />
        <FormattedMessage id="english" />
      </TzButton>
    </div>
  );
}

export default LanguageSwitch;
