## 如何使用d3-scale

让我们来看一下d3-scale这个项目repo下的介绍是怎么说的：If you use NPM, npm install d3-scale. Otherwise, download the latest release. You can also load directly from d3js.org, either as a standalone library or as part of D3 4.0. AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported.

作者说我们可以单独地使用d3-scale，可以通过AMD、CommonJS或者全局引入的方式引入，但是我第一次使用的时候还是遇到了坑，所以在这里提一下，防止你也会遇到坑。我是使用require.js来引入d3-scale的，所以以下的方式适用于require.js，当然，也可以以此类推，用到其他的方式。

首先使用`npm install d3-scale --save-dev`来安装，接下来它会默认给我们下载各种以d3开头的依赖，但是并不会在我们的package.json里有记录，这是d3-scale自己的依赖，而不是我们的，所以你可能会遇到与我相类似的问题。假设的我代码结构是这样的：

```bash
tutorial
----node_modules
--------d3-scale
--------requirejs
//以d3开头的还有很多，这里暂时不全写出来了
--------d3-array

----demo.html

```

`demo.html`是这样的：

```Javascript
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Title</title>
	<script src="node_modules/requirejs/require.js"></script>
</head>
<body>
	
</body>
<script>
	
	requirejs.config({
		baseUrl: "./node_modules/"
	});

	require(['d3-scale/build/d3-scale'], function(Scale) {
		// do something
	});

</script>
</html>
```

你可能会得到很多个类似于`Script error for "d3-color", needed by: d3-scale`这样的报错，开始我还挺纳闷的，怎么作者说话不算数呢？不是可以通过requirejs来引入的吗？后来我再仔细看了一下d3-scale的repo，发现作者自己再README.md上写的引入方式是通过全局方式引入的，就像下面这样：

```Javascript
<script src="https://d3js.org/d3-array.v1.min.js"></script>
<script src="https://d3js.org/d3-collection.v1.min.js"></script>
<script src="https://d3js.org/d3-color.v1.min.js"></script>
<script src="https://d3js.org/d3-format.v1.min.js"></script>
<script src="https://d3js.org/d3-interpolate.v1.min.js"></script>
<script src="https://d3js.org/d3-time.v1.min.js"></script>
<script src="https://d3js.org/d3-time-format.v2.min.js"></script>
<script src="https://d3js.org/d3-scale.v1.min.js"></script>
<script>

var x = d3.scaleLinear();

</script>
```

这样就完美地躲过了各种小问题，直接通过d3的全局接口来使用scale的函数，但是这并不是一个好的解决方法，我需要用require.js来引入，通过查看源码我发现d3-scale自己在初始化的时候也在引入其他的模块，它的代码是这样的：

```Javascript
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? 
        		factory(exports, require('d3-array'), require('d3-collection'), 
        		require('d3-interpolate'), require('d3-format'), require('d3-time'), 
        		require('d3-time-format'), require('d3-color')) :
        	typeof define === 'function' && define.amd ? 
        		define(['exports', 'd3-array', 'd3-collection', 
        			'd3-interpolate', 'd3-format', 'd3-time', 
        			'd3-time-format', 'd3-color'], factory) :
	            (factory( (global.d3 = global.d3 || {}), global.d3, 
			            global.d3, global.d3, global.d3, global.d3, 
			            global.d3, global.d3));
}(this, (
    function (exports, d3Array, d3Collection, 
    		d3Interpolate, d3Format, d3Time, 
    		d3TimeFormat, d3Color){

	// d3-scale的代码

    })));
```

所以说d3-scale默认各种依赖都放在与d3-scale.js相同的目录下，现在有两种解决方法，一是把所有的依赖文件都拷贝过来，另外一种是修改d3-scale.js的代码，我想，我还是喜欢第一种。

现在我们就可以通过requirejs来引入d3-scale了。

这里我暂时不讲d3-scale都有那些方法可用，因为这样是多余的，如果要学习这个，你就不会来看这些教程，好了，直接进入[Linear](../Linear/)的专题吧。