
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

Parse.Cloud.afterSave("Stamp", function(request) {
  query = new Parse.Query("Event");
  query.get(request.object.get("eventId"), {
    success: function(event) {
      var idx = event.get("thumbnailIndex");
      event.set("thumbnail" + idx, request.object.get("thumbnail"));
      event.set("stamp" + idx, request.object);
      event.set("thumbnailIndex", (idx + 1) % 6);
      event.increment("nParticipant");
      event.save();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});


