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
}