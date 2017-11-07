/**
 * jQuery xgui 1.2.6
 * 
 * made by：lvlinguang
 *
 * QQ:635074566
 *  
 * https://github.com/lvlinguang/xgui
 * 
 * 仅供个人学习使用，不得用于商业
 * 
 * 2017年
 */



//msg-div
var msgdiv = "<div class=\"xgui-msg\"></div>";

//msg-header
var msgheader = "<div class=\"xgui-msg-head\"><h2 class=\"xgui-msg-tit\">系统提示</h2><a href=\"javascript:;\" class=\"xgui-msg-close\" title=\"关闭\">×</a></div>";

//msg-main
var msgmain = "<div class=\"xgui-msg-main clearfix\"><span class=\"xgui-msg-icon icon-ok\"></span><span class=\"xgui-msg-info\">操作成功！</span></div>";

//msg-bottom
var msgbottom = "<div class=\"xgui-msg-bottom\"><a href=\"javascript:;\" class=\"xgui-msg-btn line-blue msg-btn-ok\">是</a></div>";

//msg-tip
var msgtip = "<span class=\"xgui-msg-icon icon-ok\"></span><span class=\"xgui-msg-info msgtip-info\">操作成功！</span>";

//mask遮罩
var xguimask = "<div class=\"xgui-mask\"></div>";


/*
*   datagrid — jQuery XGUI
*   made by：lv
*   Production in：2013-10-15
*   Last updated：2016-11-24
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'datagrid').options;

        var gbody = $(target);

        //添加样式
        gbody.css({ "position": "relative" });

        gbody.addClass("xgui-datagrid");

        //表格宽度
        if (opts.width) {

            gbody.outerWidth(opts.width);
        }
        else {

            gbody.outerWidth("100%");
        }

        //头部
        if (opts.title) {

            gbody.html("<div class=\"xgui-datagrid-header\"><span class=\"xgui-datagrid-header-icon\"></span><span class=\"xgui-datagrid-header-h2\">" + opts.title + "</span></div>");
        }

        gbody.append("<div class=\"xgui-datagrid-title\"></div><div class=\"xgui-datagrid-body\"></div>");

        //列表高度
        if (opts.height) {

            //取消固定头部
            opts.frozenHeader = false;
        }

        //冻结头部
        if (opts.frozenHeader) {

            //固定栏
            opts.fixbar = $(target).find(".xgui-datagrid-title");

            //固定时事件
            opts.fixEvent = function (title) {

                //给固定标题添加样式
                $(title).addClass("xgui-datagrid-title-fix");
            }

            //不固定时事件
            opts.unfixEvent = function (title) {

                //去掉给固定标题样式
                $(title).removeClass("xgui-datagrid-title-fix");
            }

            //冻结插件
            $(target).freeze(opts);
        }

        //是否分页
        if (opts.pagination) {

            gbody.append("<div class=\"xgui-datagrid-pager\"></div>");
        }

        //设置默认数据
        setDefaultValue(target);

        //载入默认框架
        Load(target);

        //刷新数据
        $(target).datagrid("reload");
    };

    //设置默认数据
    function setDefaultValue(target) {

        //设置默认数据
        $.data(target, "datagrid").data = eval('(' + '{count:0,data:[]}' + ')');
    }

    //载入数据
    function Load(target) {

        //刷新表头
        CreateTitle(target);

        //刷新内容
        CreateBody(target);

        //刷新页码
        CreatePager(target);

        //绑定事件
        BindEvent(target);

    }

    //刷新数据
    function reload(target) {

        var opts = $.data(target, 'datagrid').options;

        //加载提示信息
        xgui.loading("show", opts.loadMsg);

        //载入远程数据
        if (opts.localData == null) {

            xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                //字符串
                if (typeof o == 'string') {

                    //转换成对象
                    var data = eval('(' + o + ')');

                    //设置默认数据
                    setDefaultValue(target);
                }
                else {

                    if (o == null || (o.count != null && o.data == null)) {

                        xgui.alert("后台返回数据错误，值为null", "error");

                        setDefaultValue
                    }
                    else if (o.count == null || o.data == null) {

                        xgui.alert("后台返回数据格式错误，应为：return Json(new { count = count, data = data })", "error");

                        //设置默认数据
                        setDefaultValue(target);
                    }
                    else {

                        $.data(target, "datagrid").data = o;
                    }
                }

                //载入数据
                Load(target);

                //隐藏loading
                xgui.loading("hide");

                //载入成功触发的事件
                opts.onLoadSuccess();

            });

        }
            //载入本地数据
        else {

            //字符串
            if (typeof opts.localData == 'string') {

                //转换成对象
                var data = eval('(' + opts.localData + ')');

                $.data(target, "datagrid").data = data;
            }
            else {

                $.data(target, "datagrid").data = opts.localData;
            }

            //载入数据
            Load(target);

            //隐藏loading
            xgui.loading("hide");

            //载入成功触发的事件
            opts.onLoadSuccess();

        }

    }

    //创建表头
    function CreateTitle(target) {

        var opts = $.data(target, 'datagrid').options;

        var gtitle = $(target).find(".xgui-datagrid-title:eq(0)");

        var htmldata = "<table cellspacing=\"0\" cellpadding=\"0\"><tbody><tr>";

        //columns
        var col = opts.columns[0];

        //行标
        if (opts.rownumbers) {

            htmldata += "<td><div class=\"xgui-datagrid-cell-number\">&nbsp;</div></td>";
        }

        for (var i = 0; i < col.length; i++) {

            htmldata += "<td field=\"" + col[i].field + "\"";

            //是否隐藏
            if (col[i].hidden) {

                htmldata += " style=\"display:none;\"";
            }

            htmldata += ">";

            //复选框
            if (col[i].checkbox) {

                htmldata += "<div class=\"xgui-datagrid-header-check\"><input type=\"checkbox\"></div>";

            }
            else {

                htmldata += "<div class=\"xgui-datagrid-cell\" style = \"";

                //方向
                if (col[i].align) {

                    htmldata += "text-align:" + col[i].align + ";";
                }

                //排列
                htmldata += "\">";

                htmldata += col[i].title;

                htmldata += "</div>";
            }

            htmldata += "</td>";

        }

        htmldata += "</tr></tbody></table>";

        //输出
        gtitle.html(htmldata);

    }

    //创建内容
    function CreateBody(target) {

        var opts = $.data(target, 'datagrid').options;

        var data = $.data(target, "datagrid").data;

        var gbody = $(target).find(".xgui-datagrid-body");

        var htmldata = "<table cellspacing=\"0\" cellpadding=\"0\"><tbody>";

        //columns
        var col = opts.columns[0];

        //行数据
        $.each(data.data, function (rowindex, rowdata) {

            htmldata += "<tr datagrid-row-index=\"" + rowindex + "\" class=\"xgui-datagrid-row\">";

            //行标
            if (opts.rownumbers) {

                htmldata += "<td><div class=\"xgui-datagrid-cell-number\">" + ((opts.pageIndex - 1) * opts.pageSize + rowindex + 1) + "</div></td>";
            }

            //单元格数据
            $.each(col, function (r, d) {

                htmldata += "<td field=\"" + d.field + "\"";

                //是否隐藏
                if (d.hidden) {

                    htmldata += " style=\"display:none;\"";
                }

                htmldata += ">";

                //复选框
                if (d.checkbox) {

                    htmldata += "<div class=\"xgui-datagrid-cell-check\"><input type=\"checkbox\"></div>";

                }
                else {

                    htmldata += "<div class=\"xgui-datagrid-cell\" style = \"";

                    //方向
                    if (d.align) {

                        htmldata += "text-align:" + d.align + ";";
                    }

                    //排列
                    htmldata += "\">";

                    if (d.formatter) {

                        htmldata += d.formatter(rowdata[d.field], rowdata, rowindex)

                    }
                    else {

                        htmldata += rowdata[d.field] != null ? rowdata[d.field] : "";

                    }

                    htmldata += "</div>";

                }

                htmldata += "</td>";

            });

            htmldata += "</tr>";

        });

        htmldata += "</tbody></table>";

        //输出
        gbody.html(htmldata);


    }

    //创建页码
    function CreatePager(target) {

        var opts = $.data(target, 'datagrid').options;

        var data = $.data(target, "datagrid").data

        var gpager = $(target).find(".xgui-datagrid-pager");

        //共几条数据
        var htmldata = "<span>共" + data.count + "条记录</span>";

        //共几页
        var pageCount = data.count % opts.pageSize > 0 ? parseInt(data.count / opts.pageSize) + 1 : data.count / opts.pageSize;

        //首页、上一页
        if (opts.pageIndex != 1) {

            htmldata += "<span><a href=\"javascript:;\" pageNumber=\"1\" title=\"首页\">首页</a></span><span><a href=\"javascript:;\" pageNumber=\"" + (opts.pageIndex - 1) + "\" title=\"上一页\">上一页</a></span>";
        }
        else {

            htmldata += "<span>首页</span><span>上一页</span>";
        }

        //页码
        htmldata += "<span>" + opts.pageIndex + "/" + pageCount + "</span>";

        //下一页、尾页
        if (pageCount != 0 && opts.pageIndex != pageCount) {

            htmldata += "<span><a href=\"javascript:;\" pageNumber=\"" + (opts.pageIndex + 1) + "\" title=\"下一页\">下一页</a></span><span><a href=\"javascript:;\" pageNumber=\"" + pageCount + "\" title=\"尾页\">尾页</a></span>";
        }
        else {
            htmldata += "<span>下一页</span><span>尾页</span>";
        }

        //跳转
        //htmldata += "<span>转到第<input name=\"number\" type=\"text\" class=\"datagrid-pager-ipt\" />页</span><a href=\"javascript:;\" class=\"datagrid-pager-btn\">GO</a>";

        //输出
        gpager.html(htmldata);

    }

    //设置表格大小
    function Resize(target) {

        var opts = $.data(target, 'datagrid').options;

        //表头
        var gtitle = $(target).find(".xgui-datagrid-title:eq(0)");

        //表格
        var gbody = $(target).find(".xgui-datagrid-body");

        //表格宽减内边距
        var tableWidth = $(target).width() - (gbody.outerWidth() - gbody.width());

        if (opts.height) {

            //表格宽-18（滚动条宽）
            tableWidth -= 18;

            //是否有分页
            if (opts.pagination) {

                //分页
                var gpage = $(target).find(".xgui-datagrid-pager");

                gbody.css({ "height": opts.height - gtitle.outerHeight() - 2 - gpage.outerHeight(), "overflow-y": "scroll" });
            }
            else {

                gbody.css({ "height": opts.height - gtitle.outerHeight() - 2, "overflow-y": "scroll" });
            }
        }

        //设置表头宽
        gtitle.find("table:first").outerWidth(tableWidth);

        //设置内容表格宽
        gbody.find("table:first").outerWidth(tableWidth);

        //总列数大小
        var columnWidth = 0;

        //columns
        var col = opts.columns[0];

        //行标
        if (opts.rownumbers) {

            tableWidth -= $(target).find(".xgui-datagrid-cell-number").outerWidth();
        }

        for (var i = 0; i < col.length; i++) {

            //复选框
            if (col[i].checkbox) {

                tableWidth -= $(target).find(".xgui-datagrid-header-check").outerWidth();
            }
                //隐藏列
            else if (col[i].hidden) {

            }
            else {

                columnWidth += col[i].width || 100;
            }
        }

        //单元格宽度比例
        var rate = tableWidth / columnWidth;

        //padding值
        var padding = $(target).find(".xgui-datagrid-cell").outerWidth() - $(target).find(".xgui-datagrid-cell").width();

        for (var i = 0; i < col.length; i++) {

            if (!col[i].checkbox && !col[i].hidden) {

                var w = col[i].width || 100;

                w = parseInt(w * rate) - padding;

                $(target).find("td[field=" + col[i].field + "] .xgui-datagrid-cell").width(w);

            }
        }
    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'datagrid').options;

        var data = $.data(target, "datagrid").data;

        //表内容
        var gbody = $(target).find(".xgui-datagrid-body");

        //隔行颜色
        gbody.find('.xgui-datagrid-row:odd').addClass("xgui-datagrid-row-alt");

        //事件
        gbody.find('.xgui-datagrid-row').unbind(".datagrid").
            //鼠标移上去事件
            bind('mouseenter.datagrid', function () {
                $(this).addClass("xgui-datagrid-row-hover");
            }).
            //鼠标移除事件
            bind('mouseleave.datagrid', function () {
                $(this).removeClass("xgui-datagrid-row-hover");
            }).
            //单击事件
            bind('click.datagrid', function () {

                //$(this).addClass("xgui-datagrid-row-select").siblings().removeClass("xgui-datagrid-row-select");

                //优化选择速度
                gbody.find(".xgui-datagrid-row-select").removeClass("xgui-datagrid-row-select");

                $(this).addClass("xgui-datagrid-row-select");

                if (opts.onClickRow) {

                    var rowindex = $(this).attr("datagrid-row-index");

                    opts.onClickRow(rowindex, data.data[rowindex]);

                    //移除焦点
                    // $(".xgui-msg-close").focus().blur();
                }

            }).
            //双击事件
            bind('dblclick.datagrid', function () {

                if (opts.onDblClickRow) {

                    var rowindex = $(this).attr("datagrid-row-index");

                    opts.onDblClickRow(rowindex, data.data[rowindex]);

                    //移除焦点
                    //$(".xgui-msg-close").focus().blur();
                }
            }).
            //右击事件
            bind('contextmenu.datagrid', function (event) {

                if (opts.onRowContextMenu) {

                    //行标
                    var rowindex = $(this).attr("datagrid-row-index");

                    //选中当前行
                    $(target).datagrid('selectRow', rowindex);

                    //右击事件
                    opts.onRowContextMenu(event, rowindex, data.data[rowindex]);

                }

            });

        //复选框事件
        $(target).find('.xgui-datagrid-header-check input:checkbox').unbind(".datagrid").
            bind('click.datagrid', function () {

                if (this.checked) {

                    $(target).find(".xgui-datagrid-cell-check input[type=checkbox]").attr("checked", true);
                }
                else {

                    $(target).find(".xgui-datagrid-cell-check input[type=checkbox]").attr("checked", false);
                }
            });

        //分页事件
        if (opts.pagination) {

            //上下页
            $(target).find(".xgui-datagrid-pager span a").unbind(".datagrid").
                bind("click.datagrid", function () {

                    //页码
                    opts.pageIndex = parseInt($(this).attr("pagenumber"));

                    //刷新数据
                    $(target).datagrid("reload");

                });

        }

        //设置表格大小
        Resize(target);

        //改变窗口大小重设表格大小
        $(window).//unbind(".datagrid").
            //改变大小事件
            bind("resize.datagrid", function () {

                //设置表格大小
                Resize(target);
            });

        if (opts.frozenHeader) {

            //重新定位
            $(target).freeze("position");
        }


        //绑定外部事件
        if (opts.BindExternalEvents) {

            opts.BindExternalEvents();
        }

    }

    $.fn.datagrid = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.datagrid.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'datagrid');

            if (state) {
                //合并参数
                $.extend(state.options, options);

                //刷新
                $(this).datagrid("reload");

            } else {
                //设置数据
                $.data(this, 'datagrid', { options: $.extend({}, $.fn.datagrid.defaults, options) });

                init(this);
            }

        });
    };

    //插件方法
    $.fn.datagrid.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'datagrid');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //得到所有数据
        getAllData: function (target) {

            return $.data(target[0], "datagrid").data;
        },
        //得到数据
        getData: function (target) {

            return $.data(target[0], "datagrid").data.data;
        },
        //得到总条数
        getCount: function (target) {
            return $.data(target[0], "datagrid").data.count;
        },
        //刷新
        reload: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'datagrid').options;

                //设置参数
                $.extend(opts.queryParams, { pageIndex: opts.pageIndex, pageSize: opts.pageSize }, param);

                //设置页码
                $.extend(opts, { pageIndex: opts.queryParams.pageIndex, pageSize: opts.queryParams.pageSize });

                reload(this);

            });

        },
        //设置选中行
        selectRow: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'datagrid').options;

                var gbody = $(this).find(".xgui-datagrid-body");

                gbody.find(".xgui-datagrid-row-select").removeClass("xgui-datagrid-row-select");

                //设置样式
                gbody.find("tr[datagrid-row-index=" + param + "]").addClass("xgui-datagrid-row-select");


            });
        },
        //得到选中行数据
        getSelected: function (target) {

            var data = $.data(target[0], "datagrid").data;

            //行标
            var rowindex = parseInt($(target[0]).find(".xgui-datagrid-row-select").attr("datagrid-row-index"));

            //返回数据
            return data.data[rowindex];

        },
        //得到所有选中行数据(复选框)
        getSelections: function (target) {

            var data = $.data(target[0], "datagrid").data;

            var datas = [];

            target.find(".xgui-datagrid-cell-check input:checked").each(function () {

                //行标
                var rowindex = parseInt($(this).parents(".xgui-datagrid-row").attr("datagrid-row-index"));

                datas.push(data.data[rowindex]);
            });

            return datas;

        }

    };

    //插件默认参数
    $.fn.datagrid.defaults = {
        //标题
        title: null,
        //表格宽度
        width: null,
        //列表高度
        height: null,
        //分页
        pagination: true,
        //当前页
        pageIndex: 1,
        //每页大小
        pageSize: 30,
        //行标
        rownumbers: false,
        //头部冻结
        frozenHeader: true,
        //显示正在处理信息
        loadMsg: "数据加载中,请稍候！",
        //远程地址
        url: null,
        //本地数据
        localData: null,
        //远程参数
        queryParams: {},
        //标识
        idField: null,
        //列
        columns: null,
        //绑定外部事件
        BindExternalEvents: function () { },
        //单击事件
        onClickRow: function () { },
        //双击事件
        onDblClickRow: function () { },
        //右击事件
        onRowContextMenu: function () { },
        //载入成功触发的事件
        onLoadSuccess: function () {
        }

    }


})(jQuery);

/*
*   xgui-treegrid — jQuery XGUI
*   made by：lv
*   Production in：2013-10-23
*   Last updated：2016-11-24
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'treegrid').options;

        var gbody = $(target);

        gbody.addClass("xgui-treegrid");

        //添加样式
        gbody.css({ "position": "relative" });

        //表格
        if (opts.width) {

            gbody.outerWidth(opts.width);
        }
        else {

            gbody.width("100%");
        }

        //头部
        if (opts.title) {

            gbody.html("<div class=\"xgui-treegrid-header\"><span class=\"xgui-treegrid-header-icon\"></span><span class=\"xgui-treegrid-header-h2\">" + opts.title + "</span></div>");
        }

        gbody.append("<div class=\"xgui-treegrid-title\"></div><div class=\"xgui-treegrid-body\"></div>");

        //列表高度
        if (opts.height) {

            //取消固定头部
            opts.frozenHeader = false;
        }

        //冻结头部
        if (opts.frozenHeader) {

            //固定栏
            opts.fixbar = $(target).find(".xgui-treegrid-title");

            //固定时事件
            opts.fixEvent = function (title) {

                //给固定标题添加样式
                $(title).addClass("xgui-treegrid-title-fix");
            }

            //不固定时事件
            opts.unfixEvent = function (title) {

                //去掉给固定标题样式
                $(title).removeClass("xgui-treegrid-title-fix");
            }

            //冻结插件
            $(target).freeze(opts);
        }

        //设置默认数据
        setDefaultValue(target);

        //载入默认框架
        Load(target);

        //刷新数据
        reload(target);

    };

    //设置默认数据
    function setDefaultValue(target) {

        //设置默认数据
        $.data(target, "treegrid").data = eval('(' + '[]' + ')');
    }

    //载入数据
    function Load(target) {

        //刷新表头
        CreateTitle(target);

        //刷新内容
        CreateBody(target);

        //绑定事件
        BindEvent(target);

    }

    //刷新数据
    function reload(target) {

        var opts = $.data(target, 'treegrid').options;

        //加载提示信息
        xgui.loading("show", opts.loadMsg);

        //载入远程数据
        if (opts.localData == null) {

            xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                //字符串
                if (typeof o == 'string') {

                    //转换成对象
                    var data = eval('(' + o + ')');

                    $.data(target, "treegrid").data = data;
                }
                else {

                    $.data(target, "treegrid").data = o;
                }

                //载入数据
                Load(target);

                //隐藏提示信息
                xgui.loading("hide");

                //载入成功触发的事件
                opts.onLoadSuccess();

            });

        }
            //载入本地数据
        else {

            //字符串
            if (typeof opts.localData == 'string') {

                //转换成对象
                var data = eval('(' + opts.localData + ')');

                $.data(target, "treegrid").data = data;
            }
            else {

                $.data(target, "treegrid").data = opts.localData;
            }

            //载入数据
            Load(target);

            //隐藏提示信息
            xgui.loading("hide");

            //载入成功触发的事件
            opts.onLoadSuccess();
        }

    }

    //创建表头
    function CreateTitle(target) {

        var opts = $.data(target, 'treegrid').options;

        var gtitle = $(target).find(".xgui-treegrid-title:eq(0)");

        var htmldata = "<table cellspacing=\"0\" cellpadding=\"0\"><tbody><tr>";

        //columns
        var col = opts.columns[0];

        for (var i = 0; i < col.length; i++) {

            htmldata += "<td field=\"" + col[i].field + "\"";

            //是否隐藏
            if (col[i].hidden) {

                htmldata += " style=\"display:none;\"";
            }

            htmldata += ">";

            //复选框
            if (col[i].checkbox) {

                htmldata += "<div class=\"xgui-treegrid-header-check\"><input type=\"checkbox\"></div>";

            }
            else {

                htmldata += "<div class=\"xgui-treegrid-cell\" style = \"";

                //方向
                if (col[i].align) {

                    htmldata += "text-align:" + col[i].align + ";";
                }

                //排列
                htmldata += "\">";

                htmldata += col[i].title;

                htmldata += "</div>";

            }

            htmldata += "</td>";

        }

        htmldata += "</tr></tbody></table>";

        //输出
        gtitle.html(htmldata);


    }

    //创建内容
    function CreateBody(target) {

        var opts = $.data(target, 'treegrid').options;

        var gbody = $(target).find(".xgui-treegrid-body");

        var htmldata = "<table cellspacing=\"0\" cellpadding=\"0\"><tbody>";

        //根据父ID得到数据(递归)  对象|父ID｜返回html｜空格数
        htmldata += (GetDataForPID(target, 0, "", 0));

        htmldata += "</tbody></table>";

        //输出
        gbody.html(htmldata);


    }

    //验证是否有子元素
    function CheckPID(target, PID) {

        var opts = $.data(target, 'treegrid').options;

        var data = $.data(target, "treegrid").data;

        for (i = 0; i < data.length; i++) {

            if (data[i][opts.parentID] == PID) {

                //删除数据
                //data.splice(i, 1);

                return true;
            }
        }

        return false;

    }

    //根据父ID得到数据  对象|父ID｜返回html｜空格数
    function GetDataForPID(target, PID, html, index) {

        var opts = $.data(target, 'treegrid').options;

        var data = $.data(target, "treegrid").data;

        //空格数
        index++;

        //columns
        var col = opts.columns[0];

        //行数据
        $.each(data, function (rowindex, rowdata) {

            //找出父ID数据
            if (rowdata[opts.parentID] == PID) {

                //验证此数据下是否还有下级数据
                var havechild = false;

                //异步加载
                if (opts.data != null) {

                    //是否有下级
                    havechild = rowdata["hasChildren"];
                }
                else {

                    //验证此数据下是否还有下级数据
                    havechild = CheckPID(target, rowdata[opts.idField]);
                }

                html += "<tr class=\"xgui-treegrid-row\" node-id=\"" + rowdata[opts.idField] + "\">";

                //单元格数据
                $.each(col, function (r, d) {

                    //树
                    if (d.field == opts.treeField) {

                        html += "<td field=\"" + d.field + "\"";

                        //是否隐藏
                        if (d.hidden) {

                            html += " style=\"display:none;\"";
                        }

                        html += ">";

                        html += "<div class=\"xgui-treegrid-cell\" style = \"";


                        //方向
                        if (d.align) {

                            html += "text-align:" + d.align + ";";
                        }

                        //排列
                        html += "\">";

                        //有下级
                        if (havechild) {

                            //增加空格
                            for (i = 0; i < index - 1; i++) {

                                html += "<span class=\"tree-indent\"></span>";
                            }

                            //折叠
                            if (opts.data != null || rowdata["state"] == "close") {

                                html += "<span class=\"tree-hit tree-collapsed\"></span><span class=\"tree-folder tree-folder-close\"></span><span class=\"tree-title\">";
                            }
                                //打开
                            else {

                                html += "<span class=\"tree-hit tree-expanded\"></span><span class=\"tree-folder tree-folder-open\"></span><span class=\"tree-title\">";
                            }
                        }
                            //没有下级
                        else {

                            //增加空格
                            for (i = 0; i < index; i++) {

                                html += "<span class=\"tree-indent\"></span>";
                            }

                            html += "<span class=\"tree-folder tree-folder-file\"></span><span class=\"tree-title\">";

                        }

                        //数据格式化
                        if (d.formatter) {

                            html += d.formatter(rowdata[d.field], rowdata, rowindex)

                        }
                        else {

                            html += rowdata[d.field] != null ? rowdata[d.field] : "";

                        }

                        html += "</span></div></td>";

                    }
                    else {

                        html += "<td field=\"" + d.field + "\"";

                        //是否隐藏
                        if (d.hidden) {

                            html += " style=\"display:none;\"";
                        }

                        html += ">";

                        //复选框
                        if (d.checkbox) {

                            html += "<div class=\"xgui-treegrid-cell-check\"><input type=\"checkbox\"></div>";

                        }
                        else {

                            html += "<div class=\"xgui-treegrid-cell\" style = \"";

                            //方向
                            if (d.align) {

                                html += "text-align:" + d.align + ";";
                            }

                            //排列
                            html += "\">";

                            //数据格式化
                            if (d.formatter) {

                                html += d.formatter(rowdata[d.field], rowdata, rowindex)

                            }
                            else {

                                html += rowdata[d.field] != null ? rowdata[d.field] : "";
                            }

                            html += "</div>";

                        }

                        html += "</td>";

                    }

                });

                html += "</tr>";

                //有下级(非异步加载)
                if (havechild && opts.data == null) {

                    //折叠
                    if (rowdata["state"] == "close") {

                        html += "<tr class=\"xgui-treegrid-tr-tree\" style=\"display: none;\">";

                    }
                        //打开
                    else {

                        html += "<tr class=\"xgui-treegrid-tr-tree\">";
                    }

                    html += "<td colspan=\"" + col.length + "\" style=\"border: 0px\"><table cellspacing=\"0\" cellpadding=\"0\" style=\"width: 100%;\"><tbody>";

                    //递归
                    html = GetDataForPID(target, rowdata[opts.idField], html, index);

                    html += "</tbody></table></td></tr>";

                }

            }


        });

        return html;

    }

    //载入子树
    function LoadChildren(target, row) {

        var opts = $.data(target, 'treegrid').options;

        //加载提示信息
        xgui.loading("show", opts.loadMsg);

        //载入远程数据
        if (opts.data != null) {

            var ID = $(row).attr("node-id");

            var query = $.extend({}, opts.queryParams, { ID: ID });

            xgui.Ajax(opts.data, query, "json", true, function (o) {

                //追加数据
                var data = $.data(target, "treegrid").data;

                $.each(o, function (rowindex, rowdata) {

                    data.push(rowdata);

                });

                //缩进几格
                var index = $(row).find(".tree-indent").length + 1;

                //columns
                var col = opts.columns[0];

                var html = "<tr class=\"xgui-treegrid-tr-tree\"><td colspan=\"" + col.length + "\" style=\"border: 0px\"><table cellspacing=\"0\" cellpadding=\"0\" style=\"width: 100%;\"><tbody>";

                //递归
                html = GetDataForPID(target, ID, html, index);

                html += "</tbody></table></td></tr>";

                $(row).after(html);

                //隐藏提示信息
                xgui.loading("hide");

                //绑定事件
                BindEvent(target);
            });

        }
        else {

            alert("错误");
        }
    }

    //设置表格大小
    function Resize(target) {

        var opts = $.data(target, 'treegrid').options;

        var data = $.data(target, "treegrid").data;

        //表头
        var gtitle = $(target).find(".xgui-treegrid-title:eq(0)");

        //表格
        var gbody = $(target).find(".xgui-treegrid-body");

        //表格宽减内边距
        var tableWidth = $(target).width() - (gbody.outerWidth() - gbody.width());

        if (opts.height) {

            //表格宽-18（滚动条宽）
            tableWidth -= 18;

            //设置表高度
            gbody.css({ "height": opts.height - gtitle.outerHeight() - 2, "overflow-y": "scroll" });
        }

        //设置表头宽
        gtitle.find("table:first").outerWidth(tableWidth);

        //设置内容表格宽
        gbody.find("table:first").outerWidth(tableWidth);

        //总列数大小
        var columnWidth = 0;

        //columns
        var col = opts.columns[0];

        for (var i = 0; i < col.length; i++) {

            //复选框
            if (col[i].checkbox) {

                tableWidth -= $(target).find(".xgui-treegrid-header-check").outerWidth();
            }
                //隐藏列
            else if (col[i].hidden) {

            }
            else {

                columnWidth += col[i].width || 100;
            }
        }

        //单元格宽度比例
        var rate = tableWidth / columnWidth;

        //padding值
        var padding = $(target).find(".xgui-treegrid-cell").outerWidth() - $(target).find(".xgui-treegrid-cell").width();

        for (var i = 0; i < col.length; i++) {

            if (!col[i].hidden) {

                var w = col[i].width || 100;

                w = parseInt(w * rate) - padding;

                $(target).find("td[field=" + col[i].field + "] .xgui-treegrid-cell").width(w);

            }
        }
    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'treegrid').options;

        var data = $.data(target, "treegrid").data;

        //表内容
        var gbody = $(target).find(".xgui-treegrid-body");

        //事件
        gbody.find('.xgui-treegrid-row').unbind(".treegrid").
            //鼠标移上去事件
            bind('mouseenter.treegrid', function () {
                $(this).addClass("xgui-treegrid-row-hover");
            }).
            //鼠标移除事件
            bind('mouseleave.treegrid', function () {
                $(this).removeClass("xgui-treegrid-row-hover");
            }).
            //单击事件
            bind('click.treegrid', function () {

                //移除选中样式
                gbody.find('.xgui-treegrid-row-select').removeClass("xgui-treegrid-row-select");

                //当前设置选中样式
                $(this).addClass("xgui-treegrid-row-select");

                if (opts.onClickRow) {

                    //节点ID
                    var nodeid = $(this).attr("node-id");

                    var rowData;

                    //行数据
                    for (i = 0; i < data.length; i++) {

                        //找出父ID数据
                        if (data[i][opts.idField] == nodeid) {

                            rowData = data[i];
                            break;
                        }
                    };

                    opts.onClickRow(rowData);

                    //移除焦点
                    //$(".xgui-msg-close").focus().blur();
                }
            }).
            //双击事件
            bind('dblclick.treegrid', function () {

                if (opts.onDblClickRow) {

                    //节点ID
                    var nodeid = $(this).attr("node-id");

                    var rowData;

                    //行数据
                    for (i = 0; i < data.length; i++) {

                        //找出父ID数据
                        if (data[i][opts.idField] == nodeid) {

                            rowData = data[i];
                            break;
                        }
                    };

                    opts.onDblClickRow(rowData);

                    //移除焦点
                    //$(".xgui-msg-close").focus().blur();
                }
            }).
            //右击事件
            bind('contextmenu.treegrid', function (event) {

                if (opts.onRowContextMenu) {

                    //节点ID
                    var nodeid = $(this).attr("node-id");

                    var rowData;

                    //行数据
                    for (i = 0; i < data.length; i++) {

                        //找出父ID数据
                        if (data[i][opts.idField] == nodeid) {

                            rowData = data[i];
                            break;
                        }
                    };

                    //选中当前行
                    $(target).treegrid('selectRow', rowData[opts.idField]);

                    //右击事件
                    opts.onRowContextMenu(event, rowData);

                }

            });

        //展开、隐藏事件
        gbody.find(".tree-hit").unbind(".treegrid").
            bind('click.treegrid', function () {

                //判断状态（折叠）
                if ($(this).hasClass("tree-expanded")) {

                    //改变三角箭头
                    $(this).removeClass("tree-expanded").addClass("tree-collapsed");

                    //改变文件夹图标
                    $(this).next(".tree-folder").removeClass("tree-folder-open").addClass("tree-folder-close");

                    //隐藏列表
                    $(this).parent("div").parent("td").parent("tr").next(".xgui-treegrid-tr-tree").hide();
                }
                    //展开
                else {

                    //改变三角箭头
                    $(this).removeClass("tree-collapsed").addClass("tree-expanded");

                    //改变文件夹图标
                    $(this).next(".tree-folder").removeClass("tree-folder-close").addClass("tree-folder-open");

                    //显示列表
                    $(this).parent("div").parent("td").parent("tr").next(".xgui-treegrid-tr-tree").show();

                    //异步加载
                    if (opts.data != null) {

                        var row = $(this).parent().parent().parent(".xgui-treegrid-row");

                        if (row.next(".xgui-treegrid-tr-tree").length == 0) {

                            //载入子树
                            LoadChildren(target, $(row));
                        }
                    }
                }

            });

        //复选框事件
        $(target).find('.xgui-treegrid-header-check input:checkbox').unbind(".treegrid").
            bind('click.treegrid', function () {

                if (this.checked) {

                    $(target).find(".xgui-treegrid-cell-check input[type=checkbox]").attr("checked", true);
                }
                else {

                    $(target).find(".xgui-treegrid-cell-check input[type=checkbox]").attr("checked", false);
                }
            });

        //设置表格大小
        Resize(target);

        //改变窗口大小重设表格大小
        $(window).//unbind(".treegrid").
            bind("resize.treegrid", function () {

                //设置表格大小
                Resize(target);
            });

        if (opts.frozenHeader) {

            //重新定位
            $(target).freeze("position");
        }

        //绑定外部事件
        if (opts.BindExternalEvents) {

            opts.BindExternalEvents();
        }

    }

    $.fn.treegrid = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.treegrid.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'treegrid');

            if (state) {
                //合并参数
                $.extend(state.options, options);

                //刷新数据
                $(this).treegrid("reload");

            } else {
                //设置数据
                $.data(this, 'treegrid', { options: $.extend({}, $.fn.treegrid.defaults, options) });

                init(this);
            }


        });
    };

    //插件方法
    $.fn.treegrid.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'treegrid');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //得到数据
        getData: function (target) {

            return $.data(target[0], "treegrid").data;
        },
        //刷新
        reload: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'treegrid').options;

                //远程参数
                $.extend(opts.queryParams, param);

                reload(this);

            });

        },
        //设置选中行
        selectRow: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'treegrid').options;

                var gbody = $(this).find(".xgui-treegrid-body");

                //移除选中样式
                gbody.find('.xgui-treegrid-row-select').removeClass("xgui-treegrid-row-select");

                //设置样式
                gbody.find("tr[node-id=" + param + "]").addClass("xgui-treegrid-row-select");

            });
        },
        //得到选中行数据
        getSelected: function (target) {

            var opts = $.data(target[0], 'treegrid').options;

            var data = $.data(target[0], "treegrid").data;

            //节点ID
            var nodeid = $(target[0]).find(".xgui-treegrid-row-select").attr("node-id");

            var rowData;

            //行数据
            for (i = 0; i < data.length; i++) {

                //找出父ID数据
                if (data[i][opts.idField] == nodeid) {

                    rowData = data[i];
                    break;
                }
            };

            //返回数据
            return rowData;

        },
        //得到所有选中行数据(复选框)
        getSelections: function (target) {

            var opts = $.data(target[0], 'treegrid').options;

            var data = $.data(target[0], "treegrid").data;

            var datas = [];

            target.find(".xgui-treegrid-cell-check input:checked").each(function () {

                //节点ID
                var nodeid = parseInt($(this).parent("div").parent("td").parent("tr").attr("node-id"));

                //行数据
                for (i = 0; i < data.length; i++) {

                    //找出父ID数据
                    if (data[i][opts.idField] == nodeid) {

                        datas.push(data[i]);
                    }
                };
            });

            return datas;

        }

    };

    //插件默认参数
    $.fn.treegrid.defaults = {
        //标题
        title: null,
        //表格宽度
        width: null,
        //列表高度
        height: null,
        //行标
        rownumbers: false,
        //头部冻结
        frozenHeader: true,
        //固定表头的距离
        topOffset: 0,
        //显示正在处理信息
        loadMsg: "数据加载中,请稍候！",
        //远程地址
        url: null,
        //本地数据
        localData: null,
        //远程参数
        queryParams: {},
        //节点的数据加载(data不等于null为异步加载)
        data: null,
        //标识
        idField: null,
        //父ID
        parentID: null,
        //树名称
        treeField: null,
        //列
        columns: null,
        //绑定外部事件
        BindExternalEvents: function () { },
        //单击事件
        onClickRow: function () { },
        //双击事件
        onDblClickRow: function () { },
        //右击事件
        onRowContextMenu: function () { },
        //载入成功触发的事件
        onLoadSuccess: function () {
        }

    }


})(jQuery);

/*
*   form — jQuery XGUI
*   made by：lv
*   Production in：2013-10-9
*   Last updated：2016-02-27
*/
(function ($) {

    //给html赋值
    function setHtmlValue(target) {

        var data = $.data(target, "form").data;

        for (var name in data) {

            var val = data[name];

            //验证html
            var obj = checkhtml(target, name, val);

            if (!obj.length) {

                //文本框赋值
                $('input[name="' + name + '"]', target).val(val);

                //文本域赋值
                $('textarea[name="' + name + '"]', target).val(val);

                //下拉框赋值
                $('select[name="' + name + '"]', target).val(val != null ? val.toString() : "");

                //span标签赋值
                $('span[name="' + name + '"]', target).text(val || "");

            }

            //给插件赋值
            var plugin = ['combobox', 'combotree', 'combogrid', 'datebox'];

            for (var i = 0; i < plugin.length; i++) {

                setPluginValue(target, plugin[i], name, val);

            }

        }

    }
    //给插件赋值
    function setPluginValue(target, type, name, val) {

        var obj = $(target).find('.' + type + '-f[comboname=' + name + ']');

        if (obj.length && obj[type]) {

            //调用插件赋值 obj[type]=obj.type
            obj[type]('setValue', val);

        }
    }
    //设置checkbox(html这里必须先加value等于true)、radio选中
    function checkhtml(target, name, val) {

        var obj = $('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]', target);

        //先取消选中
        $.fn.prop ? obj.prop('checked', false) : obj.attr('checked', false);

        obj.each(function () {

            var f = $(this);

            if (f.val() == String(val)) {

                $.fn.prop ? f.prop('checked', true) : f.attr('checked', true);
            }
        });

        return obj;

    }
    //清除form
    function clear(target) {

        $("input,select,textarea", $(target)).each(function () {

            //类型
            var type = this.type;

            //名称
            var tag = this.tagName.toLowerCase();

            if (type == "text" || type == "hidden" || type == "password" || tag == "textarea") {

                this.value = "";
            }
            else {
                if (type == "file") {

                    var data = $(this);

                    data.after(data.clone().val(""));

                    data.remove();
                }
                else {
                    if (type == "checkbox" || type == "radio") {

                        this.checked = false;

                    } else {

                        if (tag == "select") {

                            this.selectedIndex = -1;

                        }
                    }
                }
            }
        });

    };
    //提交
    function submit(target) {

        var opts = $.data(target, 'form').options;

        //设置form属性
        $(target).attr({

            //地址
            action: opts.action,
            //iframeID
            target: opts.target,
            //编码方式
            enctype: opts.enctype,
            //提交方式
            method: opts.method

        });

        if ($("#" + opts.target)[0] == null) {

            var iframeStr = "<iframe frameborder=\"0\" name=\"" + opts.target + "\" id=\"" + opts.target + "\" src=\"about:blank\" style=\"display:none;\" ></iframe>";

            $("body").append(iframeStr);
        }

        //form提交
        if ($.browser.msie) {

            $(target).submit();
            //eval("window." + formid + ".submit();");

        } else {

            $(target).submit();
        }

        //完成提交
        if (opts.onSubmitSuccess) {

            //获取iframe中的内容
            $("#" + opts.target).unbind("load").
                //load事件
                bind("load", function () {

                    //通过ID
                    var body = $("#" + opts.target).contents().find("body").text();

                    var data = eval('(' + body + ')');

                    //移除iframe
                    $(this).remove();

                    //执行完成事件
                    opts.onSubmitSuccess(data);
                });

        }
    };

    $.fn.form = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.form.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'form');

            if (state) {

                //合并参数
                $.extend(state.options, options);

            } else {

                //设置数据
                $.data(this, 'form', { options: $.extend({}, $.fn.form.defaults, options) });
            }
        });

    };

    //插件方法
    $.fn.form.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'form');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //数据验证
        validate: function (target) {

            if ($.fn.validatebox) {

                var box = $('.validatebox-text', target);

                if (box.length) {

                    //全部验证
                    box.validatebox('validate');

                    //循环每个validatebox插件
                    box.each(function () {

                        var opt = $(this).validatebox("options");

                        //实时验证(隐藏所有提示)
                        if (opt.mode == "Real") {

                            //聚焦显示提示信息
                            //$(this).trigger("focus");

                            //实时验证需要使用blur来去掉提示信息
                            $(this).trigger('blur');
                        }

                    });

                    //设置第一个聚焦，则会显示提示信息
                    var valid = $('.validatebox-text.error:first', target).focus();

                    return valid.length == 0;
                }
            }
            return true;
        },
        //异步数据验证
        asyncValidate: function (target, callback) {

            if ($.fn.validatebox) {

                var box = $('.validatebox-text', target);

                if (box.length) {

                    //全部验证
                    box.validatebox('validate');

                    //循环每个validatebox插件
                    box.each(function () {

                        var opt = $(this).validatebox("options");

                        //实时验证(隐藏所有提示)
                        if (opt.mode == "Real") {

                            //聚焦显示提示信息
                            //$(this).trigger("focus");

                            //实时验证需要使用blur来去掉提示信息
                            $(this).trigger('blur');
                        }

                    });

                    //异步状态全部完成
                    if (getStatus()) {

                        //执行返回结果
                        result();
                    }
                    else {

                        (function () {

                            if (!getStatus()) {

                                setTimeout(arguments.callee, 200);
                            }
                            else {

                                //执行返回结果
                                result();
                            }

                        })();
                    }
                }
                else {

                    //执行回调
                    callback(true);

                }

                //得到异步验证状态
                function getStatus() {

                    var start = $('.validatebox-text.start', target);

                    if (start.length > 0) {

                        return false;

                    }
                    return true;
                }

                //执行返回结果
                function result() {

                    //设置第一个聚焦，则会显示提示信息
                    var valid = $('.validatebox-text.error:first', target).focus();

                    //执行回调
                    callback(valid.length == 0);
                }
            }
            else {

                //执行回调
                callback(true);
            }
        },
        //提交
        submit: function (target, param) {

            return target.each(function () {

                //得到当前实例数据
                var state = $.data(this, 'form');

                if (state) {

                    //合并参数
                    $.extend(state.options, param);

                } else {

                    //设置数据
                    $.data(this, 'form', { options: $.extend({}, $.fn.form.defaults, param) });
                }

                //提交
                submit(this);
            });
        },
        //载入数据
        load: function (target, param) {

            //载入url地址
            if (typeof param == 'string') {

                xgui.Ajax(param, "", "json", true, function (o) {

                    //字符串
                    if (typeof o == 'string') {

                        //转换成对象
                        var data = eval('(' + o + ')');

                        $.data(target, 'form', { data: data });
                    }
                    else {

                        $.data(target, 'form', { data: o });
                    }

                    setHtmlValue(target);

                    //数据验证
                    //$(target).form("validate");

                });
            }
                //载入外部数据
            else {

                $.data(target, 'form', { data: param });

                setHtmlValue(target);

                //数据验证
                //$(target).form("validate");
            }

        },
        //清除数据
        clear: function (target) {

            return target.each(function () {

                //清除html数据
                clear(this);

                //清除combobox值
                if ($.fn.combobox) {

                    $('.combobox-f', this).combobox('clear');
                }
                //清除combogrid值
                if ($.fn.combogrid) {

                    $('.combogrid-f', this).combogrid('clear');
                }
                //清除combotree值
                if ($.fn.combotree) {

                    $('.combotree-f', this).combotree('clear');
                }

                //清除datebox值
                if ($.fn.datebox) {

                    $('.datebox-f', this).datebox('clear');
                }

                //重设validatebox插件
                if ($.fn.validatebox) {

                    $('.xgui-validatebox', this).validatebox('rest');
                }

            });
        }

    };

    //插件默认参数
    $.fn.form.defaults = {

        //地址
        action: null,
        //iframeID
        target: "ifrUpload",
        //编码方式
        enctype: "multipart/form-data",
        //提交方式
        method: "post",
        //提交成功
        onSubmitSuccess: function () {

        }

    }

})(jQuery);

