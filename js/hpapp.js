// JavaScript Document
ww = $(window).width();

hh = $(window).height();

var rootPath = "http://app.glpipark-xian.com:8002/";
//var rootPath = "http://127.0.0.1/";

function ChangeDateFormat(val) {
    if (val != null) {
        var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
        //月份为0-11，所以+1，月份小于10时补个0
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours();
        if(hour<10)
        {
            hour = "0" + hour;
        }

        var min = date.getMinutes();
        if (min < 10)
        {
            min = "0" + min;
        }
        return date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" + min;
    }

    return "";
}

function GetHour(val)
{
    if (val != null) {
        var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
        return date.getHours();
    }

    return "";
}

function showLoading() {
    $.mobile.loading('show', {
        text: '',
        textVisible: false,
        theme: 'a',
        html: ""
    });
}

function hideLoading() {
    $.mobile.loading('hide', {
        textVisible: false
    });
}
getCurrentDate = function () {
    return new Date();
}

getCurrentWeek = function () {
    var now = new Date();
    var start = new Date();
    var end = new Date();
    var startStop = new Array();
    var n = now.getDay();

    start.setDate(now.getDate() - n + 1);
    end.setDate(now.getDate() - n + 7);

    start = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate();
    end = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();
    //添加本周时间  
    startStop.push(start);//本周起始时间  
    //添加本周最后一天时间  
    startStop.push(end);//本周终止时间  
    //返回  
    return startStop;
};

/***
 * 获得本月的起止时间
 */
this.getCurrentMonth = function () {
    //起止日期数组  
    var startStop = new Array();
    //获取当前时间  
    var currentDate = getCurrentDate();
    //获得当前月份0-11  
    var currentMonth = currentDate.getMonth() + 1;
    //获得当前年份4位年  
    var currentYear = currentDate.getFullYear();
    //求出本月第一天  
    var firstDay = currentYear + "-" + currentMonth + "-01";
    var lastDay = currentYear + "-" + currentMonth + "-" + currentDate.getDate();

    //添加至数组中返回  
    startStop.push(firstDay);
    startStop.push(lastDay);
    //返回  
    return startStop;
};

function getMessage() {
    try {

        $(".xinx").on("click", function () {
            changePage("xx_tishi.html");
        })
        var today = getCurrentDate().getFullYear() + "-" + (getCurrentDate().getMonth() + 1).toString() + "-" + getCurrentDate().getDate();
        var lastCheckDate = localStorage.lastCheckDate || today;
        $.getJSON(rootPath + "/Hp_Service.asmx/MessageReturnByCard?callback=?", {
            strCardID: localStorage.CardID,
            datetime: lastCheckDate
        }, function (data) {
            localStorage.lastCheckDate = new Date(lastCheckDate).getFullYear() + "-" + (new Date(lastCheckDate).getMonth() + 1).toString() + "-" + (new Date(lastCheckDate).getDate() + 1);
            if (data.IsSuccess && data.Data && data.Data.length>0) {
                var aToStr = JSON.stringify(data.Data);
                localStorage.setItem("Messages", aToStr);
                $(".xinx").css("background-image", "url(images/xinx1.png)");
            }
        });
    } catch (m) {

    }
}

function initSports(date) {
    $.getJSON(rootPath + "/Hp_Service.asmx/SportSearch?callback=?", {
        strDate: date
    }, function (data) {
        if (data.IsSuccess) {
            var changdiString = "";
            changdiData = data.Data.SportOrders;
            for (var i = 0; i < data.Data.SportNames.length; i++) {
                
                if (i % 2 == 0) {
                    changdiString += "<div style='width:100%; height:50%; float:left;'>";
                }

                changdiString += "<div class='cd01'>" + data.Data.SportNames[i] + "</div>";
                if (i % 2 == 1) {
                    changdiString += "</div>";
                }
            }
            $("#divChangdi").html("");
            $("#divChangdi").append(changdiString);

            cdPicker();
            
            cannotPick(data.Data.SportOrders, bookcd)
        } else {
            alert("查询运动场信息失败，原因：" + data.Message);
        }

    });
}

