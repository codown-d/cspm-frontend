import { Button, Result } from 'antd';
import type { ErrorInfo } from 'react';
import React from 'react';

class TzErrorBoundary extends React.Component<
  Record<string, any>,
  { hasError: boolean; errorInfo: string }
> {
  state = { hasError: false, errorInfo: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Result
          //   icon={
          //     <img
          //       width={256}
          //       src="https://gw.alipayobjects.com/zos/antfincdn/zIgkN%26mpMZ/shibaizhuangtaizuo.png"
          //     />
          //   }
          style={{
            height: '100%',
            background: '#fff',
          }}
          title="错误处理"
          extra={
            <>
              <div
                style={{
                  maxWidth: 620,
                  textAlign: 'start',
                  backgroundColor: 'rgba(255,229,100,0.3)',
                  borderInlineStartColor: '#ffe564',
                  borderInlineStartWidth: '9px',
                  borderInlineStartStyle: 'solid',
                  padding: '20px 45px 20px 26px',
                  margin: 'auto',
                  marginBlockEnd: '30px',
                  marginBlockStart: '20px',
                }}
              >
                <p>注意</p>
                <p>
                  错误边界<strong>无法</strong>捕获以下场景中产生的错误：
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                  }}
                >
                  <li>
                    事件处理（
                    <a href="https://zh-hans.reactjs.org/docs/error-boundaries.html#how-about-event-handlers#how-about-event-handlers">
                      了解更多
                    </a>
                    ）
                  </li>
                  <li>
                    异步代码（例如 <code>setTimeout</code> 或{' '}
                    <code>requestAnimationFrame</code> 回调函数）
                  </li>
                  <li>服务端渲染</li>
                  <li>它自身抛出来的错误（并非它的子组件）</li>
                </ul>
              </div>
              <Button
                danger
                type="primary"
                onClick={() => {
                  window.location.reload();
                }}
              >
                刷新页面
              </Button>
            </>
          }
        />
      );
    }
    return this.props.children;
  }
}
export default TzErrorBoundary;
