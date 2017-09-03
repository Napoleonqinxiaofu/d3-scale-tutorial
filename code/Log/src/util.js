/**
 * Create by xiaofu.qin {2017/8/31}
 */
define(function () {

    function selectLog(base) {
        return base === Math.E ? Math.log
            : base === 10 && Math.log10
            || base === 2 && Math.log2
            || (base = Math.log(base), function(x) { return Math.log(x) / base; });
    }


    function selectPow(base) {
        return base === Math.E ? Math.exp
            : function(x) { return Math.pow(base, x); };
    }

    // 这里默认的情况就是0 < a < b
    // 如果domain为负值的时候在scale中转换一下
    function deInterpolate(a, b, log, clamp) {
        b = log(b / a);
        return function(x) {
            var t = log(x / a) / b;
            t = !clamp ? t : t < 0 ? 0 : t > 1 ? 1 : t;
            return t;
        };
    }

    // 这里就是线性的
    function reInterpolate(a, b, isRound) {
        b = b - a;
        return function(t) {
            var result = b * t + a;
            result = isRound ? Math.round(result) : result;
            return result;
        };
    }

    // 下面的是invert的插值
    function deInterpolate_invert(a, b) {
        b = b - a;
        return function(x) {
            return (x - a) / b;
        };
    }

    function reInterpolate_invert(a, b) {
        return function(t) {
            var result = Math.pow(a, 1-t) * Math.pow(b, t);
            return result;
        };
    }

    return {
        selectLog: selectLog,
        selectPow: selectPow,
        deInterpolate: deInterpolate,
        reInterpolate: reInterpolate,
        deInterpolate_invert: deInterpolate_invert,
        reInterpolate_invert: reInterpolate_invert
    };

});