/*
*   dialog — jQuery XGUI
*   made by：lv
*   Production in：2013-10-9
*   Last updated：2016-11-15
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'dialog').options;

        var dialog = $(target);

        //追加到body后面
        $("body").append($(target));

        //样式
        dialog.addClass("xgui-msg xgui-dialog");

        //移除title，不然鼠标移上去会显示
        dialog.removeAttr("title");

        //追加头部
        dialog.prepend(msgheader);

        //设置宽度
        dialog.outerWidth(opts.width);

        //改变标题
        dialog.find(".xgui-msg-tit").text(opts.title);

        //设置msg居中
        xgui.setcenter(dialog, "absolute");

        //设置msg可拖动
        xgui.draggable(dialog.find(".xgui-msg-head"), dialog, true);

        //遮罩
        opts.modal == true ? dialog.after(xguimask) : "";

        //是否关闭
        opts.closed == true ? dialog.dialog("close") : dialog.dialog("open");

        //mask
        if (opts.modal) {

            $.fn.dialog.defaults.zIndex++;

            dialog.next(".xgui-mask").css({ "z-index": $.fn.dialog.defaults.zIndex });
        }

        //设置zIndex
        $.fn.dialog.defaults.zIndex++;

        //设置样式
        dialog.css({ "z-index": $.fn.dialog.defaults.zIndex });

        //绑定关闭
        dialog.find(".xgui-msg-close").bind("click", function () {

            dialog.dialog("close");

        });

    };

    $.fn.dialog = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.dialog.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'dialog');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {
                //设置数据
                $.data(this, 'dialog', {
                    options: $.extend({},
                        $.fn.dialog.defaults,
                        $.fn.dialog.parseOptions(this),
                        options)
                });

                init(this);
            }
        });
    };

    //插件方法
    $.fn.dialog.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'dialog');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //打开
        open: function (target) {

            return target.each(function () {

                var opts = $.data(this, 'dialog').options;

                //居中
                xgui.setcenter($(this));

                //mask
                if (opts.modal) {

                    $.fn.dialog.defaults.zIndex++;

                    $(this).next(".xgui-mask").css({ "z-index": $.fn.dialog.defaults.zIndex });

                    $(this).next(".xgui-mask").show()
                }

                //设置zIndex
                $.fn.dialog.defaults.zIndex++;

                //设置样式
                $(this).css({ "z-index": $.fn.dialog.defaults.zIndex });

                //显示
                $(this).show();

                //打开事件
                opts.onOpen(target);

            });

        },
        //关闭
        close: function (target) {

            return target.each(function () {

                var opts = $.data(this, 'dialog').options;

                //mask
                opts.modal == true ? $(this).next(".xgui-mask").hide() : "";

                //隐藏
                $(this).hide();

                //关闭事件
                opts.onClose();

            });
        },
        //设置标题
        setTitle: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'dialog').options;

                opts.title = param;

                $(this).find(".xgui-msg-tit").html(param);

            });

        }

    };

    //获取插件参数
    $.fn.dialog.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, {
            //标题
            title: t.attr('title'),
            //宽度
            width: (parseInt(target.style.width) || undefined),
            //关闭
            closed: (t.attr('closed') ? (t.attr('closed') == 'true' || t.attr('closed') == true) : undefined),
            //遮罩
            modal: (t.attr('modal') ? (t.attr('modal') == 'true' || t.attr('modal') == true) : undefined)
        });
    };

    //插件默认参数
    $.fn.dialog.defaults = {

        //标题
        title: "星光ui",
        //宽度
        width: 600,
        //是否关闭
        closed: false,
        //遮罩
        modal: true,
        //z-index
        zIndex: 9000,
        //打开事件
        onOpen: function () {
        },
        //关闭事件
        onClose: function () {
        }

    }


})(jQuery);

/*
*   menu — jQuery XGUI
*   made by：lv
*   Production in：2013-10-15
*   Last updated：2014-01-18
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'menu').options;

        //追加到body后面
        $("body").append($(target));

        //给每项添加样式
        $(target).children("div").addClass("xgui-menu-item");

        //设置样式
        $(target).css({ "display": opts.display, "left": opts.left, "top": opts.top });

        //绑定事件
        BindEvent(target);

        return false;

    };

    //事件
    function BindEvent(target) {

        var opts = $.data(target, 'menu').options;

        var timer = null;

        $(target).unbind(".menu").
            //移入时清除时间
            bind("mouseenter.menu", function () {

                clearTimeout(timer);

            }).
            //移出隐藏
            bind("mouseleave.menu", function (e) {

                timer = setTimeout(function () {

                    //隐藏menu
                    $(target).menu('hide');

                }, 100);

            }).
            //鼠标按下时
            bind("mousedown.menu", function () {

                return false;
            });

        //鼠标移动事件
        $(target).find(".xgui-menu-item").unbind(".menu").
            //鼠标移入时
            bind("mouseenter.menu", function () {
                $(this).addClass("xgui-menu-hover");
            }).
            //鼠标移出时
            bind("mouseleave.menu", function () {
                $(this).removeClass("xgui-menu-hover");
            }).
            //鼠标单击时
            bind("click.menu", function () {

                //隐藏menu
                $(target).menu('hide');
            });
    }

    $.fn.menu = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.menu.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'menu');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {
                //设置数据
                $.data(this, 'menu', { options: $.extend({}, $.fn.menu.defaults, options) });

            }
            init(this);

        });
    };

    //插件方法
    $.fn.menu.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'menu');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //显示
        show: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'menu').options;

                //合并参数
                $.extend(opts, param);

                //左边
                if (opts.left + $(target).outerWidth() > $(window).width() + $(document).scrollLeft()) {
                    opts.left = $(window).width() + $(document).scrollLeft() - $(target).outerWidth() - 5;
                }
                //顶部
                if (opts.top + $(target).outerHeight() > $(window).height() + $(document).scrollTop()) {
                    opts.top -= $(target).outerHeight();
                }

                $(this).css({ "display": "block", "left": opts.left, "top": opts.top });

                //绑定document单击事件
                $(document).unbind('.menu').
                    bind('mousedown.menu', function (e) {

                        //隐藏menu
                        $(target).menu('hide');
                    });
            });
        },
        //隐藏
        hide: function (target) {

            $(target).hide();

            //解除document绑定事件
            $(document).unbind('.menu');
        }

    };

    //插件默认参数
    $.fn.menu.defaults = {

        //显示
        display: "none",
        //左边距
        left: 0,
        //上边距
        top: 0
    }


})(jQuery);

/*
*   validatebox — jQuery XGUI
*   made by：lv
*   Production in：2013-11-2
*   Last updated：2017-01-05
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'validatebox').options;

        if (opts.mode == "Static") {

            var tip = $('<div class="xgui-validatebox-tip2"><span class="xgui-validatebox-tip2-icon ok"></span><span class="xgui-validatebox-tip2-con"></span></div>').appendTo('body').hide();

            $.data(target, 'validatebox').tip = tip;
        }

        //添加样式（form统一验证时用）
        $(target).addClass('validatebox-text');

        //文本框readonly
        $(target).attr('readonly', !opts.editable);

        //绑定HighlightInput插件
        $(target).HighlightInput({ mode: "Empty", emptyCon: opts.emptyCon, focusColor: opts.focusColor, blurColor: opts.blurColor });

        //绑定事件
        BindEvent(target);

    };

    //设置提示信息（模式二用）
    function setTipInfo(target, icon) {

        var opts = $.data(target, 'validatebox').options;

        //提示信息
        var msg = $.data(target, 'validatebox').message;

        //提示html
        var tip = $.data(target, 'validatebox').tip;

        //插件对象
        var box = $(target);

        //更改图标
        tip.find(".xgui-validatebox-tip2-icon").removeClass().addClass("xgui-validatebox-tip2-icon " + icon);

        //设置提示内容
        tip.find('.xgui-validatebox-tip2-con').html(msg);

        var left = box.offset().left + box.outerWidth() + opts.left + 10;

        //显示
        tip.show();

        //设置位置
        tip.css({
            left: left,
            top: box.offset().top + ((box.outerHeight() - tip.outerHeight()) / 2)
        });
    };

    //显示提示（模式一用）
    function showTip(target) {

        var opts = $.data(target, 'validatebox').options;

        //提示信息
        var msg = $.data(target, 'validatebox').message;

        //提示html
        var tip = $.data(target, 'validatebox').tip;

        //插件对象
        var box = $(target);

        if (!tip) {

            //提示html
            tip = $('<div class=\"xgui-validatebox-tip\">' +
                '<span class=\"xgui-validatebox-tip-con\"></span>' +
                '<span class=\"xgui-validatebox-tip-icon\"></span>' +
                '</div>').appendTo('body');

            $.data(target, 'validatebox').tip = tip;
        }

        //设置提示内容
        tip.find('.xgui-validatebox-tip-con').html(msg);

        var left = box.offset().left + box.outerWidth() + opts.left;

        tip.css({
            left: left,
            top: box.offset().top + opts.top
        });
    };

    //隐藏提示（模式一用）
    function hideTip(target) {

        var tip = $.data(target, 'validatebox').tip;
        if (tip) {
            tip.remove();
            $.data(target, 'validatebox').tip = null;
        }
    };

    //数据验证
    function validate(target) {

        var opts = $.data(target, 'validatebox').options;

        //提示信息
        function setMsg(value) {

            $.data(target, 'validatebox').message = value;
        }

        //移除错误
        function removeError() {

            //移除错误样式
            box.removeClass('error');

            if (opts.mode == "Real") {

                //隐藏提示
                hideTip(target);
            }
            else {

                //设置提示信息
                setMsg("");
                //显示提示
                setTipInfo(target, "success");
            }

            //return true;
        }

        //插件
        var box = $(target);

        //输入框值
        var value = box.val();

        //必填验证
        if (opts.required && (value == "" || value == opts.emptyCon)) {

            //设置错误样式
            box.addClass('error');

            //设置提示信息
            setMsg(opts.emptyMsg);

            if (opts.mode == "Real") {

                //显示提示
                showTip(target);
            }
            else {

                //显示提示
                setTipInfo(target, "error");
            }
            return false;
        }

        //类别验证及自定义验证
        if (opts.validType && (value != "" && value != opts.emptyCon)) {

            var result = /([a-zA-Z_]+)(.*)/.exec(opts.validType);

            //验证规则名称，如email、url、length
            var rule = opts.rules[result[1]];

            if (value && rule) {

                //值
                var param = eval(result[2]);

                if (opts.mode == "Static") {

                    //设置提示信息为空
                    setMsg("");

                    //显示loading
                    setTipInfo(target, "loading");

                }

                //设置开始验证标记
                box.addClass('start');

                //开始验证
                rule['validator'](value, param, function (success) {

                    if (!success) {

                        //设置错误样式
                        box.addClass('error');

                        //移除开始验证标记
                        box.removeClass('start');

                        //得到提示信息
                        var message = rule['message'];

                        //设置提示信息
                        setMsg(opts.errorMsg || message);

                        if (opts.mode == "Real") {

                            //显示提示
                            showTip(target);
                        }
                        else {

                            //显示提示
                            setTipInfo(target, "error");
                        }
                        //return false;
                    }
                    else {

                        //移除开始验证标记
                        box.removeClass('start');

                        //移除提示
                        removeError();
                    }

                });
            }
        }
        else {

            //移除提示
            removeError();
        }

        //return true;
    };

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'validatebox').options;

        //是否验证
        var validating = false;

        //插件值
        var value = undefined;

        $(target).unbind(".validatebox").
             //聚焦事件
             bind("focus.validatebox", function () {

                 if (opts.mode == "Static") {

                     //设置提示信息
                     $.data(target, 'validatebox').message = opts.Msg;

                     //显示提示
                     setTipInfo(target, "info");
                 }
                 else {

                     validating = true;

                     (function () {

                         if (validating) {

                             //阻止鼠标移除还要验证
                             if (value != $(target).val()) {

                                 value = $(target).val();

                                 //验证
                                 validate(target);
                             }
                         }

                         setTimeout(arguments.callee, 200);

                     })();

                 }

             }).
             //失去焦点事件
             bind("blur.validatebox", function () {

                 if (opts.mode == "Real") {

                     validating = false;

                     value = undefined;

                     //隐藏提示
                     hideTip(target);
                 }
                 else {

                     //验证
                     validate(target);
                 }
             }).
             //键盘按下事件
             bind("keyup.validatebox", function (e) {

                 if (opts.mode == "Real") {

                     //验证
                     validate(target);
                 }
             }).
             //鼠标移上去事件
             bind("mouseenter.validatebox", function () {

                 if ($(this).hasClass('error') && opts.mode == "Real") {

                     showTip(target);
                 }
             }).
             //鼠标移除事件
             bind("mouseleave.validatebox", function () {

                 if (opts.mode == "Real") {

                     hideTip(target);
                 }
             });
    }

    $.fn.validatebox = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.validatebox.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'validatebox');

            if (state) {

                //合并参数
                $.extend(state.options, options);

                //刷新数据
                $(this).validatebox("reload");

            } else {
                //设置数据
                $.data(this, 'validatebox', {
                    //参数
                    options: $.extend({},
                        $.fn.validatebox.defaults,
                        $.fn.validatebox.parseOptions(this),
                        options),
                    //提示信息
                    message: '',
                    //提示框
                    tip: ''
                });

                //初使化
                init(this);
            }
        });
    };

    //插件方法
    $.fn.validatebox.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'validatebox');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //验证
        validate: function (target) {
            return target.each(function () {
                validate(this);
            });
        },
        //返回验证结果（无法验证异步提交数据）
        isValid: function (target) {

            var opts = $.data(target[0], 'validatebox').options;

            //验证
            validate(target[0]);

            //获取错误
            var valid = $(target[0]).hasClass("error");

            if (valid && opts.mode == "Real") {

                $(target[0]).focus();
            }

            return !valid;
        },
        //返回验证结果(异步)
        isAsyncValid: function (target, callback) {

            var opts = $.data(target[0], 'validatebox').options;

            //执行返回结果
            function result() {

                //获取错误
                var valid = $(target[0]).hasClass("error");

                if (valid && opts.mode == "Real") {

                    $(target[0]).focus();
                }

                callback(!valid);
            }

            //得到异步验证状态
            function getStatus() {

                return !$(target[0]).hasClass("start");
            }

            //验证
            validate(target[0]);

            //获取异步提交
            var asyncvalid = $(target[0]).hasClass("start");

            //异步验证
            if (asyncvalid) {

                //异步状态是否完成
                if (getStatus()) {

                    //执行返回结果
                    result();
                }
                else {

                    (function () {

                        if (!getStatus()) {

                            setTimeout(arguments.callee, 200);
                        }
                        else {

                            //执行返回结果
                            result();
                        }

                    })();
                }
            }
                //非异步验证
            else {

                result();
            }
        },
        //得到值
        getValue: function (target) {

            var opts = $.data(target[0], 'validatebox').options;

            var val = target.val();

            return opts.emptyCon != val ? val : "";

        },
        //重设插件
        rest: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'validatebox').options;

                var tip = $.data(this, 'validatebox').tip;

                //合并参数
                $.extend(opts, param);

                //文本框readonly
                $(this).attr('readonly', !opts.editable);

                //绑定HighlightInput插件
                $(this).HighlightInput({ mode: "Empty", emptyCon: opts.emptyCon, focusColor: opts.focusColor, blurColor: opts.blurColor });

                //移除焦点，HighlightInput会重设置默认值
                //$(this).blur();

                //模式为Static时会有tip，先移除
                if (tip) {

                    tip.remove();
                    $.data(this, 'validatebox').tip = null;
                }

                if (opts.mode == "Static") {

                    var tip = $('<div class="xgui-validatebox-tip2"><span class="xgui-validatebox-tip2-icon ok"></span><span class="xgui-validatebox-tip2-con"></span></div>').appendTo('body').hide();

                    $.data(this, 'validatebox').tip = tip;
                }

                //重设内容
                $(this).val(opts.emptyCon);

                //移除错误
                $(this).removeClass("error");

            });
        }

    };
    //获取插件参数
    $.fn.validatebox.parseOptions = function (target) {
        var t = $(target);
        return {
            //模式
            mode: (t.attr('mode') || undefined),
            //必填
            required: (t.attr('required') ? (t.attr('required') == 'required' || t.attr('required') == 'true' || t.attr('required') == true) : undefined),
            //验证类别
            validType: (t.attr('validType') || undefined),
            //提示文本
            Msg: (t.attr('Msg') || undefined),
            //为空时文本
            emptyMsg: (t.attr('emptyMsg') || undefined),
            //错误时文本
            errorMsg: (t.attr('errorMsg') || undefined),
            //为空内容
            emptyCon: (t.attr('emptyCon') || undefined),
            //聚集时文字颜色
            focusColor: (t.attr('focusColor') || undefined),
            //失去焦点时文字颜色
            blurColor: (t.attr('blurColor') || undefined),
            //可编辑
            editable: (t.attr('editable') ? t.attr('editable') == 'true' : undefined),
            //left左边距离
            left: (parseInt(t.attr('left')) || undefined)
        };
    };

    //插件默认参数
    $.fn.validatebox.defaults = {

        //模式（Real、Static）
        mode: "Real",
        //必填验证
        required: false,
        //左边距离(额外增加)
        left: 0,
        //顶部距离(额外增加)
        top: 0,
        //验证类别
        validType: null,
        //提示文本
        Msg: "该项为必输项！",
        //文本框为空时提示文字
        emptyMsg: "该项为必输项！",
        //内容无效时提示文字
        errorMsg: null,
        //为空内容
        emptyCon: "",
        //聚集时文字颜色
        focusColor: null,
        //失去焦点时文字颜色
        blurColor: null,
        //可编辑
        editable: true,
        //验证规则
        rules: {
            //邮件验证
            email: {
                //正则验证
                validator: function (value, param, callback) {

                    callback(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
							.test(value));
                },
                //提示信息
                message: '邮件格式不正确！'
            },
            //url验证
            url: {
                validator: function (value, param, callback) {
                    callback(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
							.test(value));
                },
                message: 'URL地址错误！'
            },
            //文本长度验证
            length: {
                validator: function (value, param, callback) {

                    var len = $.trim(value).length;
                    //小于验证
                    if (param.length == 1) {

                        this.message = "长度必须小于" + param[0] + "！";

                        callback(len < param[0]);
                    }
                        //之间验证
                    else {
                        this.message = "长度应在" + param[0] + "到" + param[1] + "个字符！";

                        callback(len >= param[0] && len <= param[1]);
                    }
                },
                message: '长度验证错误！'
            },
            //汉字长度验证
            char: {
                validator: function (value, param, callback) {

                    //中文正则
                    var reg = /^[\u4e00-\u9fa5]+$/i;

                    var len = $.trim(value).length;

                    //小于验证
                    if (param.length == 1) {

                        this.message = "长度必须小于" + param[0] + "个汉字！";

                        callback(reg.test(value) && len < param[0]);
                    }
                        //之间验证
                    else {

                        this.message = "长度应在" + param[0] + "-" + param[1] + "个汉字！";

                        callback(reg.test(value) && len >= param[0] && len <= param[1]);
                    }
                },
                message: '请输入汉字！'
            },
            //数值验证
            number: {
                validator: function (value, param, callback) {

                    var reg1 = (/^-?(0|[1-9]\d*)(\.\d+)?$/i.test(value));

                    //数值验证
                    if (reg1 == false) {

                        this.message = "请输入数值！";

                        callback(false);
                    }
                    else {
                        //有参数
                        if (param) {

                            //小于验证
                            if (param.length == 1) {

                                this.message = "数值必须小于" + param[0] + "！";

                                callback(value < param[0]);
                                return;
                            }
                                //之间验证
                            else {

                                var reg2 = (value >= param[0] && value <= param[1]);

                                if (reg2 == false) {
                                    this.message = "数值应在" + param[0] + "到" + param[1] + "的数值范围！";

                                    callback(false);
                                    return;
                                }
                                else {

                                    //有位数
                                    if (param.length == 3) {

                                        eval("var reg3 = /^-?(0|[1-9]\d*)+(.[0-9]{1," + param[2] + "})?$/i");

                                        if (!reg3.test(value)) {

                                            this.message = "不可超过" + param[2] + "位小数！";

                                            callback(false);
                                            return;
                                        }
                                    }
                                }
                            }
                        }

                        callback(true);
                    }
                },
                message: '请输入数值！'
            },
            //整数
            integer: {
                validator: function (value, param, callback) {

                    var result = /^[0-9]*$/i.test(value);

                    //整数验证
                    if (result == false) {

                        this.message = "数值必须为正整数！";

                        callback(false);

                        return;
                    }
                    else {

                        //小于验证
                        if (param.length == 1) {

                            this.message = "数值必须小于" + param[0] + "！";

                            callback(value < param[0]);
                        }
                            //之间验证
                        else {
                            this.message = "数值应在" + param[0] + "到" + param[1] + "的整数范围！";

                            callback(value >= param[0] && value <= param[1]);
                        }
                    }
                },
                message: '数值验证错误！'
            },
            //手机号验证
            phone: {
                validator: function (value, param, callback) {
                    callback(/^1[3|4|5|7|8|][0-9]{9}$/i
                            .test(value));
                },
                message: '请输入手机号码！'
            },
            //身份证号验证
            idcard: {
                validator: function (value, param, callback) {

                    //身份证号验证
                    callback(validateIdCard(value));

                    //身份证号验证
                    function validateIdCard(idcard) {

                        function Append_zore(temp) {

                            if (temp < 10) {

                                return "0" + temp;
                            }
                            else {
                                return temp;
                            }
                        }

                        if ($.trim(idcard) != "") {

                            //身份证的地区代码对照  
                            var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };

                            //合法性验证  
                            var sum = 0;

                            //出生日期  
                            var birthday;

                            //验证长度与格式规范性的正则  
                            var pattern = new RegExp(/(^\d{15}$)|(^\d{17}(\d|x|X)$)/i);

                            if (pattern.exec(idcard)) {

                                //验证身份证的合法性的正则  
                                pattern = new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/);

                                if (pattern.exec(idcard)) {

                                    //获取15位证件号中的出生日期并转位正常日期       
                                    birthday = "19" + idcard.substring(6, 8) + "-" + idcard.substring(8, 10) + "-" + idcard.substring(10, 12);
                                }
                                else {

                                    idcard = idcard.replace(/x|X$/i, "a");

                                    //获取18位证件号中的出生日期  
                                    birthday = idcard.substring(6, 10) + "-" + idcard.substring(10, 12) + "-" + idcard.substring(12, 14);

                                    //校验18位身份证号码的合法性  
                                    for (var i = 17; i >= 0; i--) {

                                        sum += (Math.pow(2, i) % 11) * parseInt(idcard.charAt(17 - i), 11);
                                    }
                                    if (sum % 11 != 1) {

                                        return false;
                                    }
                                }
                                //检测证件地区的合法性                                  
                                if (aCity[parseInt(idcard.substring(0, 2))] == null) {

                                    return false;
                                }
                                var dateStr = new Date(birthday.replace(/-/g, "/"));

                                if (birthday != (dateStr.getFullYear() + "-" + Append_zore(dateStr.getMonth() + 1) + "-" + Append_zore(dateStr.getDate()))) {

                                    return false;
                                }
                            }
                            else {

                                return false;
                            }
                        }
                        else {

                            return false;
                        }

                        return true;
                    }
                },
                message: '身份证号错误！'
            }
        }
    }


})(jQuery);

/*
*   combo — jQuery XGUI
*   made by：lv
*   Production in：2014-1-1
*   Last updated：2016-09-02
*/
(function ($) {

    //插件初使化
    function init(target) {

        var span = $('<span class="combo"></span>').insertAfter(target);

        //输入框
        var input = $('<input type="text" class="combo-text">').appendTo(span);

        //按钮
        $('<span><span class="combo-arrow"></span></span>').appendTo(span);

        //存放值
        $('<input type="hidden" class="combo-value">').appendTo(span);

        //下拉框
        var panel = $('<div class="panel"><div class="combo-panel"><div></div>').appendTo('body');

        //隐藏插件 form load时用
        $(target).addClass("combo-f").hide();

        return {
            combo: span,
            panel: panel
        };
    };
    //创建
    function create(target) {

        var opts = $.data(target, 'combo').options;

        var combo = $.data(target, 'combo').combo;

        if (!opts.name) {

            opts.name = $(target).attr("id") ? $(target).attr("id") : undefined;

            if (!opts.name) {

                xgui.alert("插件调用错误，没有name属性且没有id属性！", "error");
            }
        }

        //设置name属性
        $('input.combo-value', combo).attr('name', opts.name);

        //移除name属性和设置comboName属性
        $(target).removeAttr('name').attr('comboName', opts.name);

        //设置大小
        setSize(target);

        //设置插件状态
        setDisabled(target, opts.disabled);

        //隐藏panel
        hidePanel(target);

        //绑定事件
        BindEvent(target);

        //数据验证
        validate(target);
    }
    //设置(combo和panel)大小
    function setSize(target, width) {

        var opts = $.data(target, 'combo').options;

        var combo = $.data(target, 'combo').combo;

        var panel = $.data(target, 'combo').panel;

        var comboPanel = panel.find(".combo-panel");

        if (width) {

            opts.width = width;
        }

        //combo宽度
        combo.outerWidth(opts.width);

        //combo-text宽度
        combo.find('.combo-text').outerWidth(opts.width - (combo.outerWidth() - combo.width()) - combo.find('.combo-arrow').outerWidth());

        //panel宽
        comboPanel.outerWidth(opts.panelWidth ? opts.panelWidth : combo.outerWidth());

        //panel高
        comboPanel.outerHeight(opts.panelHeight);

    };
    //设置插件状态
    function setDisabled(target, disabled) {

        var opts = $.data(target, 'combo').options;

        var combo = $.data(target, 'combo').combo;

        if (disabled) {

            opts.disabled = true;

            $(target).attr('disabled', true);

            //combo.find('.combo-value').attr('disabled', true);

            combo.find('.combo-text').attr('disabled', true);
        } else {

            opts.disabled = false;

            $(target).removeAttr('disabled');

            //combo.find('.combo-value').removeAttr('disabled');

            combo.find('.combo-text').removeAttr('disabled');
        }
    };
    //显示panel
    function showPanel(target) {

        var opts = $.data(target, 'combo').options;

        var combo = $.data(target, 'combo').combo;

        var panel = $.data(target, 'combo').panel;

        //显示panel
        //panel.show();

        //设置panel位置
        panel.css({
            left: fixedLeft(),
            top: fixedTop(),
            display: "block"
        });

        //绑定document单击事件
        $(document).unbind('.combo').
            bind('mousedown.combo', function (e) {

                //隐藏下拉列表
                $(target).combo('hidePanel');
            });

        //显示panel事件
        opts.onShowPanel.call(target);


        //左边距离
        function fixedLeft() {
            var left = combo.offset().left;
            if (left + panel.outerWidth() > $(window).width()
					+ $(document).scrollLeft()) {
                left = $(window).width() + $(document).scrollLeft()
						- panel.outerWidth();
            }
            if (left < 0) {
                left = 0;
            }
            return left;
        };

        //顶部距离
        function fixedTop() {

            var top = combo.offset().top + combo.outerHeight();

            if (top + panel.outerHeight() > $(window).height()
					+ $(document).scrollTop()) {
                top = combo.offset().top - panel.outerHeight();
            }
            if (top < $(document).scrollTop()) {
                top = combo.offset().top + combo.outerHeight();
            }
            return top;
        };
    };
    //隐藏panel
    function hidePanel(target) {

        var panel = $.data(target, 'combo').panel;

        panel.hide();

        //解除document绑定事件
        $(document).unbind('.combo');
    };
    //文本框验证
    function validate(target) {

        var opts = $.data(target, 'combo').options;

        //combo
        var combo = $.data(target, 'combo').combo;

        //输入框
        var input = combo.find('input.combo-text');

        //combo宽-(combo左边距)-文本框宽
        opts.left += combo.outerWidth() - ((combo.outerWidth() - combo.width()) / 2) - input.outerWidth();

        //combo顶部边距
        opts.top -= (combo.outerHeight() - combo.height()) / 2;

        //给输入框设置验证
        input.validatebox(opts);

    };
    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'combo').options;

        //combo
        var combo = $.data(target, 'combo').combo;

        //下拉框
        var panel = $.data(target, 'combo').panel;

        //输入框
        var input = combo.find('.combo-text');

        //图标
        var arrow = combo.find('.combo-arrow');

        var timer = null;

        //解除其它事件
        combo.unbind('.combo');
        panel.unbind('.combo');
        input.unbind('.combo');
        arrow.unbind('.combo');

        //禁用插件
        if (!opts.disabled) {

            //combo事件
            combo.
                //单击事件
                bind("click.combo", function () {

                    if (panel.is(":visible")) {

                        //隐藏panel
                        hidePanel(target);

                    } else {

                        //隐藏所有panel
                        $("div.panel").hide();

                        //显示panel
                        showPanel(target);
                    }
                    //文本框聚焦
                    input.focus();

                });

            //输入框事件
            input.
                //鼠标按下事件,阻止冒泡document事件
                bind('mousedown.combo', function (e) {

                    e.stopPropagation();
                }).
                //键盘按下事件
                bind('keydown.combo', function (e) {
                    switch (e.keyCode) {
                        case 38:  // 上
                            opts.keyHandler.up.call(target);
                            break;
                        case 40:  // 下
                            opts.keyHandler.down.call(target);
                            break;
                        case 13:  // 回车
                            e.preventDefault();
                            opts.keyHandler.enter.call(target);
                            return false;
                        case 9:
                        case 27:  // esc退出
                            hidePanel(target);
                            break;
                        default:

                            //查询
                            if (opts.editable) {
                                if (timer) {
                                    clearTimeout(timer);
                                }
                                timer = setTimeout(function () {

                                    showPanel(target);

                                    opts.keyHandler.query.call(target, input.val());

                                }, opts.delay);
                            }
                    }
                });

            //图标事件
            arrow.
                //单击事件
                bind('click.combo', function () {

                }).
                //移入样式
                bind('mouseenter.combo', function () {
                    $(this).addClass('combo-arrow-hover');
                }).
                //移除样式
                bind('mouseleave.combo', function () {
                    $(this).removeClass('combo-arrow-hover');
                }).
                //阻止冒泡document事件
                bind('mousedown.combo', function () {
                    return false;
                });

            //panel事件
            panel.
                //阻止冒泡document事件
                bind('mousedown.combo', function (e) {
                    return false;
                });
        }

    };

    $.fn.combo = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            //return $.fn.combo.methods[options](this, param);

            var method = $.fn.combo.methods[options];

            if (method) {

                return method(this, param);

            } else {

                //combo
                var combo = $.data($(this)[0], 'combo').combo;

                //validatebox插件
                return combo.find('input.combo-text').validatebox(options, param);
            }

        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'combo');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {

                //初使化
                var r = init(this);

                //设置数据
                $.data(this, 'combo', {
                    options: $.extend({},
                        $.fn.combo.defaults,
                        $.fn.combo.parseOptions(this),
                        options),
                    combo: r.combo,
                    panel: r.panel
                });

                //创建
                create(this);
            }
        });
    };

    //插件方法
    $.fn.combo.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'combo');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //返回combo对象
        combo: function (target) {
            return $.data(target[0], "combo").combo;
        },
        //返回panel对象
        panel: function (target) {
            return $.data(target[0], "combo").panel;
        },
        //设置大小
        resize: function (target, width) {
            return target.each(function () {
                setSize(this, width);
            });
        },
        //禁用插件
        disable: function (target) {

            return target.each(function () {

                //设置disable
                setDisabled(this, true);

                //重绑事件
                BindEvent(this);
            });
        },
        //启用插件
        enable: function (target) {

            return target.each(function () {

                //设置disable
                setDisabled(this, false);

                //重绑事件
                BindEvent(this);
            });
        },
        //显示panel
        showPanel: function (target) {
            return target.each(function () {
                showPanel(this);
            });
        },
        //隐藏panel
        hidePanel: function (jq) {
            return jq.each(function () {
                hidePanel(this);
            });
        }

    };
    //获取插件参数
    $.fn.combo.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.validatebox.parseOptions(target), {
            //宽度
            width: (parseInt(target.style.width) || undefined),
            //panel宽
            panelWidth: (parseInt(t.attr('panelWidth')) || undefined),
            //panel高
            panelHeight: (t.attr('panelHeight') == 'auto' ? 'auto' : parseInt(t.attr('panelHeight')) || undefined),
            //启用
            disabled: (t.attr('disabled') ? true : undefined),
            //name属性
            name: (t.attr('name') || undefined),
            //值
            value: (t.val() || t.attr('value') || undefined),
            //提示
            msg: t.attr('msg')
        });
    };

    //插件默认参数
    $.fn.combo.defaults = $.extend({}, $.fn.validatebox.defaults, {

        //combo宽度
        width: 134,
        //panel宽度
        panelWidth: null,
        //panel高度
        panelHeight: 160,
        //禁用插件
        disabled: false,
        //属性
        name: null,
        //值
        value: '',
        //延迟
        delay: 100,
        //按键操作
        keyHandler: {
            //上
            up: function () {
            },
            //下
            down: function () {
            },
            //回车
            enter: function () {
            },
            //查询
            query: function (q) {
            }
        },
        //panel显示时事件
        onShowPanel: function () {
        }
    });


})(jQuery);

