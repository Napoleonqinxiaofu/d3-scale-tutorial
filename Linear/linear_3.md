#### nice函数

nice这就不用翻译了，每次看见好看的姑娘除了行注目礼之外我的嘴里还会不由自主地冒出一句洋文——nice，当然了，偶尔还会有日语，为什么不说中文呢？怕她男朋友听见，或许是我也不一定！！！

而d3-scale中nice是干嘛用的呢？前面我们提到说是将定义域扩展成比较理想的形式，比如我们设定的[1, 88]，d3可能会帮我们扩展成[0, 100]，总之它会变成一个看起来比较舒服的数据。换做是你你会怎么实现这个效果呢？我不会知道你的答案的，但是我可以告诉你我第一次的想法，我从一本书上开始注意到这个nice的时候，我就想着要不使用floor或者ceil之类的来实现呗，后来才发现自己有多单纯，如果区间是[0, 1]之间的某一个小数呢，我总不能把它们都扩展成[0, 1]吧，所以我的第二个想法是百度一下，找了好久，终于让我找到了一个线索——[Jump to here](http://blog.csdn.net/heyzol/article/details/22912389)，我建议你直接去看作者给出的论文，而且是中文的那篇，另外如果还是没有看明白，那就再看看那篇期刊引用的另一篇期刊，这样你就能看懂了。我为什么没有推荐英文的呢？第一是因为我没有看，时间紧急没空翻译了，第二呢这一个小算法我们都要折腾这么久，那么放在其他的场景下我们是不是得学完所有东西才罢休呢！我个人觉得没必要，况且现在很多可复用的算法代码写得很好，我们根本没有必要去全部都学。所以呢，我就只看了中文的期刊，理解了一些东西，感觉博客上的作者没有解释清楚来龙去脉，既然我这里的定位是教程，那么我想来解释一下，如果你根本不想看这个算法的原理的话，直接跳到下一章我也很推荐的, [Next](./linear_4.md)


##### 坐标轴刻度自适应算法中的其中一种算法的介绍

首先提出我们最终的目标，我们希望我们最终获取到某一段区间上合适的步长的形式应该类似于[0.1, 0.2, 0.25, 0.5, 1]这几个数，或者说是这几个数之中某一个数乘以10的多少次方的数，专业一点的话我写不出来，就将就着吧。当然了，如果你喜欢另外的某一个数字，你也可以自己添加上，比如你喜欢6，你可以加上0.6这个数，没有关系的。

好了，我们的目的讲完了，是不是应该看一下应该怎么实现了吧！首先我们得计算出原来的步长，我们已经知道了起始值、终点值以及刻度数，那么步长就可以通过简单的除法获取到。


```Javascript
// maxValue 最大值 minValue最小值 count刻度数
// count-1是因为区间数应该比刻度数少1
var step = (maxValue - minValue) / (count-1);
```

我们要把step变成类似[0.1, 0.2, 0.25, 0.5, 1]其中的一个，电脑可不知道怎么选择，最简单的方法是把step变成[0, 1]区间上的一个值，然后判断这个值与[0.1, 0.2, 0.25, 0.5, 1]那一个值最接近，那么就选它了。怎么做？

我们知道每一个实数都可以使用科学计数法来表示，比如19 = 1.9 * 10 ^ 1，1就是19这个数的数量级，对于1200这个数来说，它的数量级就是3，我们要将某一个数值转化成[0, 1]的区间，只需要找到该数的下一个数量级，然后拿这个数值除以下一个数量级的第一个数值，就可以得到了。挺绕口的，举个例子，我们要将120转化成[0, 1]区间上的一个值，我们将120除以1000就可以得到了，关键是我们需要一个方法来适应所有的数，让这个方法自动获取某一个数值的下一个数量级，这下我们就可以使用对数函数了。


```Javascript
// 你也可以使用10为底的对数，都是可以的
var magnitude = parseInt(Math.log(step) / Math.log(10));

// 现在获取当前数量级的第一个值
var nextOrderMagnitude = Math.pow(10, magnitude);

// 如果这个时候step正好等于nextOrderMagnitute，
// 我们就不要获取下一个数量级的第一个值了，因为step就很完美
if( step !== nextOrderMagnitude ) {
    magnitude += 1
    nextOrderMagnitude = Math.pow(10, magnitude);
}

// 将step转化成[0, 1]之间的数值
var newStep = step / nextOrderMagnitude;
```

现在就OK了，我们已经解决了一个问题，接下来的问题是我们如何选择[0.1, 0.2, 0.25, 0.5, 1]其中的一个数字来作为我们新的step，这个仁者见仁智者见智，有人喜欢使用最近法则，有人喜欢用区间的方法，我们就使用第二种方法吧，那样简单一些。


```JavaScript
var isOk = false,
arr = [0.1, 0.2, 0.25, 0.5, 1];
arr.forEach(function(num, index) {
    if( isOk ) {
        return;
    }
    if( index === arr.length - 1) {
        newStep = 1;
    }
    else if( newStep > num && newStep <= arr[index + 1] ) {
        isOk = true;
        newStep = arr[index+1];
    }
});

```

选择好了最终的刻度之后，我们要把这个刻度增大到step的数量级，然后这个新的刻度就是我们的最终的刻度了。

```JavaScript
	newStep = newStep * Math.pow(10, magnitude);
```


刻度已经确定好了，我们需要重新确定起点和终点的值。

```Javascript
minValue = Math.floor(minValue / newStep) * newStep;
maxValue = Math.ceil(maxValue / newStep) * newStep;	
```

现在起点和终点的值一定是newStep的整数倍了，可是这些新的值可不一定能保证刻度数量与原来设定的一样呢，所以这个得注意一下，如果新的可度数大于或者等于原来的刻度数量，那咱们就不管了，但是如果可度数小于原来的刻度数，那么我们应该将minValue和maxValue同时扩展，来看看代码：

```Javascript
var newCount = (maxValue - minValue) / newStep;
var diffCount = count - newCount - 1;

if( diffCount > 0 ) {
    // minValue和maxValue同时扩展，但是如果diffCount是奇数的时候优先扩展maxValue
    minValue -= Math.floor(diffCount / 2) * newStep;
    maxValue += Math[diffCount % 2 === 0 ? 'floor' : 'ceil'](diffCount / 2) * newStep;
}
```

最终我们把它整理成一个函数，叫tickIncrement，这个函数要求minValue一定要小于maxValue，因为我们前面提到的log函数的定义域是x>0。

```Javascript
function tickIncrement(minValue, maxValue, count) {
        // count-1是因为区间数应该比刻度数少1
        var step = (maxValue - minValue) / (count-1);

        var magnitude = parseInt(Math.log(step) / Math.log(10));

        // 现在获取当前数量级的第一个值
        var nextOrderMagnitude = Math.pow(10, magnitude);

        // 如果这个时候step正好等于nextOrderMagnitute，
        // 我们就不要获取下一个数量级的第一个值了，因为step就很完美
        if( step !== nextOrderMagnitude ) {
            magnitude += 1
            nextOrderMagnitude = Math.pow(10, magnitude);
        }

        // 将step转化成[0, 1]之间的数值
        var newStep = step / nextOrderMagnitude;

        var isOk = false,
        arr = [0.1, 0.2, 0.25, 0.5, 1];
        arr.forEach(function(num, index) {
            if( isOk ) {
                return;
            }
            if( index === arr.length - 1) {
                newStep = 1;
            }
            else if( newStep > num && newStep <= arr[index + 1] ) {
                isOk = true;
                newStep = arr[index+1];
            }
        });

        newStep = newStep * Math.pow(10, magnitude);

        minValue = Math.floor(minValue / newStep) * newStep;
        maxValue = Math.ceil(maxValue / newStep) * newStep;

        var newCount = (maxValue - minValue) / newStep;
        var diffCount = count - newCount - 1;

        if( diffCount > 0 ) {
            // minValue和maxValue同时扩展，但是如果diffCount是奇数的时候优先扩展maxValue
            minValue -= Math.floor(diffCount / 2) * newStep;
            maxValue += Math[diffCount % 2 === 0 ? 'floor' : 'ceil'](diffCount / 2) * newStep;
        }

        return [minValue, maxValue, newStep];
    }

    console.log(tickIncrement(-50, 100, 10))
```

到这里篇幅已经比较长了，所以我准备再开一篇来继续说明nice函数。

[Prev](linear_2.md)

[Next](linear_4.md)
