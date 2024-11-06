import TzProTable, {
  TzProTableProps,
} from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import Loading from '@/loading';
import { useIntl, useNavigate } from '@umijs/max';

export type TTodoList<T extends Record<string, any>> = Omit<
  TzProTableProps<T>,
  'title'
> & {
  title: string;
  goUrl: string;
  fetchUrl: () => Promise<T[]>;
  loading?: boolean;
  className?: string;
};
function TodoList<T extends Record<string, any>>(props: TTodoList<T>) {
  const intl = useIntl();
  const { title, goUrl, loading, className, ...restProps } = props;

  const navigate = useNavigate();

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div className="head-tit-1">
          {title ?? intl.formatMessage({ id: 'todo' })}
        </div>
        <TzButton size="small" type="text" onClick={() => navigate(goUrl)}>
          {intl.formatMessage({ id: 'showMore' })}
        </TzButton>
      </div>
      <div className="pb-5 px-4 -mx-4 mt-3 max-h-[251px] overflow-y-auto">
        {loading ? (
          <Loading style={{ paddingTop: 8 }} />
        ) : (
          <TzProTable<T> pagination={false} {...restProps} />
        )}
      </div>
    </div>
  );
}

export default TodoList;
