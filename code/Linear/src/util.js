/**
 * Create by xiaofu.qin {2017/8/28}
 */
define(function() {

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

    /**
     * 生成等差数列
     * @param start
     * @param end
     * @param step
     * @returns {Array}
     */
    function makeRange(start, end, step) {
        var ascending = start < end,
            arr = [],
            sum = start;

        if( ascending ) {
            while(sum <= end) {
                arr.push(sum);
                sum += step;
            }
        }else {
            while(sum >= end) {
                arr.push(sum);
                sum -= step;
            }
        }
        return arr;
    }

    /**
     *
     * @param minValue
     * @param maxValue
     * @param count
     * @returns {{domain: [null,null], step: number}}
     */
    function tickIncrement(minValue, maxValue, count) {
        // count-1是因为区间数应该比刻度数少1
        var step = (maxValue - minValue) / (count-1);

        // 如果这个时候step属于[0, 1]，那么magnitude就是负数
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
            arr = [0, 0.1, 0.2, 0.25, 0.5, 1];
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

        return {
            domain: [minValue, maxValue],
            step: newStep
        };
    }

    return {
        judgePos: judgePos,
        makeRange: makeRange,
        tickIncrement: tickIncrement
    };

});
