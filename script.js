document.addEventListener("DOMContentLoaded", function() {
    const iframe = document.getElementById("videoPlayer");
    const lastTimeDisplay = document.getElementById("lastTime");
    const episodeSelect = document.getElementById("episodeSelect");

    const videoLinks = {
        1: "https://embed3.streamc.xyz/embed.php?hash=60da6a8137cb20f06ec036ab829b79d5",
        2: "https://embed3.streamc.xyz/embed.php?hash=b8aa76a31460ffb790bd862f1655f729",
        3: "https://embed3.streamc.xyz/embed.php?hash=55366e9191271ddc3a81021d70a2771d",
        4: "https://embed3.streamc.xyz/embed.php?hash=02320975f518c0076c9a6c1d538aff52",
        5: "https://embed2.streamc.xyz/embed.php?hash=530cabd6b67a9a0f5d54f441e3d0ddcf",
        6: "https://embed2.streamc.xyz/embed.php?hash=f9149c02f02e65d1eb37c9334d223d66",
        7: "https://embed2.streamc.xyz/embed.php?hash=a3861e87acc81089bf611b5664bd7543",
        8: "https://embed2.streamc.xyz/embed.php?hash=22e22ded4ce034fdf6797684339d3ab8",
        9: "https://embed3.streamc.xyz/embed.php?hash=1187d6ba4ccc18f5a83cc4bb5659f48a",
        10: "https://embed3.streamc.xyz/embed.php?hash=f7603fbce594df2c52d5263d62378689",
        11: "https://embed3.streamc.xyz/embed.php?hash=2f00fc693a8b99f6363fdae02b849d55",
        12: "https://embed3.streamc.xyz/embed.php?hash=1fc4f2bc956f62cdd0c98f90293252eb",
        13: "https://embed3.streamc.xyz/embed.php?hash=79c53dd7b6ca3141409c567d4f533960",
        14: "https://embed3.streamc.xyz/embed.php?hash=f1eae3cae91e4801eb46dc04418390b5",
        15: "https://embed2.streamc.xyz/embed.php?hash=581168ac48abb9077194a79553b96b79",
        16: "https://embed2.streamc.xyz/embed.php?hash=771fdfc7c8b7a74fbdd74e3192121dd0",
        17: "https://embed2.streamc.xyz/embed.php?hash=2382230a986d717632c44812493eecde",
        18: "https://embed2.streamc.xyz/embed.php?hash=67a7654626270af5d9a56f61d10c1bf0",
        19: "https://embed2.streamc.xyz/embed.php?hash=37b82524e829e8e8ab4168f785b3243c",
        20: "https://embed2.streamc.xyz/embed.php?hash=a5c58e83238ef410a5d740a199868ae8",
        21: "https://embed2.streamc.xyz/embed.php?hash=488e6e1bb8799143d2fb90e24575d1e2",
        22: "https://embed2.streamc.xyz/embed.php?hash=0695da96227c55810d33ecca8439e76b",
        23: "https://embed2.streamc.xyz/embed.php?hash=72bd4e60a9ae50035239063f58559d51",
        24: "https://embed2.streamc.xyz/embed.php?hash=f43d9d18dc7d1ad74fd260372a65575a",
        25: "https://embed2.streamc.xyz/embed.php?hash=7736587e88dd8d7d5b3268533bbf7ee2",
        26: "https://embed2.streamc.xyz/embed.php?hash=6c5c5a8697abe91b03be7130420d022a",
        27: "https://embed2.streamc.xyz/embed.php?hash=cd86f332332281b638cc2f7cb30e3cca",
        28: "https://embed2.streamc.xyz/embed.php?hash=6b72a5335eb0ab539786d954ea42f390",
        29: "https://embed2.streamc.xyz/embed.php?hash=4c4916eb12a4b53237890d7e788194d1",
        30: "https://embed2.streamc.xyz/embed.php?hash=ec7920e3103c04e0634bbad2e3c3d411",
        31: "https://embed2.streamc.xyz/embed.php?hash=2f38ac72f25c744befe25d7c6ef85b6f",
        32: "https://embed2.streamc.xyz/embed.php?hash=7503984a78f73139f3486c7b9d345b50",
        33: "https://embed2.streamc.xyz/embed.php?hash=41ed647c2215d851312abc870fdc3111",
        34: "https://embed2.streamc.xyz/embed.php?hash=7c182283988835d4148c0badc1033397",
        35: "https://embed2.streamc.xyz/embed.php?hash=ae23feff45e38b11ed1d6cb23b61c928",
        36: "https://embed2.streamc.xyz/embed.php?hash=ce3ad183e8d4cf2e0181a5ac7a78421d"
    };

    function loadEpisode(episode) {
        const lastWatchedTime = localStorage.getItem(`lastWatchedTime_episode${episode}`);
        const continueFromLastTime = lastWatchedTime && confirm("Do you want to continue from the last watched time?");

        iframe.src = videoLinks[episode];
        
        if (continueFromLastTime) {
            iframe.onload = () => {
                iframe.contentWindow.postMessage({ type: 'setTime', time: lastWatchedTime }, '*');
            };
            lastTimeDisplay.textContent = lastWatchedTime;
        } else {
            lastTimeDisplay.textContent = "0";
        }
    }

    episodeSelect.addEventListener("change", function() {
        const selectedEpisode = episodeSelect.value;
        loadEpisode(selectedEpisode);
    });

    window.addEventListener("message", function(event) {
        if (event.origin !== "https://embed3.streamc.xyz" && event.origin !== "https://embed2.streamc.xyz") return;

        const selectedEpisode = episodeSelect.value;
        if (event.data.type === 'timeupdate') {
            localStorage.setItem(`lastWatchedTime_episode${selectedEpisode}`, event.data.time);
            lastTimeDisplay.textContent = Math.floor(event.data.time);
        }

        if (event.data.type === 'ended') {
            localStorage.removeItem(`lastWatchedTime_episode${selectedEpisode}`);
            lastTimeDisplay.textContent = "0";
        }
    });

    // Load the first episode by default
    loadEpisode(episodeSelect.value);
});
