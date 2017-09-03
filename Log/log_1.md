## ds-scale的log比例尺使用方法介绍

首先呢我们还是要来介绍一下d3-scale提供的对数比例尺是怎么使用的，不然我们凿了半天的门，都不知道房屋里面住的是谁，那就有点儿说不过去了。

```JavaScript
<script>
	require([
            'd3-scale',
        ],
        function(Scale) {

            var log = Scale.scaleLog().domain([1, 10000]).range([0, 10]);

            // 7.4999999999
            console.log(log(1000);

        });
</script>
```

我们将比例尺的定义域设置为[1, 100000],你可能会问，为什么是从1开始，而不是像我们的linear比例尺那样从0开始，那是因为数学上对数（log）的定义域是y = log_a{x},x > 0,所以我们这里为了方便，从1开始取值。尔后将值域的范围设置为[0, 10]，这个又有什么讲究呢？其实没什么，你可以设置为你喜欢的任何值域，只不过通常的使用场景来说，从0开始的值域会比较实用，比如说我们的值域代表的是我们需要绘制的坐标轴在屏幕上的一个像素范围的映射。

在d3-scale的对数比例尺中，如果我们不主动设置对数的底的话，默认底为10，所以可以将定义域理解为10的n次方构成的一个区间。

早d3-scale的log比例尺的介绍中，作者告诉我们log比例尺类似于linear比例尺，只不过是在转换成linear比例尺之前将定义域转化成对数的形式，怎么来理解这句话呢？看一看下面的代码你就知道了。

```JavaScript
<script>
	var log = Scale.scaleLog().domain([1, 10000]).range([0, 10]);
    var linear = Scale.scaleLinear().domain([0, 4]).range([0, 10]);

    // 7.49999999999 7.5
    console.log(log(1000), linear(3));
</script>
```
请注意上面的代码中两个比例尺的定义域，其实我们可以将对数比例尺的定义域写成如下的形式：

```Javascript
<script>
	var log = Scale.scaleLog().domain([Math.pow(10, 0), Math.pow(10, 4)]).range([0, 10]);
</script>
```
现在看出来对数比例尺其实没有那么玄乎了吧，其实就是把数据映射到比较小的范围之内在使用linear比例尺来获取与range之间的关系。

下面我们来看一下对数比例尺的其他方法。

```Javscript
<script>
	// domain和range函数与linear比例尺的domain、range函数作用一致
	var log = Scale.scaleLog().domain([1, 10000]).range([0, 10]);

	// 设置底为10，默认也是10，如果我们想将底设置为其他的值，那么最好观察一下
	// 定义域的范围
	log.base(10);

	// 从值域上的一个值获取定义域上相对应的值
	console.log(log.invert(7.5)); // 1000

	// 设定是否夹紧
	log.clamp(true);

	// 设定将定义域扩展成比较理想的形式
	// 这里没有count参数
	log.nice();

	// 重新设置值域，并且规定将输出的结果进行四舍五入
	log.rangeRound([0, 10]);

	// 获取规定数量的刻度值
	console.log(log.tick(5));
</script>
```

基本的使用方法就是上面代码中的一些方法，有了linear比例尺的基础，我们现在看这些代码似乎更简单了，所以我在这里也没有更加详细地写出它们的输出值之类的。

在linear比例尺的时候，我们先自己实现了一个linearScale，然后再去查看d3-scale的实现方法，现在我不想这样做了，为什么呢？因为里面涉及一些数学上的计算，很难讲，所以我们直接看d3-scale的实现，最后再学习d3-scale的写法自己也实现一个。

好了，这一小节的介绍就准备结束了，我们马上进入源码的理解之中。

[Prev](./)

[Next](log_2.md)












