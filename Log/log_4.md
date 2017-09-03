#### scale.ticks

对数比例尺的刻度按理来说就是base的指数，想来其实挺简单的，但是我发现d3-scale没有这么想，通过一系列复杂的代码来产生刻度数，所以结果很明显，d3-scale的刻度函数并不好，首先我们来看一下它的刻度是什么样的。

```Javascript
<script>
require([
    'd3-scale',
],
function(Scale) {
    var log = Scale.scaleLog().domain([1, 10000]).range([0, 10]);

    //[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 
    // 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 
    // 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000] 
    console.log(log.ticks(5));

});
</script>
```

我想请问一下，这还是我们想要的刻度吗？不是了。如果你想查看它们是怎样计算出来的，欢迎你自己查看里面的源码，下面我们自己来实现自己的ticks函数。

```Javascript
<script>
	scale.ticks = function (count) {
            count = count || 5;

            var originDomain = _domain.slice(),
                niceDomain;

            // 在这里调用一下nice函数
            scale.nice();
            niceDomain = _domain.slice();
            // 为了不破坏调用nice函数之前的domain，对domain重新赋值一下。
            _domain = originDomain.slice();

            var d0 = niceDomain[0], d1 = niceDomain[1],
                reverse = d0 > d1,
                ticks = [],
                t;
            if( reverse ) {
                t = d0;
                d0 = d1;
                d1 = t;
            }

            // _log 和 _pow是与logs、pows相同的函数
            var i = _log(d0),
                j = _log(d1);

            ticks.push(d0);

            while(i++ <= j) {
                ticks.push(_pow(i));
            }

            return reverse ? ticks.reverse() : ticks.slice();
        };
</script>
```

现在好了，我们自己实现了ticks函数，感觉还有点儿骄傲呢，但是到现在为止我也不知道d3-scale的log.ticks这个函数作者到底想干嘛，不管了，我们已经按照自己的当时来实现了tiks函数。到此为止呢，有关对数比例尺的部分也讲完了，下面就是该实现的问题了，对数比例尺我们讲解的详细程度与linear比例尺的不成正比，那是因为对数比例尺很多部分都在套用Linear比例尺的东西，我认为讲多了实在是浪费时间，所以如果你对对数比例尺有一些疑惑，那么你可能需要到linear比例尺的部分去看一看。

[Prev](log_3.md)

[Next](d3_log_code_1.md)













