#### ticks函数

刻度用来干嘛呢？当我们将数据绘制在电脑屏幕的时候，为了增强我们的可视化效果，我们可能需要在坐标轴上显示一些刻度值，这个时候想想如果有一个直接获取所有刻度值的函数多好，正好d3-scale就提供了这个，我们自己先来实现以下，但是最终结果并不是太好，为什么呢？因为计算机计算数值的时候容易出现小数，而且这个小数位还比较长，所以怎么让我们获取到的刻度比较美观其实还比较难，在我们开始看d3-scale的源码的时候我们会讲到这个算法，这里就先实现一个比较简易的ticks函数。

我们先来创建一个生成等差数列的函数，叫makeRange。

```Javascript
<script>
	/**
     * 生成等差数列
     * @param start
     * @param end
     * @param step
     * @returns {Array}
     */
	function makeRange(start, end, step) {
        var ascending = start < end,
            arr = [],
            sum = start;

        if( ascending ) {
            while(sum <= end) {
                arr.push(sum);
                sum += step;
            }
        }else {
            while(sum >= end) {
                arr.push(sum);
                sum -= step;
            }
        }
        return arr;
    }

</script>
```

有了生成等差数列的函数，如果我们想获取一个定义域上的所有刻度，我们只需要知道定义域的起始值、终点和步长即可，所以我们就需要定义我们到底要多少的刻度数，来看一下。

```Javascript
<script>
    function linear() {
        // 与前一节的代码一致，省略了
        

        /**
         * 获取所有刻度
         * @param count
         * @return
         */
        function ticks(count) {
            count = count || 10;
            // 这里取绝对值，因为makeRange会自动判断是递增还是递减数列
            var step = Math.abs(_domain[1] - _domain[0]) / (count - 1),
                arr = makeRange(_domain[0], _domain[1], step);

            if( arr.length === count ) {
                arr.pop();
            }

            arr.push(_domain[1]);

            return arr;
        }




        // 将domain和range函数设置为scale的静态方法
        scale.domain = domain;
        scale.range = range;
        scale.invert = invert;
        scale.clamp = clamp;
        scale.ticks = ticks;

        // 返回scale，让外部直接调用
        return scale;
    }

    /**
     * 生成等差数列
     * @param start
     * @param end
     * @param step
     * @returns {Array}
     */
    function makeRange(start, end, step) {
        console.log(arguments)
        var ascending = start < end,
            arr = [],
            sum = start;

        if( ascending ) {
            while(sum <= end) {
                arr.push(sum);
                sum += step;
            }
        }else {
            while(sum >= end) {
                arr.push(sum);
                sum -= step;
            }
        }
        return arr;
    }


    var linearScale = linear().domain([0, 10]).range([0, 1000]);

    // [0, 1.1111111111111112, 2.2222222222222223, 3.3333333333333335, 
    // 4.444444444444445, 5.555555555555555, 6.666666666666666, 
    // 7.777777777777777, 8.888888888888888, 10]
    console.log(
        linearScale.ticks()
    );

</script>
```

写到这儿我每次粘贴上自己的代码都发现行数增加了不少，所以我决定适当地减少与前几节雷同的代码，如果你感觉不那么适应，还望见谅。接下来我们都会是这样的，因为代码量增加了不少。


好了，我准备在这里结束这一篇，还是老原因，太长，下一节我们来看一下nice函数是怎么个情况。

[Prev](linear_1.md)

[Next](linear_3.md)
