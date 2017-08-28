#### nice函数（续）

我们在前面实现了tickIncrement函数，可以可以用来辅助nice函数了，但是我们创建的tickIncrement函数有一个要求，那就是minValue一定要小于maxValue，这个要求使得我们必须要对nice函数做一些调整，而不是直接使用tickIncrement作为nice函数，因为我们传递给linearScale的domain不一定是升序的，所以我们来看一下如何实现nice函数的。

```Javascript
<script>
    function linear() {
        // 默认值
        var _domain = [0, 1],
            _range = [0, 1],
            // 保存一个步长
            _step = null,
            // 默认不夹紧，这才是真实的状态，人要多放松是不？
            isClamp = false,
            isNice = false;
     
     	// 相同的代码就不重复了

        /**
         * 将定义域扩展成比较理想的形式，使得它更符合人的视觉习惯
         * @param count 刻度数量
         */
        function nice(count) {
            isNice = !!count;
            if( !isNice ) {
                return;
            }

            var ascending = _domain[0] < _domain[1];
            var result = tickIncrement(ascending ? _domain[0] : _domain[1], ascending ? _domain[1] : _domain[0], count );

            _domain = ascending ? result.domain : result.domain.reverse();
            _step = result.step * (ascending ? 1 : -1);

            return scale;
        }

        // 为了方便调试输出，我们特意创建这个函数来查看内部变量的值
        function getAllVariable() {
            return {
                domain: _domain.slice(),
                range: _range.slice(),
                step: _step,
                isClamp: isClamp,
                isNice: isNice
            }
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

    /**
     *
     * @param minValue
     * @param maxValue
     * @param count
     * @returns {{domain: [null,null], step: number}}
     */
    function tickIncrement(minValue, maxValue, count) {
     	// codes……

        return {
            domain: [minValue, maxValue],
            step: newStep
        };
    }


    var linearScale = linear().domain([1, 88]).range([0, 1000]);

    /*domain: [1, 88]
    isClamp: false
    isNice: false
    range: [0, 1000]
    step: null*/
    console.log(
        linearScale.getAllVariable()
    );

    // 我们现在将domain扩展成比较理想的形式，并且规定它拥有10个区间
    linearScale = linear().domain([1, 88]).range([0, 1000]).nice(11);

    /*domain: [0, 100]
    isClamp: false
    isNice: true
    range: [0, 1000]
    step: 10*/
    console.log(linearScale.getAllVariable());

</script>
```

到现在为止，我们已经解决了nice的问题了，可以我的心头还有一块石头没有落下，那就是ticks函数并不是特别完美，我们只是通过简单的除法得到每一个刻度，现在我们都把nice函数学习了，我想我们能不能把ticks函数也改进一下，让每一个刻度值也变得理想一些呢？咱们还是开心的一篇来说明这个问题吧，太长了不好翻页！

[Prev](linear_3.md)

[Next](linear_5.md)