//--------------------page1-index.html----------------------------//
$(document).on("pageinit", "#page1", function () {
});

$(document).on("pageshow", "#page1", function () {
    $(".h2").height(hh * 90 / 800);
    $(".h3").height(hh * 10 / 800);
    $(".h4").height(hh * 25 / 800);
    $(".h5").height(hh * 55 / 800);
    $(".logo").height(hh * 151 / 800);
    $(".name").height(hh * 75 / 800);
    $(".login").height(hh * 76 / 800);
    $(".foot").height(hh * 30 / 800);
    if (window.localStorage && localStorage.UserId) {
        changePage("gongneng.html");
    }
    $("#mimachongzhi").on("click", function () {
        changePage("mmcz.html");
    });
    $("#btnLogin").on("click", function () {
        var txtUsername = $.trim($("#txtUsername").val());
        var txtPassword = $.trim($("#txtPassword").val());
        if (txtUsername == "") {
            alert("请输入用户名");
            return;
        }
        if (txtPassword == "") {
            alert("请输入密码");
            return;
        }
        showLoading();
        $.getJSON(rootPath + "/Hp_Service.asmx/UserLogin?callback=?", {
            strUserID: txtUsername,
            strPassword: txtPassword
        }, function (data) {
            hideLoading();
            if (!data.IsSuccess) {
                alert("用户名或者密码错误，请重试");
                return;
            }
            $.getJSON(rootPath + "/Hp_Service.asmx/GetUserInfo?callback=?", {
                strUserID: txtUsername
            }, function (res) {
                if (window.localStorage) {
                    localStorage.UserId = data.Data.Id;
                    localStorage.Email = res.Data.email;
                    localStorage.CardID = res.Data.cardid;
                    localStorage.IDCardNo = res.Data.personid;
                    changePage("gongneng.html");
                }
                else {
                    alert("您的手机不支持本地存储，所以不能自动登录");
                    changePage("gongneng.html");
                }
            });
        });
    });


});

//--------------------page2-yuding_cx.html----------------------------//
$(document).on("pageinit", "#page2", function () {
    $(".h1").height(hh * 85 / 800);
    $(".h2").height(hh * 1 / 800);
    $(".top").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".user").height(hh * 80 / 800);
    $(".main").height(hh * 575 / 800);
    $(".chz").height(hh * 55 / 800);
});

$(document).on("pageshow", "#page2", function () { });

//--------------------page3-cz_jilu.html----------------------------//
$(document).on("pageinit", "#page3", function () {
    $(".h1").height(hh * 85 / 800);
    $(".h2").height(hh * 6 / 800);
    $(".top").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".user").height(hh * 80 / 800);
    $(".m1").height($(".foot").height() + 10);
});

$(document).on("pageshow", "#page3", function () {
    getMessage();
    $("#btnIndex").bind("click", function () {
        goIndex();
    });

    $("#btnCardId").val("卡号：" + localStorage.CardID);
    showLoading();
    $.getJSON(rootPath + "/Hp_Service.asmx/RechargeList?callback=?", {
        strCardID: localStorage.CardID,
        strBegingDate: "2014-1-1",
        strEndDate: "2024-1-1"
    }, function (data) {
        hideLoading();
        $("#lvRecords").html("");
        if (data.IsSuccess) {
            for (var i = 0; i < data.Data.length; i++) {
                var temp = $("#recordTemp").clone();
                var spans = temp.find("p span");
                spans.eq(1).text(data.Data[i].Money);
                spans.eq(3).text(ChangeDateFormat(data.Data[i].OperDate));
                $("#lvRecords").append(temp.html());
            }
            $("#lvRecords").listview("refresh");
        } else {
            alert("查询充值记录失败，原因：" + data.Message);
        }
    });
});

