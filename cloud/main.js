
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

Parse.Cloud.beforeSave("Stamp", function(request, response) {
  query = new Parse.Query("Event");
  query.get(request.object.get("eventId"), {
    success: function(event) {
      request.object.set("event", event);
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
  response.success();
});

Parse.Cloud.afterSave("Stamp", function(request) {
  query = new Parse.Query("Event");
  query.get(request.object.get("eventId"), {
    success: function(event) {
      var thumbnail1 = event.get("thumbnail1");
      var thumbnail2 = event.get("thumbnail2");
      if (thumbnail2 !== null) {
        event.set("thumbnail3", thumbnail2);
      }
      if (thumbnail1 !== null) {
        event.set("thumbnail2", thumbnail1);
      }
      event.set("thumbnail1", request.object.get("thumbnail"));
      event.increment("nParticipant");
      event.save();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});

