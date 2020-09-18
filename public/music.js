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
        tap();
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
        transePlugin.moveX(dragArea, dragItem);
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
        transePlugin.bannerMove(courseWrap,ulNode, arr, baseLength );
    }

    // tap选项卡
    var tap = function () {
        var wrap = document.querySelector('#wrap .tapWrap');
        var contentNodes = document.querySelectorAll('#wrap .tapWrap .tapContent');
        for (var i = 0; i < contentNodes.length; i++) {
            move(contentNodes[i], wrap);
        }
        function move (nodes, wrap) {
            var moveX = wrap.offsetWidth;
            // 抽象小绿下标
            var smallG = document.querySelector('#wrap .tapWrap .tapNav .smallG');
            var aNodes = document.querySelectorAll('#wrap .tapWrap .tapNav a');
            smallG.style.width = aNodes[0].offsetWidth-20+'px';
            var now = 0;
            transePlugin.damu(nodes, 'translateX', -moveX);
            // 滑屏逻辑，content即是滑屏区域，又是滑屏元素
            var startPoint = {
                x: 0,
                y: 0,
            };
            var elementPoint = {
                x: 0,
                y: 0,
            };
            var isX = true; //防抖动
            var isFirst = true;
            var isOver = false;
            nodes.addEventListener("touchstart", function (ev) {
                nodes.style.transition = 'none'
                ev = ev || event;
                var touchC = ev.changedTouches[0];
                startPoint = {
                    x: touchC.clientX,
                    y: touchC.clientY,
                }
                elementPoint = {
                    x: transePlugin.damu(nodes, 'translateX'),
                    y: transePlugin.damu(nodes, 'translateY')
                }
                isX = true;
                isFirst = true;
                isOver = false;
            })
            nodes.addEventListener("touchmove", function (ev) {
                ev = ev || event;
                if (!isX) {
                    return;
                }
                if (isOver) {
                    return;
                }
                var touchC = ev.changedTouches[0];
                var nowPoint = {
                    x: touchC.clientX,
                    y: touchC.clientY,
                }
                var disPoint = {
                    x: nowPoint.x - startPoint.x,
                    y: nowPoint.y - startPoint.y
                }
                if (isFirst) { //判断第一次的方向
                    isFirst = false;
                    if (Math.abs(disPoint.y) - Math.abs(disPoint.x) > 0) {
                        isX = false;
                        return;
                    }
                }
                transePlugin.damu(nodes, 'translateX', disPoint.x + elementPoint.x);
                // 1/2跳转  加标志位，在touchmove的过程中只执行一次\
                jump(disPoint.x);
            })
            nodes.addEventListener("touchend", function (ev) {
                if (isOver) {
                    return;
                }
                ev = ev || event;
                var touchC = ev.changedTouches[0];
                var nowPoint = {
                    x: touchC.clientX,
                    y: touchC.clientY,
                }
                var disPoint = {
                    x: nowPoint.x - startPoint.x,
                    y: nowPoint.y - startPoint.y
                }
                back(nodes, wrap, disPoint.x);
            })
    
            var jump = function (disX) {
                if (isOver) {
                    return;
                }
                var moveX = wrap.offsetWidth;
                var translateX = transePlugin.damu(nodes, 'translateX');
                if (Math.abs(disX) > moveX / 2) {
                    isOver = true;
                    nodes.style.transition = 'transform 1s';
                    var targetX
                    // dis<0  左滑   dis>0 右滑
                    if (disX < 0) {
                        if (Math.abs(translateX) < moveX) {
                            targetX = -moveX;
                        } else {
                            targetX = -2 * moveX;
                        }
                    } else {
                        if (Math.abs(translateX) > moveX) {
                            targetX = -moveX
                        } else {
                            targetX = -0
                        }
                    }
                    transePlugin.damu(nodes, 'translateX', targetX);
                    nodes.addEventListener('transitionend', endFun) //动画结束发请求，防止动画冲突
                    nodes.addEventListener('webkitTransitionEnd', endFun) //动画结束发请求，防止动画冲突
                }
    
               function endFun () {
                    // 循环定时器，回调函数头部第一行清定时器
                    // DOM 绑定transitionend事件，第一件事是解绑
                    var loadings = nodes.querySelectorAll('#wrap .tapWrap .tapContent .tapLoading li');
                    nodes.removeEventListener('transitionend', endFun);
                    nodes.removeEventListener('webkitTransitionEnd', endFun);
                    //小绿
                    disX > 0 ? now-- :now++;
                    if(now<0){
                        now = aNodes.length -1;
                    }else if(now>aNodes.length -1 ){
                        now = 0;
                    }
                    transePlugin.damu(smallG, 'translateX', aNodes[now].offsetLeft);
                    if(aNodes[now].offsetWidth !== smallG.offsetWidth){
                        smallG.style.width = aNodes[now].offsetWidth-20+'px';
                    }
    
                    for(var i=0; i<loadings.length; i++){
                        loadings[i].style.opacity = 1;
                    }
                    // loading出现，发送请求， 请求结束，node要回到-moveX的位置
                    setTimeout(function(){ //因为没有接口，模拟接口请求
                        for(var i=0; i<loadings.length; i++){
                            loadings[i].style.opacity = 0;
                        }
                        isOver = false;
                        transePlugin.damu(nodes, 'translateX', -moveX);
                    }, 2000);
                }
            } 

            function back (nodes, wrap, disX) {
                var moveX = wrap.offsetWidth;
                if (Math.abs(disX) <= moveX / 2) {
                    nodes.style.transition = 'transform 1s';
                    var targetX = 0;
                    transePlugin.damu(nodes, 'translateX', targetX);
                }
            }
        }
    }
    

    init()
};