//--------------------page4-jy_liushuizhang.html----------------------------//
$(document).on("pageinit", "#page4", function () {
    ww = $(window).width();
    hh = $(window).height();
    $(".h1").height(ww * 85 / 480);
    $(".h2").height(ww * 6 / 480);
    $(".top").height(ww * 80 / 480);

    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".user").height(ww * 80 / 480);
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", ww * 5 / 480);
    $(".foot").height(ww * 65 / 480);

    $(".menu").height(ww * 55 / 480);
    $(".menu").css("lineHeight", $(".menu").height() + "px");
    $(".m1").height($(".bot").height() + 10);
    $(".bot").height($(".foot").height() + $(".menu").height());
    

    
});

$(document).on("pageshow", "#page4", function () {
    getMessage();
    function getLiuShui(start, end) {
        showLoading();
        $.getJSON(rootPath + "/Hp_Service.asmx/TransactionList?callback=?", {
            strCardID: localStorage.CardID,
            strBegingDate: start,
            strEndDate: end
        }, function (data) {
            hideLoading();
            $("#lvLiushuizhang").html("");
            if (data.IsSuccess) {
                for (var i = 0; i < data.Data.length; i++) {
                    var temp = $("#recordTemp").clone();
                    var spans = temp.find("p span");
                    spans.eq(1).text(data.Data[i].Money);
                    spans.eq(3).text(data.Data[i].Address);
                    spans.eq(5).text(ChangeDateFormat(data.Data[i].OperDate));
                    $("#lvLiushuizhang").append(temp.html());
                }
                $("#lvLiushuizhang").listview("refresh");
            } else {
                alert("查询消费明细失败，原因：" + data.Message);
                $("#lvLiushuizhang").html("");
            }
        });
    }

    $(".jyls").on("click", function () {
        $(".jyls").removeClass("jyls1")
        $(this).addClass("jyls1");

        switch ($(this).text()) {
            case "本周":
                getLiuShui(getCurrentWeek()[0].toString(), getCurrentWeek()[1].toString());
                break;
            case "本月":
                getLiuShui(getCurrentMonth()[0].toString(), getCurrentMonth()[1].toString());
                break;
            case "三个月":
                var d = new Date();
                var e = d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getDate();
                var s = d.getFullYear() + "-" + (parseInt(d.getMonth()) - 2) + "-" + d.getDate();
                getLiuShui(s, e)
                break;
        }
    });

    $("#btnIndex").on("click", function () {
        goIndex();
    });

    $("#btnCardId").val("卡号：" + localStorage.CardID);
    $(".jyls").eq(0).addClass("jyls1");
    getLiuShui(getCurrentWeek()[0].toString(), getCurrentWeek()[1].toString());

});

//--------------------page5-xx_tishi.html----------------------------//
$(document).on("pageinit", "#page5", function () {
    $(".h1").height(hh * 85 / 800);
    $(".h2").height(hh * 6 / 800);
    $(".top").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".user").height(hh * 80 / 800);
    $(".m1").height($(".foot").height() + 10);
});

