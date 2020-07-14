#### 简介
一款移动端基础知识加练手项目

#### 分辨率
物理像素
定义:横纵向像素点的个数(设备的分辨率)（物理像素是设备本身用于渲染画面的最小显示单元）
单位：px

css像素
定义： 研发开发时定义的px值，这个值最种在设备上呈现，会转换成设备对应的值（取决去设备的分辨率，默认1：1）CSS像素是编程时使用的虚拟像素


dpi（ 位图像素）
定义：位图像素是处理高清图片时用到的概念。当1物理像素可以表示1位图像素时，图片清晰。我们平时所说的x2倍的图，是基于css像素的。所以基于css像素长宽都放大两倍的图，在retina下面转换成物理像素就相当于1位图像素对应1物理像素，就会清晰

设备独立像素    
定义：css像素转物理像素重要的中间过程

设计图2x是像素比为2的手机使用， 3x是像素比为3的手机使用   

#### viewPort的meta标签(苹果发明的，桌面浏览器不支持)
```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### rem
定义： rem相当于根标签（html）的fontSize   1rem = html的fontSize
适配： 适应不同设备等比
```
//rem的适配     尺寸根据视口宽度来  rem的定义  
var styleNode =document.createElement('style');
var w = document.documentElement.clientWidth/16;
styleNode.innerHTML="html{font-size: "+w+"px!important}"
document.head.appendChild(styleNode);

```

#### viewport适配
```
// viewport的适配   将所有设备都转化成设计稿尺寸（所量即所得）  
var targetW = 750+"px";
var scale = document.documentElement.clientWidth/targetW;
var meta = document.querySelector('meta[name="viewport"]');
meta.content="initial-scale="+scale; 
优点： 所量即所得
缺点： 没有使用完美视口

```
##### 1px实现
```
css实现
@media only screen and (-webkit-device-pixel-ratio: 2){
    .onepx{
        transform: scaleY(0.5);
    }
}
@media only screen and (-webkit-device-pixel-ratio: 3){
    .onepx{
            transform: scaleY(0.333333333);
        }
}

viewport实现
var dpr = window.devicePixelRatio || 1;
var scale = 1 / dpr;

//方案二   rem的适配     尺寸根据视口宽度来  rem的定义  
var styleNode =document.createElement('style');
var w = document.documentElement.clientWidth/16;
styleNode.innerHTML="html{font-size: "+w+"px!important}"
document.head.appendChild(styleNode);

// 缩小操作
var meta = document.querySelector("meta[name='viewport']");
meta.content = "width=device-width,initial-scale=" + scale + ",user-scalable=no,minimum-scale=" + scale + ",maximum-scale=" + scale;
```

#### 基础事件
```
触屏 指针事件
touchstart
touchmove(不可能单独触发)
touchEnd
```