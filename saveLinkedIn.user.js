// ==UserScript==
// @name        saveLinkedIn.user.js
// @namespace   https://taha-amin/
// @description save search result for Marketing us
// @match    https://www.linkedin.com/search/results/index/?keywords=Marketing%20us*
// @version     1.0.0
// @grant       none
// ==/UserScript==

var baseUrl = 'https://www.linkedin.com/search/results/index/?keywords=Marketing%20us';

function wait(ms) {
	var start = new Date().getTime();
	var end = start;
	while (end < start + ms) {
		end = new Date().getTime();
	}
}

var i = 0;

function download(text, name, type) {
	text = JSON.stringify(text);
	var a = document.createElement("a");
	var file = new Blob([text], {
			type: type
		});
	a.href = URL.createObjectURL(file);
	a.target = '_blank';
	a.id = name;
	a.download = name;
	$('#' + name).on("click", function (e) {
		e.preventDefault();
		window.open('a.href', '_blank');
	});
	//allow multiable file download from address bar
	/* a.click(function(e)
{
	e.preventDefault();
	window.open(a.href);
	});
	 */
	a.click();

	// wait(5000);
	next_page = $('li.page-list > ol > li.active').next();
	if (next_page !== null) {
		window.location.href = baseUrl + '&page=' + next_page.text();
		//window.location.reload(true);
	}
}

function Add_User() {
	console.log('Add_User');
	users = [];

	profils = $('li.search-result');

	for (var li_idex = 0; li_idex < profils.length; li_idex++) {
		link = $('#' + profils[li_idex].id + ' > div.search-result__wrapper > div.search-result__info.pt3.pb4.ph0 > a')[0];
		display_name = $('#' + link.id + ' > h3.actor-name-with-distance.single-line-truncate.ember-view > span.name-and-icon > span.name.actor-name').text();
		title = $('#' + profils[li_idex].id + ' >div.search-result__wrapper > div.search-result__info.pt3.pb4.ph0 > p.subline-level-1').text();
		city = $('#' + profils[li_idex].id + ' >div.search-result__wrapper > div.search-result__info.pt3.pb4.ph0 > p.subline-level-2').text();
		current = $('#' + profils[li_idex].id + ' >div.search-result__wrapper > div.search-result__info.pt3.pb4.ph0 > p.search-result__snippets.mt2.ember-view');
		if (current !== null) {
			current = current.text().replace('Current:', '');
		} else {
			current = '';
		}
		if (display_name !== '') {
			users.push({
				'name': display_name,
				'title': title,
				'city': $.trim(city),
				'current': $.trim(current),
				'url': link.href
			});
		}

	}
	if (users.length > 0) {
		fileName = window.location.href.replace(baseUrl, '').replace('&page=', '');
		fileName = 'results' + fileName + '.txt';
		download(users, fileName, 'text/plain');
		// clearInterval(myVar);
		// console.log("-> close");
	} else {
		console.log('not found !');
	}
}

if ($('.results-list') !== null) {
	$(document).ready(function () {

		var myVar = setInterval(function () {

				if (i == 10) {
					i = 0;
					Add_User();
					//clearInterval(myVar);
					//console.log("-> close");

				} else if (i >= 0 && i < 5) {

					$("html, body").animate({
						scrollTop: $(document).height() - $(window).height()
					});
				}
				i++;
			}, 2000);
	});
}
