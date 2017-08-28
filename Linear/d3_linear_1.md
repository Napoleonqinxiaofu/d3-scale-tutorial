## 混进d3-scale之中

终于，我们自己实现了大部分的线性比例尺的函数，感觉也挺够用的，但是这还不是我们最终的学习目标，因为我们还没有看到高手写出来的代码，我们不能对自己的成就沾沾自喜，过会儿我们就开始去看代码，但是我要说一些废话先。你也可以到这里链接下下载整个[d3-scale](https://github.com/d3/d3-scale)的源码。而且，它的源码中js文件相互引用这一块使用的是ES6的规范，调试起来其实比较麻烦，所以我建议你找一个比较好的调试的编辑器，我自己使用的是WebStorm。另外作者太厉害，源码里模块化也比较厉害，所以我们得随时准备好来回跳转文件，最最重要的是作者很少写注释，不过他的README.md倒是写得很详细，所以如果你看代码不太明白的时候可以到README.md里看看用法和介绍。

这是我第二次查看某一个js库的源码，第一个是iSlider，那个代码量比较少，容易看懂，但是涉及的东西也非常多，现如今我们开始查看d3-scale的源码，总的来说，个人感觉还是iSlider的代码写得比较规范，d3-scale的源码一般来说都比较短小，但是可阅读性比较差。好了，就这么多废话，走起。