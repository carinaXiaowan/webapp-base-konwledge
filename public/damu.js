!(function (w) {
    w.transePlugin = {};
    transePlugin.damu = damu;
    transePlugin.moveX = moveX;
    transePlugin.bannerMove = bannerMove;
    transePlugin.moveY = moveY;

    function damu(node, type, val) {
        if (typeof node == 'object' && typeof node['transform'] === 'undefined') {
            node['transform'] = {};
        }
        if (arguments.length >= 3) {
            // 设置
            var text = '';
            node['transform'][type] = val;
            for (item in node['transform']) {
                if (node['transform'].hasOwnProperty(item)) {
                    switch (item) {
                        case 'translateX':
                        case 'translateY':
                            text += item + '(' + node['transform'][item] + 'px)'
                            break;
                        case 'scale':
                            text += item + '(' + node['transform'][item] + ')'
                            break;
                        case 'rotate':
                            text += item + '(' + node['transform'][item] + 'deg)'
                            break;
                    }
                }
            }
            node.style.transform = node.style.webkitTransform = text;
        }
        if (arguments.length == 2) {
            val = node['transform'][type];
            if (typeof val === 'undefined') {
                switch (type) {
                    case 'translateX':
                    case 'translateY':
                    case 'rotate':
                        val = 0;
                        break;
                    case 'scale':
                        val = 1;
                        break;
                }
            }
            return val
        }
    }

    function moveX(dragArea, dragItem) {
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

    function bannerMove(courseWrap, ulNode, arr, baseLength) {
        var starX = 0; //手指开始点击的位置
        var starY = 0;
        var elementX = 0; //元素一开始的位置
        courseWrap.addEventListener('touchstart', function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            starX = touchC.clientX;
            starY = touchC.clientY;
            elementX = transePlugin.damu(ulNode, 'translateX');
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

    function moveY(dragArea) {
        var dragItem = dragArea.children[0];
        transePlugin.damu(dragArea, 'tanslateZ', 0); //图层在同一个
        var startPoint = {
            x: 0,
            y: 0
        };
        var elementPoint = {
            x: 0,
            y: 0
        };
        var isY = true;
        var isFirst = true;

        //即点即听
        var clearTime = 0;
        var Tween = {
            linear: function(t,b,c,d){
                return c*t/d+b;
            },
            back: function(t,b,c,d,s){
                if(s == 'undefined'){
                    s = 1.70158
                }
                return  c*((t=t/d-1)*t*((s+1)*t+s)+1)+b
            },
        }
        var miniY = dragArea.clientHeight - dragItem.offsetHeight;
        // 款速滑屏的必要元素
        var lastTime = 0;
        var lastPoint = 0;
        var timeDis = 0;
        var pointDis = 0;
        dragArea.addEventListener('touchstart', function (ev) {
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            startPoint = {
                x: touchC.clientX,
                y: touchC.clientY,
            };
            elementPoint = {
                x: transePlugin.damu(dragItem, 'translateX'),
                y: transePlugin.damu(dragItem, 'translateY')
            }
            dragItem.style.transition = "none";

            // 快速滑屏
            lastTime = new Date().getTime();
            lastPoint = transePlugin.damu(dragItem, 'translateY');
            pointDis = 0; //目的是让点击的时候，元素不动，清除速度残留

            isY = true;
            isFirst = true;

            // 即点即听
            clearInterval(clearTime);   
        })
        dragArea.addEventListener('touchmove', function (ev) {
            if (!isY) {
                return;
            }
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            var nowPoint = {
                x: touchC.clientX,
                y: touchC.clientY,
            };
            var disPoint = {
                x: nowPoint.x - startPoint.x,
                y: nowPoint.y - startPoint.y
            } //每次滑动的距离

            if (isFirst) { //判断第一次的方向
                isFirst = false;
                if (Math.abs(disPoint.x) - Math.abs(disPoint.y) > 0) {
                    isY = false;
                    return;
                }
            }
            var translateY = elementPoint.y + disPoint.y;
            // 橡皮筋效果 在move的过程中，每一次touchmove真正的有效距离慢慢变小，元素的滑动距离变大
            //(偏移量和布局视口的宽度,分母越大，拉力越大)
            // 只有在判断中，才有拉力效果
            if (translateY > 0) {
                var scare = document.documentElement.clientHeight / ((document.documentElement.clientHeight +
                    translateY) * 1.5);
                translateY = elementPoint.y + (disPoint.y) * scare;
            } else if (translateY < miniY) {
                var scare = document.documentElement.clientHeight / ((document.documentElement.clientHeight + (miniY -
                    translateY)) * 1.5);
                translateY = elementPoint.y + (disPoint.y) * scare;
            }

            transePlugin.damu(dragItem, 'translateY', translateY);

            // 快速滑屏
            var nowTime = new Date().getTime();
            var nowPoint = transePlugin.damu(dragItem, 'translateY');
            timeDis = nowTime - lastTime;
            pointDis = nowPoint - lastPoint;
            lastTime = nowTime;
            lastPoint = nowPoint;
        })

        dragArea.addEventListener('touchend', function (ev) {
            var translateY = transePlugin.damu(dragItem, 'translateY');
            timeDis = timeDis == 0 ? 1 : timeDis; //防止点击后，时间差为0；
            var speed = pointDis / timeDis; //快速滑屏   速度越大，位移越远
            speed = Math.abs(speed) < 0.5 ? 0 : speed; //防止中间块滑动的时候，产生抖动
            var targetY = translateY + speed * 200;
            var time = Math.abs(speed) * 0.2;
            time = time < 1 ? 1 : time;
            //var bsr = '';
            var type = 'linear';
            if (targetY > 0) {
                targetY = 0;
                type='back';
                //bsr = 'cubic-bezier(0.26,1.51,0.68,1.54)';
            } else if (targetY < miniY) {
                targetY = miniY;
                type='back';    
                //bsr = 'cubic-bezier(0.26,1,0.68,1)';
            }
            bsr(targetY,type,time); //定点动画
            // dragItem.style.transition = time + 's ' + bsr + 'transform';
            // transePlugin.damu(dragItem, 'translateY', targetY);
            /* 元素没有渲染完成，没有办法触发过渡
               tansform切换下，如果前后transform属性值，变换位置不一样，没办法触发过渡
               没办法拿到tansition中的任何帧的状态 */
        })

        function bsr(targetY,type,time) {
            clearInterval(clearTime);
            var s = 1;
            var t = 0; //当前次数
            var b = transePlugin.damu(dragItem, 'translateY'); //初始位置
            var c = targetY - b; //初始位置和最终位置的差值
            var d = time*1000/(1000/60); //总次数
            clearTime = setInterval(function(){
                t++
                if(t>d){
                    clearInterval(clearTime);
                }
                var point = Tween[type](t,b,c,d,s);
                transePlugin.damu(dragItem, 'translateY', point)
            },1000/60)
        }
    }
})(window)