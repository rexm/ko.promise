(function (global) {
    var defineCallback = function (ko) {
        var isPromise = function (obj) {
            return !obj ? false : obj['then'];
        };
        var isKoPromise = function (obj) {
            return isPromise(obj) && obj['loading'];
        };
        var then = function (source, doneHandler, failHandler, progressHandler) {
            return factory(function (target) {
                var value = source();
                if (source['loading']() === false) {
                    target(doneHandler(value));
                }
            });
        };
        var when = function (source, promises) {
            promises.push(source);
            return factory(function (target) {
              var resolvedPromiseCount = 0,
                  resolvePromise = function() {
                    resolvedPromiseCount++;
                    if(resolvedPromiseCount === promises.length) {
                      target(source());
                    }
                  };
              for (var i = 0; i < promises.length; i++) {
                promises[i]['then'](resolvePromise)();
              }
              this['loading']['subscribe'](function(isLoading) {
                if(isLoading === false) {
                  for (var i = 0; i < promises.length; i++) {
                    if(isKoPromise(promises[i])) {
                      promises[i]();
                    }
                  }
                }
              });
            });
        };
        var factory = function (source) {
            var awaitingEvaluation = true,
            loading = ko['observable'](false),
            backing = ko['observable'](),
            updateBacking = function (value) {
                backing(value);
                loading(false);
            },
            target = function (value) {
                if (isPromise(value)) {
                    var promise = value['then'](function (result) {
                        updateBacking(result);
                    });
                    if (isKoPromise(value)) {
                        promise();
                    }
                } else {
                    updateBacking(value);
                }
            };
            var api = ko['computed']({
                'read': function () {
                    if (awaitingEvaluation) {
                        awaitingEvaluation = false;
                        ko['computed'](function () {
                            loading(true);
                            source.apply(api, [target]);
                        });
                    }
                    return ko['utils']['unwrapObservable'](backing());
                },
                'deferEvaluation': true
            });
            api['loading'] = loading;
            return api;
        };
        ko['promise'] = function (source) {
            if (isPromise(source)) {
                return factory(function (target) {
                    source['then'](function (data) {
                        target(data);
                    });
                });
            } else {
                return factory(source);
            }
        };
        ko['subscribable']['fn']['then'] = function (doneHandler, failHandler, progressHandler) {
            var source = this;
            if (isKoPromise(source)) {
                return then(source, doneHandler, failHandler, progressHandler);
            } else {
                return factory(function (target) {
                    target(doneHandler(source()));
                });
            }
        };
        ko['subscribable']['fn']['when'] = function () {
            var promises = Array.prototype.slice.call(arguments);
            return when(this, promises);
        };
    };
    if (typeof define === 'function' && define['amd']) {
        define(['knockout'], defineCallback);
    } else {
        defineCallback(global['ko']);
    }
})(this);