$(document).on("pageshow", "#page5", function () {
    
    $("#btnMessageCardid").val(localStorage.CardID);

    $("#btnIndex_xx_tishi").bind("click", function () {
        goIndex();
    });

    $("#listViewMessage").html("");
    if(localStorage.Messages)
    {
        var messages = JSON.parse(localStorage.Messages);

        for (var i = 0; i < messages.length; i++) {
            var temp = $("#messageTemplete ul").clone();
            var spans = temp.find(".pDetail");
            spans.eq(0).html("<img src='images/xx1.png'><span style='margin-top:3px;'>" + messages[i].Message + "</span>");
            $("#listViewMessage").append(temp.html());
        }
    }

    var history = [];
    if (localStorage.HistoryMessages) {
        history = JSON.parse(localStorage.HistoryMessages);
    }
        for (var i = 0; i < history.length; i++) {
            var temp = $("#messageTemplete ul").clone();
            var spans = temp.find(".pDetail");
            spans.eq(0).html("<img src='images/xx2.png'><span style='margin-top:3px;'>" + history[i].Message + "</span>");
            $("#listViewMessage").append(temp.html());
        }

        if (localStorage.Messages)
        {
            var messages = JSON.parse(localStorage.Messages);
            history.push(messages);
            localStorage.removeItem("Messages");
            localStorage.HistoryMessages = JSON.stringify(messages)
            alert(localStorage.HistoryMessages)
        }

    $("#listViewMessage").listview("refresh");

    $("#listViewMessage li").on("click", function () {
        var img = $(this).find("img").attr("src");
        if (img == "images/xx1.png") {
            $(this).find("img").attr("src","images/xx2.png")
        }
    })
});

//--------------------page6-yue_cx.html----------------------------//
$(document).on("pageinit", "#page6", function () {
    $(".h1").height(hh * 85 / 800);
    $(".h2").height(hh * 6 / 800);
    $(".top").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".user").height(hh * 80 / 800);
    $(".user").css("lineHeight", $(".user").height() + "px");
    $(".yean").height(hh * 110 / 800);
    $(".yean").css("lineHeight", $(".yean").height() + "px");
    $(".m1").height($(".foot").height() + 500);
});

$(document).on("pageshow", "#page6", function () {
    getMessage();
    $("#btnJiaoyiliushui").on("click", function () {
        changePage("jy_liushuizhang.html");
    });
    $("#btnChongzhijilu").on("click", function () {
        changePage("cz_jilu.html");
    });
    $("#btnIndex").on("click", function () {
        goIndex();
    });
    showLoading();
    //alert(localStorage.CardID)
    $.getJSON(rootPath + "/Hp_Service.asmx/Residual?callback=?", {
        strCardID: localStorage.CardID
    }, function (data) {
        hideLoading();
        if(data.IsSuccess){
            $("#txtCardId1").text(localStorage.CardID)
            $("#txtMoney").text("余额：" + data.Data.ResiDual.toFixed(2) + " 元");
        } else {
            alert("查询余额失败，原因："+data.Message);
        }
    });
});

//--------------------page7-zh_chongzhi.html----------------------------//
$(document).on("pageinit", "#page7", function () {
    $(".h1").height(hh * 85 / 800);
    $(".h2").height(hh * 6 / 800);
    $(".top").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".user").height(hh * 80 / 800);
    $(".yean").height(hh * 110 / 800);
    $(".yean").css("lineHeight", $(".yean").height() + "px");
    $(".yecz").height(hh * 155 / 800);
    $(".yecz").css("lineHeight", $(".yecz").height() + "px");
    $(".yeczxxx").height(hh * 155 / 800);
    $(".yeczxxx").css("lineHeight", $(".yecz").height() + "px");
    $(".m1").height($(".foot").height() + 500);
    $(".yeczxxx").hide();
    $("#radio-choice-d").click(function () {
        $(".yeczxxx").show();
    });
    $("#radio-choice-c").click(function () {
        $(".yeczxxx").hide();
    });

});

$(document).on("pageshow", "#page7", function () {
    getMessage();
    $("#btnIndex").bind("click", function () {
        goIndex();
    });

    var checkedValue = "current";
    $("input[name='radio-choice-b']").click(function () {
        if($(this).attr("value") == "current")
        {
            checkedValue = "current";
            $(".yeczxxx").hide();
        } else {
            checkedValue = "other";
            $(".yeczxxx").show();
        }
    });

    $("#btnCardId").val("卡号：" + localStorage.CardID);

    $("#btnChongzhi").on("click", function () {
        var chongzhiCardId = localStorage.IDCardNo;
        
        if (checkedValue == "other")
        {
            chongzhiCardId = $("#otherCardId").val();
            if(chongzhiCardId == "")
            {
                alert("请输入要充值的身份证号码");
                return;
            }

            if (!confirm("请确认身份证号码 " + chongzhiCardId + " 是否正确？"))
            {
                return;
            }
        }
        var ref = window.open(rootPath + 'PhonePay.aspx?strCardId=' + chongzhiCardId + "&strMoney=" + $("#ddlMoney").val(), '_system', 'location=no');
        $("#messageDialog").popup("open");
    })
});

