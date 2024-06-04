document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("videoPlayer");
    const lastTimeDisplay = document.getElementById("lastTime");

    // Load the last watched time from localStorage
    const lastWatchedTime = localStorage.getItem("lastWatchedTime");
    if (lastWatchedTime) {
        video.currentTime = lastWatchedTime;
        lastTimeDisplay.textContent = lastWatchedTime;
    }

    // Save the current time to localStorage when the video time updates
    video.addEventListener("timeupdate", function() {
        localStorage.setItem("lastWatchedTime", video.currentTime);
        lastTimeDisplay.textContent = Math.floor(video.currentTime);
    });

    // Save the current time to localStorage when the video is paused or ended
    video.addEventListener("pause", function() {
        localStorage.setItem("lastWatchedTime", video.currentTime);
        lastTimeDisplay.textContent = Math.floor(video.currentTime);
    });

    video.addEventListener("ended", function() {
        localStorage.removeItem("lastWatchedTime");
        lastTimeDisplay.textContent = "0";
    });
});

