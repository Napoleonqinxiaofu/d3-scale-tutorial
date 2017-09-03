/**
 * Create by xiaofu.qin {2017/8/31}
 */
define(['./util'], function(util) {
    function log() {

        var _domain = [1, 10],
            _range = [1, 10],
            _domainBackUp = _domain.slice(),
            _base = 10,
            _isRound = false,
            _clamp = false,
            _log = null,
            _pow = null;

        var domainToRangeDe,
            domainToRangeRe,
            rangeToDomainDe,
            rangeToDomainRe;

        function rescale() {
            domainToRangeDe = domainToRangeRe =
                rangeToDomainDe = rangeToDomainRe =
                    _log = _pow = null;
            _log = util.selectLog(_base);
            _pow = util.selectPow(_base);

            return scale;
        }

        function scale(x) {
            !domainToRangeDe
            && (domainToRangeDe = util.deInterpolate(_domain[0], _domain[1], _log, _clamp));

            // 传递一个_isRound参数，表示结果是否需要四舍五入
            !domainToRangeRe
            && (domainToRangeRe = util.reInterpolate(_range[0], _range[1], _isRound));

            !rangeToDomainDe
            && (rangeToDomainDe = util.deInterpolate_invert(_range[0], _range[1]));

            !rangeToDomainRe
            && (rangeToDomainRe = util.reInterpolate_invert(_domain[0], _domain[1]));

            return domainToRangeRe(domainToRangeDe(x));
        }

        scale.base = function(_) {
            return arguments.length ? (_base = +_, rescale()) : _base;
        };

        // _只能全是正数
        scale.domain = function(_) {
            return arguments.length ?
                (_domain = _.map(Number), _domainBackUp = _domain.slice(), rescale()) :
                _domain.slice();
        };

        scale.range = function(_) {
            return arguments.length ?
                (_range = _.map(Number), rescale()) :
                _range.slice();
        };

        scale.rangeRound = function(_) {
            return arguments.length ?
                (_range = _.map(Number), _isRound = true, rescale()) :
                _range.slice();
        };

        scale.invert = function(y) {
            return rangeToDomainRe(rangeToDomainDe(y));
        };

        scale.clamp = function(b) {
            return arguments.length ?
                (_clamp = !!b, rescale()):
                _clamp;
        };

        scale.nice = function() {
            var d0 = _domainBackUp[0],
                d1 = _domainBackUp[1],
                arr = [0, 0],
                reverse = d0 > d1,
                temp;
            if( reverse ) {
                temp = d0;
                d0 = d1;
                d1 = temp;
            }

            arr[0] = _pow(Math.floor(_log(d0)));
            arr[1] = _pow(Math.ceil(_log(d1)));

            _domain = reverse ? arr.reverse() : arr;

            return rescale();
        };

        scale.ticks = function (count) {
            count = count || 5;

            var originDomain = _domain.slice(),
                niceDomain;

            // 在这里调用一下nice函数
            scale.nice();
            niceDomain = _domain.slice();
            // 为了不破坏调用nice函数之前的domain，对domain重新赋值一下。
            _domain = originDomain.slice();

            var d0 = niceDomain[0], d1 = niceDomain[1],
                reverse = d0 > d1,
                ticks = [],
                t;
            if( reverse ) {
                t = d0;
                d0 = d1;
                d1 = t;
            }

            var i = _log(d0),
                j = _log(d1);

            ticks.push(d0);

            while(i++ <= j) {
                ticks.push(_pow(i));
            }

            return reverse ? ticks.reverse() : ticks.slice();
        };

        scale.debug = function() {
            console.log(
                scale.domain(),
                scale.range(),
                _domainBackUp,
                _base,
                _clamp,
                _isRound,
                _log,
                _pow
            );
        };

        return rescale();

    }

    return log;

});
