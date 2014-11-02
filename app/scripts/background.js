"use strict";

chrome.runtime.onInstalled.addListener(function (details) {
  console.log("previousVersion", details.previousVersion);
});

// display a notification of the new items
function showNotification(items){
  var notifItems = [];
  $(items).each(function(i,item){
    notifItems.push({
      title: item.soldOut ? item.name.substr(0,30) : item.name,
      message: item.soldOut ? "Sold out": ""
    });
  });

  chrome.notifications.create("",{
    type: "list",
    iconUrl: "images/mondo.png",
    title:"Mondo Updated!",
    message: "Mondo has been updated",
    items:notifItems
  }, function(){});
}

var Mondo = {
  // query mondotees and see what items are available
  pollForUpdate: function(){
    jQuery.get("http://mondotees.com/", function(data){
      var items = [];
      $(data).find("button.button").each(function(index, btn){
        var elem = $(btn).parents(".drop-item-inner");

        var item = {
          id: elem.find("button[data-variant-id]").attr("data-variant-id"),
          img: "http:"+elem.find(".drop-item-thumb").attr("src"),
          name: elem.find(".vcenter h4").text(),
          desc: elem.find(".vcenter p").text().trim()
        };

        item.soldOut = typeof(item.id) !== "string";

        items.push(item);
      });

      Mondo.checkIfUpdated(items);
    });
  },

  // compare to last check to see if things are different
  checkIfUpdated: function(newItems){
    var stringified = JSON.stringify(newItems);

    // if the items are differnet, notify user
    if (stringified !== localStorage.currentItems){
      localStorage.currentItems = stringified;
      showNotification(newItems);
    }
  }
};

// init data. 
var init = function(){
  if (!localStorage.isInitialized){
    localStorage.isActivated = true;
    localStorage.frequency = 1;
    localStorage.isInitialized = true;
  }

  if (JSON.parse(localStorage.isActivated)){
    Mondo.pollForUpdate();
  }

  var interval = 0;
  setInterval(function(){
    interval++; // increase minute
    
    if (JSON.parse(localStorage.isActivated) && localStorage.frequency <= interval){

      // we really only need to poll between 9am and 5pm central
      var hour = new Date().getUTCHours();
      if (hour >= 14 && hour < 22){
        Mondo.pollForUpdate(); // check mondo  
      }

      interval = 0;
    }
  }, 60000); // check every minute to see if we should poll
};

// goto mondotees if notification clicked
chrome.notifications.onClicked.addListener(function(){
  chrome.tabs.create({ url: "http://mondotees.com/" });
});

init();