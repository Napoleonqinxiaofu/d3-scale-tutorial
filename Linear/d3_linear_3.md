### continuous.js

#### continuous函数

在linear.js中我们直接调用continuous.js中的函数的就是continuous，所以我们先来看一下这个函数是个什么厉害的角色。

```Javascript
<script>
// 默认的区间值
var unit = [0, 1];

// deinterpolate(a, b)(x) takes a domain value x in [a,b] and 
// returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and 
// returns the corresponding domain value x in [a,b].
// 上面那句话的主要意思是deinterpolate是正向插值，输入一个[0, 1]的值t，
// 将会获得[a, b]区间上的一个值，当然了，计算方法嘛就是我们前面的interpolateNumber咯
// reinterpolate是逆向插值，逆向插值就是从值域中获取定义域所对应的值
export default function continuous(deinterpolate, reinterpolate) {
    var domain = unit, 
        range = unit,
        interpolate = interpolateValue,
        clamp = false,
        piecewise,
        output,
        input;

    function rescale() {
        piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
        output = input = null;
        return scale;
    }

    function scale(x) {
        return (output ||
            (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate,
                interpolate))
        )(+x);
    }

    scale.invert = function (y) {
        return (input || (input = piecewise(range, domain, deinterpolateLinear,
            clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
    };

    scale.domain = function (_) {
        return arguments.length ? (domain = map.call(_, number), rescale()) : domain.slice();
    };

    scale.range = function (_) {
        return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
    };

    scale.rangeRound = function (_) {
        // interpolateRound就是Math.round函数
        return range = slice.call(_), interpolate = interpolateRound, rescale();
    };

    scale.clamp = function (_) {
        return arguments.length ? (clamp = !!_, rescale()) : clamp;
    };

    scale.interpolate = function (_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
    };

    return rescale();
}
</script>
```

代码还不少，我们先来看看这一行——`interpolate = interpolateValue`，interpolateValue是什么形式的插值，这我们得看一下interpolateValue是从哪里引入的：

```Javascript
<script>
	import {interpolate as interpolateValue, interpolateRound} from "d3-interpolate";
</script>
```

也就是说interpolateValue是interpolate的别名，我们就不具体查看interpolate是什么了，简单地说，d3是一个很好的工具，它提供了很多类型的插值形式，比如说是数值、数组、字符串、颜色、日期的插值，但是有的时候我们需要一个统一的接口，我们可不想具体知道我们需要的是什么插值，所以d3也提供一个interpolate的总接口，可以自动判定我们传入的值来使用相对应的插值方法，在本次教程中，我们主要是对数值进行操作，所以这里的interpolate也就是数值的线性插值器，与前一篇中的interpolateNumber函数是差不多的。

接下来我们可以看到，在continuous函数中定义了scale函数，并且将domain、range、invert、clamp、interpolate、rangeRound等函数挂载到scale函数的函数对象上，让它们成为scale函数的静态方法。最后，创建完成scale函数之后continuous反悔了rescale函数执行的结果，rescale，通过名字我们就可以猜出一些东西，re代表重新，那么rescale也就是重新构造scale，但是这里的scale不是指的是scale函数，而是各种内部的变量，比如说output、和input之类的，最终rescale函数返回的却是我们最为熟悉不过的scale函数，在外面我们也就可以使用scale函数以及它的各种静态方法了。这种写法我是借鉴d3-scale的，为什么呢？因为它牛啊，原先的时候我想着使用new Function这样的对象方式来实现各种比例尺的，但是写了一会儿我就发现那样写比较啰嗦，所以就转向了d3-scale的写法，而且要写教程，我想模仿d3-scale的写法会让我们更快熟悉d3-scale的代码，最后我们的代码才会跟d3-scale的有一些雷同。

###### rescale

来看一下rescale函数都做了些什么。

```Javascript
<script>
	 function rescale() {
        piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
        output = input = null;
        return scale;
    }
</script>
```

首先rescale执行的时候回判断domain（这个变量是保存在整个continuous函数内部的）数组的长度是否大于两个，如果多于两个数值的话就会使用polymap，否则使用bimap，名字也比较好懂，poly表示多，bi表示两个，它们具体的作用是什么我们稍后介绍。然后将output和input设置为null，这两个变量是干嘛的，这么理解吧，output是保存一个插值关系，从domain到range，而input正好相反，保存的是从range到domain的插值关系。这里设置为null，在scale函数中会重新进行赋值，最后返回scale函数，其实道理跟我们的的做法差不多，scale什么也没干，返回它只是为了使用它本身的函数和它的静态方法。

###### scale

现在我们来看一下scale函数都做了什么。

```Javascript
<script>
	function scale(x) {
        return (output ||
            (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate,
                interpolate))
        )(+x);
    }
</script>
```

这个就稍微有点儿厉害了，需要用到好几个方法，首先我们假设我们的domain是一个只包含两个数值的数组，所以在rescale函数中我们已经将piecewise赋值为bimap，这是个方法，一会儿我们就贴出它的代码。另外我们没有设置clamp，所以clamp的值是默认的false值，最终经过我们假设之后scale函数变成如下的代码：

```Javascript
<script>
	function scale(x) {
        return (output ||
            (output = bimap(domain, range, deinterpolate, interpolate))
        )(+x);
    }
</script>
```

将bimap执行的结果返回，另外scale函数的参数x就是我们调用scaleLinear的时候传递的一个值，这个值是domain区间上（或许之外）的一个值。这里还有两个参数还不明确——deinterpolate, interpolate，这两个参数对应的是continuous函数的两个参数——deinterpolate, reinterpolate，前面我们也介绍了，其实就是两个简单的数值插值函数。

```Javascript
<script>
// reinterpolate
export default function(a, b) {
	// b变成了range，这个人写东西很简洁啊
	return a = +a, b -= a, function(t) {
		return a + b * t;
	};
}

// deinterpolate
export function (a, b) {
    return (b -= (a = +a))
        ? function (x) {
            return (x - a) / b;
        }
        : (function(x) {
			return function() {
				return x;
			};
		})(b);
}

</script>
```

够简单吧，这两个数值插值器我们清楚了之后，我们得来看一下bimap是怎么回事儿了。