/*
*   combobox — jQuery XGUI
*   made by：lv
*   Production in：2013-10-9
*   Last updated：2015-11-04
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'combobox').options;

        //form load时用
        $(target).addClass("combobox-f");

        //为多选时，不可编辑
        if (opts.multiple) {

            opts.editable = false;
        }

        //comb插件
        $(target).combo($.extend({}, opts, {
            //显示下拉列表时设置滚动条位置
            onShowPanel: function () {

                scrollTo(target, $(target).combobox('getValue'));

                if (!opts.multiple) {

                    //窗体事件
                    $(document).unbind('.combobox').
                        bind('mousedown.combobox', function (e) {

                            //验证数据
                            checkData(target);
                        });
                }
            }
        }));

        //载入数据
        reload(target);

        //设置初使值
        if (opts.value) {

            $(target).combobox("setValue", opts.value);
        }

    };

    //json转换
    function tojson(html) {

        return eval('(' + html + ')');
    }

    //载入数据
    function reload(target) {

        var opts = $.data(target, 'combobox').options;

        //插件载入开始
        opts.isLoad = false;

        if (opts.url != null) {

            xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                $.data(target, "combobox").data = o;

                //载入列表数据
                LoadList(target, "");

                //载入成功触发的事件
                opts.onLoadSuccess();

            });

        }
        else {

            //本地数据
            if (opts.localData == null) {

                var optitem = $(target).find("option");

                if (optitem.length > 0) {

                    var strData = "[";

                    for (i = 0; i < optitem.length; i++) {

                        strData += "{id:" + (i + 1) + "," + "val:\"" + $(optitem[i]).attr("value") + "\"," + "text:\"" + $(optitem[i]).text() + "\"},";
                    }

                    strData = strData.substr(0, strData.length - 1);

                    strData += "]";

                    $.data(target, "combobox").data = tojson(strData);

                }
            }
            else {

                $.data(target, "combobox").data = opts.localData;
            }

            //载入列表数据
            LoadList(target, "");

            //载入成功触发的事件
            opts.onLoadSuccess();
        }

    }

    //载入列表数据
    function LoadList(target, keyword) {

        var opts = $.data(target, 'combobox').options;

        var data = $.data(target, "combobox").data;

        var panel = $(target).combo('panel');

        var htmld = "";

        if (data != null) {

            $.each(data, function (a, b) {

                //indexof查找字符
                if (b[opts.textField].indexOf(keyword) != -1) {

                    htmld += "<div class=\"combobox-item\" val=\"" + b[opts.valueField] + "\">" + b[opts.textField] + "</div>";
                }

            });
        }

        //输出列表
        panel.find(".combo-panel").html(htmld);

        //事件
        BindEvent(target);

        //插件载入结束
        opts.isLoad = true;

    }

    //设置值
    function setValues(target, values) {

        var opts = $.data(target, 'combobox').options;

        var combo = $(target).combo("combo");

        var panel = $(target).combo("panel");

        if (opts.isLoad) {

            //设置值
            setVal();
        }
        else {

            (function () {

                if (!opts.isLoad) {

                    setTimeout(arguments.callee, 200);
                }
                else {

                    //设置值
                    setVal();
                }

            })();
        }

        //设置值
        function setVal() {

            //先清除
            $(target).combobox("clear");

            //多选
            if (opts.multiple) {

                if (values.length > 0) {

                    var Text = [];

                    for (var i = 0; i < values.length; i++) {

                        //得到项
                        var item = panel.find(".combobox-item[val='" + values[i] + "']");

                        //样式
                        item.addClass("combobox-item-select");

                        Text.push(item.text());
                    }

                    //显示文本
                    combo.find(".combo-text").val(Text);

                    //赋值
                    combo.find(".combo-value").val(values);
                }
            }
                //单选
            else {

                //数值或布尔型验证不过
                if (values.toString() != "") {

                    //得到项
                    var item = panel.find(".combobox-item[val='" + values + "']");

                    //样式
                    item.addClass("combobox-item-select");

                    //显示文本
                    combo.find(".combo-text").val(item.text());

                    //赋值
                    combo.find(".combo-value").val(values);
                }
            }
        }

    };

    //验证数据
    function checkData(target) {

        var opts = $.data(target, 'combobox').options;

        var data = $.data(target, "combobox").data;

        var combo = $(target).combo('combo');

        //下拉列表
        var panel = $(target).combo('panel');

        //item项
        var item = panel.find(".combobox-item");

        //得到值
        var value = $(target).combobox('getValue');

        //多选
        if (!opts.multiple) {

            //重新载入列表数据
            if (data != null && data.length != item.length) {

                LoadList(target, "");
            }

            //隐藏下拉列表
            $(target).combo('hidePanel');
        }

        //设置值
        $(target).combobox('setValue', value);

        //解除绑定(init绑定时)
        $(document).unbind('.combobox');
    }

    //设置滚动条位置
    function scrollTo(target, value) {

        var panel = $(target).combo('panel').find(".combo-panel");

        //得到项
        var item = panel.find(".combobox-item[val='" + value + "']");

        if (item.length) {

            if (item.position().top <= 0) {
                var h = panel.scrollTop() + item.position().top;
                panel.scrollTop(h);
            } else {
                if (item.position().top + item.outerHeight() > panel.height()) {
                    var h = panel.scrollTop() + item.position().top
							+ item.outerHeight() - panel.height();
                    panel.scrollTop(h);
                }
            }
        }
    };

    //上
    function selectPrev(target) {

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        var opts = $.data(target, 'combobox').options;

        //多选
        if (opts.multiple) {
            return;
        }

        //显示下拉列表
        $(target).combo('showPanel');

        //item项
        var item = panel.find(".combobox-item");

        if (item.length > 0) {

            //当前选中项
            var sItem = panel.find(".combobox-item-select");

            //当前选中项的位置
            var index = item.index(sItem);

            //返回最后一项
            if (index <= 0) {

                index = item.length;
            }

            //得到项
            var ptem = panel.find(".combobox-item:eq(" + (index - 1) + ")");

            //设置选中项
            $(target).combobox("setValue", ptem.attr("val"));

            //设置滚动条
            scrollTo(target, ptem.attr("val"));
        }
    }

    //下
    function selectNext(target) {

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        var opts = $.data(target, 'combobox').options;

        //多选
        if (opts.multiple) {
            return;
        }

        //显示下拉列表
        $(target).combo('showPanel');

        //item项
        var item = panel.find(".combobox-item");

        if (item.length > 0) {

            //当前选中项
            var sItem = panel.find(".combobox-item-select");

            //当前选中项的位置
            var index = item.index(sItem);

            //返回第一项
            if (index + 1 >= item.length) {

                index = -1;
            }

            //得到项
            var ptem = panel.find(".combobox-item:eq(" + (index + 1) + ")");

            //设置选中项
            $(target).combobox("setValue", ptem.attr("val"));

            //设置滚动条
            scrollTo(target, ptem.attr("val"));
        }
    }

    //查询
    function doQuery(target, q) {

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        var opts = $.data(target, 'combobox').options;

        //多选
        if (opts.multiple) {
            return;
        }

        //载入列表数据
        LoadList(target, q);

        //item项
        var item = panel.find(".combobox-item");

        //如果有数据则选中第一项
        if (item.length > 0 && q.length > 0) {

            //第一项
            var firstItem = panel.find(".combobox-item:eq(0)");

            //样式
            firstItem.addClass("combobox-item-select").siblings().removeClass("combobox-item-select");

            //赋值
            combo.find(".combo-value").val(firstItem.attr("val"));

        }
        else {

            //赋值
            combo.find(".combo-value").val("");
        }

    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'combobox').options;

        var data = $.data(target, "combobox").data;

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        //下拉列表项事件
        panel.find(".combobox-item").unbind(".combobox").
            //鼠标单击事件
            bind("click.combobox", function () {

                //多选
                if (opts.multiple) {

                    if ($(this).hasClass("combobox-item-select")) {

                        //移除样式
                        $(this).removeClass("combobox-item-select");
                    }
                    else {

                        //设置选中样式
                        $(this).addClass("combobox-item-select");

                        //单击事件
                        opts.onSelect($(this).attr("val"), $(this).text());
                    }
                }
                else {

                    //设置选中样式
                    $(this).addClass("combobox-item-select").siblings().removeClass("combobox-item-select");

                    //单击事件
                    opts.onSelect($(this).attr("val"), $(this).text());
                }

                //数据验证
                checkData(target);

            }).
            //鼠标移上去事件
            bind("mouseenter.combobox", function () {

                $(this).addClass("combobox-item-hover");

            }).
            //鼠标移除事件
            bind("mouseleave.combobox", function () {

                $(this).removeClass("combobox-item-hover");
            });

    }

    $.fn.combobox = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.combobox.methods[options];

            if (method) {

                return method(this, param);

            } else {

                return this.combo(options, param);
            }
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'combobox');

            if (state) {

                //合并参数
                $.extend(state.options, options);

                $(this).combobox("reload");

            } else {

                //设置数据
                $.data(this, 'combobox', {
                    options: $.extend({},
                        $.fn.combobox.defaults,
                        $.fn.combobox.parseOptions(this),
                        options)
                });

                init(this);
            }
        });
    };

    //插件方法
    $.fn.combobox.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'combobox');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //清除
        clear: function (target) {

            return target.each(function () {

                var opts = $.data(this, 'combobox').options;

                var combo = $(this).combo('combo');

                var panel = $(this).combo('panel');

                //显示文本
                combo.find(".combo-text").val(opts.emptyCon);

                //赋值
                combo.find(".combo-value").val("");

                //移除选中项
                panel.find(".combobox-item").removeClass("combobox-item-select");

                ////多选
                //if (!opts.multiple) {

                //    //重新载入列表
                //    LoadList(this, "");
                //}

            });
        },
        //设置值
        setValue: function (target, param) {

            return target.each(function () {

                if (param != null && param != undefined) {

                    setValues(this, param);
                }
            });
        },
        //得到文本
        getText: function (target) {

            var opts = $.data(target[0], 'combobox').options;

            var panel = $(target[0]).combo('panel');

            var values = [];

            //得到选中项
            var item = panel.find(".combobox-item-select");

            for (var i = 0; i < item.length; i++) {

                values.push($(item[i]).text());
            }

            //多选
            if (opts.multiple) {

                return values;
            }
            else {

                return values[0] || "";
            }

        },
        //得到值
        getValue: function (target) {

            var opts = $.data(target[0], 'combobox').options;

            var panel = $(target[0]).combo('panel');

            var values = [];

            //得到选中项
            var item = panel.find(".combobox-item-select");

            for (var i = 0; i < item.length; i++) {

                values.push($(item[i]).attr("val"));
            }

            //多选
            if (opts.multiple) {

                return values;
            }
            else {
                return values[0] || "";
            }
        },
        //得到选中项
        getSelected: function (target) {

            var opts = $.data(target[0], 'combobox').options;

            var data = $.data(target[0], "combobox").data;

            var panel = $(target[0]).combo('panel');

            var datas = [];

            //选中项值
            var val = panel.find(".combobox-item-select").attr("val");

            for (i = 0; i < data.length; i++) {

                if (data[i][opts.valueField] == val) {

                    datas.push(data[i]);

                    break;
                }
            }

            return datas[0];

        },
        //得到选中项
        getSelections: function (target) {

            var opts = $.data(target[0], 'combobox').options;

            var data = $.data(target[0], "combobox").data;

            var panel = $(target[0]).combo('panel');

            var datas = [];

            //得到选中项
            var item = panel.find(".combobox-item-select");

            for (var i = 0; i < item.length; i++) {

                //选中项值
                var val = $(item[i]).attr("val");

                for (j = 0; j < data.length; j++) {

                    if (data[j][opts.valueField] == val) {

                        datas.push(data[j]);
                    }
                }
            }

            //多选
            if (opts.multiple) {

                return datas;
            }
            else {

                return datas[0];
            }

        },
        //得到数据
        getData: function (target) {

            return $.data(target[0], "combobox").data;
        },
        //刷新
        reload: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'combobox').options;

                //合并参数
                $.extend(opts.queryParams, param);

                $(this).combobox("clear");

                reload(this);
            });

        }

    };
    //获取插件参数
    $.fn.combobox.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {
            //值
            valueField: t.attr('valueField'),
            //文本
            textField: t.attr('textField'),
            //远程地址
            url: t.attr('url'),
            //远程参数
            queryParams: (t.attr("queryParams") ? tojson(t.attr("queryParams")) : undefined),
            //多选
            multiple: (t.attr('multiple') ? (t.attr('multiple') == 'true' || t.attr('multiple') == true || t.attr('multiple') == "multiple") : false)
        });
    };
    //插件默认参数
    $.fn.combobox.defaults = $.extend({}, $.fn.combo.defaults, {

        //远程数据
        url: null,
        //本地数据
        localData: null,
        //远程参数
        queryParams: {},
        //值
        valueField: "val",
        //文本
        textField: "text",
        //多选
        multiple: false,
        //是否载入成功
        isLoad: false,
        //键盘操作
        keyHandler: {
            //上
            up: function () {
                selectPrev(this);
            },
            //下
            down: function () {
                selectNext(this);
            },
            //回车
            enter: function () {

                var opts = $.data(this, 'combobox').options;

                //多选
                if (opts.multiple) {

                    //隐藏下拉列表
                    $(this).combo('hidePanel');
                }
                else {

                    //验证数据
                    checkData(this);

                    //得到值
                    var data = $(this).combobox('getSelected');

                    if (data) {

                        //单击事件
                        opts.onSelect(data[opts.valueField], data[opts.textField]);
                    }
                }
            },
            //查询
            query: function (q) {
                doQuery(this, q);
            }
        },
        //当前选中
        onSelect: function () {
        },
        //载入成功触发的事件
        onLoadSuccess: function () {
        }

    });


})(jQuery);

/*
*   combogrid — jQuery XGUI
*   made by：lv
*   Production in：2015-2-5
*   Last updated：2017-11-07
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'combogrid').options;

        //form load时用
        $(target).addClass("combogrid-f");

        //comb插件
        $(target).combo($.extend({}, opts, {
            //显示下拉列表时设置滚动条位置
            onShowPanel: function () {

                scrollTo(target, $(target).combogrid('getValue'));

                //窗体事件
                $(document).unbind('.combogrid').
                    bind('mousedown.combogrid', function (e) {

                        //验证数据
                        checkData(target);
                    });
            }
        }));

        var panel = $(target).combo('panel').find(".combo-panel");

        panel.html("<div class=\"xgui-datagrid\" style=\"width:100%;\"><div class=\"xgui-datagrid-title\"></div><div class=\"xgui-datagrid-body\" style=\"position: relative;\"></div></div>");

        //合并参数
        $.extend(opts.queryParams, { keyword: "", count: opts.count });

        //载入数据
        reload(target);

        //设置初使值
        if (opts.value) {

            $(target).combogrid("setValue", opts.value);
        }
    };

    //json转换
    function tojson(html) {

        return eval('(' + html + ')');
    }

    //刷新数据
    function reload(target) {

        var opts = $.data(target, 'combogrid').options;

        //插件载入开始
        opts.isLoad = false;

        //载入远程数据
        if (opts.url != null) {

            xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                //字符串
                if (typeof o == 'string') {

                    //转换成对象
                    var data = eval('(' + o + ')');

                    $.data(target, "combogrid").data = data;
                }
                else {

                    $.data(target, "combogrid").data = o;
                }

                //载入数据
                Load(target);

            });

        }
            //载入本地数据
        else {

            $.data(target, "combogrid").data = opts.localData;

            //载入数据
            Load(target);
        }
    }

    //载入数据
    function Load(target) {

        var opts = $.data(target, 'combogrid').options;

        var data = $.data(target, "combogrid").data;

        //刷新表头
        CreateTitle(target);

        //刷新内容
        CreateBody(target, "");

        //绑定事件
        BindEvent(target);

        //插件载入结束
        opts.isLoad = true;

    }

    //创建表头
    function CreateTitle(target) {

        var opts = $.data(target, 'combogrid').options;

        var panel = $(target).combo('panel');

        var gtitle = panel.find(".xgui-datagrid-title");

        var htmldata = "<table cellspacing=\"0\" cellpadding=\"0\"><tbody><tr>";

        //columns
        var col = opts.columns[0];

        //行标
        if (opts.rownumbers) {

            htmldata += "<td><div class=\"xgui-datagrid-cell-number\">&nbsp;</div></td>";
        }

        for (var i = 0; i < col.length; i++) {

            htmldata += "<td field=\"" + col[i].field + "\"><div class=\"xgui-datagrid-cell\" style = \"";

            //方向
            if (col[i].align) {

                htmldata += "text-align:" + col[i].align + ";";
            }

            //排列
            htmldata += "\">";

            htmldata += col[i].title;

            htmldata += "</div></td>";
        }

        htmldata += "</tr></tbody></table>";

        //输出
        gtitle.html(htmldata);

    }

    //创建内容
    function CreateBody(target, keyword) {

        var opts = $.data(target, 'combogrid').options;

        var panel = $(target).combo('panel');

        var data = $.data(target, "combogrid").data;

        var gbody = panel.find(".xgui-datagrid-body");

        var htmldata = "<table cellspacing=\"0\" cellpadding=\"0\"><tbody>";

        //columns
        var col = opts.columns[0];

        if (data != null) {

            //行数据
            $.each(data, function (rowindex, rowdata) {

                //indexof查找字符
                if (opts.filter.call(target, keyword, rowdata)) {

                    htmldata += "<tr val=\"" + rowdata[opts.idField] + "\" class=\"xgui-datagrid-row\">";

                    //行标
                    if (opts.rownumbers) {

                        htmldata += "<td><div class=\"xgui-datagrid-cell-number\">" + (rowindex + 1) + "</div></td>";
                    }

                    //单元格数据
                    $.each(col, function (r, d) {

                        htmldata += "<td field=\"" + d.field + "\"><div class=\"xgui-datagrid-cell\" style = \"";

                        //方向
                        if (d.align) {

                            htmldata += "text-align:" + d.align + ";";
                        }

                        htmldata += "\">";

                        if (d.formatter) {

                            htmldata += d.formatter(rowdata[d.field], rowdata);
                        }
                        else {

                            htmldata += rowdata[d.field] != null ? rowdata[d.field] : "";
                        }

                        htmldata += "</div></td>";
                    });

                    htmldata += "</tr>";
                }
            });
        }

        htmldata += "</tbody></table>";

        //输出
        gbody.html(htmldata);
    }

    //设置表格大小
    function Resize(target) {

        var opts = $.data(target, 'combogrid').options;

        var panel = $(target).combo('panel');

        //表头
        var gtitle = panel.find(".xgui-datagrid-title");

        //表格
        var gbody = panel.find(".xgui-datagrid-body");

        //表格宽
        var tableWidth = panel.find(".combo-panel").width();

        //表格宽-18（滚动条宽）
        tableWidth -= 18;

        gbody.css({ "height": panel.find(".combo-panel").height() - gtitle.outerHeight(), "overflow-y": "scroll" });

        //设置表头宽
        gtitle.find("table:first").outerWidth(tableWidth);

        //设置内容表格宽
        gbody.find("table:first").outerWidth(tableWidth);

        //总列数大小
        var columnWidth = 0;

        //columns
        var col = opts.columns[0];

        //行标
        if (opts.rownumbers) {

            tableWidth -= panel.find(".xgui-datagrid-cell-number").outerWidth();
        }

        for (var i = 0; i < col.length; i++) {

            columnWidth += col[i].width || 100;
        }

        //单元格宽度比例
        var rate = tableWidth / columnWidth;

        //padding值
        var padding = panel.find(".xgui-datagrid-cell").outerWidth() - panel.find(".xgui-datagrid-cell").width();

        for (var i = 0; i < col.length; i++) {

            var w = col[i].width || 100;

            w = parseInt(w * rate) - padding;

            panel.find("td[field=" + col[i].field + "] .xgui-datagrid-cell").width(w);
        }
    }

    //设置滚动条位置
    function scrollTo(target, value) {

        var gbody = $(target).combo('panel').find(".xgui-datagrid-body");

        //得到项
        var item = gbody.find(".xgui-datagrid-row[val='" + value + "']");

        if (item.length) {

            if (item.position().top <= 0) {
                var h = gbody.scrollTop() + item.position().top;
                gbody.scrollTop(h);
            } else {
                if (item.position().top + item.outerHeight() > gbody.height()) {
                    var h = gbody.scrollTop() + item.position().top
							+ item.outerHeight() - gbody.height();
                    gbody.scrollTop(h);
                }
            }
        }
    };

    //上
    function selectPrev(target) {

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        var opts = $.data(target, 'combogrid').options;

        //显示下拉列表
        $(target).combo('showPanel');

        //item项
        var item = panel.find(".xgui-datagrid-row");

        if (item.length > 0) {

            //当前选中项
            var sItem = panel.find(".xgui-datagrid-row-select");

            //当前选中项的位置
            var index = item.index(sItem);

            //返回最后一项
            if (index <= 0) {

                index = item.length;
            }

            //得到项
            var ptem = panel.find(".xgui-datagrid-row:eq(" + (index - 1) + ")");

            //设置选中项
            $(target).combogrid("setValue", ptem.attr("val"));

            //设置滚动条
            scrollTo(target, ptem.attr("val"));
        }
    }

    //下
    function selectNext(target) {

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        var opts = $.data(target, 'combogrid').options;

        //显示下拉列表
        $(target).combo('showPanel');

        //item项
        var item = panel.find(".xgui-datagrid-row");

        if (item.length > 0) {

            //当前选中项
            var sItem = panel.find(".xgui-datagrid-row-select");

            //当前选中项的位置
            var index = item.index(sItem);

            //返回第一项
            if (index + 1 >= item.length) {

                index = -1;
            }

            //得到项
            var ptem = panel.find(".xgui-datagrid-row:eq(" + (index + 1) + ")");

            //设置选中项
            $(target).combogrid("setValue", ptem.attr("val"));

            //设置滚动条
            scrollTo(target, ptem.attr("val"));
        }
    }

    //查询
    function doQuery(target, q, event) {

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        var opts = $.data(target, 'combogrid').options;

        //本地检索
        if (opts.queryMode == "local") {

            //刷新内容
            CreateBody(target, q);

            //查询完成事件
            queryEvent();

            if (event) {
                event();
            }
        }
            //远程检索
        else {

            //合并参数
            $.extend(opts.queryParams, { keyword: q });

            xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                //字符串
                if (typeof o == 'string') {

                    //转换成对象
                    var data = eval('(' + o + ')');

                    $.data(target, "combogrid").data = data;
                }
                else {

                    $.data(target, "combogrid").data = o;
                }

                //刷新内容
                CreateBody(target, q);

                //查询完成事件
                queryEvent();

                if (event) {
                    event();
                }

            });
        }

        //查询完成事件
        function queryEvent() {

            //item项
            var item = panel.find(".xgui-datagrid-row");

            //如果有数据则选中第一项
            if (item.length > 0 && q.length > 0) {

                //第一项
                var firstItem = panel.find(".xgui-datagrid-row:eq(0)");

                //样式
                firstItem.addClass("xgui-datagrid-row-select").siblings().removeClass("xgui-datagrid-row-select");

                //赋值
                combo.find(".combo-value").val(firstItem.attr("val"));

            }
            else {

                //赋值
                combo.find(".combo-value").val("");
            }

            //绑定事件
            BindEvent(target);

        }
    }

    //验证数据
    function checkData(target) {

        var opts = $.data(target, 'combogrid').options;

        var data = $.data(target, "combogrid").data;

        var combo = $(target).combo('combo');

        //下拉列表
        var panel = $(target).combo('panel');

        //item项
        var item = panel.find(".xgui-datagrid-row");

        //得到值
        var value = $(target).combogrid('getValue');

        //重新载入列表数据
        if (data != null && data.length != item.length) {

            //刷新内容
            CreateBody(target, "");

            //绑定事件
            BindEvent(target);
        }

        //隐藏下拉列表
        $(target).combo('hidePanel');

        //设置值
        $(target).combogrid('setValue', value);

        //解除绑定(init绑定时)
        $(document).unbind('.combogrid');
    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'combogrid').options;

        var panel = $(target).combo('panel');

        //表内容
        var gbody = panel.find(".xgui-datagrid-body");

        //隔行颜色
        gbody.find('.xgui-datagrid-row:odd').addClass("xgui-datagrid-row-alt");

        //事件
        gbody.find('.xgui-datagrid-row').unbind(".combogrid").
            //鼠标移上去事件
            bind('mouseenter.combogrid', function () {
                $(this).addClass("xgui-datagrid-row-hover");
            }).
            //鼠标移除事件
            bind('mouseleave.combogrid', function () {
                $(this).removeClass("xgui-datagrid-row-hover");
            }).
            //单击事件
            bind('click.combogrid', function () {

                //优化选择速度
                gbody.find(".xgui-datagrid-row-select").removeClass("xgui-datagrid-row-select");

                $(this).addClass("xgui-datagrid-row-select");

                //数据验证
                checkData(target);

                //得到值
                var data = $(target).combogrid('getSelected');

                //单击事件
                opts.onSelect(data[opts.idField], data[opts.textField], data);
            });

        //设置表格大小
        Resize(target);
    }

    $.fn.combogrid = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.combogrid.methods[options];

            if (method) {

                return method(this, param);

            } else {

                return this.combo(options, param);
            }
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'combogrid');

            if (state) {

                //合并参数
                $.extend(state.options, options);

                $(this).combogrid("reload");

            } else {

                //设置数据
                $.data(this, 'combogrid', {
                    options: $.extend({},
                        $.fn.combogrid.defaults,
                        $.fn.combogrid.parseOptions(this),
                        options)
                });

                init(this);
            }
        });
    };

    //插件方法
    $.fn.combogrid.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'combogrid');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //得到数据
        getData: function (target) {

            return $.data(target[0], "combogrid").data;
        },
        //得到选中项
        getSelected: function (target) {

            var opts = $.data(target[0], 'combogrid').options;

            var panel = $(target[0]).combo('panel');

            var data = $.data(target[0], "combogrid").data;

            //得到选中项
            var item = panel.find(".xgui-datagrid-row-select");

            if (item.length > 0) {

                //值
                //var value = parseInt(item.attr("val"));

                var value = item.attr("val");

                for (i = 0; i < data.length; i++) {

                    if (data[i][opts.idField] == value) {

                        return data[i];
                    }
                }
            }

            return null;
        },
        //得到值
        getValue: function (target) {

            var opts = $.data(target[0], 'combogrid').options;

            var data = $(target).combogrid("getSelected");

            if (data) {

                return data[opts.idField];
            }

            return "";
        },
        //得到文本
        getText: function (target) {

            var opts = $.data(target[0], 'combogrid').options;

            var data = $(target).combogrid("getSelected");

            if (data) {

                return data[opts.textField];
            }

            return "";
        },
        //设置值
        setValue: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'combogrid').options;

                var combo = $(this).combo('combo');

                var panel = $(this).combo('panel');

                //对象
                var t = this;

                //先清除
                $(target).combogrid("clear");

                if (param == "") {

                    return;
                }

                if (opts.isLoad) {

                    setValue();
                }
                else {

                    //一直侦听至到加载完成并完成setValue操作
                    var runtime = setInterval(function () {

                        if (opts.isLoad) {

                            //清除时间
                            window.clearInterval(runtime);

                            setValue();
                        }

                    }, 50);
                }

                //设置值
                function setValue() {

                    var data = $.data(t, "combogrid").data;

                    if (data) {

                        var value = null;

                        for (i = 0; i < data.length; i++) {

                            if (data[i][opts.idField] == param) {

                                value = data[i];
                                break;
                            }
                        }

                        if (value) {

                            //显示文本
                            combo.find(".combo-text").val(value[opts.textField]);

                            //赋值
                            combo.find(".combo-value").val(value[opts.idField]);

                            //样式
                            panel.find("tr[val=" + param + "]").addClass("xgui-datagrid-row-select");
                        }
                    }
                }
            });
        },
        //设置数据
        setData: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'combogrid').options;

                var combo = $(this).combo('combo');

                var panel = $(this).combo('panel');

                //值
                var pvalue = param[opts.idField];
                //文本
                var ptext = param[opts.textField];

                //对象
                var t = this;

                //先清除
                $(target).combogrid("clear");

                if (pvalue == "" || ptext == "") {

                    return;
                }

                //检索
                doQuery(this, ptext, function () {

                    var data = $.data(t, "combogrid").data;

                    if (data) {

                        var value = null;

                        for (i = 0; i < data.length; i++) {

                            if (data[i][opts.idField] == pvalue) {

                                value = data[i];
                                break;
                            }
                        }

                        if (value) {

                            //验证
                            checkData(t);
                        }
                    }
                });
            });
        },
        //清除
        clear: function (target) {

            return target.each(function () {

                var opts = $.data(this, 'combogrid').options;

                var combo = $(this).combo('combo');

                var panel = $(this).combo('panel');

                //显示文本
                combo.find(".combo-text").val(opts.emptyCon);

                //赋值
                combo.find(".combo-value").val("");

                //移除选中项
                panel.find(".xgui-datagrid-row-select").removeClass("xgui-datagrid-row-select");

            });
        },
        //刷新
        reload: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'combogrid').options;

                //合并参数
                $.extend(opts.queryParams, param);

                $(this).combogrid("clear");

                reload(this);
            });

        }
    };
    //获取插件参数
    $.fn.combogrid.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {
            //id标识
            idField: t.attr('idField'),
            //文本
            textField: t.attr('textField'),
            //远程地址
            url: t.attr('url'),
            //远程参数
            queryParams: (t.attr("queryParams") ? tojson(t.attr("queryParams")) : undefined)
        });
    };
    //插件默认参数
    $.fn.combogrid.defaults = $.extend({}, $.fn.combo.defaults, {

        //远程地址
        url: null,
        //本地数据
        localData: null,
        //远程参数
        queryParams: {},
        //检索模式（服务端加载用remote）
        queryMode: "local",
        //列取条数
        count: 10,
        //标识
        idField: null,
        //文本
        textField: null,
        //行标
        rownumbers: false,
        //列
        columns: null,
        //是否载入成功
        isLoad: false,
        //键盘操作
        keyHandler: {
            //上
            up: function () {
                selectPrev(this);
            },
            //下
            down: function () {
                selectNext(this);
            },
            //回车
            enter: function () {

                //验证数据
                checkData(this);

                var opts = $.data(this, 'combogrid').options;

                //得到值
                var data = $(this).combogrid('getSelected');

                if (data) {

                    //单击事件
                    opts.onSelect(data[opts.idField], data[opts.textField], data);
                }
            },
            //查询
            query: function (q) {
                doQuery(this, q);
            }
        },
        //当前选中
        onSelect: function () {

        },
        //检索
        filter: function (keyword, rowData) {

            var opts = $.data(this, 'combogrid').options;

            return rowData[opts.textField].indexOf(keyword) != -1;
        }
    });

})(jQuery);

/*
*   combotree — jQuery XGUI
*   made by：lv
*   Production in：2013-11-13
*   Last updated：2016-04-07
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'combotree').options;

        //form load时用
        $(target).addClass("combotree-f");

        //comb插件
        $(target).combo($.extend({}, opts, {
            //显示下拉列表时设置滚动条位置
            onShowPanel: function () {

                scrollTo(target, $(target).combotree('getValue'));
            }
        }));

        //载入数据
        reload(target);

        //设置初使值
        if (opts.value) {

            $(target).combotree("setValue", opts.value);
        }
    };

    //json转换
    function tojson(html) {

        return eval('(' + html + ')');
    }

    //载入数据
    function reload(target) {

        var opts = $.data(target, 'combotree').options;

        //插件载入开始
        opts.isLoad = false;

        if (opts.url != null) {

            xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                $.data(target, "combotree").data = o;

                //载入列表数据
                LoadList(target);

                //载入成功触发的事件
                opts.onLoadSuccess();

            });
        }
        else {

            //本地数据
            if (opts.localData != null) {

                $.data(target, "combotree").data = opts.localData;
            }

            //载入列表数据
            LoadList(target);

            //载入成功触发的事件
            opts.onLoadSuccess();
        }

    }

    //验证是否有子元素
    function CheckPID(target, PID) {

        var opts = $.data(target, 'combotree').options;

        var data = $.data(target, "combotree").data;

        for (i = 0; i < data.length; i++) {

            if (data[i][opts.parentID] == PID) {

                return true;
            }
        }

        return false;

    }

    //载入列表数据
    function LoadList(target) {

        var opts = $.data(target, 'combotree').options;

        var data = $.data(target, "combotree").data;

        var panel = $(target).combo('panel');

        //根据父ID得到数据(递归)  对象|父ID｜返回html｜空格数
        var htmld = "<ul>" + (GetDataForPID(target, 0, "", 0)) + "</ul>";

        //输出列表
        panel.find(".combo-panel").html(htmld);

        //事件
        BindEvent(target);

        //插件载入结束
        opts.isLoad = true;

    }

    //根据父ID得到数据  对象|父ID｜返回html｜空格数
    function GetDataForPID(target, PID, html, index) {

        var opts = $.data(target, 'combotree').options;

        var data = $.data(target, "combotree").data;

        //空格数
        index++;

        //新增(测试)
        if (data != null) {

            //行数据
            $.each(data, function (rowindex, rowdata) {

                //找出父ID数据
                if (rowdata[opts.parentID] == PID) {

                    //验证此数据下是否还有下级数据
                    var havechild = CheckPID(target, rowdata[opts.idField]);

                    html += "<li><div class=\"xgui-tree-node\" node-id=\"" + rowdata[opts.idField] + "\">";

                    //有下级
                    if (havechild) {

                        //增加空格
                        for (i = 0; i < index - 1; i++) {

                            html += "<span class=\"tree-indent\"></span>";
                        }

                        html += "<span class=\"tree-hit tree-expanded\"></span><span class=\"tree-folder tree-folder-open\"></span>";

                        //复选框
                        if (opts.checkbox) {

                            html += "<span class=\"tree-check\"><input type=\"checkbox\"></span>";
                        }
                    }
                        //没有下级
                    else {

                        //增加空格
                        for (i = 0; i < index; i++) {

                            html += "<span class=\"tree-indent\"></span>";
                        }

                        html += "<span class=\"tree-folder tree-folder-file\"></span>";

                        //复选框
                        if (opts.checkbox) {

                            html += "<span class=\"tree-check\"><input type=\"checkbox\"></span>";
                        }
                    }

                    html += "<span class=\"tree-title\">" + rowdata[opts.treeField] + "</span></div>";


                    //有下级
                    if (havechild) {

                        html += "<ul>";

                        //递归
                        html = GetDataForPID(target, rowdata[opts.idField], html, index);

                        html += "</ul>";
                    }

                    html += "</li>";

                }
            });

        }

        return html;

    }

    //设置滚动条位置
    function scrollTo(target, value) {

        value = $(target).combotree('getValue')

        var panel = $(target).combo('panel').find(".combo-panel");

        //得到项
        var item = panel.find(".xgui-tree-node[node-id='" + value + "']");

        if (item.length) {

            if (item.position().top <= 0) {
                var h = panel.scrollTop() + item.position().top;
                panel.scrollTop(h);
            } else {
                if (item.position().top + item.outerHeight() > panel.height()) {
                    var h = panel.scrollTop() + item.position().top
							+ item.outerHeight() - panel.height();
                    panel.scrollTop(h);
                }
            }
        }
    };

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'combotree').options;

        var data = $.data(target, "combotree").data;

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        //树节点事件
        panel.find('.xgui-tree-node').unbind(".combotree").
            //鼠标移上去事件
            bind('mouseenter.combotree', function () {
                $(this).addClass("xgui-tree-hover");
            }).
            //鼠标移除事件
            bind('mouseleave.combotree', function () {
                $(this).removeClass("xgui-tree-hover");
            }).
            //单击事件
            bind('click', function (e) {

                //非复选框（单选）并且除三角箭头之外
                if (!opts.checkbox && $(e.target).closest(".tree-hit").length == 0) {

                    //隐藏下拉列表
                    $(target).combo('hidePanel');

                    //设置选中项
                    $(target).combotree("setValue", $(this).attr("node-id"));

                    //单击事件
                    opts.onSelect($(this).attr("node-id"), $(this).find(".tree-title").text());
                }

            });

        //展开、隐藏事件
        panel.find(".tree-hit").unbind(".combotree").
            bind('click.combotree', function () {

                //判断状态
                if ($(this).hasClass("tree-expanded")) {

                    //改变三角箭头
                    $(this).removeClass("tree-expanded").addClass("tree-collapsed");

                    //改变文件夹图标
                    $(this).next(".tree-folder").removeClass("tree-folder-open").addClass("tree-folder-close");

                    //隐藏列表
                    $(this).parent("div").next("ul").hide();
                }
                else {

                    //改变三角箭头
                    $(this).removeClass("tree-collapsed").addClass("tree-expanded");

                    //改变文件夹图标
                    $(this).next(".tree-folder").removeClass("tree-folder-close").addClass("tree-folder-open");

                    //显示列表
                    $(this).parent("div").next("ul").show();

                }
            });

        //复选框单击事件
        panel.find('.tree-check input[type=checkbox]').unbind("click").
            //单击事件
            bind('click', function () {

                //移除选中样式
                panel.find(".xgui-tree-node").removeClass("xgui-tree-select");

                //设置选中样式
                $(this).parent("span").parent("div").addClass("xgui-tree-select");

                //得到多选项
                var datas = $(target).combotree("getSelections");

                if (datas.length > 0) {

                    var ids = []

                    for (i = 0; i < datas.length; i++) {

                        ids.push(datas[i][opts.idField]);
                    }

                    //设置多项选中
                    $(target).combotree("setValue", ids);
                }
                else {

                    //清除
                    $(target).combotree("clear");
                }

            });
    }

    $.fn.combotree = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.combotree.methods[options];

            if (method) {

                return method(this, param);

            } else {

                return this.combo(options, param);
            }
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'combotree');

            if (state) {
                //合并参数
                $.extend(state.options, options);

                $(this).combotree("reload");

            } else {

                //设置数据
                $.data(this, 'combotree', {
                    options: $.extend({},
                        $.fn.combotree.defaults,
                        $.fn.combotree.parseOptions(this),
                        options)
                });

                init(this);
            }
        });
    };

    //插件方法
    $.fn.combotree.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'combotree');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //得到数据
        getData: function (target) {

            return $.data(target[0], "combotree").data;
        },
        //清除
        clear: function (target) {

            return target.each(function () {

                var opts = $.data(this, 'combotree').options;

                var combo = $(this).combo('combo');

                var panel = $(this).combo('panel');

                //显示文本
                combo.find(".combo-text").val(opts.emptyCon);

                //赋值
                combo.find(".combo-value").val("");

                //清空复选框
                panel.find(".tree-check input[type=checkbox]").attr("checked", false);

                //移除选中样式
                panel.find(".xgui-tree-node").removeClass("xgui-tree-select");

            });
        },
        //设置值
        setValue: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'combotree').options;

                var combo = $(this).combo('combo');

                var panel = $(this).combo('panel');

                if (opts.isLoad) {

                    setValue();
                }
                else {

                    //一直侦听至到加载完成并完成setValue操作
                    var runtime = setInterval(function () {

                        if (opts.isLoad) {

                            //清除时间
                            window.clearInterval(runtime);

                            setValue();
                        }

                    }, 50);
                }

                //设置值
                function setValue() {

                    //多选赋值
                    if (opts.checkbox) {

                        var text = [];

                        //设置复选框选中
                        for (i = 0; i < param.length; i++) {

                            //得到项
                            var item = panel.find("div[node-id='" + param[i] + "']");

                            //设置复选框选中
                            item.find(".tree-check input[type=checkbox]").attr("checked", true);

                            //得到文本
                            text.push(item.children(".tree-title").text());

                        }

                        if (text.length == 0) {

                            return;
                        }

                        //显示文本
                        combo.find(".combo-text").val(text);

                        //赋值
                        combo.find(".combo-value").val(param);

                    }
                        //单一赋值
                    else {

                        //得到项
                        var item = panel.find("div[node-id='" + param + "']");

                        //显示文本
                        combo.find(".combo-text").val(item.children(".tree-title").text());

                        //赋值
                        combo.find(".combo-value").val(item.attr("node-id"));

                        //移除选中样式
                        panel.find(".xgui-tree-node").removeClass("xgui-tree-select");

                        //样式
                        item.addClass("xgui-tree-select");
                    }
                }

            });
        },
        //得到选中行
        getSelected: function (target) {

            var opts = $.data(target[0], 'combotree').options;

            var panel = $(target[0]).combo('panel');

            var data = $.data(target[0], "combotree").data;

            //节点ID
            var nodeid = panel.find(".xgui-tree-select").attr("node-id");

            var rowData;

            //行数据
            for (i = 0; i < data.length; i++) {

                //找出父ID数据
                if (data[i][opts.idField] == nodeid) {

                    rowData = data[i];
                    break;
                }
            };

            //返回数据
            return rowData;

        },
        //得到所有选中行数据(复选框)
        getSelections: function (target) {

            var opts = $.data(target[0], 'combotree').options;

            var data = $.data(target[0], "combotree").data;

            var combo = $(target[0]).combo('combo');

            var panel = $(target[0]).combo('panel');

            var datas = [];

            panel.find(".tree-check input:checked").each(function () {

                //节点ID
                var nodeid = parseInt($(this).parent("span").parent("div").attr("node-id"));

                //行数据
                $.each(data, function (a, b) {

                    //找出父ID数据
                    if (b[opts.idField] == nodeid) {

                        datas.push(b);
                    }
                });

            });

            return datas;

        },
        //得到文本
        getText: function (target) {

            var opts = $.data(target[0], 'combotree').options;

            var panel = $(target[0]).combo('panel');

            //得到选中项
            var item = panel.find(".xgui-tree-select");

            return item.children(".tree-title").text();

        },
        //得到值
        getValue: function (target) {

            var opts = $.data(target[0], 'combotree').options;

            var panel = $(target[0]).combo('panel');

            //得到选中项
            var item = panel.find(".xgui-tree-select");

            return item.attr("node-id") || "";
        },
        //刷新
        reload: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'combotree').options;

                //远程参数
                $.extend(opts.queryParams, param);

                $(this).combotree("clear");

                reload(this);
            });

        }

    };
    //获取插件参数
    $.fn.combotree.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {
            //ID标识
            idField: t.attr('idField'),
            //文本
            treeField: t.attr('treeField'),
            //父ID
            parentID: t.attr('parentID'),
            //复选框
            checkbox: t.attr('checkbox'),
            //远程地址
            url: t.attr('url'),
            //远程参数
            queryParams: (t.attr("queryParams") ? tojson(t.attr("queryParams")) : undefined)
        });
    };
    //插件默认参数
    $.fn.combotree.defaults = $.extend({}, $.fn.combo.defaults, {

        //可编辑
        editable: false,
        //远程数据
        url: null,
        //本地数据
        localData: null,
        //远程参数
        queryParams: {},
        //ID标识
        idField: null,
        //文本
        treeField: null,
        //父ID
        parentID: null,
        //复选框
        checkbox: false,
        //是否载入成功
        isLoad: false,
        //当前选中
        onSelect: function () {
        },
        //载入成功触发的事件
        onLoadSuccess: function () {
        }

    });


})(jQuery);

/*
*   tree — jQuery XGUI
*   made by：lv
*   Production in：2013-12-12
*   Last updated：2016-2-22
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'tree').options;

        //添加样式
        $(target).addClass("xgui-tree");

        //刷新数据
        reload(target);

    };

    //json转换
    function tojson(html) {

        return eval('(' + html + ')');
    }

    //验证是否有子元素
    function CheckPID(target, PID) {

        var opts = $.data(target, 'tree').options;

        var data = $.data(target, "tree").data;

        for (i = 0; i < data.length; i++) {

            if (data[i][opts.parentID] == PID) {

                return true;
            }
        }

        return false;

    }

    //根据父ID得到数据  对象|父ID｜返回html｜空格数
    function GetDataForPID(target, PID, html, index) {

        var opts = $.data(target, 'tree').options;

        var data = $.data(target, "tree").data;

        //空格数
        index++;

        //行数据
        $.each(data, function (rowindex, rowdata) {

            //找出父ID数据
            if (rowdata[opts.parentID] == PID) {

                var havechild = false;

                //异步加载
                if (opts.data != null) {

                    //是否有下级
                    havechild = rowdata["hasChildren"];
                }
                else {

                    //验证此数据下是否还有下级数据
                    havechild = CheckPID(target, rowdata[opts.idField]);
                }

                html += "<li><div class=\"xgui-tree-node\" node-id=\"" + rowdata[opts.idField] + "\">";

                //有下级
                if (havechild) {

                    //增加空格
                    for (i = 0; i < index - 1; i++) {

                        html += "<span class=\"tree-indent\"></span>";
                    }

                    //折叠
                    if (opts.data != null || rowdata["state"] == "close") {

                        html += "<span class=\"tree-hit tree-collapsed\"></span><span class=\"tree-folder tree-folder-close\"></span>";
                    }
                        //打开
                    else {

                        html += "<span class=\"tree-hit tree-expanded\"></span><span class=\"tree-folder tree-folder-open\"></span>";
                    }

                    //复选框
                    if (opts.checkbox) {

                        html += "<span class=\"tree-check\"><input type=\"checkbox\"></span>";
                    }
                }
                    //没有下级
                else {

                    //增加空格
                    for (i = 0; i < index; i++) {

                        html += "<span class=\"tree-indent\"></span>";
                    }

                    html += "<span class=\"tree-folder tree-folder-file\"></span>";

                    //复选框
                    if (opts.checkbox) {

                        html += "<span class=\"tree-check\"><input type=\"checkbox\"></span>";
                    }
                }

                html += "<span class=\"tree-title\">" + rowdata[opts.treeField] + "</span></div>";


                //有下级(非异步加载)
                if (havechild && opts.data == null) {

                    //折叠
                    if (rowdata["state"] == "close") {

                        html += "<ul style=\"display: none;\">";
                    }
                        //打开
                    else {

                        html += "<ul>";
                    }

                    //递归
                    html = GetDataForPID(target, rowdata[opts.idField], html, index);

                    html += "</ul>";
                }

                html += "</li>";

            }
        });

        return html;

    }

    //载入列表数据
    function LoadList(target) {

        var opts = $.data(target, 'tree').options;

        var data = $.data(target, "tree").data;

        //根据父ID得到数据(递归)  对象|父ID｜返回html｜空格数
        var htmld = "<ul>" + (GetDataForPID(target, 0, "", 0)) + "</ul>";

        //输出列表
        $(target).html(htmld);

        //事件
        BindEvent(target);

        //插件载入结束
        opts.isLoad = true;

    }

    //刷新数据
    function reload(target) {

        var opts = $.data(target, 'tree').options;

        //插件载入开始
        opts.isLoad = false;

        xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

            $.data(target, "tree").data = o;

            //载入列表数据
            LoadList(target);

            //载入成功触发的事件
            opts.onLoadSuccess();

        });

    }

    //载入子树
    function LoadChildren(target, row) {

        var opts = $.data(target, 'tree').options;

        //加载提示信息
        xgui.loading("show", opts.loadMsg);

        //载入远程数据
        if (opts.data != null) {

            var ID = $(row).attr("node-id");

            var query = $.extend({}, opts.queryParams, { ID: ID });

            xgui.Ajax(opts.data, query, "json", true, function (o) {

                //追加数据
                var data = $.data(target, "tree").data;

                $.each(o, function (rowindex, rowdata) {

                    data.push(rowdata);

                });

                //缩进几格
                var index = $(row).find(".tree-indent").length + 1;

                var html = "<ul>";

                //递归
                html = GetDataForPID(target, ID, html, index);

                html += "</ul>";

                $(row).after(html);


                //隐藏提示信息
                xgui.loading("hide");

                //绑定事件
                BindEvent(target);
            });

        }
        else {

            alert("错误");
        }
    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'tree').options;

        var data = $.data(target, "tree").data;

        //树节点事件
        $(target).find('.xgui-tree-node').unbind(".tree").
            //鼠标移上去事件
            bind('mouseenter.tree', function () {
                $(this).addClass("xgui-tree-hover");
            }).
            //鼠标移除事件
            bind('mouseleave.tree', function () {
                $(this).removeClass("xgui-tree-hover");
            }).
            //单击事件
            bind('click.tree', function (e) {

                //非复选框（单选）并且除三角箭头之外
                if (!opts.checkbox && $(e.target).closest(".tree-hit").length == 0) {

                    //设置选中项
                    $(target).tree("setValue", $(this).attr("node-id"));
                }

            });


        //复选框单击事件
        $(target).find('.tree-check input[type=checkbox]').unbind("click").
            //单击事件
            bind('click', function () {

                //移除选中样式
                $(target).find(".xgui-tree-node").removeClass("xgui-tree-select");

                //设置选中样式
                $(this).parent("span").parent("div").addClass("xgui-tree-select");

            });


        //展开、隐藏事件
        $(target).find(".tree-hit").unbind(".tree").
            bind('click.tree', function () {

                //判断状态
                if ($(this).hasClass("tree-expanded")) {

                    //改变三角箭头
                    $(this).removeClass("tree-expanded").addClass("tree-collapsed");

                    //改变文件夹图标
                    $(this).next(".tree-folder").removeClass("tree-folder-open").addClass("tree-folder-close");

                    //隐藏列表
                    $(this).parent("div").next("ul").hide();
                }
                else {

                    //改变三角箭头
                    $(this).removeClass("tree-collapsed").addClass("tree-expanded");

                    //改变文件夹图标
                    $(this).next(".tree-folder").removeClass("tree-folder-close").addClass("tree-folder-open");

                    //显示列表
                    $(this).parent("div").next("ul").show();

                    //异步加载
                    if (opts.data != null) {

                        var row = $(this).parent(".xgui-tree-node");

                        if (row.next("ul").length == 0) {

                            //载入子树
                            LoadChildren(target, $(row));
                        }
                    }

                }
            });


    }

    $.fn.tree = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.tree.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'tree');

            if (state) {
                //合并参数
                $.extend(state.options, options);

                $(this).tree("reload");

            } else {
                //设置数据
                $.data(this, 'tree', { options: $.extend({}, $.fn.tree.defaults, options) });

                init(this);
            }


        });
    };

    //插件方法
    $.fn.tree.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'tree');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //得到数据
        getData: function (target) {

            return $.data(target[0], "tree").data;
        },
        //设置值或设置多项值
        setValue: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'tree').options;

                var tree = $(this);

                //一直侦听至到加载完成并完成setValue操作
                var runtime = setInterval(function () {

                    if (opts.isLoad) {

                        //多选赋值
                        if (opts.checkbox) {

                            //过滤错误
                            if (!param || param.split(',').length == 0) {

                                //清除时间
                                window.clearInterval(runtime);

                                return;
                            }

                            var ids = param.split(',');

                            //设置复选框选中
                            for (i = 0; i < ids.length; i++) {

                                //得到项
                                var item = tree.find("div[node-id='" + ids[i] + "']");

                                //设置复选框选中
                                item.find(".tree-check input[type=checkbox]").attr("checked", true);

                            }

                            //清除时间
                            window.clearInterval(runtime);

                        }
                            //单一赋值
                        else {

                            //得到项
                            var item = tree.find("div[node-id='" + param + "']");

                            //移除选中样式
                            tree.find(".xgui-tree-node").removeClass("xgui-tree-select");

                            //设置选中样式
                            item.addClass("xgui-tree-select");

                            //清除时间
                            window.clearInterval(runtime);

                            //单击事件
                            opts.onSelect(param, item.children(".tree-title").text());
                        }

                    }

                }, 50);

            });
        },
        //得到选中行
        getSelected: function (target) {

            var opts = $.data(target[0], 'tree').options;

            var data = $.data(target[0], "tree").data;

            var tree = $(target[0]);

            //得到选中项
            var nodeid = tree.find(".xgui-tree-select").attr("node-id");

            var rowData;

            //行数据
            for (i = 0; i < data.length; i++) {

                //找出父ID数据
                if (data[i][opts.idField] == nodeid) {

                    rowData = data[i];
                    break;
                }
            };

            //返回数据
            return rowData;

        },
        //得到所有选中行数据(复选框)
        getSelections: function (target) {

            var opts = $.data(target[0], 'tree').options;

            var data = $.data(target[0], "tree").data;

            var tree = $(target[0]);

            var datas = [];

            tree.find(".tree-check input:checked").each(function () {

                //节点ID
                var nodeid = parseInt($(this).parent("span").parent("div").attr("node-id"));

                //行数据
                $.each(data, function (a, b) {

                    //找出父ID数据
                    if (b[opts.idField] == nodeid) {

                        datas.push(b);
                    }
                });

            });

            return datas;

        },
        //得到文本
        getText: function (target) {

            var opts = $.data(target[0], 'tree').options;

            var tree = $(target[0]);

            //得到选中项
            var item = tree.find(".xgui-tree-select");

            return item.children(".tree-title").text();

        },
        //得到值
        getValue: function (target) {

            var opts = $.data(target[0], 'tree').options;

            var tree = $(target[0]);

            //得到选中项
            var item = tree.find(".xgui-tree-select");

            return item.attr("node-id");
        },
        //刷新
        reload: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'tree').options;

                reload(this);

            });

        }

    };

    //插件默认参数
    $.fn.tree.defaults = {

        //远程数据
        url: null,
        //本地数据
        localData: null,
        //远程参数
        queryParams: {},
        //节点的数据加载(data不等于null为异步加载)
        data: null,
        //是否载入成功
        isLoad: false,
        //ID标识
        idField: null,
        //文本
        treeField: null,
        //父ID
        parentID: null,
        //复选框
        checkbox: false,
        //当前选中
        onSelect: function () {
        },
        //当远程数据加载成功是触发.
        onLoadSuccess: function () {
        }

    }


})(jQuery);

/*
*   searchbox — jQuery XGUI
*   made by：lv
*   Production in：2013-10-25
*   Last updated：2014-9-12
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'searchbox').options;

        //comb插件
        $(target).combo(opts);

        var combo = $(target).combo('combo');

        //移除存放值
        combo.addClass("searchbox").find(".combo-value").remove();

        BindEvent(target);
    };

    //json转换
    function tojson(html) {

        return eval('(' + html + ')');
    }

    //设置滚动条位置
    function scrollTo(target) {

        var panel = $(target).combo('panel').find(".combo-panel");

        //得到项
        var item = panel.find(".searchbox-item-hover");

        if (item.length) {

            if (item.position().top <= 0) {
                var h = panel.scrollTop() + item.position().top;
                panel.scrollTop(h);
            } else {
                if (item.position().top + item.outerHeight() > panel.height()) {
                    var h = panel.scrollTop() + item.position().top
							+ item.outerHeight() - panel.height();
                    panel.scrollTop(h);
                }
            }
        }
    };

    //上
    function selectPrev(target) {

        var opts = $.data(target, 'searchbox').options;

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        //是否启用远程查询
        if (!opts.url) {

            //隐藏下拉列表
            $(target).combo('hidePanel');

            return;
        }

        //显示下拉列表
        $(target).combo('showPanel');

        //item项
        var item = panel.find(".searchbox-item");

        if (item.length > 0) {

            //当前hover项
            var Itemhover = panel.find(".searchbox-item-hover");

            //当前选中项的位置
            var index = item.index(Itemhover);

            //返回最后一项
            if (index <= 0) {

                index = item.length;
            }

            //得到项
            var ptem = panel.find(".searchbox-item:eq(" + (index - 1) + ")");

            //设置文本
            combo.find(".combo-text").val(ptem.text());

            //设置样式
            ptem.addClass("searchbox-item-hover").siblings().removeClass("searchbox-item-hover");

            //设置滚动条
            scrollTo(target);

        }
    }

    //下
    function selectNext(target) {

        var opts = $.data(target, 'searchbox').options;

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        //是否启用远程查询
        if (!opts.url) {

            //隐藏下拉列表
            $(target).combo('hidePanel');

            return;
        }

        //显示下拉列表
        $(target).combo('showPanel');

        //item项
        var item = panel.find(".searchbox-item");

        if (item.length > 0) {

            //当前hover项
            var Itemhover = panel.find(".searchbox-item-hover");

            //当前选中项的位置
            var index = item.index(Itemhover);

            //返回第一项
            if (index + 1 >= item.length) {

                index = -1;
            }

            //得到项
            var ptem = panel.find(".searchbox-item:eq(" + (index + 1) + ")");

            //设置文本
            combo.find(".combo-text").val(ptem.text());

            //设置样式
            ptem.addClass("searchbox-item-hover").siblings().removeClass("searchbox-item-hover");

            //设置滚动条
            scrollTo(target);
        }
    }

    //查询
    function doQuery(target, q) {

        var opts = $.data(target, 'searchbox').options;

        var panel = $(target).combo('panel');

        var htmld = "";

        //是否启用远程查询
        if (!opts.url) {

            //隐藏下拉列表
            $(target).combo('hidePanel');

            return;
        }

        if ($.trim(q) != "") {

            $.extend(opts.queryParams, { keyword: q, count: opts.count });

            xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                $.data(target, "searchbox").data = o;

                $.each(o, function (a, b) {

                    htmld += "<div class=\"searchbox-item\">" + b[opts.textField] + "</div>";
                });

                //输出列表
                panel.find(".combo-panel").html(htmld);

                //事件
                BindEvent(target);

            });

        }
        else {

            //输出列表
            panel.find(".combo-panel").html("");

            //隐藏下拉列表
            $(target).combo('hidePanel');
        }

    }

    //回车
    function enter(target) {

        var opts = $.data(target, 'searchbox').options;

        var combo = $(target).combo('combo');

        $(target).combo('hidePanel');

        var text = combo.find(".combo-text").val();

        if ($.trim(text) != "" && $.trim(text) != opts.emptyCon) {

            //执行onselect事件
            opts.onSelect(text);
        }
        else {

            xgui.msgtip("请输入关键字！", "warn");
        }
    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'searchbox').options;

        var data = $.data(target, "searchbox").data;

        //combo
        var combo = $(target).combo('combo');

        //输入框
        var input = combo.find('.combo-text');

        //图标
        var arrow = combo.find('.combo-arrow');

        //下拉列表
        var panel = $(target).combo('panel');

        //下拉列表项事件
        panel.find(".searchbox-item").unbind(".searchbox").
            //鼠标单击事件
            bind("click.searchbox", function () {

                //隐藏panel
                $(target).combo('hidePanel');

                //设置文本
                combo.find(".combo-text").val($(this).text());

                //单击事件
                opts.onSelect($(this).text());

            }).
            //鼠标移上去事件
            bind("mouseenter.searchbox", function () {

                $(this).addClass("searchbox-item-hover");

            }).
            //鼠标移除事件
            bind("mouseleave.searchbox", function () {

                $(this).removeClass("searchbox-item-hover");
            });

        //解除combo插件中的combo事件
        combo.unbind(".combo");

        //解除其它事件

        //输入框
        input.unbind(".searchbox").

            //单击事件
            bind("click.searchbox", function () {

                if (panel.is(":visible")) {

                    //隐藏panel
                    $(target).combo('hidePanel');

                } else {

                    //隐藏所有panel
                    $("div.panel").hide();

                    //是否启用远程查询
                    if (opts.url) {

                        //显示panel
                        $(target).combo('showPanel');
                    }
                }

            });

        //搜索图标
        arrow.unbind(".searchbox").

            bind("click.searchbox", function () {

                enter(target);
            });

    }

    $.fn.searchbox = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.searchbox.methods[options];

            if (method) {

                return method(this, param);

            } else {

                return this.combo(options, param);
            }

        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'searchbox');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {

                //设置数据
                $.data(this, 'searchbox', {
                    options: $.extend({},
                        $.fn.searchbox.defaults,
                        $.fn.searchbox.parseOptions(this),
                        options)
                });

                init(this);
            }
        });
    };

    //插件方法
    $.fn.searchbox.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'searchbox');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //清除
        clear: function (target) {

            return target.each(function () {

                var opts = $.data(this, 'searchbox').options;

                var combo = $(this).combo('combo');

                //显示文本
                combo.find(".combo-text").val(opts.emptyCon);

            });
        },
        //设置值
        setValue: function (target, param) {

            return target.each(function () {

                var combo = $(this).combo('combo');

                //显示文本
                combo.find(".combo-text").val(param);
            });
        }

    };
    //获取插件参数
    $.fn.searchbox.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {
            //文本
            textField: t.attr('textField'),
            //列取条数
            count: t.attr('count'),
            //远程地址
            url: t.attr('url'),
            //远程参数
            queryParams: (t.attr("queryParams") ? tojson(t.attr("queryParams")) : undefined)
        });
    };
    //插件默认参数
    $.fn.searchbox.defaults = $.extend({}, $.fn.combo.defaults, {

        //远程数据
        url: null,
        //远程参数
        queryParams: {},
        //文本
        textField: "text",
        //列取条数
        count: 10,
        //键盘操作
        keyHandler: {
            //上
            up: function () {
                selectPrev(this);
            },
            //下
            down: function () {
                selectNext(this);
            },
            //回车
            enter: function () {

                enter(this);
            },
            //查询
            query: function (q) {
                doQuery(this, q);
            }
        },
        //当前选中
        onSelect: function () {
        }

    });


})(jQuery);

/*
*   datebox — jQuery XGUI
*   made by：lv
*   Production in：2013-11-13
*   Last updated：2017-11-04
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'datebox').options;

        //form load时用
        $(target).addClass("datebox-f");

        //comb插件
        $(target).combo($.extend({}, opts, {

            //显示下拉列表时解除其默认的document事件
            onShowPanel: function () {

                //解除combo的默认事件
                $(document).unbind('.combo');

                //绑定自定义事件
                $(document).unbind('.datebox').
                    bind('mousedown.datebox', function (e) {

                        //单击非datebox窗体外隐藏
                        if ($(e.target).closest(".xgui-datebox-d").length == 0) {

                            //验证数据
                            checkData(target);
                        }
                    });
            }
        }));


        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        combo.addClass("datebox");

        //设置panel大小
        panel.find(".combo-panel").css({ "width": 230, "height": "auto" });

        var datebox = panel.find(".combo-panel").addClass("xgui-datebox-d");

        //输出基本框架
        datebox.html("<div class=\"xgui-datebox-header\"></div><table class=\"xgui-datebox-body\"></table>");

        //输出头部
        datebox.find(".xgui-datebox-header").html("<a class=\"xgui-datebox-prev\" title=\"上一月\"><span class=\"xgui-datebox-prev-icon\"></span></a><a class=\"xgui-datebox-next\" title=\"下一月\"><span class=\"xgui-datebox-next-icon\"></span></a><div class=\"xgui-datebox-title\"><select class=\"xgui-datebox-year\"></select>年<select class=\"xgui-datebox-month\"></select></div></div>");

        //输出星期
        datebox.find(".xgui-datebox-body").html("<thead><tr><th><span title=\"星期日\">日</span></th><th><span title=\"星期一\">一</span></th><th><span title=\"星期二\">二</span></th><th><span title=\"星期三\">三</span></th><th><span title=\"星期四\">四</span></th><th><span title=\"星期五\">五</span></th><th><span title=\"星期六\">六</span></th></tr></thead><tbody></tbody");

        //时间
        datebox.append('<div class="xgui-datebox-bottom"><span class="xgui-datebox-time"><span class="combo"><span class="combo-text"><span><em contenteditable="true" type="h">00</em><i>:</i></span><span><em contenteditable="true" type="m">00</em><i>:</i></span><span><em class="time-select" contenteditable="true" type="s">00</em></span></span><span href="javascript:;" class="xgui-datebox-time-arrow"><a href="javascript:;" class="spinner-arrow-up" tabindex="-1"></a><a href="javascript:;" class="spinner-arrow-down" tabindex="-1"></a></span></span></span><div class="xgui-datebox-btn"><span class="xgui-datebox-btn-today">今天</span><span class="xgui-datebox-btn-ok">确定</span></div></div>');

        //日期型（移除时间部分）
        if (DateType(opts.format) == 1) {

            //移除时间选择
            datebox.find(".xgui-datebox-bottom").remove();
        }

        //时间型（移除日期部分）
        if (DateType(opts.format) == 3) {

            //移除日期
            //头部
            datebox.find(".xgui-datebox-header").remove();

            //主体
            datebox.find(".xgui-datebox-body").remove();

            //添加时间样式
            datebox.find(".xgui-datebox-bottom").addClass("xgui-datebox-date-time");

            //更改按钮文字
            datebox.find(".xgui-datebox-btn-today").html("现在");
        }

        //带分钟，不带秒
        if (TimeType(opts.format) == 1) {

            //时间部分
            var timecombo = datebox.find(".xgui-datebox-bottom .combo-text");

            //移除分钟这里的冒号
            timecombo.find("span:eq(1) i").remove();

            //设置分钟选中
            timecombo.find("span:eq(1) em").addClass("time-select");

            //移除秒数
            timecombo.find("span:eq(2)").remove();
        }

        //初使化日期数据
        initDate(target);

        //设置值
        if (opts.value) {

            $(target).datebox("setValue", opts.value);
        }
    };

    //得到日期类型  日期型1，日期型带时间2，时间型3
    function DateType(format) {

        //有小时与分钟
        if (format.indexOf('hh') > -1) {

            //日期型
            if (format.indexOf('yyyy') > -1) {

                return 2;
            }
                //时间型
            else {

                return 3;
            }
        }
        else {
            return 1;
        }
    }

    //得到时间类型  没有分钟0，小时带分钟1，带秒数2
    function TimeType(format) {

        //没有分钟
        if (format.indexOf('hh') == -1) {

            return 0;
        }
        else {

            //带秒数
            if (format.indexOf(':ss') > -1) {

                return 2;
            }
                //小时带分钟
            else {
                return 1;
            }
        }
    }

    //补齐位数
    function ConNumber(value) {

        if (value < 10) {

            return "0" + value;
        }
        return value;
    }

    //初使化日期数据
    function initDate(target) {

        var opts = $.data(target, 'datebox').options;

        //当前的时间对象
        var date = new Date();

        //日期
        if (DateType(opts.format) == 1 || DateType(opts.format) == 2) {

            //当前年
            var year = date.getFullYear();

            //当前月
            var month = date.getMonth();

            //创建年
            CreateYear(target, year);

            //创建月份
            CreateMonth(target, month);

            //创建天数
            CreateDay(target, year, month);

            //创建时间
            CreateTime(target, date);
        }
            //时间
        else {

            //创建时间
            CreateTime(target, date);

            //绑定事件
            BindEvent(target);
        }
    }

    //创建日期(天数)
    function CreateDay(target, year, month) {

        year = parseInt(year);

        month = parseInt(month);

        var panel = $(target).combo('panel');

        var html = "";

        //计算一个月有几天;
        var daysOfMonth = DaysForMonth(year, month + 1);

        //计算这个月的第一天是星期几
        var firstDayOfMonth = FirstDayPosition(year, month);

        //星期天为7(将0改7)
        firstDayOfMonth == 0 ? firstDayOfMonth = 7 : "";

        //天计数
        var count = 1;

        outer:
            for (var i = 1; i < 7; i++) {

                html += "<tr>";

                //输出单元格
                for (var j = 1; j <= 7; j++) {

                    //输出空格(星期天开始的，所以加1)
                    if (i == 1 && j < firstDayOfMonth + 1) {

                        html += "<td class=\"xgui-datebox-disabled\">&nbsp;</td>";
                    }
                        //输出每日
                    else {

                        //标注今天
                        if (new Date().getFullYear() == year && new Date().getMonth() === month && new Date().getDate() === count) {

                            html += "<td data-year=\"" + year + "\" data-month=\"" + ConNumber(month) + "\" data-day=\"" + ConNumber(count) + "\"><a href=\"javascript:;\" class=\"xgui-datebox-default xgui-datebox-highlight\">" + count + "</a></td>";
                        }
                        else {

                            html += "<td data-year=\"" + year + "\" data-month=\"" + ConNumber(month) + "\" data-day=\"" + ConNumber(count) + "\"><a href=\"javascript:;\" class=\"xgui-datebox-default\">" + count + "</a></td>";
                        }

                        count++;

                        //大于月几天则跳出outer循环
                        if (count > daysOfMonth) {

                            break outer;
                        }

                    }
                }

                html += "</tr>";

            }

        //输出
        panel.find(".xgui-datebox-body tbody").html(html);

        //绑定事件
        BindEvent(target);
    }

    //创建年下拉列表
    function CreateYear(target, year) {

        var opts = $.data(target, 'datebox').options;

        var panel = $(target).combo('panel');

        var html = "";

        //opts.Interval  与当前年前后间隔
        for (i = 0; i <= opts.Interval * 2; i++) {

            var y = (year - opts.Interval) + i;

            html += "<option value=\"" + y + "\">" + y + "</option>";

        }

        //输出年份
        panel.find(".xgui-datebox-year").html(html);

        //设置选中项
        panel.find(".xgui-datebox-year").val(year);

    }

    //创建月份下拉列表
    function CreateMonth(target, month) {

        var panel = $(target).combo('panel');

        var html = "<option value=\"0\">一月</option><option value=\"1\">二月</option><option value=\"2\">三月</option><option value=\"3\">四月</option><option value=\"4\">五月</option><option value=\"5\">六月</option><option value=\"6\">七月</option><option value=\"7\">八月</option><option value=\"8\">九月</option><option value=\"9\">十月</option><option value=\"10\">十一月</option><option value=\"11\">十二月</option>";

        //输出
        panel.find(".xgui-datebox-month").html(html);

        //设置选中项
        panel.find(".xgui-datebox-month").val(month);

    }

    //创建时间
    function CreateTime(target, date) {

        var opts = $.data(target, 'datebox').options;

        //有时间
        if (TimeType(opts.format) > 0) {

            var panel = $(target).combo('panel');

            var h = date.getHours();

            var m = date.getMinutes();

            var s = date.getSeconds();

            //小时
            panel.find(".combo-text em:eq(0)").html(ConNumber(h));

            //分钟
            panel.find(".combo-text em:eq(1)").html(ConNumber(m));

            //秒数
            panel.find(".combo-text em:eq(2)").html(ConNumber(s));
        }
    }

    //计算一个月有多少天
    function DaysForMonth(year, month) {

        var days = (new Date(+(new Date(year, month, 1)) - 86400000)).getDate();

        return days;
    }

    //计算这个月的第一天是星期几
    function FirstDayPosition(year, month) {

        return new Date(year, month, 1).getDay();
    }

    //日期格式化属性
    function Dateformat(date, format) {

        var o =
        {
            //月
            "M+": date.getMonth() + 1,
            //天
            "d+": date.getDate(),
            //小时
            "h+": date.getHours(),
            //分钟
            "m+": date.getMinutes(),
            //秒数
            "s+": date.getSeconds(),
            //季
            "q+": Math.floor((date.getMonth() + 3) / 3),
            //毫秒
            "S": date.getMilliseconds()
        }
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }

    //验证数据
    function checkData(target) {

        var opts = $.data(target, 'datebox').options;

        //下拉列表
        var panel = $(target).combo('panel');

        //得到值
        var value = $(target).datebox('getValue');

        if (value) {

            //设置值
            $(target).datebox('setValue', value);
        }
        else {

            //清除
            $(target).datebox('clear');
        }

        //隐藏下拉列表
        $(target).combo('hidePanel');

        //解除绑定
        $(document).unbind('.datebox');
    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'datebox').options;

        var combo = $(target).combo('combo');

        var panel = $(target).combo('panel');

        //解除combo中panel的事件(年份及月份下拉不能用)
        panel.unbind("mousedown");

        //解除combo中panel的事件(年份及月份下拉不能用)
        //panel.unbind("mousedown").bind("mousedown", function (e) {

        //    //单击非select外
        //    if ($(e.target).closest("select").length == 0) {

        //        //return false;
        //    }
        //});

        //绑定上一月
        panel.find(".xgui-datebox-prev").unbind(".datebox").
            bind("click.datebox", function () {

                //年
                var year = parseInt(panel.find(".xgui-datebox-year").val());

                //月
                var month = parseInt(panel.find(".xgui-datebox-month").val());

                if (month != 0) {

                    panel.find(".xgui-datebox-month").val(month - 1);
                }
                else {

                    //重设年份下拉表
                    CreateYear(target, year - 1);

                    //设置月份
                    panel.find(".xgui-datebox-month").val(11);
                }

                //刷新日期
                CreateDay(target, panel.find(".xgui-datebox-year").val(), panel.find(".xgui-datebox-month").val());
            });

        //绑定下一月
        panel.find(".xgui-datebox-next").unbind(".datebox").
            bind("click.datebox", function () {

                //年
                var year = parseInt(panel.find(".xgui-datebox-year").val());

                //月
                var month = parseInt(panel.find(".xgui-datebox-month").val());

                if (month != 11) {

                    panel.find(".xgui-datebox-month").val(month + 1);
                }
                else {

                    //重设年份下拉表
                    CreateYear(target, year + 1);

                    //设置月份
                    panel.find(".xgui-datebox-month").val(0);
                }

                //刷新日期
                CreateDay(target, panel.find(".xgui-datebox-year").val(), panel.find(".xgui-datebox-month").val());
            });

        //绑定年下拉事件
        panel.find(".xgui-datebox-year").unbind(".datebox").
            bind("change.datebox", function () {

                //重设年份下拉表
                CreateYear(target, $(this).val());

                //年
                var year = panel.find(".xgui-datebox-year").val();

                //月
                var month = panel.find(".xgui-datebox-month").val();

                //刷新日期
                CreateDay(target, year, month);

            });

        //绑定月下拉事件
        panel.find(".xgui-datebox-month").unbind(".datebox").
            bind("change.datebox", function () {

                //年
                var year = panel.find(".xgui-datebox-year").val();

                //月
                var month = panel.find(".xgui-datebox-month").val();

                //刷新日期
                CreateDay(target, year, month);

            });

        //日期选择
        panel.find(".xgui-datebox-default").unbind(".datebox").
            //单击事件
            bind("click.datebox", function () {

                //移除选中样式
                panel.find(".xgui-datebox-default").removeClass("xgui-datebox-select");

                //设置样式选中
                $(this).addClass("xgui-datebox-select");

                //日期型
                if (DateType(opts.format) == 1) {

                    //单击事件
                    opts.onSelect($(target).datebox("getValue"));

                    //数据验证
                    checkData(target);
                }
            }).
            //鼠标移入事件
            bind("mouseenter.datebox", function () {

                $(this).addClass("xgui-datebox-hover");

            }).
            //鼠标移出事件
            bind("mouseleave.datebox", function () {

                $(this).removeClass("xgui-datebox-hover");

            });

        //今天/现在
        panel.find(".xgui-datebox-btn-today").unbind(".datebox").
            bind("click.datebox", function () {

                //当前时间
                var curdate = Dateformat(new Date(), opts.format);

                //设置值
                $(target).datebox('setValue', curdate);

                //单击事件
                opts.onSelect($(target).datebox("getValue"));

                //隐藏下拉列表
                $(target).combo('hidePanel');

                //解除绑定
                $(document).unbind('.datebox');
            });

        //确定
        panel.find(".xgui-datebox-btn-ok").unbind(".datebox").
            bind("click.datebox", function () {

                var date1 = $(target).datebox('getValue');

                //有值
                if (date1) {

                    //数据验证
                    checkData(target);

                    //单击事件
                    opts.onSelect($(target).datebox("getValue"));
                }
                    //没有值
                else {

                    //设置今天值
                    panel.find(".xgui-datebox-btn-today").click();
                }
            });

        //时间事件
        panel.find(".combo-text em").unbind(".datebox").
            //聚焦
            bind("focus.datebox", function () {
                panel.find(".combo-text em").removeClass("time-select");

                $(this).addClass("time-select");
            }).
            //失去焦点
            bind("blur.datebox", function () {

                //类别
                var type = $(this).attr("type");

                //值
                var val = $(this).text();

                //截取下字符串（解决数字过长有问题）
                val = val.substring(0, 4);

                //过虑值
                var rval = parseInt(val.replace(/[^0-9]/g, '') || 0);

                //去掉符号
                $(this).html((rval < 10 ? "0" + rval : rval));

                //小时
                if (type == "h") {

                    if (parseInt(rval) > 23 || parseInt(rval) < 0) {

                        $(this).html("00");
                    }
                }
                    //分钟
                else if (type == "m") {

                    if (parseInt(rval) > 59 || parseInt(rval) < 0) {

                        $(this).html("00");
                    }
                }
                    //秒
                else {

                    if (parseInt(rval) > 59 || parseInt(rval) < 0) {

                        $(this).html("00");
                    }
                }
            });

        //加
        panel.find(".spinner-arrow-up").unbind(".datebox").
            bind("click.datebox", function () {

                //当前选中项
                var item = panel.find(".combo-text .time-select");

                //时间类别
                var type = item.attr("type");

                //小时
                if (type == "h") {

                    //加一小时
                    ChangeTime(target, 3600);
                }
                    //分钟
                else if (type == "m") {

                    //加一分钟
                    ChangeTime(target, 60);
                }
                    //秒
                else {

                    //加一秒
                    ChangeTime(target, 1);
                }
            });

        //减
        panel.find(".spinner-arrow-down").unbind(".datebox").
            bind("click.datebox", function () {

                //当前选中项
                var item = panel.find(".combo-text .time-select");

                //时间类别
                var type = item.attr("type");

                //小时
                if (type == "h") {

                    //减一小时
                    ChangeTime(target, -3600);
                }
                    //分钟
                else if (type == "m") {

                    //减一分钟
                    ChangeTime(target, -60);
                }
                    //秒
                else {

                    //减一秒
                    ChangeTime(target, -1);
                }
            });
    }

    //改变时间 对象  |  秒数
    function ChangeTime(target, second) {

        var opts = $.data(target, 'datebox').options;

        var panel = $(target).combo('panel');

        //当前时间
        var val = $(target).datebox("setValue");

        //小时项
        var hitem = panel.find(".combo-text em[type=h]");

        //分钟项
        var mitem = panel.find(".combo-text em[type=m]");

        //秒项
        var sitem = panel.find(".combo-text em[type=s]");

        var hs = parseInt(hitem.text() || 0) * 60 * 60;
        var ms = parseInt(mitem.text() || 0) * 60;
        var ss = parseInt(sitem.text() || 0);

        //总秒数
        var sum = hs + ms + ss + parseInt(second);

        var newtime = formatSeconds(sum);

        var array = newtime.split(":");

        //设置小时
        hitem.html(array[0]);

        //设置分钟
        mitem.html(array[1]);

        //设置秒数
        sitem.html(array[2]);
    }

    //秒数转换成小时
    function formatSeconds(value) {

        //设置23点59分59秒
        if (value < 0) {

            value = 86399;
        }
        //设置0点
        if (value >= 86400) {

            value = 0;
        }

        // 秒
        var theTime = parseInt(value);

        // 分
        var theTime1 = 0;

        // 小时
        var theTime2 = 0;

        if (theTime >= 60) {

            //分钟
            theTime1 = parseInt(theTime / 60);

            //秒数
            theTime = parseInt(theTime % 60);

            if (theTime1 >= 60) {

                //小时
                theTime2 = parseInt(theTime1 / 60);

                //秒数
                theTime1 = parseInt(theTime1 % 60);
            }
        }

        //小时
        var result = ConNumber(parseInt(theTime2)) + ":";

        //分钟
        result += ConNumber(parseInt(theTime1)) + ":";

        //秒
        result += ConNumber(parseInt(theTime));

        return result;
    }

    $.fn.datebox = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.datebox.methods[options];

            if (method) {

                return method(this, param);

            } else {

                return this.combo(options, param);
            }
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'datebox');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {

                //设置数据
                $.data(this, 'datebox', {
                    options: $.extend({},
                        $.fn.datebox.defaults,
                        $.fn.datebox.parseOptions(this),
                        options)
                });

                init(this);
            }
        });
    };

    //获取插件参数
    $.fn.datebox.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {

            //格式化
            format: t.attr('format')
        });
    };

    //插件方法
    $.fn.datebox.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'datebox');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //清除
        clear: function (target) {
            return target.each(function () {

                var opts = $.data(this, 'datebox').options;

                var combo = $(this).combo('combo');

                //显示文本
                combo.find(".combo-text").val(opts.emptyCon);

                //赋值
                combo.find(".combo-value").val("");

                //初使化日期数据
                initDate(this);
            });
        },
        //设置值
        setValue: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'datebox').options;

                var combo = $(this).combo('combo');

                var panel = $(this).combo('panel');

                //是否有值
                if (!param) {

                    return;
                }

                try {

                    var date = param.replace("-", "/");

                    //时间
                    if (DateType(opts.format) == 3) {

                        //当前时间
                        var curdate = Dateformat(new Date(), "yyyy/MM/dd");

                        date = new Date((curdate + " " + date));
                    }
                        //日期
                    else {

                        date = new Date(date);
                    }

                    //不是日期类型
                    if (date == "Invalid Date" || date == "NaN") {

                        return;
                    }

                    var o =
                        {
                            "Y": date.getFullYear(),
                            //月
                            "M": date.getMonth(),
                            //天
                            "d": date.getDate(),
                            //小时
                            "h": date.getHours(),
                            //分钟
                            "m": date.getMinutes(),
                            //秒数
                            "s": date.getSeconds()
                        }

                    //设置值
                    combo.find(".combo-text,.combo-value").val(param);

                    //时间
                    if (DateType(opts.format) == 3) {

                        //小时
                        panel.find(".combo-text em:eq(0)").html(ConNumber(o.h));

                        //分钟
                        panel.find(".combo-text em:eq(1)").html(ConNumber(o.m));

                        //秒数
                        panel.find(".combo-text em:eq(2)").html(ConNumber(o.s));
                    }
                        //日期
                    else {

                        //重设年份下拉表
                        CreateYear(this, o.Y);

                        //月下拉列表
                        panel.find(".xgui-datebox-month").val(o.M);

                        //设置表格
                        CreateDay(this, o.Y, o.M);

                        //设置选中
                        panel.find("td[data-year=" + ConNumber(o.Y) + "][data-month=" + ConNumber(o.M) + "][data-day=" + ConNumber(o.d) + "]").children("a").addClass("xgui-datebox-select");

                        //日期型带时间
                        if (DateType(opts.format) == 2) {

                            //小时
                            panel.find(".combo-text em:eq(0)").html(ConNumber(o.h));

                            //分钟
                            panel.find(".combo-text em:eq(1)").html(ConNumber(o.m));

                            //秒数
                            panel.find(".combo-text em:eq(2)").html(ConNumber(o.s));

                        }
                    }

                } catch (e) {

                    return;
                }
            });
        },
        //得到值
        getValue: function (target) {

            var opts = $.data(target[0], 'datebox').options;

            var panel = $(target[0]).combo('panel');

            //时间
            if (DateType(opts.format) == 3) {

                //小时
                var t1 = panel.find(".combo-text em:eq(0)").text() || "00";

                //分钟
                var t2 = panel.find(".combo-text em:eq(1)").text() || "00";

                var Time = t1 + ":" + t2;

                //秒数
                if (TimeType(opts.format) == 2) {

                    Time += ":" + panel.find(".combo-text em:eq(2)").text() || "00";
                }

                return Time;
            }
                //日期
            else {

                var item = panel.find(".xgui-datebox-select").parent("td");

                if (item.length > 0) {

                    //年
                    var year = item.attr("data-year");

                    //月
                    var month = parseInt(item.attr("data-month")) + 1;

                    month = ConNumber(month);

                    //日
                    var day = item.attr("data-day");

                    var Time = year + "/" + month + "/" + day;

                    //带时间
                    if (DateType(opts.format) == 2) {

                        //小时
                        var t1 = panel.find(".combo-text em:eq(0)").text() || "00";

                        //分钟
                        var t2 = panel.find(".combo-text em:eq(1)").text() || "00";

                        //秒数
                        var t3 = panel.find(".combo-text em:eq(2)").text() || "00";

                        Time += " " + t1 + ":" + t2;

                        //秒数
                        if (TimeType(opts.format) == 2) {

                            Time += ":" + panel.find(".combo-text em:eq(2)").text() || "00";
                        }
                    }

                    return Dateformat(new Date(Time), opts.format);
                }
                return "";
            }
        }

    };

    //插件默认参数
    $.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {

        //年份间隔条数
        Interval: 30,
        //格式化
        //format: "yyyy-MM-dd hh:mm:ss",
        format: "yyyy-MM-dd",
        //键盘操作
        keyHandler: {
            //上
            up: function () {

            },
            //下
            down: function () {

            },
            //回车
            enter: function () {

                //数据验证
                checkData(this);
            },
            //查询
            query: function (q) {

                //设置值
                $(this).datebox("setValue", q);
            }
        },
        //当前选中
        onSelect: function () {
        }

    });


})(jQuery);

/*
*   HighlightInput — jQuery XGUI
*   made by：lv
*   Production in：2014-1-11
*   Last updated：2014-9-12
*/
(function ($) {

    //初使化
    function init(target) {

        var opts = $.data(target, 'HighlightInput').options;

        //设置内容
        if ($(target).val() == "") {

            $(target).val(opts.emptyCon)
        }

        if (opts.blurColor) {

            //初使化失去聚焦样式
            $(target).css("color", opts.blurColor);
        }

        //初使化边框
        if (opts.mode == "EmptyAndBorder" || opts.mode == "Border") {

            //设置文字和边框样式
            $(target).css({ "border": "1px solid " + opts.blurborderColor });
        }

        //绑定事件
        BindEvent(target);

    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'HighlightInput').options;

        $(target).unbind(".HighlightInput").
            //聚焦时
            bind("focus.HighlightInput", function () {

                if (opts.focusColor) {

                    //设置文字聚焦样式
                    $(this).css("color", opts.focusColor);
                }

                //清空内容
                if (opts.mode == "Empty" || opts.mode == "EmptyAndBorder") {

                    //改变内容
                    if ($(this).val() == opts.emptyCon) {

                        $(this).val("");
                    }
                }
                //改变边框颜色
                if (opts.mode == "Border" || opts.mode == "EmptyAndBorder") {

                    //设置文字和边框样式
                    $(this).css({ "border": "1px solid " + opts.focusborderColor });
                }

            }).
            //失去焦点时
            bind("blur.HighlightInput", function () {

                if (opts.blurColor) {

                    //设置失去聚焦样式
                    $(this).css("color", opts.blurColor);
                }

                //设置内容
                if (opts.mode == "Empty" || opts.mode == "EmptyAndBorder") {

                    //改变内容
                    if ($(this).val() == "") {

                        $(this).val(opts.emptyCon);
                    }
                }
                //改变边框颜色
                if (opts.mode == "Border" || opts.mode == "EmptyAndBorder") {

                    //设置文字和边框样式
                    $(this).css({ "border": "1px solid " + opts.blurborderColor });
                }

            });
    }

    // 插件
    $.fn.HighlightInput = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.HighlightInput.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'HighlightInput');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {

                //设置数据
                $.data(this, 'HighlightInput', {
                    options: $.extend({},
                        $.fn.HighlightInput.defaults,
                        options)
                });

                init(this);
            }
        });
    };

    // 默认值
    $.fn.HighlightInput.defaults = {

        //模式（Empty、Border、EmptyAndBorder）
        mode: "Empty",

        //聚焦时文字颜色
        focusColor: "#292929",

        //失去焦点时文字颜色
        blurColor: "#aba9a9",

        //聚焦时边框颜色
        focusborderColor: "#3eb3fe",

        //失去焦点时边框颜色
        blurborderColor: "#d7d7d7",

        //为空时内容
        emptyCon: "高亮文本插件！"

    }


})(jQuery);

