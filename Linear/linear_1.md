#### invert函数的实现

这一节是对[上一节](README.md)的继续，所以你可以方便的来回跳转。

invert表示反转的意思，invert函数就是我们想来一个转换，想获取一个值域上的值对应的定义域上的值，这个方法的使用场景在哪儿呢？还是用上一节讲到的例子吧，我们有一组数据代表某一家公司的营业额，现在我们已经使用比例尺将数据转换成我们的电脑屏幕可以接受的数据，假如我们最后把它们绘制成一个折线图了，现在我们想要有一点儿交互的效果——当我们使用鼠标覆盖某一点的时候，显示这个点对应的真实数据。我们的真实数据是一个离散值，毕竟那是营业额不是，所以我们使用一般的手段获取某一点对应的真实数据有点儿麻烦，这个时候如果有一个invert函数来将值域上值转化成定义域上的值就好了，这就是我们马上要实现的invert函数。

不知道大家是否知道黄宏、巩汉林、林永健的一个小品——《装修》，黄宏说了一句话：能拆就能砌，能破就能立。当然了，到最后还是喊了半天的八十、八十没到手……现在我们既然能从定义域获取值域，也就能从值域中获取定义域，我们只需要交换一下两者的身份就可以了……

```Javascript
<script>
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

            // 在这里返回scale，使得调用domain或者range函数之后可以直接使用scale函数来求解
            // 类似链式调用的效果
            return scale;
        }

        /**
         * 设定值域
         * @param r
         */
        function range(r) {
            _range = r;
            return scale;
        }

        /**
         * 映射关系函数,将上一节的fx更名为scale
         * @param x
         */
        function scale(x) {
            // 计算x在定义域中的比例
            var ratio = (x - _domain[0]) / (_domain[1] - _domain[0]);

            return ratio * (_range[1] - _range[0]);
        }

        /**
         * 从值域中获取对应的定义域的值
         * @param y
         * @returns {number}
         */
        function invert(y) {
            // 计算x在定义域中的比例
            var ratio = (y - _range[0]) / (_range[1] - _range[0]);

            return ratio * (_domain[1] - _domain[0]);
        }

        // 将domain和range函数设置为scale的静态方法
        scale.domain = domain;
        scale.range = range;
        scale.invert = invert;

        // 返回scale，让外部直接调用
        return scale;
    }


    var linearScale = linear().domain([0, 10]).range([0, 1000]);


    console.log(
        linearScale(5),
        linearScale.invert(linearScale(5))
    );

</script>
```

现在看看我们的代码还是挺简单的，invert函数无非就是把定义域和值域交换了嘛，就是这么简单。我们可以怀着轻松的心情看下一个函数的实现方式了。


#### clamp函数

clamp这个单词翻译过来是夹紧，我的脑海突然闪出两个年头，一个军训的时候必须两腿夹紧的夹紧，另一个高中的时候讲到的夹逼定理，哎哟，你别说，讲那堂课的时候我就没有好好听课，因为这个词就够我和同桌开玩笑的。前面我们也提到过，d3-scale的clamp函数的作用是当我们输入的值在定义域之外的时候就会使用边界上的值来代替。具体应该怎么实现呢？那就是判断一下输入的数是否在定义域的区间之内了（对于invert函数我们就不管了，有的时候考虑得太多会给自己徒增麻烦）。这不就走起了。

```Javascript
<script>
    function linear() {
        // 默认值
        var _domain = [0, 1],
            _range = [0, 1],
            // 默认不夹紧，这才是真实的状态，要放松
            isClamp = false;

        /**
         * 设置定义域
         * @param d
         */
        function domain(d) {
            _domain = d;

            // 在这里返回scale，使得调用domain或者range函数之后可以直接使用scale函数来求解
            // 类似链式调用的效果
            return scale;
        }

        /**
         * 设定值域
         * @param r
         */
        function range(r) {
            _range = r;
            return scale;
        }

        /**
         * 映射关系函数,将上一节的fx更名为scale
         * @param x
         */
        function scale(x) {
            // 现在要看看调用函数的时候需不需要夹紧了
            var sign = judgePos(x, _domain);
            x = !isClamp ? x : (sign === -1 ? _domain[0] : (sign  === 1 ? _domain[1] : x));
            // 计算x在定义域中的比例
            var ratio = (x - _domain[0]) / (_domain[1] - _domain[0]);

            return ratio * (_range[1] - _range[0]);
        }

        /**
         * 从值域中获取对应的定义域的值
         * @param y
         * @returns {number}
         */
        function invert(y) {
            // 计算x在定义域中的比例
            var ratio = (y - _range[0]) / (_range[1] - _range[0]);

            return ratio * (_domain[1] - _domain[0]);
        }

        /**
         * 设定是否将定义域夹紧
         * @param b
         * @returns {scale}
         */
        function clamp(b) {
            isClamp = !!b;
            return scale;
        }

        // 将domain和range函数设置为scale的静态方法
        scale.domain = domain;
        scale.range = range;
        scale.invert = invert;
        scale.clamp = clamp;

        // 返回scale，让外部直接调用
        return scale;
    }

    /**
     * 判断x是否在domain的值范围内
     * @param x
     * @param domain
     * @returns {-1 x在domain的左区间， 0 x在domain区间内， 1 x在domain右区间}
     */
    function judgePos(x, domain) {
        var sign = domain[0] < domain[1] ? 1 : -1;
        var result = 1,
            domainSort = domain.slice().sort();

        if( x < domainSort[0] ) {
            result = sign * -1;
        }
        else if( x > domainSort[1] ) {
            result = sign;
        }
        else {
            result = 0;
        }
        return result;
    }


    var linearScale = linear().domain([0, 10]).range([0, 1000]);

    // -1000 0
    console.log(
        linearScale(-10),
        linearScale.clamp(true)(-10)
    );

</script>
```

我们添加了一个工具函数judgePos来判断某一个数与定义域在数轴上的位置关系，由于我们这是在一个文件中进行开发，所以就把它们都写在一起了，你也可以将这个函数写在别的模块中，只要到时候我们能获取就可以了。写完了clamp的功能，我们应该来看一下我们的标签刻度之类的东西了，但是呢，这篇代码已经占据了很大的篇幅了，我们写在另一篇之中吧！


[Prev](./README.md)

[Next](linear_2.md)












