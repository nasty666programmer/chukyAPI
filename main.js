(function(apiKey) {
	chucky.style.backgroundImage = `url(${imgContent})`;
	chucky.onclick = function() {
		localStorage.removeItem('jokes');
		jokeWrapper.innerHTML = '';
	}

	var apiLink = "https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/";
	var headers = {
		"x-rapidapi-host": "matchilling-chuck-norris-jokes-v1.p.rapidapi.com",
		"x-rapidapi-key": apiKey,
		"accept": "application/json"
	}

	var jokes = localStorage.getItem('jokes') || [];
	if(jokes && jokes.length) {
		jokes = JSON.parse(jokes);
		jokes.forEach((joke) => {
			showJoke(joke, true);
		});
	}

	async function getCategories() {
		var responce = await fetch(apiLink + "categories", {
			"method": "GET",
			"headers": headers
		});

		var categories = await responce.json();
		showCategories(categories);
	}

	function showCategories(categories = []) {
		categories.forEach((category) => {
			var elem = document.createElement('option');
			elem.innerText = category;
			elem.value = category;
			categoryList.append(elem);
		});
	}

	getJokeBtn.onclick = function() {
		var category = categoryList.value;
		getJoke(category);
	}

	async function getJoke(category) {
		var url = apiLink + "random";

		if(category) {
			url += "?category=" + category;
		}

		var responce = await fetch(url, {
			"method": "GET",
			"headers": headers
		});

		var joke = await responce.json();
		showJoke(joke);
	}

	function showJoke(joke, ignore = false) {
		if(!ignore) {
			jokes.push(joke);
			localStorage.setItem('jokes', JSON.stringify(jokes));
		}

		var elem = document.createElement('div');
		var icon = document.createElement('img');
		icon.src = joke.icon_url;

		var content = document.createElement('span');
		content.innerText = joke.value;

		var categories = document.createElement('small');
		categories.innerText = joke.categories.join(', ');
		
		elem.append(icon);
		elem.append(content);
		elem.append(categories);

		jokeWrapper.append(elem);
	}

	searchJokesBtn.onclick = async function() {
		var url = apiLink + "search";

		var query = search.value;
		if(query.length < 3 || query.length > 120) {
			alert('Query should be at least 3 symbols and less then 120');
			return;
		} else {
			url += "?query=" + query;
		}
		
		var responce = await fetch(url, {
			"method": "GET",
			"headers": headers
		});

		var jokes = await responce.json();

		alert(jokes.total + " jokes found");
		jokes.result.forEach((joke) => {
			showJoke(joke);
		});
	}

	getCategories();
})("ef65d6dac6msh677e559e00ff321p176f78jsn9d3edbacfd5a");

