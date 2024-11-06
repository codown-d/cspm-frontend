import {
  ProDescriptions,
  ProDescriptionsItemProps,
  ProDescriptionsProps,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useSize } from 'ahooks';
import { message } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { get } from 'lodash';
import { ReactNode, useMemo } from 'react';
import TzTypography from '../../TzTypography';
import { TzButton } from '../../tz-button';
import './index.less';

export type TzProDescriptionsItemProps<RecordType, ValueType> =
  ProDescriptionsItemProps<RecordType, ValueType> & {
    propmtIcon?: string;
    tzEllipsis?: boolean | number;
    tzCopyable?: boolean;
    linkTo?: (arg: RecordType) => void;
  };

export type TzProDescriptionsProps<
  RecordType = Record<string, any>,
  ValueType = 'text',
> = Omit<ProDescriptionsProps<RecordType, ValueType>, 'columns'> & {
  columns?: TzProDescriptionsItemProps<RecordType, ValueType>[];
};
export const renderWithLinkEllipsis = (
  dom: any,
  record: unknown,
  cal?: Function,
) => {
  cal;
  return dom ? (
    <TzButton
      onClick={(e) => cal?.(record, e)}
      type="text"
      size="small"
      className="max-w-full"
    >
      <TzTypography.Text ellipsis={{ tooltip: dom }}>{dom}</TzTypography.Text>
    </TzButton>
  ) : (
    '-'
  );
};

export const renderTextWithPropmt = (
  dom: ReactNode,
  record: unknown,
  cal?: Function,
  propmtIcon?: string,
) =>
  dom ? (
    <div
      className="prompt-col link no-color"
      onClick={(e) => {
        e.stopPropagation();
        cal?.(record);
      }}
    >
      <TzTypography.Text
        ellipsis={{
          tooltip: dom,
          // @ts-ignore
          suffix: (
            <div className="prompt-icon ml-1" key={dom as string}>
              <i
                className={classNames(
                  'icon iconfont suffix-icon',
                  propmtIcon || 'icon-jiqiren',
                )}
              />
              {/* <Image preview={false} src={`${PUBLIC_URL}/ai_active.png`} /> */}
            </div>
          ),
        }}
      >
        {dom}
      </TzTypography.Text>
    </div>
  ) : (
    '-'
  );

function TzProDescriptions<
  RecordType = Record<string, any>,
  ValueType = 'text',
>(props: TzProDescriptionsProps<RecordType, ValueType>) {
  const { className, columns, ...rest } = props;
  const intl = useIntl();
  const { width = 0 } = useSize(document.body) ?? {};
  const realProps = useMemo(() => {
    return {
      className: classNames('tz-descriptions', className),
      columns: columns?.map(
        (v: TzProDescriptionsItemProps<RecordType, ValueType>) => {
          const { linkTo, propmtIcon, tzEllipsis, tzCopyable, ...realCol } = v;
          if (linkTo) {
            return {
              render: (dom, record) =>
                renderWithLinkEllipsis(dom, record, linkTo),
              ...realCol,
            };
          }
          if (tzEllipsis) {
            return {
              render: (dom: ReactNode, record) => {
                return v?.dataIndex && get(record, v?.dataIndex) ? (
                  <TzTypography.Paragraph
                    ellipsis={{ tooltip: dom, rows: +tzEllipsis }}
                  >
                    {dom}
                  </TzTypography.Paragraph>
                ) : (
                  '-'
                );
              },
              ...realCol,
            };
          }
          if (tzCopyable) {
            return {
              render: (dom, record) => {
                return renderTextWithPropmt(
                  dom,
                  record,
                  (e?: React.MouseEvent<HTMLDivElement>) => {
                    copy(dom as string);
                    message.success(
                      intl.formatMessage({ id: 'TzProDescriptions.copySuc' }),
                    );
                  },
                  'icon-fuzhi',
                );
              },
              ...realCol,
            };
          }
          return realCol;
        },
      ),
      column: width >= 1440 ? 3 : 2,
      ...rest,
    } as ProDescriptionsProps;
  }, [props, width]);
  return <ProDescriptions {...realProps} />;
}
TzProDescriptions.Item = ProDescriptions.Item;
export default TzProDescriptions;
