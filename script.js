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
		const selectedType = filmTypeSelect.value;
		const options = getFilmOptions(selectedType);

		filmSelect.innerHTML = ""; // Clear existing options
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

	function getFilmOptions(selectedType) {
		switch (selectedType) {
			case "phimLe":
				return [{ value: "film5", text: "Mai (Trấn Thành)" }];
			case "phimBo":
				return [
					{ value: "film11", text: "Dữ Phượng Hành" },
					{ value: "film12", text: "Mặc Vũ Vân Gian" },
					{ value: "film4", text: "Khánh Dư Niên 1" },
					{ value: "film1", text: "Khánh Dư Niên 2" },
					{ value: "film6", text: "Thả Thí Thiên Hạ" },
					{ value: "film8", text: "Bạn Trai Tôi Là Hồ Ly" },
					{ value: "film7", text: "Bạn Trai Tôi Là Hồ Ly 2" },
					{ value: "film2", text: "Phá Kén 2" },
				];
			case "phimNgan":
				return [{ value: "film10", text: "Châu Tinh Kỷ" }];
			case "phimHoatHinh":
				return [
					{ value: "film9", text: "Thám Tử Lừng Danh Conan" },
					{ value: "film13", text: "PAW Patrol: Phim Siêu Đẳng" },
					{ value: "film3", text: "KungFu Panda 4" },
					{ value: "film14", text: "Doraemon: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời" },
					{ value: "film15", text: "PAW Patrol" },
				];
			default:
				return [];
		}
	}

	function loadEpisode(film) {
		let currentEpisode = localStorage.getItem(film) || 1;
		let videoUrl = videoLinks[film]?.[currentEpisode];
		if (videoUrl) {
			iframe.src = videoUrl;
			localStorage.setItem("currentFilm", film);
			episodeSelect.value = currentEpisode;
		} else {
			alert(`Video URL for episode ${currentEpisode} is not available.`);
			currentEpisode = 1;
			videoUrl = videoLinks[film]?.[currentEpisode];
			iframe.src = videoUrl;
			localStorage.setItem("currentFilm", film);
			episodeSelect.value = currentEpisode;
		}
	}

	function saveTimeInput() {
		localStorage.setItem("timeInput", timeInput.value);
	}

	function loadTimeInput() {
		const savedTimeInput = localStorage.getItem("timeInput");
		if (savedTimeInput) {
			timeInput.value = savedTimeInput;
		}
	}

	function populateEpisodeSelect(film) {
		const episodes = Object.keys(videoLinks[film] || {});
		episodeSelect.innerHTML = ""; // Clear existing options

		episodes.forEach((episode) => {
			if (episode === "names") return;
			const nameFilm = videoLinks[film]?.names?.[episode] || `Tập ${episode}`;
			const option = document.createElement("option");
			option.value = episode;
			option.textContent = nameFilm;
			episodeSelect.appendChild(option);
		});
	}

	function changeEpisode(step) {
		const selectedFilm = filmSelect.value;
		const currentEpisode = parseInt(episodeSelect.value);
		const episodes = Object.keys(videoLinks[selectedFilm] || {});
		const currentEpisodeIndex = episodes.indexOf(currentEpisode.toString());
		const newEpisodeIndex = currentEpisodeIndex + step;

		if (newEpisodeIndex >= 0 && newEpisodeIndex < episodes.length) {
			const newEpisode = episodes[newEpisodeIndex];
			if (videoLinks[selectedFilm]?.[newEpisode]) {
				localStorage.setItem(selectedFilm, newEpisode);
				loadEpisode(selectedFilm);
			} else {
				alert(`Video URL for ${selectedFilm} episode ${newEpisode} is not available.`);
			}
		}
	}

	prevEpisodeButton.addEventListener("click", () => changeEpisode(-1));
	nextEpisodeButton.addEventListener("click", () => changeEpisode(1));

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
		const [minutes, seconds] = timeInput.value.split(":").map(Number);
		const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
		timeInSeconds.textContent = `Thời gian tính bằng giây: ${totalSeconds}`;
		saveTimeInput();
	});

	document.getElementById("showNoteButton").addEventListener("click", function () {
		var noteSection = document.getElementById("noteSection");

		if (noteSection.classList.contains("hidden")) {
			noteSection.classList.remove("hidden");
		}
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
