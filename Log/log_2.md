## log函数

现在我们应该学聪明了，直接先从d3-scale暴露出的log函数入手看是看代码，那么d3-scale关于log比例尺的对外暴露的函数就是log，来看看它的代码。

```Javascript	
<script>
	function log() {

    // 现在的scale仍然是线性的比例尺
    var scale = continuous(deinterpolate, reinterpolate).domain([1, 10]),
        domain = scale.domain,
        base = 10,
        // 这下面的暂时不用管
        logs = logp(10),
        pows = powp(10);

        ……
    }
</script>
```

果然，log比例尺还是在调用continuous函数，这个函数我们在linear比例尺的时候讲到过，它最终返回一个scale函数，这个scale函数还带有一些静态函数，比如domain、range、invert……尔后又将scale.domain这个方法赋值给domain变量。而且我们知道continuous函数接受的两个参数非作用分别是将定义域转化成比例，和将比例转换成值域。来看看它是怎样实现。

```Javscript	
<script>
function deinterpolate(a, b) {
    // 这里还是套用的是linear的想法
    // b = log(b) - log(a)
    // return [log(x) - log(a)] / [log(b) - log(a)]
    return (b = Math.log(b / a))
        ? function (x) {
            return Math.log(x / a) / b;
        }
        : function(x) {
        	return b;
        };
}

function reinterpolate(a, b) {
    // 这应该是生凑出来的一个式子，毕竟当t=0的时候要获取到的是a,t=1的时候要返回b
    return a < 0
        ? function (t) {
            return -Math.pow(-b, t) * Math.pow(-a, 1 - t);
        }
        : function (t) {
            return Math.pow(b, t) * Math.pow(a, 1 - t);
        };
}
</script>
```
deinterpolate函数返回一个函数，负责将定义域上的一个值转化成一个[0, 1]之间的比例值（当然也可能在这个区间之外），这个函数里面涉及到了对数换底的公式，我们来介绍一下。我们前面说过了，对数比例尺只不过是先将定义域转化成与其相对应的对数的值之后使用linear比例尺来求解最终的值域的，所以这里的关键是怎样将定义域转化成相关的对数的值。假设我们的对数的底为base，区间为[a, b]，那么最终转化成对数的范围就是：

```Bash
<script>
	// 下面的写法是latex的语法，不是JavaScript的
	convert = [log_{base}{a}, log_{base}{b}]
</script>
```

可是JavaScript给我们提供的对数函数就只有一些常用的——log、log10、log2，我们需要的是可以设置更多的base的对数，数学上有一个对数换底的公式可以帮我们实现任意的底的计算。

```Bash
<script>
	// 我们需要计算base为底，x的对数
	result = log_{base}{x};

	// 通过对数换底公式可以写成如下形式：a为任意数值
	result = log_{a}{x} / log_{a}{base};

	// 既然a可以为任意的数值，那么我们就可以将a设置为Math.E自然数了
	result = ln{x} / ln{base};

	// 在JavaScript中ln自然底对数是Math.log，所以最终可以写成如下的形式
	result = Math.log(x) / Math.log(base);
</script>
```

说多了，似乎deinterpolate用不到这个换底公式，不过我们也在这里提一下，以后会用到，既然讲到了数学公式，就一并将log比例尺使用到的数学公式讲解了。deinterpolate使用到的有关对数的公式是什么呢？是一个简单的对数运算法则，来看一下：

```Bash
<script>
	// 这个法则表示形式如下
	ln(a/b) = ln(a) - ln(b);
	// ln是自然数的对数，你也可以将其转化成以其他数为底的对数
</script>
```

我们在linear比例尺的时候要计算定义域上一个值在定义域上的位置比例，需要将定义域区间的差值算出来，在这里也不例外，只不过我们如果不进行转换的话，这个比例就会不准确，比如说我们的定义域是[1, 10000],值域是[0, 10]，现在要求取100在值域上的对应位置，不进行转换的话，那么得到的值域上的就是10 * 100 * [10000 - 1],这个数值看着就不得劲儿，而如果将其转化成对数的形式就是10 * log_{base}{100} * [log_{base}{10000} - log_{base}{1}],这样计算下来得到的值将会是一个比较符合我们阅读习惯的数值。而deinterpolate获取比例值的方式就是这样的：

```Bash
<script>
	// base都可以不要
	function deinterpolate(a, b) {
		var diffRange = Math.log(b) - Math.log(a);
		return function(x) {
			return (Math.log(x) - Math.log(a)) / diffRange;
		}
	}
	// d3-scale考虑到a===b的情况，这里我们就不考虑了
</script>
```

接下来就是reinterpolate这个函数，这个函数获取某一个值域上的值，并将其转化成定义域上相对应的数值，其实也不算很难，为什么呢？我们只要知道我们输入0，那么得到的是1，输入10得到的是10000就可以构造出一个函数出来，来看看它是怎样构造的，这里我们简略一些，规定值域也是大于0的数值。

```Javascript
<script>
function reinterpolate(a, b) {
    // 这应该是生凑出来的一个式子，毕竟当t=0的时候要获取到的是a,t=1的时候要返回b
    return function (t) {
        return Math.pow(b, t) * Math.pow(a, 1 - t);
    }
}
</script>
```

其实也是简单的推理过程，现在我们已经知道了continuous函数接受的两个参数是什么了，我们应该来看一看一些log比例尺与linear不同的函数了。

[Prev](log_1.md)

[Next](log_3.md)












