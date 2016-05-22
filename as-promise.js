module.exports = function asPromise(func, args, argsAfterCallback) {
    return new Promise(function (resolve, reject) {
        var thisArg = {};

        if (func.constructor == Array) {
            thisArg = func[0];
            func = thisArg[func[1]];
        }

        args = args || [];
        argsAfterCallback = argsAfterCallback || [];

        args.push(function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });

        args = args.concat(argsAfterCallback);
        func.apply(thisArg, args);
    });
};