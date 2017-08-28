/**
 * Create by xiaofu.qin {2017/8/28}
 */
define(['util'], function(util) {

    function linear() {
        // 默认值
        var _domain = [0, 1],
            _range = [0, 1],
            // 保存一个步长
            _step = null,
            // 默认不夹紧，这才是真实的状态，人要多放松是不？
            isClamp = false,
            isNice = false;

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
            var sign = util.judgePos(x, _domain);
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
                result = util.tickIncrement(start, end, count);

            if( !ascending ) {
                result.domain.reverse();
            }
            var arr = util.makeRange(result.domain[0], result.domain[1], result.step);

            return arr;
        }

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
            var result = util.tickIncrement(ascending ? _domain[0] : _domain[1], ascending ? _domain[1] : _domain[0], count );

            _domain = ascending ? result.domain : result.domain.reverse();
            _step = result.step * (ascending ? 1 : -1);

            return scale;
        }

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

    return linear;

});