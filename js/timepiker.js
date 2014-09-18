
//场地选择
function cdPicker() {
    $(".cd01").on("click", function() {
        $(".cd01").removeClass("cdslected");
        $(this).addClass("cdslected");
        bookcd = $(this).html();
        lianJie();
        
        clearUnCheckedTime();
        cannotPick(changdiData, bookcd)
    });
    $(".cd01:eq(0)").addClass("cdslected");
    bookcd = $(".cd01:eq(0)").html();
}

function clearUnCheckedTime()
{
    var hours = $(".hourBox li[check=3]");
    var oldStyle = $(".hourBox li[check=0]").eq(0).find("span").eq(0).attr("style");
    if(hours.length >0)
    {
        hours.attr("check", "0");
        hours.find("span").removeAttr("style").attr("style", oldStyle);
    }
}

function cannotPick(orderedTime, place)
{
    var unableHour = [0, 1, 2, 3, 4, 5, 23];
    if (orderedTime && orderedTime.length > 0)
    {
        for(var i=0;i<orderedTime.length;i++)
        {
            if (orderedTime[i].Address != place)
            {
                return;
            }

            var dec = GetHour(orderedTime[i].EndDate) - GetHour(orderedTime[i].BegingDate);
            if (dec == 1) {
                unableHour.push(GetHour(orderedTime[i].BegingDate))
            } else {
                for(var j=0;j<dec;j++)
                {
                    unableHour.push(GetHour(orderedTime[i].BegingDate) + j);
                }
            }
        }
    }
    
    //失效时段
    for (var jj = 0; jj < unableHour.length; jj++) {
        $(".hourBox ul li:eq(" + unableHour[jj] + ")").attr("check", 3);
        $(".hourBox ul li:eq(" + unableHour[jj] + ") div span").css("background-color", "#D5D5D5")
        $(".hourBox ul li:eq(" + unableHour[jj] + ") div span").css("border", "none")
        $(".hourBox ul li:eq(" + unableHour[jj] + ") div span").css("color", "#fff")
    }
}

//时间选择初始化
function initTimePiker() {
	
	
    //日期处理
    var minutes = 1e3 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var years = days * 365;
    var d1 = new Date();
    for (var d = 0; d < dateRange; d++) {
        var t = d1.getTime() + d * days;
        var d2 = new Date(t);
        $(".dateP ul").append("<li>" + d2.getFullYear() + "-" + (d2.getMonth() + 1) + "-" + d2.getDate() + "</li>");
    }
    cDate = $(".dateP ul li:eq(0)").html();
    $(".dateP ul").css("width", dateRange*$(".dateP").width());
    $(".dateP ul li").css("width", $(".dateP").width());
    $(".dateP ul li").height($(".dateP").height());
    $(".dateP ul li").css("line-height", $(".dateP").height() + "px");
    var dw = $(".dateP").width();
    //---------------------------------------------------
    var j = 0;
    $(".prev").on("click", function() {
        j--;
        if (j < 0) {
            j = 0;
        }
        $(".dateP ul").animate({
            left:-j * dw + "px"
        }, 300);
        cDate = $(".dateP ul li:eq(" + j + ")").html();
        lianJie();
        clearUnCheckedTime();
        initSports(cDate)
    });
    $(".next").on("click", function() {
        j++;
        if (j > dateRange - 1) {
            j = dateRange - 1;
        }
        $(".dateP ul").animate({
            left:-j * dw + "px"
        }, 300);
        cDate = $(".dateP ul li:eq(" + Math.abs(j) + ")").html();
        lianJie();
        clearUnCheckedTime();
        initSports(cDate)
    });
    //小时处理
    for (var i = 0; i < $(" ul div span").length; i++) {
        $(".hourBox ul div span:eq(" + i + ")").html(i);
    }
    $(".hourBox ul li").height($(".hourBox ul li").width());
    mp = $(".hourBox ul li").height() * .15;
    $(".hourBox ul li").addClass("default");
    $(".hourBox ul li").css("padding-bottom", mp);
    $(".hourBox ul li").css("padding-top", mp);
    $(".hourBox ul li div").css("padding-left", mp);
    $(".hourBox ul li div").css("padding-right", mp);
    $(".hourBox ul li div span").css("line-height", $(".hourBox ul li div span").height() + "px");
    $(".hourBox ul li").on("click", function() {
        if ($(this).attr("check") == 1) {
            $(this).attr("check", 0);
            $(this).removeClass("checked");
        } else if($(this).attr("check") == 0){
            $(this).attr("check", 1);
            $(this).addClass("checked");
        }
        lianJie();
    });
}
//时间选择并成订单
function lianJie() {
    bookarr = [];
    var d1 = null;
    var d2 = null;
    var l = $(".hourBox ul li").length;
    var c = "#B9FBFB";
    for (var d = 0; d < l; d++) {
        var obj = $(".hourBox ul li:eq(" + d + ")");
        var obj1 = $(".hourBox ul li:eq(" + (d - 1) + ")");
        var obj3 = $(".hourBox ul li:eq(" + (d + 1) + ")");
		
        if (obj.attr("check") == 1) {
            if ((obj1.attr("check")!=1) && obj3 && obj3.attr("check") == 1) {
                d1 = d;
                obj.children("div").css("background-color", c);
                obj.children("div").css("border-radius", "50% 0 0 50%");
                obj.children("div").css("margin-left", mp);
                obj.children("div").css("padding-left", 0);
            } else if (obj1 && obj1.attr("check") == 1 && obj3.attr("check") !=1) {
                //2	
                bookarr.push(returnJson(d1, d));
                obj.children("div").css("background-color", c);
                obj.children("div").css("border-radius", "0 50% 50% 0");
                obj.children("div").css("margin-right", mp);
                obj.children("div").css("padding-right", 0);
            } else if (obj1 && obj1.attr("check") == 1 && obj3 && obj3.attr("check") == 1) {
                obj.children("div").css("background-color", c);
                obj.children("div").css("border-radius", "0 0 0 0");
                obj.children("div").css("margin-right", 0);
                obj.children("div").css("padding-right", mp);
                obj.children("div").css("margin-left", 0);
                obj.children("div").css("padding-left", mp);
            } else if ((!obj1 || obj1.attr("check") !=1) && (!obj3 || obj3.attr("check")!=1)) {
                d1 = d;
                bookarr.push(returnJson(d1, d));
                obj.children("div").css("background-color", "#fff");
                obj.children("div").css("border-radius", "0 0 0 0");
                obj.children("div").css("margin", 0);
                obj.children("div").css("padding-right", mp);
                obj.children("div").css("padding-left", mp);
            }
        }
        if (obj.attr("check") == 0) {
            obj.children("div").css("background-color", "#fff");
            obj.children("div").css("border-radius", "0 0 0 0");
            obj.children("div").css("margin", 0);
            obj.children("div").css("padding-right", mp);
            obj.children("div").css("padding-left", mp);
        }
    }
    creatOrder(bookarr);
}

