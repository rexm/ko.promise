# ko.promise

## The Problem

In Knockout-based applications of any significant size, you may find yourself writing a lot of the same boilerplate code - wherein you copy the result of a promise into a `ko.observable`:

    var myObservable = ko.observable();
    var promiseResult = getSomeResourceAsync();
    promiseResult.then(function(value) {
      myObservable(value);
    });
    
This is **annoying** and **error-prone**.

## The Solution?
    
ko.promise attempts to solve this by merging observables and the Promises/A contract. It extends observables with promise-like contracts, allowing the developer to:
- Set up promise pipelines and co-dependent promises (piggybacking off `ko.computed`)
- Declaratively write MVVM applications to behave predictably in a totally async progamming model

Thorough documentation forthcoming :)