//--------------------page8-yuding_cx.html----------------------------//
$(document).on("pageinit", "#page8", function () {
    $(".h1").height(hh * 85 / 800);
    $(".h2").height(hh * 6 / 800);
    $(".h3").height(hh * 20 / 800);
    $(".top").height(hh * 80 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".menu").height(ww * 55 / 480);
    $(".menu").css("lineHeight", $(".menu").height() + "px");
    $(".user").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".m1").height($(".foot").height() + 200);
});

$(document).on("pageshow", "#page8", function () {
    getMessage();
    $("#btnIndex").bind("click", function () {
        goIndex();
    });
    function showYuding()
    {
        showLoading();
        $.getJSON(rootPath + "/Hp_Service.asmx/SportByPersonal?callback=?", {
            strCardID: localStorage.CardID
        }, function (data) {
            hideLoading();
            $(".dianjixg").html("");
            $(".dianjixg").listview("refresh");
            if (data.IsSuccess) {
                for (var i = 0; i < data.Data.length; i++) {
                    var temp = $("#yuyueItem ul").clone();
                    var spans = temp.find(".yuyueItemDetail");
                    spans.eq(0).attr("sportId", data.Data[i].SeqId);
                    temp.find("#hChangguanName").text(data.Data[i].Address);
                    spans.eq(0).html(ChangeDateFormat(data.Data[i].BegingDate) + " -- " + ChangeDateFormat(data.Data[i].EndDate));
                    $(".dianjixg").append(temp.html());
                }
                $(".dianjixg").listview("refresh");

                $(".dianjixg li").on("click", function () {
                    //alert("xxxxxxxxxxx")  选择与取消 功能
                    if ($(this).val() == "0") {
                        $(this).val(1)
                        $(this).find("img").attr("src", "images/duih2.png")

                    } else {
                        $(this).val(0)
                        $(this).find("img").attr("src", "images/duih1.png")
                    } $(".dianjixg").listview("refresh");

                });
            } else {
                alert("获取预定记录失败，原因：" + data.Message);
            }
            
        });
    }
    showYuding();

    $("#btnCancelR").on("click", function () {
        var items = $(".dianjixg li[value=1]");
        if (!items || items.length == 0)
        {
            alert("没有要取消的预约");
            return;
        }

        if (items.length > 0) {
            var idList = "";
            if (window.confirm("你确定要取消预约吗？")) {
                
                for (var i = 0; i < items.length; i++) {
                    var sportId = items.eq(i).find(".yuyueItemDetail").attr("sportId");
                    idList += sportId + ",";
                }

                if(idList.length>0)
                {
                    idList = idList.substring(0, idList.length - 1);
                }
                $("#btnYuding_Username").val("用户名：" + localStorage.Email);
                showLoading();
                $.getJSON(rootPath + "/Hp_Service.asmx/CancelOrder?callback=?", {
                    seqId: idList
                }, function (data) {
                    hideLoading();
                    if (data.IsSuccess) {
                        alert("取消预约成功");
                        showYuding();
                    } else {
                        alert("取消预约失败，原因：" + data.Message);
                    }
                });
            }
        }
    });
    $("#btnYuding_Username").val("用户名：" + localStorage.Email);
    
});

//--------------------page9-caiwu_gl.html----------------------------//
$(document).on("pageinit", "#page9", function () {
    $(".h1").height(hh * 80 / 800);
    $(".h2").height(hh * 6 / 800);
    $(".h3").height(hh * 20 / 800);
    $(".top").height(hh * 80 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".menu").height(ww * 55 / 480);
    $(".menu").css("lineHeight", $(".menu").height() + "px");
    $(".user").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".m1").height($(".foot").height() + 200);

});