function creatOrder(arr) {
    $("#orderList1").empty();
    //---------------------------
    var jsStr = "{ 'cd':'" + bookcd + "','data' : [";
    for (var i = 0; i < arr.length; i++) {
        if (i != arr.length - 1) {
            jsStr += arr[i] + ",";
        } else {
            jsStr += arr[i];
        }
    }
    jsStr += "],'tlongth':0}";
    jsonObj = eval("(" + jsStr + ")");
    jsonObj.tLongth = 0;
    //----------------------------
    var m = 0;
    for (var ii = 0; ii < jsonObj.data.length; ii++) {
        // $("#orderList1").append('<li style="text-shadow:none; width:100%; float:left;background:#e7eaef; height:auto "><div class="m1l" style="width:80%; margin:0 auto;height:1.5em; line-height:1.5em "><p style="border-radius:5px;float:left; background:#69bbe1; color:#fff; text-align:center; width:20%; height:100%;">2号场地</p><p class="xinx" style="float:left; margin-left:5px;">'+jsonObj.data[ii].date+' '+jsonObj.data[ii].timeFrom+'---'+jsonObj.data[ii].timeTo+'<br/></p></div></li>')
        m++;
        $("#orderList1").append('<li ><span style=" font-weight:bold">' + m + '. </span> <span style="text-shadow:none; color:#fff; border-radius:0.3em; background-color:#0Cc; padding:0.3em;" >' + jsonObj.cd + "</span> " + jsonObj.data[ii].date + " " + jsonObj.data[ii].timeFrom + "—" + jsonObj.data[ii].timeTo + ' <span style="float:right;">' + jsonObj.data[ii].tLongth + "小时 </span>  </li>");
        jsonObj.tLongth += jsonObj.data[ii].tLongth;
    }
    if (jsonObj.tLongth) {
        $("#orderList1").append('<li><span style=" color:#f00;float:right">合计: ' + jsonObj.tLongth + "小时 </span>  </li>");
    } else {
        $("#orderList1").append("<li>选择时间生成订单</li>");
    }
    $("#orderList1").listview("refresh");
}

function returnJson(d, d2) {
    if (d == d2) {
        return "{'date':'" + cDate + "','timeFrom':'" + d + ":00','timeTo':'" + (d2 + 1) + ":00','tLongth':1}";
    } else {
        return "{'date':'" + cDate + "','timeFrom':'" + d + ":00','timeTo':'" + (d2 + 1) + ":00','tLongth':" + (d2 - d + 1) + "}";
    }
}