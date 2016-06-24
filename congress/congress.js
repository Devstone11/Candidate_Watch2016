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
          twitter_id: member.twitter_id,
          title_name: member.title + member.last_name
        })
      })

    }
  })
  counter++;
  member_count -= 50;
};

congressArr.sort(function(a,b) {
  if (a.title_name < b.title_name) {
    return 1;
  } else if (a.title_name < b.title_name){
    return -1;
  };
  return 0;
})

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
    statesArr[i].name !== "Virgin Islands" &&
    statesArr[i].name !== "District Of Columbia") {
      $('select').append(`<option>${statesArr[i].name}</option>`)
  }
}

$('#pick-state').click(function() {
  changeButtons();
  $("main").html('');
  populateMembers();
  twitterScript();
});

function changeButtons() {
  $('#pick-state').hide();
  $('select').hide();
  $('#reset, .results').removeClass('hidden');
  $('#reset').click(function(){
    location.reload();
  })
}

function populateMembers() {
  state = $('select option:selected').html();
  congressArr.forEach(function(member) {
    if (member.state === state) {
      appendHeader(member.title, member.firstname, member.lastname, member.party, member.twitter_id, member.facebook_id);
      appendMemberDiv(member.lastname, state, member.firstname, member.title, member.party, member.website);
      appendTwitterFeed(member.twitter_id, member.lastname, state);
      appendFacebookFeed(member.facebook_id, member.lastname, state);
    }
  })
};

function appendHeader(memberTitle, memberFirst, memberLast, memberParty, memberTwitter, memberFacebook) {
  $('.results').append(`<a href="#${memberLast}${state}"><div class="members">${memberTitle}. ${memberFirst} ${memberLast} - ${memberParty}</div></a>`);
}

function appendMemberDiv(memberLast, state, memberFirst, memberTitle, memberParty, memberWebsite) {
  $("main").append(`<section id="${memberLast}${state}"></section>`);
  $(`#${memberLast}${state}`).append(`
    <a name="${memberLast}${state}"></a>
    <div class="name-card">
      <div class="name">
        <a href="#top">
          <img class="top-link" src="../images/arrow-158-128.png" alt="up-arrow" />
        </a>
        ${memberTitle}. ${memberFirst} ${memberLast}
      </div>
      <div class="party">Party: ${partyName(memberParty)}</div>
      <div class="website">Website: <a href="${memberWebsite}">${memberWebsite}</a></div>
    </div>
    <div class="timelines"></div>`);
}

function partyName(party) {
  if (party==="D") {
    return "Democrat";
  } else if (party==="R") {
    return "Republican";
  } else if (party==="I") {
    return "Independent";
  }
}

function appendTwitterFeed(memberTwitter, memberLast, state) {
  if (memberTwitter === null || memberTwitter === undefined) {
    $(`#${memberLast}${state} .timelines`).append('<div class=box>No Twitter feed available...</div>');
  } else {
    $(`#${memberLast}${state} .timelines`).append('<div class=box><a class="twitter-timeline" data-width="400" data-height="100%" data-theme="dark" data-chrome="transparent" href="https://twitter.com/'+memberTwitter+'">Tweets by '+memberTwitter+'</a></div>');
  };
}

function appendFacebookFeed(memberFacebook, memberLast, state) {
  if (memberFacebook === null || memberFacebook === undefined) {
    $(`#${memberLast}${state} .timelines`).append('<div class="box">No Facebook feed available...</div>')
  } else {
    $(`#${memberLast}${state} .timelines`).append('<div class="box"><iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F'+memberFacebook+'%2F%3Ffref%3Dts&tabs=timeline&width=400&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1561544894148350" scrolling="no" frameborder="0" allowTransparency="true"></iframe></div>')
  }
}
