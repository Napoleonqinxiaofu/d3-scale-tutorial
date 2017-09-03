#### scale.ticks(count)

ticks函数是获取定义域上指定的刻度数量下的每一个刻度数，想想我们第一次实现ticks的时候每一个tick都可能带有很长的小数，当时真是没有办法，后来学习到了刻度nice的方法，终于把每一个刻度都变得稍微符合人的阅读习惯了。但是我们还不满足，总是想知道d3-scale到底是怎样实现的。上一节我们讲完了scale.nice这个函数，也知道了d3-scale是如何获取一个步长的了，现在我们猜想一下，d3-scale会怎样实现这个ticks呢？也别把想得那么高深，既然人家都有一个tickIncrement了，为什么还要创造别的函数呢，所以说，d3-scale的ticks函数就是基于这个函数而实现的，来看看一看。

```Javascript
<script>
scale.ticks = function(count) {
	var d = domain();
	return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
};

function ticks(start, stop, count) {
  var reverse = stop < start,
      i = -1,
      n,
      ticks,
      step;
  // 交换起始点以及终点的值，使得最终start < stop
  if (reverse) n = start, start = stop, stop = n;

  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}
</script>
```
看着这些语句总是感觉那么熟悉，其实ticks也在调用tickIncrement来获取定义域上比较好的步长值，最后来扩展domain的区间两边的值，最后生成一个等差数列。就这么简单。





## linear结语

从开始准备些教程的兴致勃勃到现在感觉一脸生无可恋，我现在算是理解了写博客的痛苦了，特别是讲解代码的教程，以为平常我们学习代码都是通过调试代码来学习的，好一点儿的情况下，人家的代码可能有注释或者文档，所以说用文字来介绍一个代码逻辑真的很难，不过还没有完，我们还有对数比例尺。

[Prev](d3_linear_5.md)

[Next](../Log)

