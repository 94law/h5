# X-Components

该目录中的组件基于 `vant` 进行二次封装，主要是为了扩展vant组件的功能或者增加新的通用组件。

## FontIcon

### 添加图标

1. 将图标源文件`*.svg`放到`combine-icons/fonts`目录  
2. 执行 `npm run iconfont:gen` 将从 `combine-icons/fonts` 目录中生成 `iconfont`

```vue
<x-font-icon name="rectangle" />
```

### Props

| 参数   | 说明                                                    | 类型             | 默认值    |
| :---- | :------------------------------------------------------ | :-------------- | :------- |
| name  | 图标名称                                                 | string           | -       |
| dot   | 是否显示图标右上角小红点                                    | boolean          | false   |
| badge | 图标右上角徽标的内容                                       | string \| number | -       |
| size  | 图标大小，如`20px`, `2em`，当传入 number 类型时默认单位为`px` | string \| number | inherit |
| color | 图标颜色                                                 | string           | -       |
| tag   | HTML 标签                                               | string           | -       |

### Events

| 事件名  | 说明         | 回调参数       |
| :----- | :----------- | :----------- |
| click  | 点击图标时触发 | event: Event  |

## Popup

> API 参考 [Vant Popup](https://vant-contrib.gitee.io/vant/#/zh-CN/popup)

以下为新增的`props`和`slots`

### Props

| 参数                 | 说明                                         | 类型       | 默认值 |
| :------------------ | :------------------------------------------- | :-------- | :---- |  
| title               | 标题                                         | string    | -     |
| close-icon-position | 关闭图标位置，新增`top-center`和`bottom-center` | string    | -     |

### Slots

| 名称  | 说明                                                          |
| :------ | :--------------------------------------------------------- |
| default | 弹窗内容                                                    |
| title   | 标题                                                        |
| action  | 标题右侧内容                                                 |
| footer  | 弹窗底部内容                                                 |

## CountUp

该组件基于 [countup.js](https://github.com/inorganik/countUp.js)进行封装

### Props

| 参数      | 说明                                      | 类型           | 默认值                                 |
| :------- | :---------------------------------------- | :------------- | :------------------------------------ |
| end-val  | 结束值                                     | number         | -                                     |
| autoplay | 是否在组件加载后自动执行动画                   | boolean        | true                                  |
| delay    | 延迟多久执行动画，仅在`autoplay`为`true`时生效 | number         | -                                     |
| options  | countUp.js options配置                     | CountUpOptions | 参考以下`CountUpOptions` |

### CountUpOptions (defaults in parentheses)

```ts
interface CountUpOptions {
  startVal?: number; // number to start at (0)
  decimalPlaces?: number; // number of decimal places (0)
  duration?: number; // animation duration in seconds (2)
  useGrouping?: boolean; // example: 1,000 vs 1000 (true)
  useEasing?: boolean; // ease animation (true)
  smartEasingThreshold?: number; // smooth easing for large numbers above this if useEasing (999)
  smartEasingAmount?: number; // amount to be eased for numbers above threshold (333)
  separator?: string; // grouping separator (',')
  decimal?: string; // decimal ('.')
  // easingFn: easing function for animation (easeOutExpo)
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  formattingFn?: (n: number) => string; // this function formats result
  prefix?: string; // text prepended to result
  suffix?: string; // text appended to result
  numerals?: string[]; // numeral glyph substitution
}
```

### Methods

| 名称         | 说明                          |
| :---------- | :---------------------------- |
| start       | 接收回调参数，动画结束后触发       |
| pauseResume | 暂停或恢复                      |
| reset       | 重置为初始值`startVal`           |
| update      | 更新至最新的值，参数为`number`类型 |

**更多API使用请参考：[countup.js](https://github.com/inorganik/countUp.js#usage)**

## Placeholder

该组件主要用于占位，通常用于子组件设置为 `position: fixed;` 的情况下，未占用该区域导致遮挡的问题

如下示例：

```html
<x-placeholder>
  <div class="footer" style="position: fixed"></div>
</x-placeholder>
```