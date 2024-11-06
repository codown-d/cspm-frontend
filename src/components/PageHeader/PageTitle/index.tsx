import TzTypography from '@/components/lib/TzTypography';
import useCancelFormEdit from '@/hooks/useCancelFormEdit';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { ReactNode, RefObject } from 'react';
import './index.less';

type TPageTitle = {
  title: string;
  backFn?: () => void;
  tag?: ReactNode;
  showBack?: boolean;
  formChanged?: boolean | RefObject<boolean>;
};

function PageTitle({ title, backFn, tag, showBack, formChanged }: TPageTitle) {
  const intl = useIntl();
  const dstBackFn = backFn ?? (() => history.back());
  const cancelTipFn = useCancelFormEdit();

  const onBack = useMemoizedFn(() => {
    if (formChanged === undefined) {
      dstBackFn();
      return;
    }
    const isChange =
      typeof formChanged === 'boolean' ? formChanged : formChanged.current;
    if (!isChange) {
      dstBackFn();
    } else {
      cancelTipFn(dstBackFn);
    }
  });

  return (
    <span className={classNames('tz-page-title')}>
      <i onClick={onBack} className="icon iconfont icon-arrow title-back" />
      <TzTypography.Paragraph
        className="tz-page-txt ml-1 text-link"
        ellipsis={{ rows: 2, tooltip: title }}
      >
        {title}
      </TzTypography.Paragraph>
      {tag}
    </span>
  );
}

export default PageTitle;
