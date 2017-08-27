## Linear 线性比例尺

#### 如何使用？

```Javascript

<script>

require(['./node_modules/d3-scale/build/d3-scale'], function(scale) {

	var linear = scale().domain([0, 10]).range([0, 100]);

	console.log(linear(2));

	console.log(linear(3));

});

</script>

```

线性比例尺是常用的比例尺，与线性函数类似，计算线性的对应关系，首先来介绍一下线性比例尺的各种方法：

+ `scale.scaleLinear()`

定义一个线性比例尺，或者输入一个在定义域的值，返回值域内相对应的值。

+ `scale.domain(x)`

获取或者设定定义域。

+ `scale.range(x)`

获取或者设置值域。

+ `scale.invert(y)`

输入一个值域上的值，获取定义域上的相对应的值。

+ `scale.rangeRound([values])`

代替range函数使用的函数，我们调用比例尺的时候，输出的值会进行四舍五入，结果是整数。

+ `scale.clamp([boolean])`

默认设置为false，表示当我们输入一个超出定义域的值的时候，我们希望d3-scale怎么给我们返回值，设置为false的话就会返回值域的边界值，比如说我们的值域设置为[0, 90]，定义域设置为[0, 10]，输入一个超出定义域的值的时候，如果clamp设置为true，就会返回0或者90，这要看我们输入的值在定义域的哪个方向。

+ `scale.nice([count])`

将定义域扩展成一个比较好的形式，比如有的时候我们并非手动设置定义域，而是通过程序计算得到的数值，这就可能带有很多的小数位，这样我们不能控制，我们就希望把这些小数点变得好看一些，可以使用nice方法，传递进去的count表示可度数，也就是我们在将定义域均分成count-1个区间，这就是可度数，默认count=10。

+ `scale.ticks()`

有的时候绘制坐标轴，需要有标签，可是我们不想自己算标签，可以使用ticks函数来获取，例如domain=[0, 10]，调用ticks之后会得到[0, 1, ……, 9]这样类似的数组，方便我们填写标签。

其实光介绍这些方法也没有什么意思，因为你在别处都能看得到，所以我们还是来每一个都调用一下，看看效果吧。

```JavaScript
<script>
	// 定义一个线性比例尺
	var linear = scale.scaleLinear();

	// 设置定义域，没有设置的话，默认就是[0, 1]
	linear.domain([1, 88]);

	// 设置值域，默认也是[0, 1]
	linear.range([0, 100]);

	// 获取一个[1, 88]之间的值对应的[0, 100]的值，
	// 这就是比例尺，将[1, 88]映射成[0, 100]的范围
	console.log(linear(30)); // 33.33333333333333

	// 获取一个在[1, 88]之外的值对应的值域的值
	console.log(linear(-10)); // -12.643678160919542

	// 输入一个值域内的值，获取其在定义域相对应的值
	console.log(linear.invert(20)); // 18.400000000000002

	// 获取刻度标签数组
	console.log(linear.ticks(4)); //[20, 40, 60, 80]

	// 设置clamp，然后获取超出定义域范围的值的插值
	linear = linear.clamp(true);
	console.log(linear(-40)); //0

	// 再来看一下nice方法的作用
	linear = linear.nice(true); 

	console.log(linear.domain()); //[0, 100]

	console.log(linear.ticks()); //[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
</script>
```

你可能会疑惑，像我上面的代码没有什么使用价值，我得到这些数据又有什么用呢？其实如果你往后退一步想一想，d3.js是一个js数据可视化的工具，最常用的就是坐标轴。比如现在我们要将一些公司的月季度营业额使用柱形图展现出来，而且一个大公司的营业额的数量级还比较大，可能像我们的电话号码似的，但是我们的屏幕就那么大，这个时候就可以使用比例尺来缩放数据了，地图我相信列位都看过，就是一样的道理，通俗的话讲呢是我们将使用屏幕上的每一个像素点代表真实数据的多少值。

好了，用法都展现在上面了，是时候说一说原理以及代码实现的问题了。

#### 原理

我记得上学的时候数学老师告诉我们，数学函数是一种映射关系，给定一个集合A，和另一个集合B，从集合A到集合B之间的映射关系就是函数关系式。而线性函数是最简单的那一种，它是从定义域（集合A）到值域（集合B）的一种一对一的映射关系，通常可以写成:`y = f(x) = ax + b, x属于A`。而在一般的数据可视化的过程中，我们需要寻找的是这个映射关系，因为定义域和值域我们都有了，好在这只是一个线性函数。动动手就解出来了，也许还不用。

在d3中，定义域使用domain来表示，值域使用range来表示，下面我们就入乡随俗，使用它们的黑话，不好意思，是使用它们的术语。

```Javascript
// 设定定义域为[0, 90]
// 设定值域为[0, 20]
var domain = [0, 90],
	range = [0, 20];

// 它们之间有一种线性关系，而且这种线性关系一定是有这样的形式
// f(domain) = range = domain * a + b;
// 并且我们已经知道了两个初始条件
// f(0) = 0; f(90) = 20
// 还有谁不会解这个题！！！
// 最终的函数关系式为：
// f(x) = (2 / 9) * x;
function mapRelation(x) {
	return (2 / 9) * x;
}

```

#### 代码实现

然而，电脑并不会解题，这就很尴尬了。所以我们得寻求另一种办法来获取定义域和值域之间的对应关系。我们想要的是某一个在定义域内的值（x）在值域中对应位置的值（y），那就简单了，我们先找出x在定义域上的所占的比例，然后用这个比例套到值域上，就可以求解出来答案了。

```Javascript
    // 咱们上的代码可有点儿多了……
    function linear() {
        // 默认值
        var _domain = [0, 1],
            _range = [0, 1];

        /**
         * 设置定义域
         * @param d
         */
        function domain(d) {
            _domain = d;

            // 在这里返回fx，使得调用domain或者range函数之后可以直接使用fx函数来求解
            // 类似链式调用的效果
            return fx;
        }

        /**
         * 设定值域
         * @param r
         */
        function range(r) {
            _range = r;
            return fx;
        }

        /**
         * 映射关系函数
         * @param x
         */
        function fx(x) {
            // 计算x在定义域中的比例
            var ratio = (x - _domain[0]) / (_domain[1] - _domain[0]);
			
			// 返回值域中相对应的位置上的值
            return ratio * (_range[1] - _range[0]);
        }

        // 将domain和range函数设置为fx的静态方法
        fx.domain = domain;
        fx.range = range;

        // 返回fx，让外部直接调用
        return fx;
    }


    var linearScale = linear().domain([0, 90]).range([0, 20]);

	// 0, 20, 8.88888888888889
    console.log(linearScale(0), linearScale(90), linearScale(40));

```

在上面的代码中我们使用了闭包和函数对象的技巧，我相信并不会给你造成多大的困难，但是这只是我们自己的方法，并不是d3-scale里面的代码，下一节让我们来看一下d3-scale是怎么写的。

[Prev](../Preface/)               

[Next](linear_1.md)