$(document).on("pageshow", "#page9", function () {
    getMessage();
    $("#yuechaxun").on("click", function () {
        changePage("yue_cx.html");
    });
    $("#chongzhijiluchaxun").on("click", function () {
        changePage("cz_jilu.html");
    });
    $("#jiaoyiliushuichaxun").on("click", function () {
        changePage("jy_liushuizhang.html");
    });
    $("#zhanghuchongzhi").on("click", function () {
        changePage("zh_chongzhi.html");
    });
    $("#btnIndex").bind("click", function () {
        goIndex();
    });
});

//--------------------page10-zh_gl.html----------------------------//
$(document).on("pageinit", "#page10", function () {
    $(".h1").height(hh * 80 / 800);
    $(".h2").height(hh * 6 / 800);
    $(".h3").height(hh * 20 / 800);
    $(".top").height(hh * 80 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".menu").height(ww * 55 / 480);
    $(".menu").css("lineHeight", $(".menu").height() + "px");
    $(".user").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".m1").height($(".foot").height() + 200);

    /*没有信息调用下面这一句*/
    $(".xinx").css("background-image", "url(images/xinx.png)");
    /*有信息调用下面这一句
	$(".xinx").css("background-image","url(../images/xinx1.png)");
	*/


});

$(document).on("pageshow", "#page10", function () {
    
    $("#btnIndex").on("click", function () {
        goIndex();
    });

    $("#btnEditUser").on("click", function () {
        var txtEmail = $("#txtUserEmail").val();
        var txtTel = $("#txtUserTel").val();
        
        if (txtTel == "")
        {
            alert("请输入联系电话");
            return;
        }
            if (txtEmail == "") {
                alert("请输入Email");
                return;
            } 
            if (txtTel != $("#txtTel").text() || txtEmail != $("#txtEmail").text()) {
                showLoading();
                $.getJSON(rootPath + "/Hp_Service.asmx/EditUserInfo?callback=?", {
                    strUserID: localStorage.UserId,
                    strEmail: txtEmail,
                    strPhone: txtTel
                }, function (data) {
                    hideLoading();
                    if (data.IsSuccess) {
                        localStorage.Email = data.Data.email;
                        $("#txtTel").text(txtTel);
                        $("#txtEmail").text(txtEmail);
                        $("#popupEditUser").popup("close");
;                    } else {
                        alert(data.Message)
                    }
                });
            } else {
                $("#popupEditUser").popup("close");
            }
    });

    showLoading();
    $.getJSON(rootPath + "/Hp_Service.asmx/GetUserInfo?callback=?", {
        strUserID: localStorage.Email
    }, function (data) {
        hideLoading();
        if (!data.IsSuccess) {
            alert("获取用户信息失败，原因："+data.Message);
            return;
        } else {
            $("#txtUsername").text(data.Data.name);
            $("#txtCardId").text(data.Data.cardid);
            $("#txtStatus").text(data.Data.state);
            $("#txtDate").text(data.Data.sendcarddate);
            $("#txtAccount").text(data.Data.email);
            $("#txtTruename").text(data.Data.name);
            $("#txtSex").text(data.Data.sex);
            $("#txtCompany").text(data.Data.company);
            $("#txtIDCard").text(data.Data.personid);
            $("#txtTel").text(data.Data.phone);
            $("#txtEmail").text(data.Data.email);

            $("#txtUserEmail").val(data.Data.email);
            $("#txtUserTel").val(data.Data.phone);
        }
    });

    getMessage();
});

