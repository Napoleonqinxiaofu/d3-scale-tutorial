#### scale.nice

nice函数呢是将定义域扩展成比较理想的形式，在linear比例尺中我们还需要计算一个比较好的步长，但是在这里我想我们不用这么麻烦了，为什么呢？因为只要我们设置了log比例尺的底（base），那么我们根本就不能再自己计算步长，每一步的步长无非就是base的多少次方之间的差值，所以nice函数只需要将定义域上的两个端点值变成base的某一个值的指数即可。不过我们现在需要考虑的是，如果定义域是[99999， 3] 这样的情况，也就是定义域反转，我们同样需要将其转化成能够包含[99999, 3]的定义域，来看一下。

```Javascript
<script>
	// 这里不需要count了
	scale.nice = function(domain, interval) {
		domain = domain.slice();

		var i0 = 0,
			i1 = domain.length - 1,
			x0 = domain[i0],
			x1 = domain[i1],
			t;

		if (x1 < x0) {
			 = i0, i0 = i1, i1 = t;
			t = x0, x0 = x1, x1 = t;
		}

		domain[i0] = interval.floor(x0);
		domain[i1] = interval.ceil(x1);
		return domain;
	}
</script>
```

先不要管interval是什么，我们看一下其他的代码能看出来，nice函数的前期操作是将domain的按照升序的排列方式来排序，然后调用floor、ceil之类的函数，暂时还不知道这玩意儿，不过我们知道，floor对domain的最小值进行操作，而ceil是对domain的最大值进行操作，这样就能保证即便我们的定义域是翻转过来的也能把它扩展成比原来的定义域大的区间。下面来看一下interval是什么。

```Javascript	
<script>
	var interval = {
		floor: function (x) {
            return pows(Math.floor(logs(x)));
        },
        ceil: function (x) {
            return pows(Math.ceil(logs(x)));
        }
    };
</script>
```
这又多出两个函数——pows、logs，这两个函数呢是根据我们在前面设置的base来返回对应的指数或者对数函数，来瞧一瞧。

```Javascript
<script>

function pow10(x) {
    return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
    return base === 10 ? pow10
        : base === Math.E ? Math.exp
        : function (x) {
            return Math.pow(base, x);
        };
}


function logp(base) {
    // 这里在最后采用了对数换底的法则，log_{a}^{b} = log_{x}^{b} / log_{x}^{a}
    // x可以使任何的底数，所以d3就直接使用log的自然数对数函数
    // 最后返回的是一个以base为底的对数函数
    return base === Math.E ? Math.log
        : base === 10 && Math.log10
        || base === 2 && Math.log2
        || (base = Math.log(base), function (x) {
            return Math.log(x) / base;
        });
}

// base就是我们使用log.base()设置的数值
logs = logp(base),
pows = powp(base);
</script>
```
现在看出来了吧，logs就是将某一个数值转变成对数的形式，pows呢正好反过来，获取某一个数的指数形式，将它们传递给interval对象，这样再通过Math.floor和Math.ceil函数将它们转化成整数的形式，得到最终的理想的定义域形式。也许你会问，如果我的定义域是在0和1之间的数，那应该怎么办，那只能凉拌了，不好意思。

[Prev](log_2.md)

[Next](log_4.md)