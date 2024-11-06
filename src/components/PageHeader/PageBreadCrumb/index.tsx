import { FormattedMessage, Link } from '@umijs/max';
import { Breadcrumb, BreadcrumbProps } from 'antd';
import './index.less';
export type PageBreadCrumbProps = {
  items: BreadcrumbProps['items'];
};
function PageBreadCrumb({ items }: PageBreadCrumbProps) {
  return (
    <div className="tz-page-breadcrumb">
      <Breadcrumb
        items={items?.map((item: any) => ({
          title: item.path ? (
            <Link key={item.path} to={item.path}>
              <FormattedMessage id={item.title} defaultMessage={item.title} />
              {/* {intl.formatMessage({ id: item.title })} */}
            </Link>
          ) : (
            <FormattedMessage id={item.title} defaultMessage={item.title} />
          ),
          key: item.title,
        }))}
      />
    </div>
  );
}

export default PageBreadCrumb;