/*
*   commentbox — jQuery XGUI
*   made by：lv
*   Production in：2014-4-10
*   Last updated：2014-11-23
*/
(function ($) {

    //创建
    function create(target) {

        var wrap = $('<div class="xgui-comment-box"><div class="comment-content"><div class="comment-text" contenteditable="true"></div><div class="comment-number"><span id="current-length">0</span>/<span id="max-length">500</span></div></div><div class="comment-footer clearfix"><div class="comment-toolbar"><a class="toolbar-item item-emotion js-emotion" title="插入表情"><i class="toolbar-icon icon-emotion"></i>表情</a></div><div class="comment-opt"><a href="javascript:;" class="toolbar-btn green">发表</a></div></div></div>');

        return wrap;
    }

    //json转换
    function tojson(html) {

        return eval('(' + html + ')');
    }

    //隐藏
    function hide(target) {

        var opts = $.data(target, 'commentbox').options;

        var wrap = $.data(target, 'commentbox').wrap;

        var value = $(target).commentbox("getValue");

        if (value == "") {

            //setTimeout修复单击document先执行表情移除
            //setTimeout(function () {

            //绑定移除事件
            opts.hideEvent(target);

            wrap.remove();

            //解除document绑定事件
            $(document).unbind('.commentbox');

            //}, 1);

        }

    }

    //统计文字长度
    function getStrLength(str) {
        var len = str.length;
        var reLen = 0;
        for (var i = 0; i < len; i++) {
            if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
                // 全角    
                reLen += 2;
            } else {
                reLen++;
            }
        }
        return reLen;
    }

    //设置字数
    function setNumber(target) {

        var wrap = $.data(target, 'commentbox').wrap;

        var value = $(target).commentbox("getValue");

        //转换为中文除2
        var len = parseInt(getStrLength(value) / 2);

        //开始长度
        wrap.find("#current-length").html(len);
    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'commentbox').options;

        var wrap = $.data(target, 'commentbox').wrap;

        var content = wrap.find(".comment-text");

        //文本聚焦
        content.focus();

        //开始长度
        wrap.find("#current-length").html(0);

        //最大长度
        wrap.find("#max-length").html(opts.maxlength);

        //鼠标按下事件,阻止冒泡document事件
        wrap.unbind(".commentbox").
            //鼠标按下事件
            bind('mousedown.commentbox', function (e) {

                e.stopPropagation();
            });

        //字数统计
        content.unbind(".commentbox").
            //键按下时
            bind("keyup.commentbox", function () {

                //设置字数
                setNumber(target);

            });

        //绑定表情按钮
        wrap.find(".js-emotion").emotion({

            //输出容器
            container: content,
            //输出类型
            outtype: "html",
            top: 6
        });

        //绑定发表按钮
        wrap.find(".toolbar-btn").unbind(".commentbox").
            //单击事件
            bind("click.commentbox", function () {

                //按钮
                var btn = $(this);

                var value = $(target).commentbox("getValue");

                //长度检测
                if (!$(target).commentbox("isValid")) {

                    return;
                }

                //回复某人数据
                var data = wrap.find(".comment-text").find("button");

                if (data[0]) {

                    //远程参数
                    $.extend(opts.queryParams, tojson(data.attr("data")));
                }

                //数据参数(转义内容换行)
                var parm = "{" + opts.name + ":'" + value.replace(/[\r\n]+/g, '\\n') + "'}";

                //远程参数（内容）
                $.extend(opts.queryParams, tojson(parm));

                if (opts.url != null) {

                    xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                        opts.Success(target, o);

                    }, function () {

                        xgui.alert("提交失败！", "warn");

                    }, function () {

                        //禁用按钮
                        //App.disableAtag(btn);

                    }, function () {

                        //启用按钮
                        //App.enableAtag(btn);
                    });
                }
                else {

                    xgui.alert("请绑定url地址！", "warn");
                }
            });

        //自动隐藏
        if (opts.autoHide) {

            //绑定document单击事件
            $(document).unbind('.commentbox').
                bind('mousedown.commentbox', function (e) {

                    //隐藏对象
                    $(target).commentbox("hideWrap");
                });
        }
    }

    $.fn.commentbox = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.commentbox.methods[options];

            if (method) {

                return method(this, param);

            }
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'commentbox');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {

                //创建
                var wrap = create(this);

                //设置数据
                $.data(this, 'commentbox', {

                    options: $.extend({},
                        $.fn.commentbox.defaults,
                        $.fn.commentbox.parseOptions(this),
                        options
                        ), wrap: wrap
                });
            }
        });
    };

    //插件方法
    $.fn.commentbox.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'commentbox');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //返回对象
        wrap: function (target) {

            return $.data(target[0], 'commentbox').wrap;
        },
        //绑定显示事件
        showEvent: function (target) {

            return target.each(function () {

                BindEvent(this);
            });
        },
        //隐藏对象
        hideWrap: function (target) {

            return target.each(function () {

                hide(this);
            });
        },
        //清除
        clear: function (target) {

            return target.each(function () {

                var wrap = $.data(this, 'commentbox').wrap;

                wrap.find("#current-length").html(0);

                wrap.find(".comment-text").html("");
            });

        },
        //得到值
        getValue: function (target) {

            var wrap = $.data(target[0], 'commentbox').wrap;

            var text = wrap.find(".comment-text");

            //复制一份数据
            var data = text.clone();

            //移除回复某人块 button
            data.find("button.mention").remove();

            var value = data.html();

            //有回复某人块并且回复某人块后的第一个是空格
            if (text.find("button.mention")[0] && value.substring(0, 6) == "&nbsp;") {

                value = value.substr(6, value.length);
            }

            return value;

            //去除html标签
            //str = str.replace(/<[^>].*?>/g,""); 
        },
        //设置值
        setValue: function (target, param) {

            return target.each(function () {

                var wrap = $.data(this, 'commentbox').wrap;

                //使用表情插件设置值
                wrap.find(".js-emotion").emotion("setValue", param);

                //设置字数
                setNumber(this);

            });

        },
        //合法性验证
        isValid: function (target) {

            var opts = $.data(target[0], 'commentbox').options;

            var value = $(target[0]).commentbox("getValue");

            //内容检测
            if (value == "") {

                xgui.msgtip("请输入内容！", "warn");
                return false;
            }

            //转换为中文除2
            var len = parseInt(getStrLength(value) / 2);

            //长度检测
            if (len > opts.maxlength) {

                xgui.msgtip("长度过长！", "warn");
                return false;
            }

            return true;
        }

    };
    //获取插件参数
    $.fn.commentbox.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {

            //远程地址
            url: t.attr('url'),
            //远程参数
            queryParams: (t.attr("queryParams") ? tojson(t.attr("queryParams")) : undefined)
        });
    };
    //插件默认参数
    $.fn.commentbox.defaults = $.extend({}, $.fn.combo.defaults, {

        //远程数据
        url: null,
        //文本name名称
        name: "content",
        //远程参数
        queryParams: {},
        //长度(最长)
        maxlength: 500,
        //自动隐藏（单击非评论框外）
        autoHide: true,
        //提交成功
        Success: function (o) {
        },
        //隐藏事件
        hideEvent: function () {

        }

    });


})(jQuery);

