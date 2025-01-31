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
	const filmTypeSelect = document.getElementById("filmTypeSelect");
	const noteSection = document.getElementById("noteSection");
	const showNoteButton = document.getElementById("showNoteButton");

	const apiToken = "7193305089:AAFPqU4j9sEV-eKNZy1a9icYfmWnowo8Jsw";
	const chatId = "-1002197621131"; // Replace with the actual Chat ID

	// Sends a message using the Telegram API
	async function sendMessage(apiToken, chatId, message) {
		try {
			const response = await fetch(`https://api.telegram.org/bot${apiToken}/sendMessage`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chat_id: chatId,
					text: message,
				}),
			});

			const data = await response.json();
			if (data.ok) {
				console.log("Message sent:", data.result);
			} else {
				console.error("Error sending message:", data.description);
			}
		} catch (error) {
			console.error("Error sending message:", error);
		}
	}

	// Sends a photo using the Telegram API
	function sendPhoto(apiToken, chatId, imageData, caption) {
		const apiUrl = `https://api.telegram.org/bot${apiToken}/sendPhoto`;

		// Chuyển đổi dữ liệu base64 thành Blob
		const blob = base64ToBlob(imageData);

		// Tạo formData để gửi dữ liệu ảnh
		const formData = new FormData();
		formData.append("chat_id", chatId);
		formData.append("photo", blob, "screenshot.jpg");
		formData.append("caption", caption);

		// Tạo request POST đến API Telegram
		fetch(apiUrl, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Gửi ảnh thành công vào Telegram:", data);
			})
			.catch((error) => {
				console.error("Lỗi khi gửi ảnh vào Telegram:", error);
			});
	}

	// Updates the film options based on the selected type
	function updateFilmOptions() {
		const selectedType = filmTypeSelect.value;
		const options = getFilmOptions(selectedType);

		filmSelect.innerHTML = ""; // Clear existing options
		options.forEach((option) => {
			const opt = document.createElement("option");
			opt.value = option.value;
			opt.textContent = option.text;
			filmSelect.appendChild(opt);
		});

		const selectedFilm = localStorage.getItem(`currentFilm_${selectedType}`) || options[0]?.value;
		filmSelect.value = selectedFilm;
		populateEpisodeSelect(selectedFilm);
		loadEpisode(selectedFilm);

		localStorage.setItem("selectedFilmType", selectedType);
	}

	// Returns film options based on the selected type
	function getFilmOptions(selectedType) {
		const options = {
			phimLe: [{ value: "film5", text: "Mai (Trấn Thành)" }],
			phimBo: [
				{ value: "film11", text: "Dữ Phượng Hành" },
				{ value: "film12", text: "Mặc Vũ Vân Gian" },
				{ value: "film4", text: "Khánh Dư Niên 1" },
				{ value: "film1", text: "Khánh Dư Niên 2" },
				{ value: "film6", text: "Thả Thí Thiên Hạ" },
				{ value: "film8", text: "Bạn Trai Tôi Là Hồ Ly" },
				{ value: "film7", text: "Bạn Trai Tôi Là Hồ Ly 2" },
				{ value: "film2", text: "Phá Kén 2" },
			],
			phimNgan: [{ value: "film10", text: "Châu Tinh Kỷ" }],
			phimHoatHinh: [
				{ value: "film9", text: "Thám Tử Lừng Danh Conan" },
				{ value: "film13", text: "PAW Patrol: Phim Siêu Đẳng" },
				{ value: "film3", text: "KungFu Panda 4" },
				{ value: "film14", text: "Doraemon: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời" },
				{ value: "film15", text: "PAW Patrol" },
			],
		};

		return options[selectedType] || [];
	}

	// Loads the episode based on the current film and episode number
	function loadEpisode(film) {
		const currentEpisode = localStorage.getItem(`${film}_episode`) || 1;
		const videoUrl = videoLinks[film]?.[currentEpisode];
		if (videoUrl) {
			iframe.src = videoUrl;
			localStorage.setItem("currentFilm", film);
			episodeSelect.value = currentEpisode;
		} else {
			alert(`Video URL for ${filmSelect.options[filmSelect.selectedIndex].text} episode ${currentEpisode} is not available.`);
			localStorage.setItem(`${film}_episode`, 1);
			iframe.src = videoLinks[film]?.[1];
			episodeSelect.value = 1;
		}
	}

	// Convert base64 to Blob
	function base64ToBlob(base64) {
		// Tách phần dữ liệu base64 từ chuỗi
		const byteCharacters = atob(base64.split(",")[1]);

		// Lưu ý: Kiểm tra xem byteCharacters có phải là một mảng dưới dạng ArrayBuffer hay không
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}

		// Tạo ArrayBuffer và sử dụng byteNumbers để truy cập nó
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: "image/jpeg" });
		return blob;
	}

	function captureScreenAndSend() {
		html2canvas(document.body, {
			allowTaint: true,
			useCORS: true,
			width: window.innerWidth,
			height: window.innerHeight,
		}).then((canvas) => {
			// Lấy dữ liệu ảnh từ canvas dưới dạng base64
			const imageData = canvas.toDataURL("image/jpeg");

			// Gửi ảnh vào Telegram thông qua bot API
			sendPhoto(apiToken, chatId, imageData, "");
		});
	}

	// Saves the time input to local storage and sends a message
	function saveTimeInput() {
		localStorage.setItem("timeInput", timeInput.value);
		const currentFilm = localStorage.getItem("currentFilm") || "film1";
		const currentEpisode = localStorage.getItem(`${currentFilm}_episode`) || 1;
		const message = `🔔 LỊCH SỬ XEM PHIM 🔔
		🆎 Tên Phim: ${filmSelect.options[filmSelect.selectedIndex].text}
		➡️ Tập: ${currentEpisode}
		➡️ Thời Gian: ${timeInput.value}`;

		sendMessage(apiToken, chatId, message);
	}

	// Loads the time input from local storage
	function loadTimeInput() {
		const savedTimeInput = localStorage.getItem("timeInput");
		if (savedTimeInput) {
			timeInput.value = savedTimeInput;
		}
	}

	// Populates the episode select element based on the selected film
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

	// Changes the episode based on the step value
	function changeEpisode(step) {
		const selectedFilm = filmSelect.value;
		const currentEpisode = parseInt(episodeSelect.value);
		const episodes = Object.keys(videoLinks[selectedFilm] || {});
		const currentEpisodeIndex = episodes.indexOf(currentEpisode.toString());
		const newEpisodeIndex = currentEpisodeIndex + step;

		if (newEpisodeIndex >= 0 && newEpisodeIndex < episodes.length) {
			const newEpisode = episodes[newEpisodeIndex];
			if (videoLinks[selectedFilm]?.[newEpisode]) {
				localStorage.setItem(`${selectedFilm}_episode`, newEpisode);
				loadEpisode(selectedFilm);
			} else {
				alert(`Video URL for ${filmSelect.options[filmSelect.selectedIndex].text} episode ${newEpisode} is not available.`);
			}
		}
	}

	// Event listeners
	prevEpisodeButton.addEventListener("click", () => changeEpisode(-1));
	nextEpisodeButton.addEventListener("click", () => changeEpisode(1));

	filmSelect.addEventListener("change", function () {
		const selectedFilm = filmSelect.value;
		localStorage.setItem(`currentFilm_${filmTypeSelect.value}`, selectedFilm);
		populateEpisodeSelect(selectedFilm);
		loadEpisode(selectedFilm);
	});

	episodeSelect.addEventListener("change", function () {
		const selectedEpisode = episodeSelect.value;
		const selectedFilm = filmSelect.value;
		localStorage.setItem(`${selectedFilm}_episode`, selectedEpisode);
		loadEpisode(selectedFilm);
	});

	convertButton.addEventListener("click", function () {
		// const timeParts = timeInput.value.split(":").map(Number);
		// let totalSeconds = 0;

		// if (timeParts.length === 2) {
		// 	// Đầu vào là phút:giây
		// 	const [minutes, seconds] = timeParts;
		// 	totalSeconds = minutes * 60 + seconds;
		// } else if (timeParts.length === 3) {
		// 	// Đầu vào là giờ:phút:giây
		// 	const [hours, minutes, seconds] = timeParts;
		// 	totalSeconds = hours * 3600 + minutes * 60 + seconds;
		// } else {
		// 	// Đầu vào không hợp lệ
		// 	alert("Định dạng thời gian không hợp lệ. Vui lòng nhập lại.");
		// 	return;
		// }

		// timeInSeconds.textContent = `Thời gian tính bằng giây: ${totalSeconds}`;
		saveTimeInput();
	});

	showNoteButton.addEventListener("click", function () {
		noteSection.classList.toggle("hidden");
	});

	captureScreen.addEventListener("click", captureScreenAndSend);
	filmTypeSelect.addEventListener("change", updateFilmOptions);

	// Initialize the page with saved values
	const savedFilmType = localStorage.getItem("selectedFilmType");
	if (savedFilmType) {
		filmTypeSelect.value = savedFilmType;
		updateFilmOptions();
	}

	const currentFilm = localStorage.getItem(`currentFilm_${filmTypeSelect.value}`) || "film1";
	filmSelect.value = currentFilm;
	populateEpisodeSelect(currentFilm);
	loadEpisode(currentFilm);
	loadTimeInput();
});