//--------------------page11-gongneng.html----------------------------//
$(document).on("pageinit", "#page11", function () {
    //if (window.localStorage && !localStorage.UserId) {
    //    changePage("index.html");
    //}
    $(".h1").height(hh * 85 / 800);
    $(".h2").height(hh * 6 / 800);
    $(".h3").height(hh * 15 / 800);
    $(".gnan").height(hh * 205 / 800);
    $(".gn5").height(hh * 75 / 800);
    $(".top").height(hh * 80 / 800);
    $(".foot").height(hh * 65 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".fanh").css("margin-right", ww * 15 / 480);
    $(".fanh1").css("margin-left", ww * 15 / 480);
    $(".fanh1").css("margin-top", hh * 5 / 800);

    $(".user").height(hh * 80 / 800);
    $(".yean").height(hh * 110 / 800);
    $(".yean").css("lineHeight", $(".yean").height() + "px");
    $(".m1").height($(".foot").height() + 500);
});

$(document).on("pageshow", "#page11", function () {
    
    $("#zhanghuchaxun").on("click", function () {
        changePage("zh_gl.html");
    });
    $("#caiwuguanli").on("click", function () {
        changePage("caiwu_gl.html");
    });
    $("#changdiyuyue").on("click", function () {
        changePage("changdi_yy.html");
    });
    $("#yuyuechaxun").on("click", function () {
        changePage("yuding_cx.html");
    });
    $("#btnIndex").on("click", function () {
        goIndex();
    });
    $("#btnLogout").on("click", function () {
        localStorage.removeItem("UserId");
        localStorage.removeItem("Email");
        localStorage.removeItem("CardID");
        changePage("index.html");
    });

    getMessage();
});

//--------------------page12-changdi_yy.html----------------------------//
$(document).on("pageinit", "#page12", function () {
    $(".h2").height(hh * 6 / 800);
    $(".h3").height(hh * 20 / 800);
    $(".top").height(hh * 80 / 800);
    $(".top").css("lineHeight", $(".top").height() + "px");
    $(".menu22").height(hh * 72 / 800);
    //$(".menu22").css("lineHeight",$(".menu22").height()+"px");
    $(".menu22 p").css("lineHeight", hh * 36 / 800 + "px");
    $(".hed").height($(".top").height() + $(".menu22").height());
    $(".h1").height($(".hed").height());
    $(".fanh").css("margin-right", hh * 15 / 800);
    $(".fanh1").css("margin-left", hh * 15 / 800);
    $(".fanh1").css("margin-top", hh * 5 / 800);
    $(".menu1").height(hh * 110 / 800);
    $(".menu1").css("lineHeight", hh * 55 / 800 + "px");
    //$(".time").height(hh*380/800);
    //$(".main1 li").height(hh*56/800);
    $(".ti1").height(hh * 75 / 800);
    $(".ti1").css("lineHeight", hh * 75 / 800 + "px");
    //	$(".m1l").height(hh*40/800);
    //$(".m1l").css("lineHeight",hh*40/800+"px");
    //$(".xinx").css("lineHeight",hh*20/800+"px");
    $(".cdan").height(hh * 70 / 800);
    $(".cdan").css("padding-top", hh * 10 / 800 + "px");
    $(".cdan1").css("lineHeight", hh * 60 / 800 + "px");
    $(".foot").height(hh * 65 / 800);
    $(".m1").height($(".foot").height());
});

//------------------------------------提交订单页面-------------------------------------------------------------------


