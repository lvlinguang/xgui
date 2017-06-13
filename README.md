# xgui
前端框架，类似easyui，更方便，速度更快

插件效果部分预览图：
http://www.xgbanji.com/user/1/photo/3738

后期将整理一整套的demo出来

### Datagrid test
```
$("#grid").datagrid({
    title: "用户管理",
    pagination: true,
    pageSize: 30,
    url: "/Platform/Platform/CityList",
    queryParams: { ID: 5 },
    idField: 'ID',
    //BindExternalEvents: function () { optsEvent(); },
    columns: [[
            { checkbox: true, field: 'ID', hidden: false },
            { field: 'CityID', title: '市ID', width: 200 },
            { field: 'Name', title: '名称', width: 200 },
            { field: 'ProvinceID', title: '省ID', width: 100 },
            {
                title: '操作', field: 'ID', width: 100,
                formatter: function (value, rowData, rowIndex) {
                    return "<a href=\"javascript:;\" class=\"opt\">操作</a>";
                }
            }
    ]]
});

```