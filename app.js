//Twitter's "widgets.js" script

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

//NYT API Call

function callNytApi(searchTerm, sectionToAppend) {
  $.get("http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +searchTerm +"&sort=newest&api-key=f8a1d16405da44bb82a31378767bb5ff", function(data) {
    data.response.docs.forEach(function(thing) {
      var pubDateArr = thing.pub_date.split("T")[0].split("-");
      var pubDate = `${pubDateArr[1]}/${pubDateArr[2]}/${pubDateArr[0]}`;
      $(sectionToAppend).append(`<li><a href= ${thing.web_url}> ${thing.headline.main}</a> - ${pubDate}</li> ${thing.lead_paragraph}`);
    })
  })
}

callNytApi("donald+trump", "#trump-nyt");
callNytApi("hillary+clinton", "#clinton-nyt");

//NPR API call

function callNprApi(searchFirst, searchLast, sectionToAppend) {
  $.get("http://api.npr.org/query?fields=title,teaser,storyDate,byline,transcript&searchTerm=" + searchFirst + "%20" + searchLast + "&dateType=story&output=JSON&numResults=20&apiKey=MDI0ODU5MzA5MDE0NjY0NjE3NzYyMmEyOA000", function(data) {
    $.parseJSON(data).list.story.forEach(function(thing) {
      var pubDateArr = thing.storyDate.$text.split(" ");
      var pubDate = `${pubDateArr[2]} ${pubDateArr[1]}, ${pubDateArr[3]}`
      $(sectionToAppend).append(`<li><a href=${thing.link[0].$text}> ${thing.title.$text}</a> - ${pubDate}</li> ${thing.teaser.$text}`)
    })
  })
}

callNprApi("Donald", "Trump", "#trump-npr");
callNprApi("Hillary", "Clinton", "#clinton-npr");
