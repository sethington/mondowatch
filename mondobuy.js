// listen for messages coming from popup.html
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "BUY"){
        	buyItem(request.id);
        }
	}
);

// mondo buy item click
var buyItem = function(itemId){
	var element = jQuery("button[data-variant-id='"+itemId+"']");
	if (element.length > 0){
		element.click();

		setTimeout(function(){
			jQuery("input[type='submit'][name='checkout']").click();
		},750); // wait a second before clicking checkout
	}
	else{
		console.log("ack, element not found");
	}
};

// focus on the password to get the field updated
var mondoLogin = function(){
	jQuery("#customer_password").focus();
	setTimeout(function(){
		if (jQuery("#customer_email").val() !== ""){
			jQuery(".account-submit input.button").click();
		}
	}, 250);
};

// shopify checkout
var shopifyCheckout = function(){
	// wait for checkout.shopify to load. if login button is present, click it
	if (jQuery("div#email").find(".active-customer").length === 0){
		console.log("forwarding to login");
		window.location.href = jQuery("#customer-login-link").attr('href');
	}
	else{
		var firstAddr = jQuery("#billing_address_selector option:first").attr('value');
		jQuery("#billing_address_selector").val(firstAddr);
		jQuery("#commit-button").click();
	}
};

// determine what action to perform based on where we end up
if (window.location.host.match(/shopify/)){
	// step 2 of checkout. scroll down to cc entry
	if (window.location.href.match(/shopify.*\/pay$/)){
		setTimeout(function(){
			jQuery("body").scrollTop(1125);
			jQuery("#credit_card_number").focus();
		}, 500);
	}
	else if (window.location.href.match(/checkout\.shopify.*\/carts\//)){
		// step 1 of checkout
		shopifyCheckout();
	}
}
else if (window.location.href.match(/mondotees\.com.*account\/login\//)){
	// we werent logged in and have been dumped back to mondo to login.
	mondoLogin();
}
