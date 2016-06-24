function twitterScript() {
  window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };

      return t;
    }(document, "script", "twitter-wjs"));
  }
// setArrs();

// function setArrs() {
//   congressArr = ["hi"];
  // $.get("https://www.govtrack.us/api/v2/role?current=true&limit=600", function(data){
  //   data.objects.forEach(function(member) {
  //     congressArr.push({
  //         firstname: member.person.firstname,
  //         lastname: member.person.lastname,
  //         party: member.party,
  //         state: member.state,
  //         title: member.role_type_label
  //     });
  //   });
  // })


var congressArr = [];
var member_count = 575;
var counter = 1 ;
while (member_count > 0 ){
  $.ajax({
    url:"https://congress.api.sunlightfoundation.com/legislators?in_office=true&per_page=50&page="+counter+"&apikey=e3e323bd11b84c5ca89b2d18c6a00ebb",
    dataType: "json",
    async: false,
    success: function(data){
      data.results.forEach(function(member) {
        congressArr.push({
          title: member.title,
          firstname: member.first_name,
          lastname: member.last_name,
          party: member.party,
          state: member.state_name,
          website: member.website,
          facebook_id: member.facebook_id,
          twitter_id: member.twitter_id
        })
      })
    }
  })
  counter++;
  member_count -= 50;
};

var statesArr = [];
$.ajax({
  url: "https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_titlecase.json",
  dataType: 'json',
  async: false,
  success: function(data) {
    data.forEach(function(state) {
      statesArr.push({
        name: state.name,
        abbrev: state.abbreviation
      })
    })
  }
})

for (var i = 0; i < statesArr.length; i++) {
  if(statesArr[i].name !== "American Samoa" &&
    statesArr[i].name !== "Federated States Of Micronesia" &&
    statesArr[i].name !== "Guam" &&
    statesArr[i].name !== "Marshall Islands" &&
    statesArr[i].name !== "Northern Mariana Islands" &&
    statesArr[i].name !== "Palau" &&
    statesArr[i].name !== "Puerto Rico" &&
    statesArr[i].name !== "Virgin Islands") {
      $('select').append(`<option>${statesArr[i].name}</option>`)
  }
}
$('input').click(function() {
  $("main").html('');
  findReps();
  twitterScript();
});

function findReps() {
  state = $('select option:selected').html();
  congressArr.forEach(function(member) {
    if (member.state === state) {
      appendMemberDiv(member.lastname, state, member.firstname);
      appendTwitterFeed(member.twitter_id, member.lastname, state);
      appendFacebookFeed(member.facebook_id, member.lastname, state);
    }
  })
};

function appendMemberDiv(memberLast, state, memberFirst) {
  $("main").append(`<section id="${memberLast}${state}">${memberFirst}</section>`);
}

function appendTwitterFeed(memberTwitter, memberLast, state) {
  if (memberTwitter === null || memberTwitter === undefined) {
    $(`#${memberLast}${state}`).append('<div class=box>No Twitter feed available...</div>');
  } else {
    $(`#${memberLast}${state}`).append('<div class=box><a class="twitter-timeline" data-width="400" data-height="500" data-theme="dark" data-chrome="transparent" href="https://twitter.com/'+memberTwitter+'">Tweets by '+memberTwitter+'</a></div>');
  };
}

function appendFacebookFeed(memberFacebook, memberLast, state) {
  if (memberFacebook === null || memberFacebook === undefined) {
    $(`#${memberLast}${state}`).append('<div class="box">No Facebook feed available...</div>')
  } else {
    $(`#${memberLast}${state}`).append('<div class="box"><iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F'+memberFacebook+'%2F%3Ffref%3Dts&tabs=timeline&width=400&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1561544894148350" scrolling="no" frameborder="0" allowTransparency="true"></iframe></div>')
  }
}