/*
*   emotion — jQuery XGUI
*   made by：lv
*   Production in：2014-11-17
*   Last updated：2014-11-23
*/
(function ($) {

    //初使化
    function init(target) {

        var opts = $.data(target, 'emotion').options;

        //容器
        var wrap = $('<div class="xgui-emotion"><div class="xgui-emotion-header"><div class="category-tab"></div><div class="category-page"><a href="javascript:;"class="pager-prev"title="上一页">&laquo;</a><a href="javascript:;"class="pager-next"title="下一页">&raquo;</a></div></div><div class="xgui-emotion-container"></div><div class="xgui-emotion-page"></div></div>');

        $.data(target, 'emotion').wrap = wrap;

        // 分组
        var category = new Array();

        //表情
        var emotion = new Array();

        //数据字典
        var Dictionary = new Hashtable();

        //使用settimeout解决ie发送jsonp时不起作用
        setTimeout(function () {

            xgui.Ajax(opts.url, "", "jsonp", true, function (response) {

                var data = response.data;

                for (var i in data) {

                    if (data[i].category == '') {
                        data[i].category = '默认';
                    }
                    if (emotion[data[i].category] == undefined) {
                        emotion[data[i].category] = new Array();
                        category.push(data[i].category);
                    }
                    emotion[data[i].category].push({
                        name: data[i].phrase,
                        icon: data[i].icon
                    });

                    Dictionary.put(data[i].phrase, data[i].icon);
                }

                //commentbox会产生错误(评论框先移除则会产生错误)
                try {

                    //数据
                    $.data(target, "emotion").data = Dictionary;

                    //分类
                    $.data(target, "emotion").category = category;

                    //表情
                    $.data(target, "emotion").emotion = emotion;
                }
                catch (e) {

                    //alert(e.message);
                }

            });

        }, 1);

        //绑定文本框事件
        $(opts.container).unbind(".emotion").
            //解盘弹起与鼠标弹起事件
            bind("keyup.emotion mouseup.emotion", function () {

                //设置range
                getRange(target);
            }).
            //粘贴事件
            bind("paste.emotion", function (e) {

                //文本框对象为div
                if (getType(this) == 'div') {

                    var pastedText = undefined;

                    // IE
                    if (window.clipboardData && window.clipboardData.getData) {

                        pastedText = window.clipboardData.getData('Text');

                    }
                        //google
                    else {

                        //e.clipboardData.getData('text/plain');
                        pastedText = e.originalEvent.clipboardData.getData('Text');
                    }

                    //插入文本
                    insertText(target, pastedText);

                    return false;
                }

            });

        //对象
        $(target).unbind(".emotion").
            //鼠标按下事件
            bind("mousedown.emotion", function () {

                return false;
            }).
            //单击事件
            bind("click.emotion", function () {

                if ($(".xgui-emotion")[0]) {

                    //设置位置
                    setPosition(target);

                    return;
                }

                $("body").append(wrap);

                //显示分类
                Category(target);

                //显示表情
                Emotion(target);

                //设置位置
                setPosition(target);

                //绑定事件
                BindEvent(target);
            });

    }

    //hashtable
    function Hashtable() {

        this._hash = new Object();
        this.put = function (key, value) {
            if (typeof (key) != "undefined") {
                if (this.containsKey(key) == false) {
                    this._hash[key] = typeof (value) == "undefined" ? null : value;
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        this.remove = function (key) { delete this._hash[key]; }
        this.size = function () { var i = 0; for (var k in this._hash) { i++; } return i; }
        this.get = function (key) { return this._hash[key]; }
        this.containsKey = function (key) { return typeof (this._hash[key]) != "undefined"; }
        this.clear = function () { for (var k in this._hash) { delete this._hash[k]; } }
    }

    //分类
    function Category(target) {

        var opts = $.data(target, 'emotion').options;

        //分类
        var category = $.data(target, "emotion").category;

        //容器
        var wrap = $.data(target, 'emotion').wrap;

        //清空分类
        wrap.find(".category-tab").html('');

        for (var i = (opts.sortIndex - 1) * 5; i < opts.sortIndex * 5 && i < category.length; i++) {

            wrap.find(".category-tab").append($('<a href="javascript:;">' + category[i] + '</a>'));
        }

        //设置当前项选中
        wrap.find('.category-tab a').each(function () {

            if ($(this).text() == opts.sortName) {

                $(this).addClass('current');
            }
        });

    }

    //表情
    function Emotion(target) {

        var opts = $.data(target, 'emotion').options;

        //表情
        var emotion = $.data(target, "emotion").emotion

        //容器
        var wrap = $.data(target, 'emotion').wrap;

        //表情容器
        wrap.find('.xgui-emotion-container').html('');

        //分页容器
        wrap.find('.xgui-emotion-page').html('');

        //表情
        for (var i = (opts.pageIndex - 1) * 72; i < opts.pageIndex * 72 && i < emotion[opts.sortName].length; ++i) {

            wrap.find('.xgui-emotion-container').append($('<a href="javascript:;" class="emotion-item" title="' + emotion[opts.sortName][i].name + '"><img src="' + emotion[opts.sortName][i].icon + '" alt="' + emotion[opts.sortName][i].name + '" /></a>'));
        }

        //分页
        for (var i = 1; i < emotion[opts.sortName].length / 72 + 1; ++i) {

            wrap.find('.xgui-emotion-page').append($('<a href="javascript:;"' + (i == opts.pageIndex ? ' class="current"' : '') + '>' + i + '</a>'));
        }

    }

    //根据文本得到表情
    function getImg(target, text) {

        var opts = $.data(target, 'emotion').options;

        var data = $.data(target, "emotion").data

        var img = "";

        var sArr = text.match(/\[.*?\]/g);

        for (var i = 0; i < sArr.length; i++) {

            if (data.containsKey(sArr[i])) {

                var reStr = "<img src=\"" + data.get(sArr[i]) + "\" class=\"emoticon\" height=\"22\" width=\"22\" />";

                img = text.replace(sArr[i], reStr);

                break;
            }
        }

        return img;

    }

    //设置位置
    function setPosition(target) {

        var opts = $.data(target, 'emotion').options;

        //容器
        var wrap = $.data(target, 'emotion').wrap;

        var left = opts.left + $(target).offset().left;

        var top = opts.top + $(target).offset().top + $(target).outerHeight();

        $(wrap).css({ "display": "block", "left": left, "top": top });
    }

    //设置range range操作
    function getRange(target) {

        var opts = $.data(target, 'emotion').options;

        var t = $(opts.container)[0];

        t.focus();

        //IE(记录range)
        if (document.all) {

            //获取光标
            opts.range = document.selection.createRange();

        }
            //google(记录光标起始位置)
        else {

            //文本框对象为div
            if (getType(t) == 'div') {

                //得到光标位置
                opts.range = window.getSelection().getRangeAt(0);
            }
                //input、textarea
            else {

                //设置光标起始位置
                opts.start = getStart(t);
            }
        }

    }

    //得到光标位置(google) range操作
    function getStart(container) {

        var t = $(container)[0];

        //文本框对象为text或textarea
        if (t.selectionStart || t.selectionStart == '0') {

            return t.selectionStart;

        }
            //文本框对象为div
        else if (window.getSelection) {

            var rng = window.getSelection().getRangeAt(0).cloneRange();

            rng.setStart(t, 0);

            return rng.toString().length;
        }
    }

    //得到选中时的文本(未使用，以后其它地方可用) range操作
    function getSelectText(target) {

        var opts = $.data(target, 'emotion').options;

        //ie
        if (document.all) {
            var r = document.selection.createRange();
            document.selection.empty();
            return r.text;
        }
            //google
        else {

            //文本框对象
            var t = $(opts.container)[0];

            if (t.selectionStart || t.selectionStart == '0') {

                var text = getType(t) == 'div' ? $(t).html() : $(t).val();

                return text.substring(t.selectionStart, t.selectionEnd);
            }
            else if (window.getSelection) {

                return window.getSelection().toString()
            };
        }
    }

    //得到文本框对象类型 range操作
    function getType(container) {

        var tagName = container.tagName.toLowerCase();

        return tagName;
    }

    //插入文本 range操作
    function insertText(target, text) {

        var opts = $.data(target, 'emotion').options;

        //检测是否有range
        if (opts.range == null) {

            getRange(target);
        }

        //文本框对象
        var t = $(opts.container)[0];

        t.focus();

        //IE
        if (document.all) {

            //文本框对象为div
            if (getType(t) == 'div') {

                document.selection.empty();
                opts.range.pasteHTML(text);
                opts.range.collapse();
                opts.range.select();
            }
                //input、textarea
            else {

                document.selection.empty();
                opts.range.text = text;
                opts.range.collapse();
                opts.range.select();
            }
        }
            //google
        else {

            //文本框对象为div
            if (getType(t) == 'div') {

                //this.element.innerHTML = this.element.innerHTML.substr(0, this.start) + text + this.element.innerHTML.substr(this.start);

                opts.range.collapse(false);

                node = opts.range.createContextualFragment(text);

                //获得DocumentFragment的末尾位置
                var c = node.lastChild;

                opts.range.insertNode(node);

                if (c) {

                    //设置末尾位置  
                    opts.range.setEndAfter(c);

                    opts.range.setStartAfter(c)
                }
                var j = window.getSelection();

                //清除range
                j.removeAllRanges();

                //设置range 
                j.addRange(opts.range);

            }
                //文本框对象为input或textarea
            else {

                var value = $(t).val().substr(0, opts.start) + text + $(t).val().substr(opts.start);

                //设置值
                $(t).val(value);

                //设置光标位置
                opts.start = t.selectionStart = t.selectionEnd = opts.start + text.length;
            };
        }
    }

    //移除表情
    function remove(target) {

        //commentbox会产生错误(评论框先移除则会产生错误)
        try {

            var wrap = $.data(target, 'emotion').wrap;

            wrap.remove();
        }
        catch (e) {

            $(".xgui-emotion").remove();
        }

        //解除document绑定事件
        $(document).unbind('.emotion');

    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'emotion').options;

        var wrap = $.data(target, 'emotion').wrap;

        //分类
        var category = $.data(target, "emotion").category;

        //插件
        wrap.unbind(".emotion").
            bind("mousedown.emotion", function () {

                return false;
            });

        //分类上一页
        wrap.find(".pager-prev").unbind(".emotion").
            //单击事件
            bind('click.emotion', function (e) {

                if (opts.sortIndex > 1) {

                    opts.sortIndex -= 1;

                    //显示分类
                    Category(target);

                    //绑定事件
                    BindEvent(target);
                }
            });

        //分类下一页
        wrap.find(".pager-next").unbind(".emotion").
            //单击事件
            bind('click.emotion', function (e) {

                if (opts.sortIndex < category.length / 5) {

                    opts.sortIndex += 1;

                    //显示分类
                    Category(target);

                    //绑定事件
                    BindEvent(target);
                }
            });

        //绑定单击分类
        wrap.find('.category-tab a').unbind(".emotion").
            //单击事件
            bind("click.emotion", function () {

                //添加当前样式
                $(this).siblings().removeClass("current");

                $(this).addClass('current');

                //表情定位到第一页
                opts.pageIndex = 1;

                //分类名
                opts.sortName = $(this).text();

                //显示表情
                Emotion(target);

                //绑定事件
                BindEvent(target);
            });

        //绑定单击表情事件
        wrap.find('.emotion-item').unbind(".emotion").
            //单击事件
            bind("click.emotion", function () {

                var tit = $(this).attr('title');

                //插入文本
                if (opts.outtype == "text") {

                    insertText(target, tit);
                }
                    //插入html
                else {

                    insertText(target, getImg(target, tit));
                }

                //移除
                remove(target);
            });

        //单击分页事件
        wrap.find('.xgui-emotion-page a').unbind(".emotion").
            //单击事件
            bind("click.emotion", function () {

                opts.pageIndex = $(this).text();

                Emotion(target);

                //绑定事件
                BindEvent(target);
            });

        //绑定document单击事件
        $(document).unbind('.emotion').
            bind('mousedown.emotion', function (e) {

                //移除
                remove(target);
            });

    }

    $.fn.emotion = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.emotion.methods[options];

            if (method) {

                return method(this, param);
            }
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'emotion');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {

                //设置数据
                $.data(this, 'emotion', {

                    options: $.extend({}, $.fn.emotion.defaults, options)
                });

                //初使化
                init(this);
            }
        });
    };

    //插件方法
    $.fn.emotion.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'emotion');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }
        },
        //设置值
        setValue: function (target, param) {

            return target.each(function () {

                insertText(this, param);
            });
        }

    };

    //插件默认参数
    $.fn.emotion.defaults = $.extend({

        //远程数据
        url: "https://api.weibo.com/2/emotions.json?source=1362404091",
        //分类当前页
        sortIndex: 1,
        //分类名称
        sortName: "默认",
        //表情当前页
        pageIndex: 1,
        //容器
        container: null,
        //输出类型(text、html)
        outtype: "text",
        //range
        range: null,
        //光标起始位置
        start: 0,
        //左边距离(额外增加)
        left: 0,
        //顶部距离(额外增加)
        top: 0

    });


})(jQuery);

