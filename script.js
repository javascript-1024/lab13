import videoLinks from "./videoLinks.js"; // Adjust the path as necessary

document.addEventListener("DOMContentLoaded", function () {
	const iframe = document.getElementById("videoPlayer");
	const episodeSelect = document.getElementById("episodeSelect");
	const filmSelect = document.getElementById("filmSelect");

	const timeInput = document.getElementById("timeInput");
	const convertButton = document.getElementById("convertButton");
	const timeInSeconds = document.getElementById("timeInSeconds");

	function updateFilmOptions() {
		const filmTypeSelect = document.getElementById("filmTypeSelect");
		const filmSelect = document.getElementById("filmSelect");
		const selectedType = filmTypeSelect.value;

		while (filmSelect.firstChild) {
			filmSelect.removeChild(filmSelect.firstChild);
		}

		let options = [];
		if (selectedType === "phimLe") {
			options = [
				{ value: "film3", text: "KungFu Panda 4" },
				{ value: "film5", text: "Mai (Trấn Thành)" },
			];
		} else if (selectedType === "phimBo") {
			options = [
				{ value: "film2", text: "Phá Kén 2 (Full)" },
				{ value: "film4", text: "Khánh Dư Niên 1 (Full)" },
				{ value: "film1", text: "Khánh Dư Niên 2 (Full)" },
			];
		}

		options.forEach((option) => {
			const opt = document.createElement("option");
			opt.value = option.value;
			opt.textContent = option.text;
			filmSelect.appendChild(opt);
		});
		const selectedFilm = filmSelect.value;
		populateEpisodeSelect(selectedFilm);
		loadEpisode(selectedFilm);
	}

	function loadEpisode(film) {
		const currentEpisode = localStorage.getItem(film) || 1;
		const videoUrl = videoLinks[film][currentEpisode];
		if (videoUrl) {
			iframe.src = videoUrl;
			localStorage.setItem("currentFilm", film);
			episodeSelect.value = currentEpisode;
		} else {
			console.error(`Video URL for ${film} episode ${currentEpisode} is not available.`);
		}
	}

	function saveTimeInput() {
		const timeValue = timeInput.value;
		localStorage.setItem("timeInput", timeValue);
	}

	function loadTimeInput() {
		const savedTimeInput = localStorage.getItem("timeInput");
		if (savedTimeInput) {
			timeInput.value = savedTimeInput;
		}
	}

	function populateEpisodeSelect(film) {
		const episodes = Object.keys(videoLinks[film]);
		const filmTypeSelect = document.getElementById("filmTypeSelect");
		episodeSelect.innerHTML = "";
		const selectedType = filmTypeSelect.value;
		episodes.forEach((episode) => {
			let option = document.createElement("option");
			option.value = episode;
			option.textContent = selectedType === "phimLe" ? episode : `Tập ${episode}`;
			episodeSelect.appendChild(option);
		});
	}

	const prevEpisodeButton = document.getElementById("prevEpisodeButton");
	const nextEpisodeButton = document.getElementById("nextEpisodeButton");

	prevEpisodeButton.addEventListener("click", function () {
		const selectedFilm = filmSelect.value;
		const currentEpisode = parseInt(episodeSelect.value);
		if (currentEpisode > 1) {
			const previousEpisode = currentEpisode - 1;
			if (videoLinks[selectedFilm][previousEpisode]) {
				localStorage.setItem(selectedFilm, previousEpisode);
				loadEpisode(selectedFilm);
			} else {
				console.error(`Video URL for ${selectedFilm} episode ${previousEpisode} is not available.`);
			}
		}
	});

	nextEpisodeButton.addEventListener("click", function () {
		const selectedFilm = filmSelect.value;
		const currentEpisode = parseInt(episodeSelect.value);
		const totalEpisodes = Object.keys(videoLinks[selectedFilm]).length;
		if (currentEpisode < totalEpisodes) {
			const nextEpisode = currentEpisode + 1;
			if (videoLinks[selectedFilm][nextEpisode]) {
				localStorage.setItem(selectedFilm, nextEpisode);
				loadEpisode(selectedFilm);
			} else {
				console.error(`Video URL for ${selectedFilm} episode ${nextEpisode} is not available.`);
			}
		}
	});

	filmSelect.addEventListener("change", function () {
		const selectedFilm = filmSelect.value;
		populateEpisodeSelect(selectedFilm);
		loadEpisode(selectedFilm);
	});

	episodeSelect.addEventListener("change", function () {
		const selectedEpisode = episodeSelect.value;
		const selectedFilm = filmSelect.value;
		localStorage.setItem(selectedFilm, selectedEpisode);
		loadEpisode(selectedFilm);
	});

	convertButton.addEventListener("click", function () {
		const timeParts = timeInput.value.split(":");
		const minutes = parseInt(timeParts[0], 10) || 0;
		const seconds = parseInt(timeParts[1], 10) || 0;
		const totalSeconds = minutes * 60 + seconds;
		timeInSeconds.textContent = `Thời gian tính bằng giây: ${totalSeconds}`;
		saveTimeInput();
	});

	const currentFilm = localStorage.getItem("currentFilm") || "film1";
	filmSelect.value = currentFilm;
	populateEpisodeSelect(currentFilm);
	loadEpisode(currentFilm);
	loadTimeInput();

	document.getElementById("filmTypeSelect").addEventListener("change", updateFilmOptions);
	updateFilmOptions();
});
