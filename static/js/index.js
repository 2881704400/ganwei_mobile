var boxw = $('.box').width();
var boxh = $('.box').height();
var th = $('.box .t').height();
var lh = $('.box .l').height();
var bh = $('.box .b').height();
// ----------------canvas动画---------------------------
var canvas = document.getElementById('canvas-bg');
var ctx = canvas.getContext('2d');
var w = canvas.width = window.innerWidth || document.body.clientWidth;
var h = canvas.height = window.innerHeight || document.body.clientHeight;


// ---------------start---------------
// -------------默认配置--------------
var defaultFrame = null;
var hue = 225,
    stars = [],
    count = 0,
    maxStars = 1500;//星星数量

var canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');
canvas2.width = 100;
canvas2.height = 100;
var half = canvas2.width / 2,
    gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
gradient2.addColorStop(0.025, '#ccc');
gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
gradient2.addColorStop(1, 'transparent');

ctx2.fillStyle = gradient2;
ctx2.beginPath();
ctx2.arc(half, half, half, 0, Math.PI * 2);
ctx2.fill();

// End cache

function random(min, max) {
    if (arguments.length < 2) {
        max = min;
        min = 0;
    }

    if (min > max) {
        var hold = max;
        max = min;
        min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x, y) {
    var max = Math.max(x, y),
        diameter = Math.round(Math.sqrt(max * max + max * max));
    return diameter / 2;
    //星星移动范围，值越大范围越小，
}

var Star = function (opt, ct, st, flag) {

    this.orbitRadius = opt.orbitRadius !== undefined ? opt.orbitRadius : random(maxOrbit(w, h));
    // 星云半径
    this.radius = opt.radius !== undefined ? opt.radius : random(60, this.orbitRadius) / 8;
    //星星大小
    this.orbitX = opt.orbitX !== undefined ? opt.orbitX : w / 2;
    this.orbitY = opt.orbitY !== undefined ? opt.orbitY : h / 2;
    // 星云圆心坐标
    this.timePassed = opt.timePassed !== undefined ? opt.timePassed : random(0, maxStars);
    this.speed = opt.speed !== undefined ? opt.speed : random(this.orbitRadius) / 500000;
    //星星移动速度
    this.alpha = opt.alpha !== undefined ? opt.alpha : random(2, 10) / 10;

    if (flag === true) {
        ct++;
        st.push(this);
    } else {
        count++;
        stars[count] = this; 
    }
}

Star.prototype.draw = function (xFun, yFun, xF, yF) {
    // default: x -> sin, y -> cos
    var funcArr = ['sin', 'cos', 'tan', 'atan', 'atan2', 'asin', 'acos'];
    xFun = xFun || 0;
    yFun = yFun || 1;
    xF = xF || 1;
    yF = yF || 1;
    var x = Math[funcArr[xFun]](this.timePassed) * xF * this.orbitRadius + this.orbitX,
        y = Math[funcArr[yFun]](this.timePassed) * yF * this.orbitRadius + this.orbitY,
        twinkle = random(10);

    if (twinkle === 1 && this.alpha > 0) {
        this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
        this.alpha += 0.05;
    }

    ctx.globalAlpha = this.alpha;

    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
}

for (var i = 0; i < maxStars; i++) {
    new Star({});
}

function aniDefault() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.5; //尾巴
    ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
    ctx.fillRect(0, 0, w, h)

    ctx.globalCompositeOperation = 'lighter';
    for (var i = 1, l = stars.length; i < l; i++) {
        stars[i].draw();
    };

    defaultFrame = window.requestAnimationFrame(function () {
        aniDefault();
    });
}

// ---------------------粒子爆炸效果配置---------------------
var showCount = 0;
var showStars = [];
var showConf = {
    maxStars: 2200,
    orbitRadius: 1,
    radius: 1,
    orbitX: w / 2,
    orbitY: h / 2,
    speed: 0,
    rf: null
};
for (var i = 0; i < showConf.maxStars; i++) {
    showConf.orbitRadius = random(maxOrbit(1500, 2200));
    showConf.radius = random(70, 80);
    showConf.orbitX = random(w);
    showConf.orbitY = random(h);
    new Star(showConf, showCount, showStars, true);
}

// -----------------------粒子流星飞过配置-------------------
var meteorCount = 0;
var meteorStars = [];
var meteorConf = {
    maxStars: 1500,
    orbitRadius: 1,
    radius: 12,
    orbitX: 0,
    orbitY: h / 2 + 70,
    speed: 0.0007,
    rf: null
};
for (var i = 0; i < meteorConf.maxStars; i++) {
    new Star(meteorConf, meteorCount, meteorStars, true);
}


