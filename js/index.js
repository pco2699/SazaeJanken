/**
 * Created by pco2699 on 2017/04/01.
 */

var te_str_jp = ["チョキ", "グー", "パー"] //じゃんけんの手の日本語名を格納する配列;
var te_str_en = ["cho", "guu", "par"];

var te_num_arr = {cho: 0, guu: 1, par: 2};

$(function () {
    var comp_te_num = calcRandom();
    var play_video_num = calcRandom();

    $("#guu_btn").on("click", function () {
        play_opening(play_video_num);

        $("#guu_btn").addClass("selected");

        $("#cho_btn").animate({'opacity':0}, 300, "swing");
        $("#cho_btn").addClass("hided");


        $("#par_btn").animate({'opacity':0}, 300, "swing");
        $("#par_btn").addClass("hided");

        onVideoEnded(comp_te_num, te_num_arr["guu"], play_video_num);
    });

    $("#cho_btn").on("click", function () {
        play_opening(play_video_num);

        $("#cho_btn").addClass("selected");

        $("#guu_btn").animate({'opacity':0}, 300, "swing");
        $("#guu_btn").addClass("hided");


        $("#par_btn").animate({'opacity':0}, 300, "swing");
        $("#par_btn").addClass("hided");

        onVideoEnded(comp_te_num, te_num_arr["cho"], play_video_num);
    });

    $("#par_btn").on("click", function () {
        play_opening(play_video_num);

        $("#par_btn").addClass("selected");

        $("#cho_btn").animate({'opacity':0}, 300, "swing");
        $("#cho_btn").addClass("hided");

        $("#guu_btn").animate({'opacity':0}, 300, "swing");
        $("#guu_btn").addClass("hided");

        onVideoEnded(comp_te_num, te_num_arr["par"], play_video_num);
    });
});

function onVideoEnded(comp_te_num, player_te_num, play_video_num) {
    var title_arr = [
        ["金魚すくいの女王","うちの前座さん","電車を待ちながら"],
        ["ワカメ 冬の通学路", "マスオチャレンジ精神","お父さんが怖いもの"],
        ["タラちゃん涙の味", "こんにちは ご先祖さま", "健康がいちばん"]
    ];

    $('#sazae_area video').on("ended", function () {
        $('#sazae_area').children("div").show();
        $('#sazae_area').removeClass("no_background");
        $('#sazae_area video').hide();

        // 予告のナレーションは12.5秒後
        var base = 12500;
        // 各タイトルの間隔は1.5秒
        var addTime = 1500;


        setTimeout(function () {
            $('.sazae_item:nth-child(1)').html(title_arr[play_video_num][0]);
            $('.sazae_item:nth-child(1)').fadeIn(1000);
        }, base);

        base += addTime;
        setTimeout(function () {
            $('.sazae_item:nth-child(2)').html(title_arr[play_video_num][1]);
            $('.sazae_item:nth-child(2)').fadeIn(1000);
        }, base);

        base += addTime;
        setTimeout(function () {
            $('.sazae_item:nth-child(3)').html(title_arr[play_video_num][2]);
            $('.sazae_item:nth-child(3)').fadeIn(1000);
        }, base);

        base += 2680;
        setTimeout(function () {
            var sazae_area = $('#sazae_area');
            var sazae_area_video = $('#sazae_area video');


            sazae_area.children("div").hide();
            sazae_area.addClass("no_background");
            sazae_area_video.remove();
            sazae_area.html('<video muted id="janken_video"><source src="video/' + te_str_en[comp_te_num] +'.mp4" type="video/mp4"></video>')

            $('#sazae_area video#janken_video').show();
            $('#sazae_area video#janken_video')[0].play();
        }, base);

        base += 4800;
        setTimeout(function () {
            var result = judgeJanken(comp_te_num, player_te_num);
            setResult(te_str_jp[comp_te_num], result);
            if (result) {
                // 勝ちなら価値の音楽を流す
                setTimeout(function () {
                    $("#sazae_sound").removeAttr("src");
                    $("#sazae_sound").attr("src", "audio/smile.mp3");
                    $("#sazae_sound")[0].play();
                }, 11000);

                setTimeout(function () {
                    var falling_sazae = count_object();

                    setInterval(function () {
                        var random_num = Math.floor(Math.random() * 50 + 1);

                        if (random_num === 1) {
                            falling_sazae.addArr(new FallingSazae(falling_sazae.getCnt()));
                        }
                        for (var arr of falling_sazae.getArr()) {
                            arr.gravity();
                        }
                    }, 10);
                }, 15000);
            }
            else{
                setTimeout(function () {
                    var pc_selector = $("#pc");
                    var result_selector = $("#num");

                    pc_selector.html('<a href="javascript:history.go(0)">再挑戦する</a>');
                    result_selector.empty();

                }, 2000)
            }
        }, base);

    });
}

function setResult(comp_te_str, result_str) {
    var pc_selector = $("#pc");
    var result_selector = $("#num");

    pc_selector.html(comp_te_str);
    result_selector.html(result_str);
}

// ランダム値(0〜2)を計算する関数
function calcRandom() {
    return  Math.floor(Math.random() * 3);
}

// じゃんけんを判定する関数
function judgeJanken(comp_te_num, player_te_num) {
    if (comp_te_num === player_te_num) {
        return "あいこ";
    }
    else if ((player_te_num + 1) % 3 === comp_te_num % 3){
        return "負け";
    }
    else {
        return "勝ち";
    }
}

function count_object() {
    var cnt = 0;
    var image_array = [];

    return {
        getArr : function () {
            return image_array;
        },
        addArr : function (arr) {
            cnt++;
            image_array.push(arr);
        },
        getCnt :  function () {
            return cnt;
        }
    }
}

function play_opening(video_num) {
    $("#sazae_sound").attr("src", "audio/sazae" + (video_num + 1) + ".mp3");
    $("#sazae_sound")[0].play();

    $('#sazae_area').children("div").hide();
    $('#sazae_area').addClass("no_background");
    $('#sazae_area video').html('<source src="video/open.mp4" type="video/mp4">');
    $('#sazae_area video').show();
    $('#sazae_area video')[0].play();
}

function FallingSazae(id) {
    this.move_num = Math.floor(Math.random() * 10 + 1);
    this.move_speed = Math.random() * 10;


    this.rot_num = Math.floor(Math.random() * 10 + 1);
    this.rot_speed = Math.floor(Math.random() * 3 - 3);

    this.scale_num = Math.floor(Math.random() * 20 + 1) * 0.1;

    this.id = id;
    this.left = Math.floor(Math.random() * $(window).width());

    $("#sazae_surprise").append('<img src="img/e557f4e2c9fe090cfa9625ce6577c86c_2808.png" id ="sazae_img' + this.id + '">');
}
FallingSazae.prototype.gravity = function () {
    this.move_num += this.move_speed;
    this.rot_num += this.rot_speed;

    this.move = this.move_num + "px";
    $("img#sazae_img" + this.id).css({"transform": "rotate(" + this.rot_num + "deg) scale(" + this.scale_num + ")", "left": this.left + "px", "top": this.move_num + "px"});
    if(this.move_num > $(window).height()){
        $("img#sazae_img" + this.id).hide();
    }
}