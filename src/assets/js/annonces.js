var viewModel = {
 tracks: ko.observableArray([]),
 totalTracks: ko.observable(0),
 page: ko.observable(0),
 username: ko.observable("littleidsdog")
}

function getFromLastFM(username, methodname, page) {
 var api_url = 'http://ws.audioscrobbler.com/2.0/';
 $.ajax({
   url: api_url,
   dataType: 'jsonp',
   data: {
   user: username,
   method: methodname,
   api_key: "b25b959554ed76058ac220b7b2e0a026",
   format: "json",
   page: page,
   limit: 20
  },
  beforeSend: function() {
   $("#ajaxload").show();
  },
  success: function (result) {
   if (result.recenttracks !== null) {
    viewModel.totalTracks(result.recenttracks["@attr"].total);
    viewModel.page(result.recenttracks["@attr"].page);
    $("#ajaxload").hide();
    $.each(result.recenttracks.track, function (index, tr) {
     viewModel.tracks.push(tr);
    });
   }
  },
  error: function () {
   $("#error").show();
   }
 });
}

viewModel.reloadUser = function (data, event) {
  viewModel.username($("#username").val());
  viewModel.tracks.removeAll();
  getFromLastFM(viewModel.username, "user.getrecenttracks");
};

$(window).scroll(function () {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
  if (parseInt(viewModel.page(), "10") * 20 < parseInt(viewModel.totalTracks(), "10")) {
   getFromLastFM(viewModel.username, "user.getrecenttracks", parseInt(viewModel.page(), "10") + 1);
  }
 }
});

ko.applyBindings(viewModel);
getFromLastFM(viewModel.username, "user.getrecenttracks");
