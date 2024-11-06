import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import { useScanStatusEnum } from '@/hooks/enum/useScanStatusEnum';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import {
  renderCommonStatusTag,
  renderCommonTag,
} from '@/pages/components/RenderRiskTag';
import { IPolicyTableOptionals, getStandardOptionals } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { get, keys } from 'lodash';
import {
  ReactNode,
  Ref,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

interface IProps {
  optionals?: IPolicyTableOptionals;
  renderActionBtns?: (
    arg: ReactNode,
    record: API.CredentialsDatum,
  ) => ReactNode;
}

export type CredentialTableRef = {
  reload: VoidFunction;
};
const CredentialTable = (
  { optionals, renderActionBtns, ...restProps }: IProps,
  ref: Ref<CredentialTableRef>,
) => {
  const intl = useIntl();
  const { getScanTagInfoByStatus } = useScanStatusEnum();
  const actionRef = useRef<ActionType>();
  const _optionals = useMemo(
    () => getStandardOptionals(optionals),
    [optionals],
  );
  const columns = useMemo(() => {
    const _colums: TzProColumns<API.CredentialsDatum>[] = [
      {
        title: intl.formatMessage({ id: 'accountName' }),
        dataIndex: 'name',
        tzEllipsis: 2,
      },
      {
        title: intl.formatMessage({ id: 'cloudPlatformType' }),
        dataIndex: 'platform',
        render(dom) {
          return <RenderColWithIcon platform={dom as string} />;
        },
      },
      {
        title: intl.formatMessage({ id: 'testingResult' }),
        dataIndex: 'status',
        isOptional: true,
        align: 'center',
        width: 90,
        render: (_, { status }) =>
          status
            ? renderCommonStatusTag(
                {
                  getTagInfoByStatus: getScanTagInfoByStatus,
                  status,
                },
                { size: 'small' },
              )
            : '-',
      },
      {
        title: intl.formatMessage({ id: 'tag' }),
        dataIndex: 'tags',
        width: '20%',
        render: (_, { tags }) => (tags?.length ? renderCommonTag(tags) : '-'),
        // render: (_, {tags}) => (
        //   <div className="max-w-full">
        //     {tags?.length ? renderCommonTag(tags) : '-'}
        //   </div>
        // ),
      },
      {
        title:
          get(_optionals, ['created_at', 'label']) ??
          intl.formatMessage({ id: 'creationTime' }),
        dataIndex: 'created_at',
        valueType: 'dateTime',
        isOptional: true,
      },
      {
        title: intl.formatMessage({ id: 'modifiedTime' }),
        dataIndex: 'updated_at',
        valueType: 'dateTime',
        isOptional: true,
      },
    ].filter((v) => !v.isOptional || keys(_optionals)?.includes(v.dataIndex));

    renderActionBtns &&
      _colums.push({
        title: intl.formatMessage({ id: 'operate' }),
        dataIndex: 'option',
        render: renderActionBtns,
      });
    return _colums;
  }, [renderActionBtns]);

  useImperativeHandle(ref, () => {
    return {
      reload() {
        actionRef.current?.reload?.();
      },
    };
  });
  return (
    <TzProTable<API.CredentialsDatum>
      rowKey="id"
      columns={columns}
      {...restProps}
      actionRef={actionRef}
    />
  );
};

export default memo(forwardRef(CredentialTable));
