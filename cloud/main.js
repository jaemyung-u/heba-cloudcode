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

