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

### Basic Example:

We can declare a `ko.promise`:

    var observablePromise = ko.promise(getSomeResourceAsync());

Pipeline it:

    var transformedPromise = observablePromise.then(function(value) {
        return value * 2;
    });
    
And bind it:

    <div data-bind="
        visible: transformedPromise.loading,
        text: transformedPromise"></div>

Thorough documentation forthcoming :)
