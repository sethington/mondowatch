"use strict";

var loadItems = function(){
	if (localStorage.currentItems){
		var items = [];

		try{
			items = JSON.parse(localStorage.currentItems);
		}
		catch(e){
		}

		var html = "";

		$(items).each(function(i,item){
			html += "<div class='mondo-item'>";
			html += "<img src='"+item.img+"' />";
			html += "<div class='details'>";
			html += "<b>"+item.name+"</b><br/><span>"+item.desc+"</span><br/>";
			if (!item.soldOut){
				html += "<button data-id='"+item.id+"'>Buy Now</button>";
			}
			else{
				html += "<i>Sold Out</i>";
			}
			html += "</div>";
			html += "</div><div style='clear:both;'></div>";
		});

		$("div.content").html(html);

		$("button", "div.content").click(function(){
			var id = $(this).attr("data-id");
			console.log("buy",id);

			var msg = {
				type: "BUY",
				id: id
			};

			chrome.tabs.query({
				url:"http://mondotees.com/"
			}, function(results){
				if (results.length > 0){
					chrome.tabs.sendMessage(results[0].id, msg);
				}
				else{
					chrome.tabs.create({ url: "http://mondotees.com/" }, function(tab){
						setTimeout(function(){
							chrome.tabs.sendMessage(tab.id, msg);
						}, 500);
					});
				}
			});
		});
	}
};

document.addEventListener("DOMContentLoaded", function () {
	loadItems();
});