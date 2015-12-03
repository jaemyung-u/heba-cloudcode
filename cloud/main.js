
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("averageLocation", function(request, response) {
  var query = new Parse.Query("Stamp");
  query.descending("updatedAt");
  query.limit(5);
  query.find({
    success: function(results) {
      var sum = "";
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("comment");
      }
      response.success(sum);
    },
    error: function() {
      response.error("comment summation failed.");
    }
  });
});
