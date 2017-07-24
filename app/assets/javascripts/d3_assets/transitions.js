// Mike Bostock = endhttps://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
function endall(transition, callback) {
    if (typeof callback !== "function") throw new Error("Not a function");
    if (transition.size() === 0) { callback() }
    var n = 0;
    transition
        .each(function() { ++n; })
        .each("end", function() { if (!--n) callback.apply(this, arguments); });
  }