/*
*   inputcontainer — jQuery XGUI
*   made by：lv
*   Production in：2014-4-16
*   Last updated：2014-12-8
*/
(function ($) {

    //创建
    function create(target) {

        var wrap = $('<span class="xgui-input-container"><span class="input-wrap"><input type="text" class="input-text" /><span class="input-number"><span class="current-length">0</span>/<span class="max-length">500</span></span></span><a href="javascript:;" class="line-yellow input-confirm">确定</a><a href="javascript:;" class="input-cancel">取消</a><span class="input-tips" style="display:none;"><i class="icon"></i></span></span>');

        return wrap;
    }

    //json转换
    function tojson(html) {

        return eval('(' + html + ')');
    }

    //隐藏
    function hide(target) {

        var opts = $.data(target, 'inputcontainer').options;

        var wrap = $.data(target, 'inputcontainer').wrap;

        //隐藏提示框
        wrap.find(".input-tips").html("").hide();

        //清除数据
        $(target).inputcontainer("clear");

        //绑定移除事件
        opts.hideEvent(target);

        //移除插件
        wrap.remove();

        //解除document绑定事件
        $(document).unbind('.inputcontainer');

    }

    //统计文字长度
    function getStrLength(str) {
        var len = str.length;
        var reLen = 0;
        for (var i = 0; i < len; i++) {
            if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
                // 全角    
                reLen += 2;
            } else {
                reLen++;
            }
        }
        return reLen;
    }

    //设置字数
    function setNumber(target) {

        var wrap = $.data(target, 'inputcontainer').wrap;

        var value = $(target).inputcontainer("getValue");

        //转换为中文除2
        var len = parseInt(getStrLength(value) / 2);

        //开始长度
        wrap.find(".current-length").html(len);
    }

    //提交
    function submit(target) {

        var opts = $.data(target, 'inputcontainer').options;

        //按钮
        //var btn = $(target);

        var value = $(target).inputcontainer("getValue");

        //合法性验证
        if (!$(target).inputcontainer("isValid")) {

            return;
        }

        //值不相等则提交
        if (opts.queryParams[opts.name] != value) {

            //数据参数
            var parm = "{" + opts.name + ":'" + value + "'}";

            //远程参数（内容）
            $.extend(opts.queryParams, tojson(parm));

            if (opts.url != null) {

                xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

                    opts.Success(target, o);

                }, function () {

                    xgui.alert("提交失败！", "warn");

                }, function () {

                    //禁用按钮
                    //App.disableAtag(btn);

                }, function () {

                    //启用按钮
                    //App.enableAtag(btn);
                });
            }
            else {

                xgui.alert("请绑定url地址！", "warn");
            }
        }
        else {

            opts.Success(target);
        }
    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'inputcontainer').options;

        var wrap = $.data(target, 'inputcontainer').wrap;

        var content = wrap.find(".input-text");

        //文本聚焦
        content.focus();

        //开始长度
        wrap.find(".current-length").html(0);

        //最大长度
        wrap.find(".max-length").html(opts.maxlength);

        //是否显示操作按钮
        if (!opts.button) {
            wrap.find(".input-confirm").remove();
            wrap.find(".input-cancel").remove();
        }

        //插件框宽度
        wrap.find(".input-wrap").outerWidth(opts.width);

        //文本框宽度
        content.outerWidth(opts.width - (opts.width - wrap.find(".input-wrap").width()) - wrap.find(".input-number").outerWidth());

        //提示框宽度
        wrap.find(".input-tips").outerWidth(wrap.find(".input-wrap").outerWidth());

        //鼠标按下事件,阻止冒泡document事件
        wrap.unbind(".inputcontainer").
            //鼠标按下事件
            bind('mousedown.inputcontainer', function (e) {

                e.stopPropagation();
            });

        //字数统计
        content.unbind(".inputcontainer").
            //键按下时
            bind("keyup.inputcontainer", function () {

                //设置字数
                setNumber(target);

                //合法性验证
                $(target).inputcontainer("isValid");
            });

        //绑定确定按钮
        wrap.find(".input-confirm").unbind(".inputcontainer").
            //单击事件
            bind("click.inputcontainer", function () {

                //合法性验证
                if ($(target).inputcontainer("isValid")) {

                    //提交
                    submit(target);

                    //隐藏对象
                    $(target).inputcontainer("hideWrap");
                }
            });

        //绑定取消按钮
        wrap.find(".input-cancel").unbind(".inputcontainer").
            //单击事件
            bind("click.inputcontainer", function () {

                //隐藏对象
                $(target).inputcontainer("hideWrap");
            });

        //绑定document单击事件
        $(document).unbind('.inputcontainer').
            bind('mousedown.inputcontainer', function (e) {

                //合法性验证
                if ($(target).inputcontainer("isValid")) {

                    //提交
                    submit(target);

                    //隐藏对象
                    $(target).inputcontainer("hideWrap");
                }
            });

    }

    $.fn.inputcontainer = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.inputcontainer.methods[options];

            if (method) {

                return method(this, param);
            }
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'inputcontainer');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {

                //创建
                var wrap = create(this);

                //设置数据
                var j = $.data(this, 'inputcontainer', {

                    options: $.extend({},
                        $.fn.inputcontainer.defaults,
                        $.fn.inputcontainer.parseOptions(this),
                        options
                        ), wrap: wrap
                });
            }
        });
    };

    //插件方法
    $.fn.inputcontainer.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'inputcontainer');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //返回对象
        wrap: function (target) {

            return $.data(target[0], 'inputcontainer').wrap;
        },
        //绑定显示事件
        showEvent: function (target) {

            return target.each(function () {

                BindEvent(this);
            });
        },
        //隐藏对象
        hideWrap: function (target) {

            return target.each(function () {

                hide(this);
            });
        },
        //清除
        clear: function (target) {

            return target.each(function () {

                var wrap = $.data(this, 'inputcontainer').wrap;

                wrap.find(".current-length").html(0);

                wrap.find(".input-text").val("");
            });

        },
        //得到值
        getValue: function (target) {

            var wrap = $.data(target[0], 'inputcontainer').wrap;

            var text = wrap.find(".input-text");

            return text.val();
        },
        //设置值
        setValue: function (target, value) {

            return target.each(function () {

                var opts = $.data(this, 'inputcontainer').options;

                var wrap = $.data(this, 'inputcontainer').wrap;

                var text = wrap.find(".input-text");

                //数据参数
                var parm = "{" + opts.name + ":'" + value + "'}";

                //远程参数（内容）
                $.extend(opts.queryParams, tojson(parm));

                //设置内容
                text.val(value);

                //设置字数
                setNumber(this);
            });

        },
        //合法验证
        isValid: function (target) {

            var opts = $.data(target[0], 'inputcontainer').options;

            var wrap = $.data(target[0], 'inputcontainer').wrap;

            var value = $(target[0]).inputcontainer("getValue");

            //转换为中文除2
            var len = parseInt(getStrLength(value) / 2);

            //内容检测
            if (value == "") {

                wrap.find(".input-tips").html("请输入内容！").show();

                xgui.msgtip("请输入内容！", "warn");

                return false;
            }

            //长度检测
            if (len > opts.maxlength) {

                wrap.find(".input-tips").html("长度过长！").show();

                xgui.msgtip("长度过长！", "warn");

                return false;
            }

            wrap.find(".input-tips").html("").hide();

            return true;
        }

    };
    //获取插件参数
    $.fn.inputcontainer.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {

            //远程地址
            url: t.attr('url'),
            //远程参数
            queryParams: (t.attr("queryParams") ? tojson(t.attr("queryParams")) : undefined)
        });
    };
    //插件默认参数
    $.fn.inputcontainer.defaults = $.extend({}, $.fn.combo.defaults, {

        //远程数据
        url: null,
        //文本name名称
        name: "content",
        //插件宽度
        width: 200,
        //远程参数
        queryParams: {},
        //长度(最长)
        maxlength: 20,
        //是否显示按钮
        button: true,
        //提交成功
        Success: function (o) {
        },
        //隐藏事件
        hideEvent: function () {

        }

    });


})(jQuery);

