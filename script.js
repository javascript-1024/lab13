import videoLinks from "./videoLinks.js"; // Adjust the path as necessary

document.addEventListener("DOMContentLoaded", function () {
	const iframe = document.getElementById("videoPlayer");
	const episodeSelect = document.getElementById("episodeSelect");
	const filmSelect = document.getElementById("filmSelect");
	const timeInput = document.getElementById("timeInput");
	const convertButton = document.getElementById("convertButton");
	const timeInSeconds = document.getElementById("timeInSeconds");

	const prevEpisodeButton = document.getElementById("prevEpisodeButton");
	const nextEpisodeButton = document.getElementById("nextEpisodeButton");

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
				{ value: "film11", text: "Dữ Phượng Hành" },
				{ value: "film12", text: "Mặc Vũ Vân Gian" },
				{ value: "film4", text: "Khánh Dư Niên 1" },
				{ value: "film1", text: "Khánh Dư Niên 2" },
				{ value: "film6", text: "Thả Thí Thiên Hạ" },
				{ value: "film8", text: "Bạn Trai Tôi Là Hồ Ly" },
				{ value: "film7", text: "Bạn Trai Tôi Là Hồ Ly 2" },
				{ value: "film2", text: "Phá Kén 2" },
			];
		} else if (selectedType === "phimNgan") {
			options = [{ value: "film10", text: "Châu Tinh Kỷ" }];
		} else if (selectedType === "phimHoatHinh") {
			options = [
				{ value: "film9", text: "Thám Tử Lừng Danh Conan" },
				{ value: "film13", text: "PAW Patrol: Phim Siêu Đẳng" },
				{ value: "film14", text: "Doraemon Movie 43" },
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

		localStorage.setItem("selectedFilmType", selectedType);
	}

	function loadEpisode(film) {
		let currentEpisode = localStorage.getItem(film) || 1;
		let videoUrl = videoLinks[film][currentEpisode];
		if (videoUrl) {
			iframe.src = videoUrl;
			localStorage.setItem("currentFilm", film);
			episodeSelect.value = currentEpisode;
		} else {
			alert(`Video URL for episode ${currentEpisode} is not available.`);
			currentEpisode = 1;
			videoUrl = videoLinks[film][currentEpisode];
			iframe.src = videoUrl;
			localStorage.setItem("currentFilm", film);
			episodeSelect.value = currentEpisode;
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
			if (episode === "names") {
				return;
			}
			let nameFilm = "";
			if (selectedType === "phimLe") {
				nameFilm = videoLinks[film].names[episode];
			}
			let option = document.createElement("option");
			option.value = episode;
			option.textContent = selectedType === "phimLe" ? nameFilm : `Tập ${episode}`;
			episodeSelect.appendChild(option);
		});
	}

	prevEpisodeButton.addEventListener("click", function () {
		const selectedFilm = filmSelect.value;
		const currentEpisode = parseInt(episodeSelect.value);
		const episodes = Object.keys(videoLinks[selectedFilm]);
		const currentEpisodeIndex = episodes.indexOf(currentEpisode.toString());

		if (currentEpisodeIndex > 0) {
			const previousEpisode = parseInt(episodes[currentEpisodeIndex - 1]);
			if (videoLinks[selectedFilm][previousEpisode]) {
				localStorage.setItem(selectedFilm, previousEpisode);
				loadEpisode(selectedFilm);
			} else {
				alert(`Video URL for ${selectedFilm} episode ${previousEpisode} is not available.`);
			}
		}
	});

	nextEpisodeButton.addEventListener("click", function () {
		const selectedFilm = filmSelect.value;
		const currentEpisode = parseInt(episodeSelect.value);
		const episodes = Object.keys(videoLinks[selectedFilm]);
		const currentEpisodeIndex = episodes.indexOf(currentEpisode.toString());
		const totalEpisodes = episodes.length;

		if (currentEpisodeIndex !== -1 && currentEpisodeIndex < totalEpisodes - 1) {
			const nextEpisode = parseInt(episodes[currentEpisodeIndex + 1]);
			if (videoLinks[selectedFilm][nextEpisode]) {
				localStorage.setItem(selectedFilm, nextEpisode);
				loadEpisode(selectedFilm);
			} else {
				alert(`Video URL for ${selectedFilm} episode ${nextEpisode} is not available.`);
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
	const savedFilmType = localStorage.getItem("selectedFilmType");
	if (savedFilmType) {
		document.getElementById("filmTypeSelect").value = savedFilmType;
		updateFilmOptions();
	}
});
