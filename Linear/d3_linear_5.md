#### scale.nice

现在是时候来看一下d3-scale是怎么来实现将定义域扩展成比较理想的形式了，我们在前面定义了一个tickIncrement函数来专门执行刻度自适应的算法，那么我这里坦白一下，tickCrement这个函数名称是从d3-scale中借鉴过来的，那么这就比较好理解了，不过我们自己的tickIncrement计算了适合的步长之后顺便计算了比较好的定义域，而d3-scale呢就简略一些，只是计算了step，来看一下。

```JavaScript
<script>
var e10 = Math.sqrt(50),
	e5 = Math.sqrt(10),
	e2 = Math.sqrt(2);
function tickIncrement(start, stop, count) {
	var step = (stop - start) / Math.max(0, count),
	power = Math.floor(Math.log(step) / Math.LN10),
	error = step / Math.pow(10, power);

	return power >= 0
		? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
		: -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}
</script>
```

看着这些代码也不会太陌生，不就是Math.log之类的对数函数来获取数量级这些算法吗，其实就是这样，首先通过传递进来的起始值和终点值计算步长，然后计算出步长的数量级，并将其赋值给power变量，紧接着，将步长与当前数量级的第一个值相除的结果赋值给error。让我们来假设一下原始的步长，如果它是120，那么power的值应该是2，而error的值应该是1.2，所以现在最后return的时候应该走的是这一步的代码：

```Javacsript
<script>
	(error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
</script>
```

具体的值应该是100,最后返回的步长是100，我们设定的步长比d3-scale的多0.25这一个，其实基本原理都差不多。现在我们再来假设一下，power小于零的情况，这种情况是当step属于(0, 1]的区间的时候，比如说step=0.0234，则power=-2，那么那么代码就会走下面的路线：

```JavaScript
<script>
	-Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1)
</script>
```
所以最终返回的值会是-50，这个值就是d3-scale最终计算出来的step，这个step是d3-scale计算出来比较适合人类习惯的一个步长，所以接下来我们可以拿着这个步长去重新改造我们的domain了。

###### 根据step扩展domain