/*
*   divtext — jQuery XGUI
*   made by：lv
*   Production in：2013-12-12
*   Last updated：2016-03-04
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'divtext').options;

        //添加框
        $(target).addClass("xgui-divtext clearfix");

        //输出input输入框
        $(target).html("<div class=\"div-input\"><input type=\"text\" class=\"js-input\"><span class=\"js-text\"></span></div>");

        //设置panel
        var panel = $('<ul class="xgui-divtext-list" style="display:none;"></ul>').appendTo('body');

        $.data(target, 'divtext').panel = panel;

        //设置宽
        $(target).outerWidth(opts.width);

        //绑定事件
        BindEvent(target);

    };

    //查询
    function doQuery(target, keyword) {

        var opts = $.data(target, 'divtext').options;

        var panel = $.data(target, 'divtext').panel

        var html = "";

        if ($.trim(keyword) == "") {

            panel.html("");

            //隐藏下拉列表
            panel.hide();

            return;
        }

        //合并参数
        $.extend(opts.queryParams, { keyword: keyword, count: opts.count });

        xgui.Ajax(opts.url, opts.queryParams, "json", true, function (o) {

            $.data(target, "divtext").data = o;

            if (o.length > 0) {

                $.each(o, function (a, b) {

                    html += "<li class=\"list-item\"><a class=\"list-text\" value=\"" + b[opts.idField] + "\">" + b[opts.textField] + "</a></li>";

                });

                //输出列表
                panel.html(html);

                //设置列表位置
                SetListPostion(target);

                //设置第一项选中

                //第一项
                var firstItem = panel.find(".list-item:first");

                //设置样式
                firstItem.addClass("list-item-hover").siblings().removeClass("list-item-hover");

                //显示下拉列表
                panel.show();

                //事件
                BindEvent(target);

            }
            else {

                panel.html("");

                //隐藏下拉列表
                panel.hide();
            }

        });

    }

    //设置下拉列表位置
    function SetListPostion(target) {

        var panel = $.data(target, 'divtext').panel

        var obj = $(target).offset();

        var left = $(target).find(".js-input").offset().left;

        var top = obj.top + $(target).outerHeight();

        panel.css({ "left": left, "top": top });

    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'divtext').options;

        var data = $.data(target, "divtext").data;

        var panel = $.data(target, 'divtext').panel

        var timer = null;

        //插件事件
        $(target).unbind(".divtext").
            //单击事件(使输入框聚焦)
            bind("click.divtext", function (e) {

                //单击非Item项外的且在插件里的
                if ($(e.target).closest(".div-item").length == 0) {

                    //输入框聚焦
                    $(this).find(".js-input").focus();
                }

            });

        //输入框事件
        $(target).find(".js-input").unbind(".divtext").

            //键盘弹起与按下时
            bind("keyup.divtext keydown.divtext", function (e) {

                //关键字
                var keyword = $(this).val();

                //设置js-text值从而得到它的宽度
                $(this).next(".js-text").text(keyword + "xgui");

                //设置input宽
                $(target).find(".div-input").width($(this).next(".js-text").width());
            }).
            //键盘按下时
            bind("keydown.divtext", function (e) {

                //back键
                if (e.keyCode == 8) {

                    //关键字
                    var keyword = $(this).val();

                    if ($.trim(keyword) == "") {

                        //最后一项
                        var lastitem = $(target).find(".div-item:last");

                        if (lastitem[0]) {

                            lastitem.addClass("div-item-select");

                            $(this).blur();

                            //绑定document事件
                            BindDoc(target);

                            return false;
                        }
                    }
                }

                //回车
                if (e.keyCode == 13) {

                    return false;
                }
            }).
            //键盘弹起时
            bind("keyup.divtext", function (e) {

                //关键字
                var keyword = $(this).val();

                //li项
                var liItem = panel.find(".list-item");

                //设置input宽
                $(target).find(".div-input").width($(this).next(".js-text").width());

                switch (e.keyCode) {
                    case 38:  // 上

                        if (liItem.length > 0) {

                            //当前hover项
                            var Itemhover = panel.find(".list-item-hover");

                            //当前hover项的位置
                            var index = liItem.index(Itemhover);

                            //返回最后一项
                            if (index <= 0) {

                                index = liItem.length;
                            }

                            //得到应该选中的li项
                            var sItem = panel.find(".list-item:eq(" + (index - 1) + ")");

                            //设置hover样式
                            sItem.addClass("list-item-hover").siblings().removeClass("list-item-hover");
                        }

                        break;
                    case 40:  // 下

                        if (liItem.length > 0) {

                            //当前hover项
                            var Itemhover = panel.find(".list-item-hover");

                            //当前hover项在列表中的位置
                            var index = liItem.index(Itemhover);

                            //返回第一项
                            if (index + 1 >= liItem.length) {

                                index = -1;
                            }

                            //得到应该选中的li项
                            var sItem = panel.find(".list-item:eq(" + (index + 1) + ")");

                            //设置样式
                            sItem.addClass("list-item-hover").siblings().removeClass("list-item-hover");
                        }

                        break;
                    case 13:  // 回车
                        e.preventDefault();

                        checkData(target);

                        return false;
                    case 8: //删除

                        //var itemd = $(target).find(".div-item");

                        //if ($.trim(keyword) == "" && itemd.length > 0) {

                        //    itemd.eq(itemd.length - 1).addClass("div-item-select");

                        //    $(this).blur();

                        //    //绑定document事件
                        //    BindDoc(target);
                        //}

                        //break;
                    default:

                        //查询
                        if (timer) {

                            clearTimeout(timer);
                        }
                        timer = setTimeout(function () {

                            //查询
                            doQuery(target, keyword);

                        }, opts.delay);

                }

            }).
            //文本框失去焦点时
            bind("blur.divtext", function () {

                checkData(target);

            });

        //数据项事件
        $(target).find(".div-item").unbind(".divtext").
            //鼠标移上去事件
            bind("mouseenter.divtext", function () {

                $(this).addClass("div-item-hover");
            }).
            //鼠标移除事件
            bind("mouseleave.divtext", function () {

                $(this).removeClass("div-item-hover");
            }).
            //单击事件
            bind("click.divtext", function () {

                $(target).find(".div-item").removeClass("div-item-select");

                //添加样式
                $(this).addClass("div-item-select");

                //绑定document事件
                BindDoc(target);
            });

        //下拉列表事件
        panel.find(".list-item").unbind(".divtext").
            //鼠标移入事件
            bind("mouseenter.divtext", function () {

                //移除hover样式
                panel.find(".list-item-hover").removeClass("list-item-hover");

                $(this).addClass("list-item-hover");
            }).
            //鼠标移除事件
            bind("mouseleave.divtext", function () {

                $(this).removeClass("list-item-hover");
            });

    }

    //绑定document事件
    function BindDoc(target) {

        //绑定窗体事件
        $(document).unbind(".divtext").

            //绑定键盘按下事件
            bind("keydown.divtext", function (e) {

                //当前选中项
                var Item = $(target).find(".div-item-select");

                if (Item.length > 0) {

                    //值
                    var val = Item.find(".div-data").attr("value");

                    //删除back||删除del
                    if (e.keyCode == 8 || e.keyCode == 46) {

                        //删除
                        $(target).divtext("removeItem", val);
                    }
                    //前
                    if (e.keyCode == 37) {

                        //选中前一项
                        Item.prev(".div-item").addClass("div-item-select").siblings().removeClass("div-item-select");
                    }
                    //后
                    if (e.keyCode == 39) {

                        //选中前一项
                        Item.next(".div-item").addClass("div-item-select").siblings().removeClass("div-item-select");
                    }
                }

                return false;
            }).
            //绑定单击事件
            bind("click.divtext", function (e) {

                //单击非Item项外的隐藏
                if ($(e.target).closest(".div-item").length == 0) {

                    //移除选中样式
                    $(target).find(".div-item-select").removeClass("div-item-select");

                    //解除document事件
                    DelBindDoc(target);
                }
            });
    }

    //解除document事件
    function DelBindDoc(target) {

        //解除绑定窗体事件
        $(document).unbind(".divtext");

    }

    //验证数据
    function checkData(target) {

        var data = $.data(target, "divtext").data;

        var panel = $.data(target, 'divtext').panel

        //li项
        var liItem = $(".list-item");

        //当前hover项
        var hoverItem = $(".list-item-hover");

        //显示内容
        var text = $(target).find(".js-input").val();

        if (hoverItem.length != 0 || $.trim(text).length != 0) {

            //列表有选中时
            if (hoverItem.length != 0) {

                var dvalue = hoverItem.find(".list-text");

                //设置值
                $(target).divtext("setValue", { id: dvalue.attr("value"), text: dvalue.text() });

            }

            //清空输入框
            $(target).find(".js-input").val("");

            $(target).find(".js-text").html("");

            panel.html("");

            //隐藏列表
            panel.hide();
        }

    }

    $.fn.divtext = function (options, param) {

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.divtext.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'divtext');

            if (state) {
                //合并参数
                $.extend(state.options, options);

            } else {
                //设置数据
                $.data(this, 'divtext', { options: $.extend({}, $.fn.divtext.defaults, options) });

                init(this);
            }

        });
    };

    //插件方法
    $.fn.divtext.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'divtext');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //得到选中项的值
        getSelectValue: function (target) {

            var sItem = $(target[0]).find(".div-item-select");

            return sItem.find(".div-data").attr("value");
        },
        //设置值
        setValue: function (target, param) {

            return target.each(function () {

                var Item = $(this).find(".div-data[value='" + param.id + "']");

                //不存在，则添加
                if (!Item[0]) {

                    var htmld = '<div class="div-item"><span class="div-data" value="' + param.id + '">' + param.text + '</span>;</div>';

                    //插入元素
                    $(this).find(".div-input").before(htmld);

                    //重新绑定事件
                    BindEvent(this);
                }
            });

        },
        //设置值
        setValues: function (target, param) {

            return target.each(function () {

                var t = $(this);

                $.each(param, function (a, b) {

                    var id = b[0][0];

                    var text = b[0][1];

                    var Item = t.find(".div-data[value='" + id + "']");

                    //不存在，则添加
                    if (!Item[0]) {

                        var htmld = '<div class="div-item"><span class="div-data" value="' + id + '">' + text + '</span>;</div>';

                        //插入元素
                        t.find(".div-input").before(htmld);
                    }
                });

                //重新绑定事件
                BindEvent(this);

            });

        },
        //清除数据
        clear: function (target) {

            return target.each(function () {

                $(this).find(".div-item").remove();
            });
        },
        //移除项
        removeItem: function (target, param) {

            return target.each(function () {

                var sItem = $(this).find(".div-data[value='" + param + "']").parent(".div-item-select");

                //选中前一项
                sItem.prev().addClass("div-item-select");

                sItem.remove();
            });

        },
        //得到值
        getValue: function (target) {

            var data = [];

            var Item = $(target[0]).find(".div-data");

            $.each(Item, function (a, b) {

                data.push($(b).attr("value"));
            });

            return data.join(',');

        },
        //得到数据
        getData: function (target) {

            var data = [];

            var Item = $(target[0]).find(".div-data");

            $.each(Item, function (a, b) {

                data.push({ id: $(b).attr("value"), text: $(b).text() });
            });

            return data;
        }

    };

    //插件默认参数
    $.fn.divtext.defaults = {

        //远程数据
        url: null,
        //列取条数
        count: 10,
        //远程参数
        queryParams: {},
        //查询延时
        delay: 100,
        //值
        idField: null,
        //文本
        textField: null,
        //插件宽度
        width: 300

    }


})(jQuery);

/*
*   gallery — jQuery XGUI
*   made by：lv
*   Production in：2014-4-17
*   Last updated：2015-6-4
*/
(function ($) {

    //创建
    function create(target) {

        //插件
        var wrap = $('<div class="gallery"><div class="gallery-mask"></div><div class="gallery-container"><div class="gallery-close"><a href="javascript:;"></a></div></div></div>');

        //画布
        var photo_wrapper = '<div class="photo-wrapper"><a href="javascript:;" class="photo-prev photo-prev-hover"></a><a href="javascript:;" class="photo-next photo-next-hover"></a><div class="photo-loading"></div></div>';

        //内容信息
        var gallery_info = '<div class="gallery-info"><div class="photo-info"><div class="user-info clearfix"><div class="user-avatar"><a href="#"><img src="/Upload/Avatar/user/81/mid-20140411022139867.png"></a></div><div class="user-desc"><p class="user-name"><a href="#">吕林光</a></p><p class="publish-time">2014年12月23日 18:37</p></div></div><div class="photo-desc">我永远爱你！我永远爱你！我永远爱你！</div></div><div class="photo-opt"><a href="javascript:;">赞</a>｜<a href="javascript:;">评论</a>｜<a href="javascript:;">转发</a></div><div class="comment-wrap"><div class="user-praise"><a href="#">吕林光</a>、<a href="#">陈光</a>、<a href="#">张梁剑</a>、<a href="#">吕敏</a>、等66人觉得很赞</div><ul class="comment-list"><li class="comment-item clearfix"><div class="user-avatar"><a href="/user/81" title="吕林光"><img src="/Upload/Avatar/user/81/small-20140411022139867.png"></a></div><div class="comment-info"><a href="/user/81" class="user-name">吕林光</a>：<p class="comment-con">下午该做相册了！下午该做相册了！</p></div></li><li class="comment-item clearfix"><div class="user-avatar"><a href="/user/81" title="吕林光"><img src="/Upload/Avatar/user/81/small-20140411022139867.png"></a></div><div class="comment-info"><a href="/user/81" class="user-name">吕林光</a>：<p class="comment-con">下午该做相册了！下午该做相册了！下午该做相册了！下午该做相册了！</p></div></li></ul><div class="comment-tip-input">发表评论！</div></div></div>';

        //缩略图
        var gallery_thumb = '<div class="gallery-thumb"><div class="thumb-prev"><span></span></div><div class="thumb-next"><span></span></div><div class="thumb-list"><ul class="thumb-list-ul clearfix"></ul></div></div>'

        wrap.find(".gallery-container").append(photo_wrapper + gallery_info);

        wrap.append(gallery_thumb);

        return wrap;
    }

    //初使化
    function init(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        if ($(".gallery")[0] != null) {
            return;
        }

        $("body").append(wrap);

        //如果是照片模式，则隐藏评论区
        if (opts.mode == "photo") {

            wrap.find(".gallery-info").remove();

            wrap.find(".photo-wrapper").css({ "width": "auto" });
        }

        //隐藏滚动条
        $("body,html").css("overflow-y", "hidden");

        //当前图片索引
        opts.index = getIndexForData(target, opts.queryParams);

        //第一条数据
        opts.firstData = opts.localData[0];

        //最后一条数据
        opts.lastData = opts.localData[opts.localData.length - 1];

        //载入缩略图列表
        loadThumb(target);

        //显示当前图片
        showImg(target);

        //设置页面样式
        setPageStyle(target);

        //动态载入数据
        dynamicData(target);

        //绑定事件
        BindEvent(target);

    }

    //json转换
    function tojson(html) {

        return eval('(' + html + ')');
    }

    //隐藏
    function hide(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        $(document).unbind('.gallery');

        $(window).unbind(".gallery")

        //显示滚动条
        $("body,html").removeAttr("style");

        //解除滚轮事件
        $(window).unbind("mousewheel.gallery");

        wrap.remove();

    }

    //得到数据索引
    function getIndexForData(target, curData) {

        var opts = $.data(target, 'gallery').options;

        for (i = 0; i < opts.localData.length; i++) {

            if (opts.localData[i][opts.ID] == curData[opts.ID]) {

                return i;
            }
        }
    }

    //设置页面高度及宽度
    function setPageStyle(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        //浏览器
        var objW = $(window);

        //插件高度
        var wrapH = objW.height() > opts.minHeight ? objW.height() : opts.minHeight;

        //设置样式
        wrap.css({ "top": objW.scrollTop() });

        //插件高度
        wrap.outerHeight(wrapH);

        //内容区高度
        wrap.find(".gallery-container").outerHeight(wrapH - opts.thumbHeight);

        //缩略图导航宽度 55为每张图片宽度
        opts.thumbWidth = opts.localData.length * 55;

        //导航缩略图宽
        wrap.find(".thumb-list-ul").outerWidth(opts.thumbWidth);

        wrap.find(".thumb-list-ul").css({ "margin-left": opts.thumbLeft });

        //重设图片大小
        var img = wrap.find(".photo-img").removeAttr("style");

        xgui.SetImgSizeInParent(img);

    }

    //载入缩略图
    function loadThumb(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        //先清空
        wrap.find(".thumb-list-ul").empty();

        for (i = 0; i < opts.localData.length; i++) {

            wrap.find(".thumb-list-ul").append('<li class="thumb-item"><a href="javascript:;"><img src="' + opts.localData[i][opts.imgThumb] + '" class="thumb-img"></a></li>');
        }
    }

    //增加缩略图
    function addThumb(target, data) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        var html = "";

        for (i = 0; i < data.length; i++) {

            html += '<li class="thumb-item"><a href="javascript:;"><img src="' + data[i][opts.imgThumb] + '" class="thumb-img"></a></li>';
        }

        //往前面追加数据
        if (opts.direction == "left") {

            wrap.find(".thumb-list-ul").prepend(html);
        }
            //往后面追加数据
        else {

            wrap.find(".thumb-list-ul").append(html);
        }
    }

    //动态加载数据
    function dynamicData(target) {

        var opts = $.data(target, 'gallery').options;

        if (opts.thumbUrl) {

            setTimeout(function () {

                //远程参数
                var query = $.extend({}, opts.direction == "left" ? opts.firstData : opts.lastData, { direction: opts.direction, PageSize: opts.thumbPageSize });

                xgui.Ajax(opts.thumbUrl, query, "json", true, function (o) {

                    //往后面追加数据
                    if (opts.direction == "right") {

                        //增加新数据
                        opts.localData = opts.localData.concat(o);

                        //最后一条数据
                        opts.lastData = opts.localData[opts.localData.length - 1];

                    }
                        //往前面增加数据
                    else {

                        opts.localData = o.concat(opts.localData);

                        //缩略图导航左移
                        opts.thumbLeft -= o.length * 55;

                        //第一条数据
                        opts.firstData = opts.localData[0];

                        //当前图片索引
                        opts.index = opts.index + o.length;
                    }

                    //增加新缩略图
                    addThumb(target, o);

                    //重设样式
                    setPageStyle(target);

                    //绑定事件
                    BindEvent(target);

                    //第一次加载下一页的同时也加载上一页数据
                    if (opts.direction == "right" && opts.thumbLeft >= 0 && opts.index > 0) {

                        opts.direction = "left";

                        //动态载入数据
                        dynamicData(target);
                    }

                });

            }, 300);
        }
    }

    //定位缩略图
    function fixedPosition(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        //当前图片距离左边的距离
        var left = wrap.find(".thumb-item:eq(" + opts.index + ")").position().left;

        //左移
        if (left >= opts.thumbNavWidth - 50) {

            thumbMoveLeft(target);

        }
        //右移
        if (left <= 40) {

            thumbMoveRight(target);
        }
    }

    //缩略图左移
    function thumbMoveLeft(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        if (opts.thumbWidth + opts.thumbLeft <= opts.thumbNavWidth) {

            return;
        }

        opts.thumbLeft -= 10 * 55;

        //显示上一页按钮
        wrap.find(".thumb-prev").show();

        wrap.find(".thumb-list-ul").animate({ "margin-left": opts.thumbLeft }, function () {

            //是否隐藏下一页按钮
            if (opts.thumbWidth + opts.thumbLeft <= opts.thumbNavWidth) {

                //隐藏下一页按钮
                wrap.find(".thumb-next").hide();

                //方向，右
                opts.direction = "right";

                //载入新数据
                dynamicData(target);
            }

        });

    }

    //缩略图右移
    function thumbMoveRight(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        if (opts.thumleft >= 0) {
            return;
        }

        opts.thumbLeft += 10 * 55;

        if (opts.thumbLeft > 0) {

            opts.thumbLeft = 0;
        }

        //是否显示下一按钮
        if (opts.thumbWidth + opts.thumbLeft > opts.thumbNavWidth) {

            wrap.find(".thumb-next").show();
        }

        wrap.find(".thumb-list-ul").animate({ "margin-left": opts.thumbLeft }, function () {

            //是否隐藏上一页按钮
            if (opts.thumbLeft >= 0) {

                wrap.find(".thumb-prev").hide();

                //方向，左
                opts.direction = "left";

                //载入新数据
                dynamicData(target);
            }

        });

    }

    //上一张
    function Prev(target) {

        var opts = $.data(target, 'gallery').options;

        if (opts.index <= 0)

            opts.index = opts.localData.length;

        opts.index--;

        //显示图片
        showImg(target);

    }

    //下一张
    function Next(target) {

        var opts = $.data(target, 'gallery').options;

        if (opts.index >= opts.localData.length - 1)

            opts.index = -1;

        opts.index++;

        showImg(target);
    }

    //显示图片
    function showImg(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        //定位缩略图导航
        fixedPosition(target);

        //先移除样式
        wrap.find(".thumb-item").removeClass("item-focus");

        //添加选中样式
        wrap.find(".thumb-item:eq(" + opts.index + ")").addClass("item-focus");

        //显示loading
        wrap.find(".photo-loading").show();

        nextImg = new Image();

        nextImg.onload = function (obj) {

            //移除原图
            wrap.find(".photo-img").remove();

            //添加图片
            wrap.find(".photo-wrapper").append(nextImg);

            //ie会默认加上width和height属性，所以要去掉
            $(this).removeAttr("width").removeAttr("height").addClass("photo-img");

            //设置图片大小
            xgui.SetImgSizeInParent($(this));

            //隐藏loading
            wrap.find(".photo-loading").hide();

        };

        nextImg.src = opts.localData[opts.index][opts.imgOrigin];

    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'gallery').options;

        var wrap = $.data(target, 'gallery').wrap;

        //鼠标按下事件,阻止冒泡document事件
        wrap.find(".gallery-container,.gallery-thumb").unbind(".gallery").
            //鼠标按下事件
            bind('mousedown.gallery', function (e) {

                e.stopPropagation();
            });

        //绑定关闭事件
        wrap.find(".gallery-close").unbind(".gallery").
            bind("click.gallery", function () {

                //隐藏
                $(target).gallery("hideWrap");
            });

        //上一页与下一页
        wrap.find(".photo-wrapper").unbind(".gallery").
            //鼠标移入时
            bind("mouseenter.gallery mousemove.gallery", function (e) {

                //画面宽度
                var width = $(this).outerWidth();

                //左边距离
                var x = e.clientX - $(this).offset().left;

                //显示图标
                wrap.find(".photo-prev,.photo-next").show();

                //显示左边
                if (x < width / 2) {

                    wrap.find(".photo-prev").addClass("photo-prev-hover");

                    wrap.find(".photo-next").removeClass("photo-next-hover");
                }
                    //显示右边
                else {

                    wrap.find(".photo-prev").removeClass("photo-prev-hover");

                    wrap.find(".photo-next").addClass("photo-next-hover");
                }

            }).
            //鼠标移出时
            bind("mouseleave.gallery", function (e) {

                wrap.find(".photo-prev,.photo-next").hide();
            }).
            //单击时
            bind("click.gallery", function (e) {

                //画面宽度
                var width = $(this).outerWidth();

                //左边距离
                var x = e.clientX - $(this).offset().left;

                //上一张
                if (x < width / 2) {

                    Prev(target);
                }
                    //下一张
                else {

                    Next(target);
                }
            }).
            //选中时(阻止内容被选中)
            bind("selectstart", function () {

                return false;
            });

        //缩略图载入完成时设置图片大小
        wrap.find(".thumb-item img").unbind(".gallery").
            bind("load.gallery", function () {

                //设置缩略图宽高
                xgui.SetImgSize($(this));
            });

        //缩略图上一页事件
        wrap.find(".thumb-prev").unbind(".gallery")
            .bind("click.gallery", function () {

                //缩略图右移
                thumbMoveRight(target);

            });

        //缩略图下一页事件
        wrap.find(".thumb-next").unbind(".gallery").
            bind("click.gallery", function () {

                //缩略左移
                thumbMoveLeft(target);
            });

        //绑定缩略图项事件
        wrap.find(".thumb-item").unbind(".gallery").
            //鼠标移入事件
            bind("mouseenter.gallery", function () {

                $(this).addClass("item-hover");
            }).
            //鼠标移出事件
            bind("mouseleave.gallery", function () {

                $(this).removeClass("item-hover");
            }).
            //鼠标单击事件
            bind("click.gallery", function () {

                //当前项索引
                opts.index = wrap.find(".thumb-item").index(this);

                //显示图片
                showImg(target);
            });

        //是否显示上一按钮（缩略图）
        if (opts.thumbLeft < 0) {

            wrap.find(".thumb-prev").show();
        }

        //是否显示下一按钮（缩略图）
        if (opts.thumbWidth + opts.thumbLeft > opts.thumbNavWidth) {

            wrap.find(".thumb-next").show();
        }

        //浏览器事件
        $(window).unbind(".gallery").
            //改变大小事件
            bind("resize.gallery", function () {

                setPageStyle(target);
            }).
            //滚轮事件
            bind("mousewheel.gallery", function () {

                return false;
            });

        //绑定document单击事件
        $(document).unbind('.gallery').
            bind('mousedown.gallery', function (e) {

                //隐藏
                $(target).gallery("hideWrap");
            });

    }

    $.fn.gallery = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            var method = $.fn.gallery.methods[options];

            if (method) {

                return method(this, param);
            }
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'gallery');

            if (state) {

                //合并参数
                $.extend(state.options, param);

                //刷新
                $(this).gallery("reload");

            } else {

                //创建
                var wrap = create(this);

                //设置数据
                $.data(this, 'gallery', {

                    options: $.extend({},
                        $.fn.gallery.defaults,
                        $.fn.gallery.parseOptions(this),
                        options
                        ), wrap: wrap
                });

                //初使化
                init(this);
            }
        });
    };

    //插件方法
    $.fn.gallery.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'gallery');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //返回对象
        wrap: function (target) {

            return $.data(target[0], 'gallery').wrap;
        },
        //隐藏对象
        hideWrap: function (target) {

            return target.each(function () {

                hide(this);
            });
        },
        //刷新
        reload: function (target, param) {

            return target.each(function () {

                var opts = $.data(this, 'gallery').options;

                //合并参数
                $.extend(opts.queryParams, param);

                init(this);
            });
        }

    };
    //获取插件参数
    $.fn.gallery.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {

            //缩略图远程地址
            thumbUrl: t.attr('thumbUrl'),
            //远程参数
            queryParams: (t.attr("queryParams") ? tojson(t.attr("queryParams")) : undefined)
        });
    };
    //插件默认参数
    $.fn.gallery.defaults = $.extend({}, $.fn.combo.defaults, {

        //模式（相册photo、评论comment）
        mode: "photo",
        //缩略图远程地址
        thumbUrl: null,
        //本地数据
        localData: null,
        //远程参数
        queryParams: {},
        //缩略图每页大小
        thumbPageSize: 50,
        //值
        ID: "ID",
        //缩略图
        imgThumb: "imgThumb",
        //大图
        imgOrigin: "imgOrigin",
        //最小高度
        minHeight: 320,
        //缩略图高度
        thumbHeight: 90,
        //缩略图宽度
        thumbWidth: 0,
        //导航缩略图宽
        thumbNavWidth: 944,
        //缩略图左边距离
        thumbLeft: 0,
        //方向
        direction: 'right',
        //当前项索引
        index: 0,
        //第一条数据
        firstData: null,
        //最后一条数据
        lastData: null

    });


})(jQuery);

