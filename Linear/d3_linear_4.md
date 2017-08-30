#### scale函数（续）

前面我们提到scale函数，正好讲到了将bimap函数执行的结果赋给了output变量，经过我们队bimap的介绍，我们现在知道output就是一个函数，该函数接受一个比例值，最终output这个函数返回一个值域上相应比例的值。那么scale函数中还有判断clamp的代码，如下：

```Javascript
<script>
	(output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) 
		: deinterpolate, interpolate))
	/**
	 function scale(x) {
        // 写这么麻烦
        return (output ||
            (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate,
                interpolate))
        )(+x);
    }
    /*
</script>
```

前面我们都讲解过了deinterpolate和reinterpolate，现在就差deinterpolateClamp(deinterpolate) 这个函数了。回忆一下，我们前面自己说道clamp的含义。clamp是夹紧的意思，那就意味着如果我们输入的值不在定义域的区间之内，那么就会选择距离该值最近的定义域的端点值来代替，这就是夹紧的效果。我们前面已经自己实现过这个效果了，所以很容易就可以想象出来，我们只需要判断传递进去的值与domain的位置关系即可。但是d3-scale还有一种比较优雅的方式，我们先来看看deinterpolateClamp函数是怎样写的吧！

```Javascript
<script>
function deinterpolateClamp(deinterpolate) {
    return function (a, b) {
        var d = deinterpolate(a = +a, b = +b);
        return function (x) {
            return x <= a ? 0 : x >= b ? 1 : d(x);
        };
    };
}
</script>
```

deinterpolateClamp接受deinterpolate作为参数，并最终返回一个函数，用文字来表达这种代码结构真是费事儿，所以你如果不是很清晰的话，多看俩眼这个函数的代码，最后我们知道deinterpolate函数返回的函数接受一个值作为参数，并且判断这个值如果小于区间的最小值则返回0，大于区间的最大值则返回1，其他情况正常返回，为什么作者就一定知道a是区间的最小值，而b是区间的最大值呢？请查看bimap的代码。但是我觉得这样写多少理解起来有一些费劲儿，我们来改进一下这个函数。

```Javascript
<script>
	function deinterplateClamp(domain) {
       return function(x) {
           var t = (x - domain[0]) / (domain[1] - domain[0]);
           t = t < 0 ? 0 : t > 1 ? 1 : t;
           return t;
       }
   }
</script>
```

对于d3-scale的domain是大于两个数值的数组的时候，它分别对每两个相邻的数值作线性插值处理，这里我们就不准备讲解了，因为它跟domain只有两个数值的时候的情况是一样的，只不过多了几个循环。下面我们来看一下scale的几个静态方法。

#### scale.domain

这个函数的作用呢是设置或者获取比例尺的定义域，我们自己的实现的代码中并没有这么多的功能，我们只是设置了定义域，而没有获取这个功能，来看看d3-scale是怎么做到的。

```Javascript
<script>
	scale.domain = function (_) {
        return arguments.length ? (domain = map.call(_, number), rescale()) : domain.slice();
    };
</script>
```

如果你是一个喜欢追求完美的人，肯定会觉得d3-scale的代码有点儿潦草，连命名都没有做好，但是其实如果你在公司里或者自己写一个比较大的项目之后会发现，注释和变量命名符合规范真实一种奢望，因为到最后会词穷，而对于注释来说，如果你抽象地很厉害那就没法儿写注释了，因为它包含的功能似乎有点儿多，而如果某一个方法只是单纯地负责做一件事儿的话，你又不屑于写注释，这是一种无法调和的矛盾，不顾我们还是尽量将代码写得让人能快速看懂吧，不管这期间有多麻烦，这是d3-scale做的有些不完美的地方。

这个domain函数里面会判断我们是否传递了值，如果没有的话，就会返回domain的复制的值，这里使用复制的值相信大家都懂，为了防止外部操作改变了函数里面的值嘛。如果我们传递了参数，那么程序就会将我们传递的参数转化成包含多个数值的数组。有的时候你想让自己的程序有更多的容错性，能接受更多的可变参数，所以你在程序中加了对很多参数的判断，导致了程序的臃肿，这个时候我们应该想想，这些容错性真的是必须的吗？不一定，也许这个时候使我们想多了，所以scale.domain就默认如果我们传递了参数，这个参数就是一个数组，而且为了保证程序能正常运行，传递的的数组要大于等于两个值，然后它调用`map.call(_, number)`将获取到的最终数组赋值给domain，最后调用rescale，重新对output和input赋值，也就达到了重新设置定义域的功能。

在`map.call(_, number)`语句中有两个函数让我们困惑，但是等我跳进去这个函数的时候我都想骂娘，我不知道作者为什么要这么做，其实map就是Array.prototype.map的一个引用，而number的效果就是讲某一个数变成了数值类型的函数，类似于JavaScript的Number(x)，我们还是来看看scale.domain函数比较直观的代码结构形式吧。

```Javascript
<script>
	scale.domain(_) {
		if( !_ ) {
			return domain.slice();
		}
		_ = _ || [0, 1];
		_ = _.map(Number);
		domain = _;
		return rescale();
	}
</script>
```

#### scale.range

range函数与domain函数差不多，如果我们传递了参数进去，则默认认为这个参数是一个至少包含两个值以上的数组，并且最终将这些值其转化成数值，赋值给range值域变量，如果不传递参数，就会返回range的复制版。

```Javascript
<script>
	scale.range = function (_) {
        return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
    };

    // 自己实现的代码
    scale.range(_) {
		if( !_ ) {
			return range.slice();
		}
		_ = _ || [0, 1];
		_ = _.map(Number);
		range = _;
		return rescale();
	}
</script>
```

所以有的时候不能一味地崇拜牛人的代码，它们总是比较懒。这个世上有耐心的牛人太少，只能等着我们自己慢慢去学习了。

#### scale.clamp

```Javascript
<script>
	scale.clamp = function (_) {
        return arguments.length ? (clamp = !!_, rescale()) : clamp;
    };
</script>
```

这个函数就比较简单了，这里就不解释了。

#### scale.invert

```Javascript
<script>
	scale.invert = function (y) {
        return (input || (input = piecewise(range, domain, deinterpolateLinear,
            clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
    };
</script>
```

这个函数比较常用，我们通常需要翻转比例尺来获取初始的值，那么d3-scale的做法是什么呢？它也是简单地将domain和range的身份对换了一下，这里跟我们前面的scale函数很类似，我们在自己实现的代码中也是这么做的，只不过我们实现起来比较明确，没有引用那么多的函数。

有的时候我很疑惑，d3-scale的代码的模块化这么厉害，作者是怎么给抽象出来的，将这些代码模块化并进行复用，这里面有他本人的博学有关，其实我认为跟d3.js的不断迭代改进也有关系，毕竟孩子养多了，也就有了经验了。所以各位不要因为自己写不出类似作者那样简洁而有用的代码而苦恼，我们现在写不出来，不代表以后不能写出来，我也在向这个目标进发。

其实scale还有几个静态的方法，我们不准备讲解了，因为它比较简单，而且如果你也跟着我完成自己的linear比例尺（前面我们自己的代码），你也会觉得剩下的没有讲完的函数可以自己看懂的，下面我们将会介绍nice和ticks函数，在我们自己实现这一部分代码的时候，我们也花了不少的时间，所以我们可不想错过d3-scale自己的实现方式，万一我们自己实现的效果比d3-scale要好呢！！！说笑了。我们新开一篇来介绍它们吧。

[Prev](d3_linear_3.md)

[Next](d3_linear_5.md)
