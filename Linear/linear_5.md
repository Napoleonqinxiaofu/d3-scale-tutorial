#### ticks函数改进

要想获取比较理想的刻度数，我们还是得牺牲一下domian，也就是说，我们获取到的ticks的值会将domain改变成比较理想的值，就是使用nice一样的效果。

```JavaScript
<script type="text/javascript">
	

/**
 * 获取所有刻度
 * @param count
 * @return
 */
function ticks(count) {
    count = count || 10;

    var ascending = _domain[0] < _domain[1],
        start = ascending ? _domain[0] : _domain[1],
        end = ascending ? _domain[1] : _domain[0],
        result = tickIncrement(start, end, count);

    if( !ascending ) {
        result.domain.reverse();
    }
    var arr = makeRange(result.domain[0], result.domain[1], result.step);

    return arr;
}

</script>
```

好了，现在ticks函数我们也算是完成了，大部分的d3-scale里面关于linear的函数我们都实现了，接下来让我们看看d3-scale它自己是怎么实现的吧。但是既然我们自己也谢了代码，就千万别随手丢掉，我们把它们整理起来，作为自己的一些成果吧，在开始学习d3-scale如何实现scaleLinear之前，我们来整理一下自己的代码，我个人使用requirejs来辅助开发，你也可以使用别的工具来辅助开发，我们最终的文件结构会是这样的：

```Bash
----src
--------util.js
--------linear.js
----demo.html
```

具体的代码可以前往这里查看，[GO](../code/Linear)

[Prev](./linear_4.md)

[Next](./d3_linear_1.md)