/*
*   freeze — jQuery XGUI
*   made by：lv
*   Production in：2016-3-16
*   Last updated：2016-3-17
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'freeze').options;

        //复制标题
        var title = $(opts.fixbar).clone().hide();

        $(opts.fixbar).after(title);

        //绑定事件
        BindEvent(target);

    };

    //固定到顶部
    function FixTop(target) {

        var opts = $.data(target, 'freeze').options;

        //滚动条高
        var scrollTop = $(window).scrollTop();

        //表格距离顶部高度
        var top = $(target).offset().top;

        //表头1
        var gtitle1 = $(opts.fixbar);

        //表头2
        var gtitle2 = gtitle1.next();

        if (scrollTop > top - opts.topOffset) {

            //表头 top距离
            var top2 = top + $(target).outerHeight() - scrollTop - gtitle1.height();

            if (top2 < opts.topOffset) {

                //设置顶部距离
                gtitle1.css({ "position": "fixed", "top": top2 });
            }
            else {

                //设置顶部距离
                gtitle1.css({ "position": "fixed", "top": opts.topOffset });
            }

            //显示表头1
            gtitle2.show();

            //固定时事件
            if (opts.fixEvent) {

                opts.fixEvent(opts.fixbar);
            }
        }
        else {

            //隐藏表头2
            gtitle2.hide();

            //移除样式
            //gtitle1.removeAttr("style");

            gtitle1.css({ "position": "static" });

            //不固定时事件
            if (opts.unfixEvent) {

                opts.unfixEvent(opts.fixbar);
            }
        }

    }

    //绑定事件
    function BindEvent(target) {

        //事件
        $(window).
            //拖动滚动条事件
            bind("scroll.freeze", function () {

                //固定头部
                FixTop(target);
            });

    }

    $.fn.freeze = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.freeze.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'freeze');

            if (state) {

                //合并参数
                $.extend(state.options, options);

            } else {
                //设置数据
                $.data(this, 'freeze', { options: $.extend({}, $.fn.freeze.defaults, options) });

                init(this);
            }

        });
    };

    //插件方法
    $.fn.freeze.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'freeze');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //定位
        position: function (target) {

            return target.each(function () {

                FixTop(this);
            });
        }

    };

    //插件默认参数
    $.fn.freeze.defaults = {
        //固定栏
        fixbar: null,
        //固定表头的距离
        topOffset: 0,
        //固定时事件
        fixEvent: function () { },
        //不固定时事件
        unfixEvent: function () { }

    }


})(jQuery);

/*
*   divscroll — jQuery XGUI
*   made by：lv
*   Production in：2016-3-25
*   Last updated：2016-3-26
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'divscroll').options;

        //内容高
        var conHeight = $(opts.container).outerHeight();

        //外框高
        var wrapHeight = $(target).outerHeight();

        if (conHeight <= wrapHeight) {

            return;
        }

        //滚动条
        var scrollbar = '<div class="xgui-scroll"><div class="xgui-scroll-bar"><span class="xgui-scroll-bar-dragger"></span></div></div>'

        //追加到页面
        $(target).append(scrollbar);

        //绑定事件
        BindEvent(target);

    };

    //设置大小
    function Resize(target) {

        //参数
        var opts = $.data(target, 'divscroll').options;

        //内容高
        var conHeight = $(opts.container).outerHeight();

        //外框高
        var wrapHeight = $(target).outerHeight();

        //滚动条外框高度
        $(target).find(".xgui-scroll-bar").height(wrapHeight);

        //内滚动条高度  
        var sh2 = wrapHeight / conHeight * wrapHeight;

        //内滚动条高度
        var draggerH = sh2 < opts.minHeight ? opts.minHeight : sh2;

        //滚动条内高度
        $(target).find(".xgui-scroll-bar-dragger").height(draggerH);

        //步长等于：需要滚动部分的高度/可滚动部分高度
        opts.step = (conHeight - wrapHeight) / (wrapHeight - (draggerH));

        //底部
        opts.bottom = conHeight - wrapHeight;

    }

    //绑定事件
    function BindEvent(target) {

        var opts = $.data(target, 'divscroll').options;

        //鼠标移入显示滚动条
        $(target).
            //鼠标移入显示滚动条
            bind("mouseenter", function () {

                $(target).find(".xgui-scroll").fadeIn();
            }).
            //鼠标移出隐藏滚动条
            bind("mouseleave", function () {

                $(target).find(".xgui-scroll").fadeOut();
            });

        //设置大小
        Resize(target);

        //滚动条
        $(target).find(".xgui-scroll-bar-dragger").
            //鼠标按下时
            bind("mousedown", function (Event) {

                //设置透明度
                $(target).find(".xgui-scroll-bar-dragger").css({

                    "filter": "alpha(opacity=100)",
                    "opacity": "1"
                });

                //上边距离
                var y = Event.clientY - $(target).find(".xgui-scroll-bar-dragger").offset().top + $(target).offset().top;

                //绑定拖动
                $(target).bind("mousemove", function (Event2) {

                    var top = 0;

                    //顶部限制
                    if (Event2.clientY - y > 0) {

                        top = (Event2.clientY - y);
                    }

                    //底部限制
                    if ((Event2.clientY - y) * opts.step >= opts.bottom) {

                        top = opts.bottom / opts.step;
                    }

                    //设置拖动条位置
                    $(target).find(".xgui-scroll-bar-dragger").css({

                        "margin-top": top + "px"
                    });

                    //设置内容位置
                    $(opts.container).css({

                        "margin-top": -top * opts.step + "px"
                    });

                    return false;
                });

                //绑定停止
                $(target).bind("mouseup", function () {

                    //解除事件
                    $(target).unbind("mousemove");
                    $(target).unbind("mouseup");
                });

                return false;

            }).
            //鼠标弹起时
            bind("mouseup", function () {

                //透明度
                $(target).find(".xgui-scroll-bar-dragger").css({

                    "filter": "alpha(opacity=80)",
                    "opacity": "0.8"
                });
            });

    }

    $.fn.divscroll = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.divscroll.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'divscroll');

            if (state) {

                //合并参数
                $.extend(state.options, options);

            } else {
                //设置数据
                $.data(this, 'divscroll', { options: $.extend({}, $.fn.divscroll.defaults, options) });

                init(this);
            }

        });
    };

    //插件方法
    $.fn.divscroll.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'divscroll');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }

        },
        //定位
        position: function (target) {

            return target.each(function () {

                //FixTop(this);
            });
        }

    };

    //插件默认参数
    $.fn.divscroll.defaults = {

        //主内容
        container: null,
        //滚动条最小高度
        minHeight: 30,
        //滚动条最小宽度
        minWidth: 30,
        //步长
        step: 0
    }


})(jQuery);

/*
*   ossupload — jQuery XGUI
*   made by：lv
*   Production in：2017-3-17
*   Last updated：2017-3-21
*/
(function ($) {

    //插件初使化
    function init(target) {

        var opts = $.data(target, 'ossupload').options;

    };

    //得到随机名（上传文件名）
    function getname(name) {

        //时间
        var date = new Date();

        var o =
        {
            "Y": date.getFullYear(),
            //月
            "M": date.getMonth() + 1,
            //天
            "d": date.getDate(),
            //小时
            "h": date.getHours(),
            //分钟
            "m": date.getMinutes(),
            //秒数
            "s": date.getSeconds(),
            //毫秒
            "f": date.getMilliseconds()
        }

        return o.Y.toString() + o.M.toString() + o.d.toString() + o.h.toString() + o.m.toString() + o.s.toString() + o.f.toString();
    }

    //得到扩展名
    function getext(name) {

        var point = name.lastIndexOf(".");

        return name.substr(point);
    }

    //扩展名验证
    function checkext(target) {

        var opts = $.data(target, 'ossupload').options;

        //扩展名验证
        if (!opts.extensions) {
            return true;
        }

        //文件
        var file = target.files[0];

        var flag = false;

        //文件扩展名
        var ext = getext(file.name).replace(".", "");

        var array = opts.extensions.split(',');

        for (i = 0; i < array.length; i++) {
            if (array[i] == ext) {
                flag = true;
                break;
            }
        }
        if (!flag) {

            return false;
        }
        return true;
    }

    //设置数据（得到签名）
    function setdata(target, callback) {

        //参数
        var opts = $.data(target, 'ossupload').options;

        //文件
        var file = target.files[0];

        //上传目录
        $.extend(opts.queryParams, { dir: opts.dir });

        //得到签名
        xgui.Ajax(opts.sigurl, opts.queryParams, "json", true, function (o) {

            //填充多表单数据
            opts.data = new FormData();

            //状态
            opts.data.append("success_action_status", "200");

            //名称
            opts.file.name = file.name;

            //大小
            opts.file.size = file.size;

            //文件类别
            opts.file.type = file.type;

            //设置文件扩展名
            opts.file.ext = getext(file.name);

            //以文件命名
            if (opts.name == "file") {

                //key
                opts.data.append("key", o.dir + "${filename}");
            }
                //随机名
            else {

                //文件名
                opts.file.name = getname(file.name) + opts.file.ext;

                opts.data.append("key", o.dir + opts.file.name);
            }

            //
            opts.data.append("policy", o.policy);

            //key id
            opts.data.append("OSSAccessKeyId", o.accessid);

            //
            opts.data.append("callback", o.callback);

            //签名
            opts.data.append("signature", o.signature);

            //文件
            opts.data.append("file", file);

            //回调
            callback();

        },
        //上传失败
        function () {

            //更改上传状态
            opts.status = true;
        });
    }

    //上传
    function upload(target) {

        var opts = $.data(target, 'ossupload').options;

        //文件
        var file = target.files[0];

        if (file == undefined) {
            xgui.alert("请上传文件", "info");
            return;
        }

        //扩展名验证
        if (!checkext(target)) {
            xgui.alert("请上传以下格式的文件：" + opts.extensions, "info");
            return;
        }

        //未完成
        if (!opts.status) {
            return;
        }

        //更改上传状态
        opts.status = false;

        //设置数据（得到签名）
        setdata(target, function () {

            //提交
            var request = $.ajax({
                type: 'post',
                url: opts.uploadurl,
                data: opts.data,
                processData: false,// 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                contentType: false,// 不设置Content-type请求头
                dataType: 'json',
                beforeSend: function () {
                    if (opts.beforeSend)
                        opts.beforeSend(request);
                },
                complete: function () {

                    //更改上传状态
                    opts.status = true;

                    if (opts.complete)
                        opts.complete(request);
                },
                success: function () {

                    //设置参数
                    $.extend(opts.file, { status: request.status });

                    if (opts.sucCallback)
                        opts.sucCallback(opts.file);
                },
                error: function () {

                    //更改上传状态
                    opts.status = true;

                    if (opts.falCallback) {
                        opts.falCallback(request);
                    }
                    else {
                        //xgui.msgtip("载入失败！", "error");
                    }
                }
            });

        });
    }

    $.fn.ossupload = function (options, param) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //如果参数是字符，则执行方法
        if (typeof options == 'string') {

            return $.fn.ossupload.methods[options](this, param);
        }
        //否则执行插件
        options = options || {};
        return this.each(function () {

            //得到当前实例数据
            var state = $.data(this, 'ossupload');

            if (state) {

                //合并参数
                $.extend(state.options, options);

            } else {
                //设置数据
                $.data(this, 'ossupload', { options: $.extend({}, $.fn.ossupload.defaults, options) });

                init(this);
            }

        });
    };

    //插件方法
    $.fn.ossupload.methods = {

        //返回插件option参数
        options: function (target) {

            var data = $.data(target[0], 'ossupload');

            if (data) {

                return data.options;

            }
            else {

                return undefined;
            }
        },
        //开始上传
        start: function (target) {

            upload(target[0]);
        }
    };

    //插件默认参数
    $.fn.ossupload.defaults = {

        //上传地址
        uploadurl: null,
        //获取签名的地址
        sigurl: null,
        //远程参数
        queryParams: {},
        //上传目录
        dir: "",
        //上传数据
        data: null,
        //上传状态
        status: true,
        //命名模式（file,random）
        name: "file",
        //上传扩展名
        extensions: null,
        //返回数据
        file: {},
        //开始上传
        beforeSend: null,
        //上传成功
        sucCallback: null,
        //上传完成事件
        complete: null,
        //出错回调
        falCallback: null
    }

})(jQuery);

/*
*   parser — jQuery XGUI
*   made by：lv
*   Production in：2014-1-6
*   Last updated：2015-2-6
*/
(function ($) {
    //插件解析
    $.parser = {
        //地址
        url: "www.xgbanji.com",
        //插件类别
        plugins: ['validatebox', 'combobox', 'combogrid', 'combotree', 'searchbox', 'datebox', 'dialog', 'menu'],
        //解析插件
        parse: function (context) {

            var aa = [];

            for (var i = 0; i < $.parser.plugins.length; i++) {

                var name = $.parser.plugins[i];

                var r = $('.xgui-' + name, context);

                if (r.length) {

                    if (r[name]) {

                        r[name]();
                    }
                }
            }
        },
        //合法使用验证
        validate: function () {

            var url = window.location.host;

            if (url != $.parser.url) {

                return false;
            }
            return true;
        }
    };

    //初使化
    $(function () {

        //初使化解析
        $.parser.parse();
    });

})(jQuery);



var xgui = {

    //Ajax  远程地址｜远程数据｜返回类型｜异步模式｜成功加调｜失败回调|开始加载｜完成加载
    Ajax: function (url, data, dataType, async, sucCallback, falCallback, beforeSend, complete) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        $.ajax({
            type: "post",
            url: url,
            dataType: dataType,
            data: data,
            async: async,
            cache: false,
            beforeSend: function (o) {
                if (beforeSend)
                    beforeSend(o);
            },
            complete: function (o) {
                if (complete)
                    complete(o);
            },
            success: function (o) {
                if (sucCallback)
                    sucCallback(o);
            },
            error: function () {
                if (falCallback) {
                    falCallback();
                }
                else {
                    //xgui.msgtip("载入失败！", "error");
                }
            }
        });

    },
    //alert弹出框
    alert: function (info, icon, callback) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        if ($(".msg-alert")[0]) {
            return;
        }

        //向body输出msg框
        $("body").append(msgdiv.replace("xgui-msg", "xgui-msg msg-alert"));

        var msg = $(".msg-alert");

        //输出mask
        msg.after(xguimask);

        //mask
        var mask = msg.next(".xgui-mask");

        //输出header
        msg.html(msgheader);

        //输出main
        msg.append(msgmain);

        //输出bottom
        msg.append(msgbottom);

        //mask
        $.fn.dialog.defaults.zIndex++;

        mask.css({ "z-index": $.fn.dialog.defaults.zIndex });

        //弹出框
        $.fn.dialog.defaults.zIndex++;

        //设置样式
        msg.css({ "z-index": $.fn.dialog.defaults.zIndex });

        //更改图标
        msg.find(".xgui-msg-icon").removeClass().addClass("xgui-msg-icon icon-" + icon);

        //更改提示信息
        msg.find(".xgui-msg-info").html(info);

        //设置msg居中
        this.setcenter(msg, "absolute");

        //设置msg可拖动
        this.draggable(msg.find(".xgui-msg-head"), msg);

        //绑定关闭
        msg.find(".xgui-msg-close,.msg-btn-ok").bind("click", function () {

            //移除msg
            msg.remove();

            //移除mask
            mask.remove();

            //回调
            if (callback) {

                callback();
            }

        });


    },
    //确认提示框
    confirm: function (info, callback, callback2) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        if ($(".msg-confirm")[0]) {
            return;
        }

        //向body输出msg框
        $("body").append(msgdiv.replace("xgui-msg", "xgui-msg msg-confirm"));

        var msg = $(".msg-confirm");

        //输出mask
        msg.after(xguimask);

        //mask
        var mask = msg.next(".xgui-mask");

        //输出header
        msg.html(msgheader);

        //输出main
        msg.append(msgmain);

        //输出bottom
        msg.append(msgbottom);

        //增加按钮
        msg.find(".xgui-msg-bottom").append("<a href=\"javascript:;\" class=\"xgui-msg-btn line-grey msg-btn-no\">否</a>");

        //mask
        $.fn.dialog.defaults.zIndex++;

        mask.css({ "z-index": $.fn.dialog.defaults.zIndex });

        //弹出框
        $.fn.dialog.defaults.zIndex++;

        //设置样式
        msg.css({ "z-index": $.fn.dialog.defaults.zIndex });

        //更改图标
        msg.find(".xgui-msg-icon").removeClass().addClass("xgui-msg-icon icon-warn");

        //更改提示信息
        msg.find(".xgui-msg-info").html(info);

        //设置msg居中
        this.setcenter(msg, "absolute");

        //设置msg可拖动
        this.draggable(msg.find(".xgui-msg-head"), msg);

        //绑定确定
        msg.find(".msg-btn-ok").bind("click", function () {

            //移除msg
            msg.remove();

            //移除mask
            mask.remove();

            //回调
            if (callback) {

                callback();
            }
        });

        //绑定关闭
        msg.find(".xgui-msg-close,.msg-btn-no").bind("click", function () {

            //移除msg
            msg.remove();

            //移除mask
            mask.remove();

            //回调
            if (callback2) {

                callback2();
            }
        });


    },
    //提示框
    msgtip: function (info, icon, callback, time) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        if ($(".msg-msgtip")[0]) {
            return;
        }

        //向body输出msg框
        $("body").append(msgdiv.replace("xgui-msg", "xgui-msg msg-msgtip clearfix"));

        var msg = $(".msg-msgtip");

        //输出tip
        msg.html(msgtip);

        //弹出框
        $.fn.dialog.defaults.zIndex++;

        //设置样式
        msg.css({ "z-index": $.fn.dialog.defaults.zIndex });

        //更改图标
        msg.find(".xgui-msg-icon").removeClass().addClass("xgui-msg-icon icon-" + icon);

        //更改提示信息
        msg.find(".xgui-msg-info").html(info);

        //设置居中
        if (xgui.isie6()) {

            xgui.setcenter(msg, "absolute");

        }
        else {

            xgui.setcenter(msg, "fixed");
        }

        if (time) {

            time = time * 1000;
        }
            //2秒
        else {

            time = 1500;
        }

        //设定移除
        setTimeout(function () {

            msg.remove();

            if (callback) {

                callback();

            }

        }, time);


    },
    //正在加载
    loading: function (mode, info) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //显示
        if (mode == "show") {

            if ($(".xgui-loading")[0]) {
                return;
            }

            $("body").append("<div class=\"xgui-loading\">数据加载中,请稍等。。。</div>");

            //弹出框
            $.fn.dialog.defaults.zIndex++;

            //设置样式
            $(".xgui-loading").css({ "z-index": $.fn.dialog.defaults.zIndex });

            //更新提示信息
            $(".xgui-loading").html(info);

            //设置居中
            if (xgui.isie6()) {

                xgui.setcenter($(".xgui-loading"), "absolute");

            }
            else {

                xgui.setcenter($(".xgui-loading"), "fixed");
            }


        }
            //隐藏
        else {
            $(".xgui-loading").remove();
        }
    },
    //设置居中
    setcenter: function (obj, position) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //浏览器
        var win = $(window);

        //对象
        var ojb = $(obj);

        var left;

        var top;

        //fiexd
        if (position == "fixed") {

            left = (win.width() - obj.width()) / 2;

            top = (win.height() - obj.height()) / 2;
        }
            //absolute
        else {

            left = win.scrollLeft() + (win.width() - obj.width()) / 2;

            top = win.scrollTop() + (win.height() - obj.height()) / 2;
        }

        //设置位置
        ojb.css({ "position": position, "left": left, "top": top });

    },
    //可拖动
    draggable: function (tit, con, opacity) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        x = 0;
        y = 0;

        //绑定鼠标按下时
        $(con).find(tit).
            bind("mousedown", function (Event) {

                //左边距离
                x = Event.clientX - $(con).offset().left;

                //上边距离
                y = Event.clientY - $(con).offset().top;

                //绑定拖动
                $(document).bind("mousemove", Move);

                //绑定停止
                $(document).bind("mouseup", Stop);

                return false;
            });

        //移动 设置位置
        function Move(Event) {

            $(con).css({
                "left": (Event.clientX - x) + "px",
                "top": (Event.clientY - y) + "px"
            });

            if (opacity) {

                //透明度
                $(con).css({

                    "filter": "alpha(opacity=80)",
                    "opacity": "0.8"
                });
            }
        }

        //停止 解除绑定
        function Stop() {

            $(document).unbind("mousemove", Move);
            $(document).unbind("mouseup", Stop);

            if (opacity) {

                //透明度
                $(con).css({

                    "filter": "alpha(opacity=100)",
                    "opacity": "1"
                });
            }

        }

    },
    //根据父元素设置图片大小
    SetImgSize: function (img, model) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //父宽度
        var parentW = $(img).parent().width();

        //父高度
        var parentH = $(img).parent().height();

        //图片宽比例
        var RatioW = $(img).width() / parentW;

        //图片高比例
        var RatioH = $(img).height() / parentH;

        //图片宽度
        var imgw = 0;

        //图片高度
        var imgh = 0;

        //margin-top
        var mt = 0;

        //margin-left
        var ml = 0;

        //根据父元素全部显示在父元素里
        if (model && model == "all") {

            //按宽
            if (RatioW > RatioH) {

                if ($(img).width() > parentW) {


                    //图片宽度
                    imgw = parentW;

                    //图片高度
                    imgh = $(img).height() / RatioW;

                }
                else {

                    imgw = $(img).width();

                    imgh = $(img).height();

                }

            }
                //按高
            else {

                if ($(img).height() > parentH) {


                    //图片宽度
                    imgw = $(img).width() / RatioH;

                    //图片高度
                    imgh = parentH;
                }
                else {

                    imgw = $(img).width();

                    imgh = $(img).height();
                }

            }
        }
            //根据父元素隐藏部分（铺满父元素为主）
        else {

            //按高
            if (RatioW > RatioH) {

                if ($(img).height() > parentH) {

                    //图片宽度
                    imgw = $(img).width() / RatioH;

                    //图片高度
                    imgh = parentH;

                }
                else {

                    imgw = $(img).width();

                    imgh = $(img).height();

                }

            }
                //按宽
            else {

                if ($(img).width() > parentW) {

                    //图片宽度
                    imgw = parentW;

                    //图片高度
                    imgh = $(img).height() / RatioW;
                }
                else {

                    imgw = $(img).width();

                    imgh = $(img).height();
                }

            }
        }


        mt = (parentH - imgh) / 2;

        ml = (parentW - imgw) / 2;

        $(img).css({ "width": imgw, "height": imgh, "margin-left": ml, "margin-top": mt });

    },
    //根据父元素设置图片大小
    SetImgSizeInParent: function (img) {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        //父宽度
        var parentW = $(img).parent().width();

        //父高度
        var parentH = $(img).parent().height();

        //图片宽比例
        var RatioW = $(img).width() / parentW;

        //图片高比例
        var RatioH = $(img).height() / parentH;

        //图片宽度
        var imgw = $(img).width();

        //图片高度
        var imgh = $(img).height();

        //margin-top
        var mt = 0;

        //margin-left
        var ml = 0;

        //图片大于父宽度，或高度大于父高度
        if (imgw > parentW || imgh > parentH) {

            //按宽缩小
            if (RatioW > RatioH) {

                //图片宽
                imgw = parentW;

                //图片高度
                imgh = imgh / RatioW;

            }
                //按高缩小
            else {
                imgw = imgw / RatioH;

                imgh = parentH;
            }

        }

        mt = (parentH - imgh) / 2;

        ml = (parentW - imgw) / 2;

        $(img).css({ "width": imgw, "height": imgh, "margin-left": ml, "margin-top": mt });
    },
    //检测ie6版本
    isie6: function () {

        //插件合法性使用验证
        if (!$.parser.validate()) {
            return;
        }

        if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
            return true;
        }
        return false;

    }
}