function main() {
	// Slideshow
	// "fx" is the only state class the slideshow has: style.css fades that
	// image in over 3s and slowly scales it to 1.1 over 10s (the Ken Burns
	// effect). Removing the class fades it back out. The first image is given
	// the class straight away so the screen is never blank.
	document.querySelector(".mrfrost-loading-slideshow").getElementsByTagName("img")[0].className = "fx";

	let images = document.querySelector(".mrfrost-loading-slideshow").getElementsByTagName("img"),
		numberOfImages = images.length,
		i = 1;

	// Fades the next image in and the one two steps back out, so two images are
	// visible at once and the outgoing one has a full tick to fade away. The
	// three branches are the same rule, just wrapped around the end of the
	// list. This needs at least three images to behave; with fewer, an image
	// would be faded out again in the same tick it was faded in.
	const kenBurns = () => {
		if (i == numberOfImages) {
			i = 0;
		}
		images[i].className = "fx";

		if (i === 0) {
			images[numberOfImages - 2].className = "";
		}
		if (i === 1) {
			images[numberOfImages - 1].className = "";
		}
		if (i > 1) {
			images[i - 2].className = "";
		}
		i++;
	};

	// 7s per slide: longer than the 3s cross-fade so the fade finishes well
	// before the next one starts, shorter than the 10s zoom so it never sits
	// still at the end of the scale.
	window.setInterval(kenBurns, 7000);

	// Loader
	const loader = document.querySelector(".loading-bar-inner");
	const loaderIndicator = document.querySelector(".loading-amount");

	// The game posts loading-screen events into the page as window messages.
	// Only "loadProgress" is handled here; its loadFraction is a 0-1 float.
	// The other events the game sends (startInitFunction, onLogLine,
	// startDataFileEntries and so on) are ignored.
	window.addEventListener("message", (e) => {
		if (e.data.eventName === "loadProgress") {
			const loaded = parseInt(e.data.loadFraction * 100);
			loader.style.width = `${loaded}%`;
			if (loaded == 100) {
				loaderIndicator.innerHTML = `${loaded}%`;
				setTimeout(() => {
					loaderIndicator.innerHTML = `Fertig!`;
				}, 2000);
			} else {
				loaderIndicator.innerHTML = `${loaded}%`;
			}
		}
	});

	// Music Playback
	const audio = document.querySelector(".mrfrost-loading-music");
	// This list, not the <source> element in index.html, is what actually gets
	// played - assigning audio.src below overrides the markup. Add or remove
	// entries here to change the playlist; the files are not shipped with the
	// resource, see assets/README.md.
	const musicSources = ["./assets/audio/noncopyright.mp3", "./assets/audio/noncopyright1.mp3"];
	let isPlaying = false;

	function playRandomMusic() {
		const randomIndex = Math.floor(Math.random() * musicSources.length);
		const randomSource = musicSources[randomIndex];
		audio.src = randomSource;
		// Deliberately very quiet (2.5%): the track plays over whatever the
		// player already has running, and there is no volume slider.
		audio.volume = 0.025;
		audio.play();
		isPlaying = true;
		updatePlayPauseIcon();
	}

	function pauseMusic() {
		audio.pause();
		isPlaying = false;
		updatePlayPauseIcon();
	}

	function resumeMusic() {
		audio.play();
		isPlaying = true;
		updatePlayPauseIcon();
	}

	function toggleMute() {
		audio.muted = !audio.muted;
		updateMuteIcon();
	}

	function skipMusic() {
		pauseMusic();
		playRandomMusic();
	}

	function updatePlayPauseIcon() {
		const playPauseButton = document.querySelector(".mrfrost-loading-play-pause");
		playPauseButton.innerHTML = isPlaying ? '<i class="material-icons">pause</i>' : '<i class="material-icons">play_arrow</i>';
	}

	function updateMuteIcon() {
		const muteButton = document.querySelector(".mrfrost-loading-mute");
		muteButton.innerHTML = audio.muted ? '<i class="material-icons">volume_off</i>' : '<i class="material-icons">volume_up</i>';
	}

	playRandomMusic();

	// Event Listeners
	const playPauseButton = document.querySelector(".mrfrost-loading-play-pause");
	playPauseButton.addEventListener("click", () => {
		if (isPlaying) {
			pauseMusic();
		} else {
			resumeMusic();
		}
	});

	const muteButton = document.querySelector(".mrfrost-loading-mute");
	muteButton.addEventListener("click", toggleMute);

	const skipButton = document.querySelector(".mrfrost-loading-skip");
	skipButton.addEventListener("click", skipMusic);

	// Show info button code
	const infoButton = document.querySelector(".info-button");
	const infoContainer = document.querySelector(".info-container");

	infoButton.addEventListener("click", () => {
		if (infoContainer.style.display === "block") {
			infoContainer.style.display = "none";
		} else {
			infoContainer.style.display = "block";
		}
	});

	// Show discord button code
	const discordButton = document.querySelector(".discord-button");
	const discordContainer = document.querySelector("#discord-widget");

	discordButton.addEventListener("click", () => {
		if (discordContainer.style.display === "flex") {
			discordContainer.style.display = "none";
		} else {
			discordContainer.style.display = "flex";
		}
	});

	// nuiHandoverData is populated by deferrals.handover() in server.lua. It is
	// only present when the game opens the page during a real connect, so this
	// callback throws when index.html is opened in a plain browser and the
	// placeholder name in the markup is left as-is.
	window.addEventListener("DOMContentLoaded", () => {
		document.querySelector(".namePlaceholder").innerText = window.nuiHandoverData.name;
	});
}

main();
