window.onload = function () {
    // 阻止事件的默认行为
    document.addEventListener("touchStart", function (ev) {
        ev = ev || event;
        ev.preventDefault();
    });
    // 适配方案
    (function () {
        //chrome下字体的默认大小是16
        //方案二   rem的适配     尺寸根据视口宽度来  rem的定义
        var styleNode = document.createElement("style");
        var w = document.documentElement.clientWidth / 16; //除以16的目的是不希望出现小数，初始定义视口宽度为1rem,但是这样会出现小数，所以除以16方便计算
        styleNode.innerHTML = "html{font-size: " + w + "px!important}";
        document.head.appendChild(styleNode);
    })();

    
    var arr = [
        "https://iknow-pic.cdn.bcebos.com/b64543a98226cffc192273a6b9014a90f603ea9e",
        "https://image-c-dev.weimobwmc.com/qa-saas-wxbiz/b3854b2e1af0462c8e845840c200b888.jpeg?imageMogr2/thumbnail/500x",
        "https://image-c-dev.weimobwmc.com/qa-saas-wxbiz/ac5bfeedc57441c69ef27023336f7a1d.jpg?imageMogr2/thumbnail/500x",
    ];

    var init = function () {
        drag();
        carouse(arr);
        changeColor();
    }

    var changeColor = function () {
        var list = document.querySelector('#wrap .content .nav .list');
        var liNodes = document.querySelectorAll('#wrap .content .nav .list li');
        list.addEventListener('touchend', function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            for (var i = 0; i < liNodes.length; i++) {
                liNodes[i].classList.remove('active');
                if (touchC.target.nodeName.toUpperCase() === 'A') {
                    //liNodes[i].classList.add('active');
                }
            }
        })
    }
    // 导航滑屏
    var drag = function () {
        // 滑屏区域
        var dragArea = document.querySelector('#wrap .content .nav');
        // 滑屏元素
        var dragItem = document.querySelector('#wrap .content .nav .list');
        var startX = 0;
        var elementX = 0;
        var miniX = dragArea.clientWidth - dragItem.offsetWidth;
        // 款速滑屏的必要元素
        var lastTime = 0;
        var lastPoint = 0;
        var timeDis = 0;
        var pointDis = 0;
        dragArea.addEventListener('touchstart', function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            startX = touchC.clientX;
            elementX = transePlugin.damu(dragItem, 'translateX');
            dragItem.style.transition = "none";

            // 快速滑屏
            lastTime = new Date().getTime();
            lastPoint = transePlugin.damu(dragItem, 'translateX');
            pointDis = 0; //目的是让点击的时候，元素不动，清除速度残留
        })
        dragArea.addEventListener('touchmove', function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            var nowX = touchC.clientX;
            var disX = nowX - startX; //每次滑动的距离
            var translateX = elementX + disX;
            // 橡皮筋效果 在move的过程中，每一次touchmove真正的有效距离慢慢变小，元素的滑动距离变大
            //(偏移量和布局视口的宽度,分母越大，拉力越大)
            // 只有在判断中，才有拉力效果
            if (translateX > 0) {
                var scare = document.documentElement.clientWidth / ((document.documentElement.clientWidth +
                    translateX) * 1.5);
                translateX = elementX + disX * scare;
            } else if (translateX < miniX) {
                var scare = document.documentElement.clientWidth / ((document.documentElement.clientWidth + (miniX -
                    translateX)) * 1.5);
                translateX = elementX + disX * scare;
            }
            transePlugin.damu(dragItem, 'translateX', translateX);

            // 快速滑屏
            var nowTime = new Date().getTime();
            var nowPoint = transePlugin.damu(dragItem, 'translateX');
            timeDis = nowTime - lastTime;
            pointDis = nowPoint - lastPoint;
            lastTime = nowTime;
            lastPoint = nowPoint;
        })

        dragArea.addEventListener('touchend', function (ev) {
            var translateX = transePlugin.damu(dragItem, 'translateX');
            timeDis = timeDis == 0 ? 1 : timeDis; //防止点击后，时间差为0；
            var speed = pointDis / timeDis; //快速滑屏   速度越大，位移越远
            speed = Math.abs(speed) < 0.5 ? 0 : speed; //防止中间块滑动的时候，产生抖动
            var targetX = translateX + speed * 200;
            var time = Math.abs(speed) * 0.2;
            time = time < 1 ? 1 : time;
            var bsr = '';
            if (targetX > 0) {
                targetX = 0;
                bsr = 'cubic-bezier(0.26,1.51,0.68,1.54)';
            } else if (targetX < miniX) {
                targetX = miniX;
                bsr = 'cubic-bezier(0.26,1,0.68,1)';
            }
            dragItem.style.transition = time + 's ' + bsr + 'transform';
            transePlugin.damu(dragItem, 'translateX', targetX);

        })
    }

    // 轮播
    function carouse(arr) {
        //   布局
        var baseLength = arr.length;
        arr = arr.concat(arr); //合并数组，目的是做无缝滚动
        var courseWrap = document.querySelector(".courseWrap");
        if (courseWrap) {
            var ulNode = document.createElement("ul");
            var styleNode = document.createElement('style');
            ulNode.classList.add("list");
            for (var i = 0; i < arr.length; i++) {
                ulNode.innerHTML +=
                    '<li><a href="javascript:;"><img src="' +
                    arr[i] +
                    '" alt=""></a></li>';
            }
            styleNode.innerHTML = '.courseWrap .list{list-style: none;width: ' + (arr.length) * 100 +
                '%;overflow: hidden;} .courseWrap .list li{width: ' + (1 / arr.length * 100) + '%;} '
            courseWrap.appendChild(ulNode);
            document.head.appendChild(styleNode);

        }

        //   滑屏
        var starX = 0; //手指开始点击的位置
        var starY = 0;
        var elementX = 0; //元素一开始的位置
        var elementY = 0
        courseWrap.addEventListener('touchstart', function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            starX = touchC.clientX;
            starY = touchC.clientY;
            elementX = transePlugin.damu(ulNode, 'translateX');
            elementY = transePlugin.damu(ulNode, 'translateY');
            // 无缝逻辑  点击第一组的第一张时，瞬间跳到第二组的最后一张，点击第二组的最后一张，瞬间跳到第一组的第一张
            var index = transePlugin.damu(ulNode, 'translateX') / document.documentElement.clientWidth; //index代表ul的位置
            if (-index === 0) {
                index = -baseLength
            } else if (-index === (arr.length - 1)) {
                index = -(baseLength - 1)
            }
            transePlugin.damu(ulNode, 'translateX', index * (document.documentElement.clientWidth));
            ulNode.style.transition = 'none'
        })
        courseWrap.addEventListener('touchmove', function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            var nowX = touchC.clientX;
            var nowY = touchC.clientY;
            var disX = nowX - starX;
            var disY = nowY - starY;
            if (Math.abs(disY) > Math.abs(disX)) { //说明在Y轴上滑动
                return; //目的是防抖动，上下滚动，不触发轮播图
            }
            transePlugin.damu(ulNode, 'translateX', elementX + disX);
        })
        courseWrap.addEventListener('touchend', function (ev) {
            ev = ev || event;
            var index = transePlugin.damu(ulNode, 'translateX') / document.documentElement.clientWidth;
            index = Math.round(index);
            if (index > 0) {
                index = 0;
            }
            if (index < 1 - arr.length) {
                index = 1 - arr.length;
            }
            ulNode.style.transition = 'transform 1s'
            transePlugin.damu(ulNode, 'translateX', index * (document.documentElement.clientWidth))
        })
    }


    init()
};