$(document).on("pageshow", "#page12", function () {
    

    $("#btnIndex").on("click", function () {
        goIndex();
    });

    changdiData = [];
    //允许的日期范围
    dateRange = 7;
    mp = null;
    bookarr = [];
    bookcd = "";

    cDate = null;
    //不可选 时段
    initTimePiker();
    var currDate = new Date();
    initSports(currDate.getFullYear() + "-" + (parseInt(currDate.getMonth()) +1) + "-" + currDate.getDate());

    //订单json
    jsonObj = null;
    
    $("#btn_order").on("click", function () {
        if (jsonObj && jsonObj.tLongth) {
            //---------提交订单json-------//---------提交订单json-------//---------提交订单json-------
            for (var i = 0; i < jsonObj.data.length; i++) {
                $.getJSON(rootPath + "/Hp_Service.asmx/SportOrderByPersonal?callback=?", {
                    strCardID: localStorage.CardID,
                    strSportName: jsonObj.cd,
                    strBeginTime: jsonObj.data[i].date + " " + jsonObj.data[i].timeFrom,
                    strEndTime: jsonObj.data[i].date + " " + jsonObj.data[i].timeTo,
                }, function (data) {
                    alert(data.Message)
                });
            }
        } else {
            alert("请选择要预约的时间！");
        }
    });
});

function goIndex() {
    $.mobile.navigate("gongneng.html", {
        transition: "slide"
    });
}

function changePage(url) {
    $.mobile.navigate(url, {
        transition: "slide"
    });
}

/*--------------------软件安装 新加----------------------------*/
$(document).on("pageinit", "#page15", function () {

    $(".rootbox").width(ww);
    $(".rootbox").height(hh);

    $(".h1").height(ww * 85 / 480);
    $(".h2").height(ww * 6 / 480);



});



$(document).on("pageinit", "#page13", function() {

 	$(".h1").height(ww*85/480);
	$(".h2").height(ww*6/480);
	$(".h3").height(ww*50/480);
	$(".mman").height(ww*55/480);
	$(".mman").css("lineHeight",$(".mman").height()+"px");
	$(".mmt1").height(ww*100/480);
	$(".mmt1").css("padding-top",ww*30/480);
    $(".top").height(ww*80/480);
	$(".foot").height(ww*65/480);
	$(".top").css("lineHeight",$(".top").height()+"px");
	
	$(".fanh").css("margin-right",ww*15/480);
	
	$(".fanh1").css("margin-left",ww*15/480);
	$(".fanh1").css("margin-top",ww*5/480);
	
	
	$(".user").height(ww*80/480);

 	$(".m1").height($(".foot").height()+10)
   
   
});
$(document).on("pageshow", "#page13", function () {
    $("#btnIndex").on("click", function () {
        changePage("index.html");
    });
    $("#btnFindPassword").on("click", function () {
        var IDcard = $("#textinput-disabled").val();
        if(IDcard == "")
        {
            alert("请输入身份证号码");
            return;
        }

        $.getJSON(rootPath + "/Hp_Service.asmx/FindPassWord?callback=?", {
            strUserID: IDcard
        }, function (data) {
            alert(data.IsSuccess)
            if(data.IsSuccess)
            {
                changePage("mmcz1.html");
            } else {
                alert("找回密码失败，原因：" + data.Message);
            }
        });
    })
});


$(document).on("pageinit", "#page14", function() {

 	$(".h1").height(ww*85/480);
	$(".h2").height(ww*6/480);
	$(".h3").height(ww*50/480);
	$(".mman").height(ww*55/480);
	$(".mman").css("lineHeight",$(".mman").height()+"px");
	$(".mmt1").height(ww*100/480);
	$(".mmt1").css("padding-top",ww*30/480);
    $(".top").height(ww*80/480);
	$(".foot").height(ww*65/480);
	$(".top").css("lineHeight",$(".top").height()+"px");
	
	$(".fanh").css("margin-right",ww*15/480);
	
	$(".fanh1").css("margin-left",ww*15/480);
	$(".fanh1").css("margin-top",ww*5/480);
	
	
	$(".user").height(ww*80/480);

 	$(".m1").height($(".foot").height()+100)
   
   
});

$(document).on("pageshow", "#page14", function () {
    $("#btnIndex").on("click", function () {
        goIndex();
    });
});

$(document).on("pageinit", "#page15", function() {

	$(".rootbox").width(ww);
	$(".rootbox").height(hh);

 	$(".h1").height(ww*85/480);
	$(".h2").height(ww*6/480);

   
   
});


