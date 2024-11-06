// echarts.config.ts
// * 需要哪些组件和配置，请在 import 时手动添加。
import * as echarts from 'echarts/core';
// 引入用到的图表
import {
  BarChart,
  CustomChart,
  GaugeChart,
  LineChart,
  PieChart,
  RadarChart,
} from 'echarts/charts';
// 引入提示框、数据集等组件
import {
  DataZoomComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
  TimelineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
// 引入标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，必须
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  BarChart,
  PieChart,
  RadarChart,
  LineChart,
  TimelineComponent,
  GaugeChart,
  TitleComponent,
  CustomChart,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  UniversalTransition,
  TooltipComponent,
  CanvasRenderer,
  LabelLayout,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  RadarComponent,
]);

export default echarts;

// 类型相关
// 系列类型的定义后缀都为 SeriesOption
import type {
  BarSeriesOption,
  CustomSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
} from 'echarts/charts';
// 组件类型的定义后缀都为 ComponentOption
import type {
  DataZoomComponentOption,
  LegendComponentOption,
  RadarComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
// 通过引入 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
import type { ComposeOption } from 'echarts/core';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = ComposeOption<
  | BarSeriesOption
  | PieSeriesOption
  | LineSeriesOption
  | GaugeSeriesOption
  | RadarComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | CustomSeriesOption
  | DataZoomComponentOption
  | ToolboxComponentOption
  | RadarComponentOption
  | RadarSeriesOption
>;
