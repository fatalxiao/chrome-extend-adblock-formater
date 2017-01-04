chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, tabs => {
		chrome.tabs.create({
			url: "option/index.html",
			index: (tabs[0] ? tabs[0].index + 1 : undefined)
		});
	});
});