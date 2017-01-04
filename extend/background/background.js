chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		chrome.tabs.create({
			url: "option/index.html",
			index: (tabs[0] ? tabs[0].index + 1 : undefined)
		});
	});
});