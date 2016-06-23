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

//Media API Calls

function callApi(source, urlPart1, searchTerm, urlPart2, sectionToAppend) {
  $.get(urlPart1+searchTerm+urlPart2, function(data) {
    var articleArr = storyArr(source, data);
    articleArr.forEach(function(article) {
      var link;
      var headline;
      var teaser;
      var dateArr;
      var date;
      if (source==="New York Times") {
        assignVars(article.web_url, article.headline.main, article.lead_paragraph, article.pub_date.split("T")[0].split("-"));
        date = `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`;
      } else if (source==="NPR") {
        assignVars(article.link[0].$text, article.title.$text, article.teaser.$text, article.storyDate.$text.split(" "));
        date = `${formatMonth(dateArr[2])}/${dateArr[1]}/${dateArr[3]}`;
      } else if (source = "The Guardian") {
        assignVars(article.webUrl, article.webTitle, "", article.webPublicationDate.split("T")[0].split("-"));
        date = `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`;
      }
      function assignVars(assignLink, assignHeadline, assignTeaser, assignDateArr, assignDate) {
        link = assignLink;
        headline = assignHeadline;
        teaser = assignTeaser;
        dateArr = assignDateArr;
      }
      appendArticle(sectionToAppend, link, headline, source, date, teaser);
    })
  })
}

function storyArr(source, data) {
  if (source==="New York Times") {
    return data.response.docs;
  } else if (source==="NPR") {
    return $.parseJSON(data).list.story;
  } else if (source = "The Guardian") {
    return data.response.results;
  }
}

function formatMonth(month) {
  switch(month) {
    case "Jun":
      return "06";
      break;
    case "Jul":
      return "07";
      break;
    case "Aug":
      return "08";
      break;
    case "Sep":
      return "09";
      break;
    case "Oct":
      return "10";
      break;
    case "Nov":
      return "11";
      break;
    case "Dec":
      return "12";
      break;
    case "Jan":
      return "01";
      break;
    case "Feb":
      return "02";
      break;
    case "Mar":
      return "03";
      break;
    case "Apr":
      return "04";
      break;
    case "May":
      return "05";
      break;
    default:
      return "xx";
  }
}

function appendArticle(sectionToAppend, link, headline, source, date, teaser) {
  $(sectionToAppend).append(`<li><a href= ${link} target="_blank"> ${headline}</a> - ${source}, ${date}</li> ${teaser}`);
}

callApi("New York Times", "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=", "hillary+clinton", "&sort=newest&api-key=f8a1d16405da44bb82a31378767bb5ff", "#clinton-nyt")
callApi("New York Times", "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=", "donald+trump", "&sort=newest&api-key=f8a1d16405da44bb82a31378767bb5ff", "#trump-nyt")
callApi("NPR", "https://api.npr.org/query?fields=title,teaser,storyDate,byline,transcript&searchTerm=", "Donald%20Trump", "&dateType=story&output=JSON&numResults=20&apiKey=MDI0ODU5MzA5MDE0NjY0NjE3NzYyMmEyOA000", "#trump-npr")
callApi("NPR", "https://api.npr.org/query?fields=title,teaser,storyDate,byline,transcript&searchTerm=", "Hillary%20Clinton", "&dateType=story&output=JSON&numResults=20&apiKey=MDI0ODU5MzA5MDE0NjY0NjE3NzYyMmEyOA000", "#clinton-npr")
callApi("The Guardian", "https://content.guardianapis.com/search?q=", "hillary+clinton", "&api-key=385a3c1d-2622-4ecf-b191-12805b5f0645", "#clinton-guardian");
callApi("The Guardian", "https://content.guardianapis.com/search?q=", "donald+trump", "&api-key=385a3c1d-2622-4ecf-b191-12805b5f0645", "#trump-guardian");
