# ko.promise

In Knockout-based applications of any significant size, you may find yourself writing a lot of the same boilerplate code - wherein you copy the result of a promise into a `ko.observable`:

    var myObservable = ko.observable();
    var promiseResult = getSomeResourceAsync();
    promiseResult.then(function(value) {
      myObservable(value);
    });
    
ko.promise is an attempt to merge observables and the Promises/A contract by extending observables with promise-like contracts.

Thorough documentation forthcoming :)
