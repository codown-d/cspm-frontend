# README CSPM

## start

```bash
$ pnpm i
$ pnpm start
```

## build

```bash
$ pnpm i
$ pnpm build
```

# 注意事项

1. 新增、编辑、详情页、列表页的跳转逻辑

xxx1页 -> xxx2页 -> 增/创建副本页面 提交成功后：新详情  (返回：xxx2页 ->  xxx1页)
xxx1页 -> 详情页 -> 编辑页面 提交成功后： 详情页(新数据)  (返回：xxx1页)
xxx1页 -> xxx2页 -> 编辑页面 提交成功后： 详情页(新数据)  (返回：xxx2页 -> xxx1页)
xxx1页 -> A详情页 ->  单一控件编辑（周期任务详情开关） 操作成功后： A详情页(新数据)  (返回：xxx1页)

路径中xxx若为有操作列的列表页，则都要刷新表格的当前页数据，其它部分保留缓存

2. 所有可以在页面上可以新增、编辑的数据，在新增成功的接口需要返回新数据的 id，用这个 id 跳转到数据的详情页

3. 页面上可以编辑数据的列表页面，需要在列表页调用 `useRefreshTable`

4. 表格行点击增加了个统一处理方法，主要针对筛选项面板打开的情况，点击行响应的面板失焦 而不是跳转。现在我统一修改了，后面新功能需要注意这个。

```jsx
<TzProTable<API.BaselinesDatum>
  onRow={(record) => {
    return {
      onClick: () =>
        onRowClick(() =>
          history.push(`/risks/basic-line/info/${record.id}`),
        ),
    };
  }}
/>
```
5. 组件内的样式采用横杠。自己页面业务代码里用小驼峰，并用import ..  from .. 的方式引入使用。这样业务代码内样式重名也不会相互影响
