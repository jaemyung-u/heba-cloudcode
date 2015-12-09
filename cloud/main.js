Parse.Cloud.afterSave("Stamp", function(request) {
  query = new Parse.Query("Event");
  query.get(request.object.get("eventId"), {
    success: function(event) {
      var n = event.get("nParticipant");
      var geoPoint = new Parse.GeoPoint(request.object.get("location"));
      var latitude = geoPoint.latitude;
      var longitude = geoPoint.longitude;
      var mean_la_p = event.get("xMean");
      var mean_lo_p = event.get("yMean");
      var var_la_p = event.get("xVar");
      var var_lo_p = event.get("yVar");

      var mean_la = (n*mean_la_p + latitude) / (n+1);
      var mean_lo = (n*mean_lo_p + longitude) / (n+1);
      event.set("xMean", mean_la);
      event.set("yMean", mean_lo);

      var var_la = 0.0;
      var var_lo = 0.0;
      if (n !== 0) {
        var var_la = ((n-1)*var_la_p + (latitude - mean_la)*(latitude - mean_la_p))/n;
        var var_lo = ((n-1)*var_lo_p + (longitude - mean_lo)*(longitude - mean_lo_p))/n;
      } 
      event.set("xVar", var_la);
      event.set("yVar", var_lo);

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