// ------------------------粒子爆炸效果---------------------
function aniShow(stArr) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.6; //尾巴
    ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
    ctx.fillRect(0, 0, w, h)

    ctx.globalCompositeOperation = 'lighter';
    for (var i = 1, l = stArr.length; i < l; i++) {
        stArr[i].draw(2, 0, -2.2);
    };

    showConf.rf = window.requestAnimationFrame(function () {
        aniShow(stArr);

        if (performance.now() <= 1700) {
            stArr.forEach(function (item) {
                item.orbitX = w / 2;
                item.orbitY = h / 2;
                item.speed += 0.001;

                if (item.radius > 0) {
                    item.radius -= random(0.7, 1);
                } else {
                    item.radius = 1
                }

                if (item.orbitRadius > 0) {
                    item.orbitRadius -= item.orbitRadius / 10;
                } else {
                    item.orbitRadius = 1;
                }

            });
        }

        if (performance.now() > 1700) {
            stArr.forEach(function (item) {
                item.speed = 0;
                
                item.orbitRadius += item.orbitRadius / 5.6;
                item.radius += item.radius >= 10 ? random(1.2, 3) : random(0.7, 1.2);
            });
        }

        if (performance.now() > 2400) {
            // $('.title .icon').removeClass('hide').addClass('ani');
            $('.title .txt').removeClass('hide').addClass('ani');
        }

        if (performance.now() > 2600) {
            step1(160);
        }

        if (performance.now() > 2800) {
            aniMeteor(meteorStars);
        }

        if (performance.now() > 3140) {
            window.cancelAnimationFrame(showConf.rf);
            aniDefault();
        }
        
    });
}


// --------------------粒子流星飞过----------------------------
function aniMeteor (stArr) {
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 1, l = stArr.length; i < l; i++) {
        stArr[i].draw(3, 1, undefined, undefined);
    };

    meteorConf.rf = window.requestAnimationFrame(function () {
        aniMeteor(stArr);

        stArr.forEach(function (item, index) {
            item.orbitX += random(40, 60) + item.orbitX / 18.7;
        });

        if (performance.now() > 3200) {
            $('.title .line').removeClass('hide').addClass('ani');
            
        }

        if (performance.now() > 3400) {
            $('.title .txt-en').removeClass('hide').addClass('ani');
        }

        if (performance.now() > 4000) {
            window.cancelAnimationFrame(meteorConf.rf);
        }

    });
}

aniShow(showStars);

// --------------星光轨迹动画---------------------------
var ele = document.querySelector('img.star-light');
var elew = $(ele).width();
var eleh = $(ele).height();
var eleScale = 1;
function step1(time) {
    $(ele).animate({ 'opacity': '1' }, time);
    Math.animation(0, (w - boxw) / 2 + boxw, time, 'quad.easeIn', (val, end) => {
        elew += elew > 267 ? 0 : 16;
        eleh += elew > 217 ? 0 : 16;
        var w = elew + 'px';
        var h = eleh + 'px';
        $(ele).css('width', w);
        $(ele).css('height', h);

        ele.style.left = val + 'px';
        if (end) {
            step2(200);
        }
    });

}

function step2(time) {

    Math.animation((w - boxw) / 2 + boxw, (w - boxw) / 2 + boxw + 800, time / 2, 'quad.easeOut', (val, end) => {
        ele.style.left = val + 'px';
        if (end) {
            Math.animation((w - boxw) / 2 + boxw + 800, (w - boxw) / 2 + boxw + 100, time / 2, 'quad.easeIn', (val, end) => {
                ele.style.left = val + 'px';
            });
        }
    });

    Math.animation(h / 2, h / 2 - 800, time, 'linear', (val, end) => {
        ele.style.top = val + 'px';
        if (end) {
            step3(400);
        }
    });

}

function step3(time) {

    Math.animation((w - boxw) / 2 + boxw + 100, (w - boxw) / 2, time, 'sine.easeOut', (val, end) => {
        ele.style.left = val + 'px';
    });

    Math.animation(h / 2 - 800, (h - boxh) / 2, time, 'sine.easeIn', (val, end) => {
        ele.style.top = val + 'px';
        eleScale += eleScale > 2.6 ? 0 : 0.08;
        $(ele).css('transform', 'scale(' + eleScale + ')');
        if (end) {
            $(ele).animate({ 'opacity': '0' }, 200);
            $('img.icon').animate({ 'opacity': '1' }, 300);
        }
    });
}


var flyto = document.querySelector('#mv-flyto');
flyto.width = w;

function flyInto() {
    flyto.play();
    $('#mv-flyto').css('z-index', '10').animate({
        'opacity': '1'
    }, 2000, 'linear', function () {
        window.cancelAnimationFrame(defaultFrame);
    });
}

$('.title img.icon').on('click', flyInto);