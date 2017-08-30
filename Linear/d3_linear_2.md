## linear.js

通常我们调用d3-scale中的线性比例尺的方式是直接使用scaleLinear函数，所以说我们可以首先在index.js中找到这个语句：

```Javascript
<script>
	
	export {
		default as scaleLinear
	} from "./src/linear";

</script>
```

现在我们就到src/linear.js中查看defualt函数是什么。

```Javascript
<script>
	// index.js中的scaleLinear函数就是这里的linear函数
	export default function linear() {
		var scale = continuous(deinterpolate, reinterpolate);

		scale.copy = function() {
			return copy(scale, linear());
		};

		return linearish(scale);
	}
</script>
```

不过看到这里我们突然发现友好一个变量或者函数并没有定义，所以应该是由外部引进来的，比如continuous、 deinterpolate、reinterpolate、scale、copy、linearish，linearish函数是同处在与linear函数相同的文件内，也就是本文件中，一会儿就展示。是不是觉得很麻烦，别着急，这只是第一步，后面还有更为复杂的呢！来看一看linearish函数先。

```Javascript
<script>
export function linearish(scale) {

	var domain = scale.domain;

	// 有没有觉得有种遇见故人的感觉
	scale.ticks = function(count) {
		var d = domain();
		return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
	};

	scale.tickFormat = function(count, specifier) {
		return tickFormat(domain(), count, specifier);
	};

	// 这儿也有nice函数哦
	scale.nice = function(count) {
		// codes...
		return scale;
	};

	return scale;
}
</script>
```

在上面的代码中，比我们前面自己实现的diamante多了一个tickFormat函数，tickFormat是对每一个刻度进行format格式化，但是我们前面没有自己实现，主要是我认为它的用法并不灵活，使用数组的方法比它灵活多了，所以就没有实现，以后我们也将会忽略这个方法。应该说在我们前面自己实现的代码中，代码的风格多少受到d3-scale源码的影响，比如说讲函数挂载在某一个函数对象上，使之成为一个静态函数……看完这一小部分的代码，咱们应该看看那些个从别的文件或者依赖中引入的函数到底是什么。

```Javascript
<script>
	
	import {ticks, tickIncrement} from "d3-array";
	import {interpolateNumber as reinterpolate} from "d3-interpolate";
	import {default as continuous, copy, deinterpolateLinear as deinterpolate} from "./continuous";
	// 这个忽略了以后
	import tickFormat from "./tickFormat";

</script>
```

ticks和tickIncrement函数我们在前面也自己实现过，所以你看到这两个函数应该不会感到陌生吧，interpolateNumber呢是数值插值的函数，什么是插值，就是预测，给定两个非重叠的点的坐标，我们能得到一条直线，另外在给某一点的x或者y坐标，我们就能求出另外的未知数的值，这就是插值。这里的线性插值说出来都怕你不屑于会，来看看吧。

```Javascript
<script>
// interpolateNumber function 
export default function(a, b) {
	return a = +a, b -= a, function(t) {
		return a + b * t;
	};
}
</script>
```

是不是很震惊，这不就是我们之前scale函数里面的一部分代码吗？的确是这样的，不过作者这样写估计是为了能多复用吧，但是我从内心里是拒绝的，因为文件分布太散了，不会调试。interpolateNumber函数的两个参数就是区间的起始值和终止值，这个区间可以使升序的，也可以是降序的，最终interpolateNumber会返回一个内部函数，暂时命名为innerFunc，innerFunc接受一个比例的参数t，如果t属于[0, 1]区间内，那么innerFunc返回的值将会是[a, b]区间之内，否则返回的值将在[a, b]区间之外，实例就不写了，太简单了手累。

来看一下linearish函数，该函数接受一个scale的参数，这个scale是一个函数，别着急疑惑它从哪儿来，我们就想象着这个scale就是我们前面自己实现的linear函数里面的scale函数，怕你给忘了，我先贴出代码来：

###### 这是我们自己实现的代码的片段，别搞混了

```JavaScript
<script>
function linear() {
	/**
     * 映射关系函数,将上一节的fx更名为scale
     * @param x
     */
    function scale(x) {
        // 现在要看看调用函数的时候需不需要夹紧了
        var sign = util.judgePos(x, _domain);
        x = !isClamp ? x : (sign === -1 ? _domain[0] : (sign  === 1 ? _domain[1] : x));
        // 计算x在定义域中的比例
        var ratio = (x - _domain[0]) / (_domain[1] - _domain[0]);

        return ratio * (_range[1] - _range[0]);
    }

    // 将domain和range函数设置为scale的静态方法
    scale.domain = domain;
    scale.range = range;
    scale.invert = invert;
    scale.clamp = clamp;
    scale.ticks = ticks;
    scale.nice = nice;

    scale.getAllVariable = getAllVariable;

    // 返回scale，让外部直接调用
    return scale;
}
</script>
```

linearish函数接受的scale就类似于上面的scale函数，它的函数对象里挂载着domain、range、clamp……多个静态函数，并且在linearish函数中又添加了nice和ticks函数，这样的写法跟我们自己实现的写法没有本质上的区别，都是把ticks、nice、domain等函数挂载到scale的函数对象上。接下来linearish又在linear函数中被调用，调用之后也没有发生什么稀奇的事情，就是得到接受scale函数，挂载ticks、nice函数到scale函数对象上、返回scale，就这么简单，如果你不返回也会生效，因为函数是一个地址引用类型的变量，所以在哪儿修改都会被影响到。但是我更喜欢有返回值的这样的写法儿，这样我们能更准确知道某一个函数的作用是什么，而不用从头开始去寻找，我相信这也是一个小技巧吧。

最终d3-scale的linear.js返回linear函数，而linear函数又返回我们前面提到的scale函数，说着比较混乱，但是代码还算比较清晰地。那么怎么产生这个scale函数的呢？我们就得到continuous.js去看看了，continuous可以翻译作连续的意思，线性可不就是连续的嘛，当然，连续指的是数值连续，也就是说任何一种类型可以转变成数值类型的数，都可以被认为是连续型的数值，也可以使用数值插值了，所以continuous.js单独写成一个文件也是这个原因吧，为了复用。

另外还有四个函数来自于continuous.js——default as continuous, copy, deinterpolateLinear as deinterpolate，现在暂时不介绍这些代码，因为一会儿我们的重点就在continuous.js文件里，而且这一篇就够多的了，我们再开一篇来介绍continuous.js的内容（我估计一篇不够）。

[Prev](d3_linear_1.md)

[Next](d3_linear_3.md)
