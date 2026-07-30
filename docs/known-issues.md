# Known issues

Everything below was found by reading the code. Nothing has been fixed —
the resource is published as-is and cannot be tested against a live server any
more — so each entry says what a fix would look like rather than applying one.
Line numbers refer to the files as published.

## Nothing in this resource dismisses the loading screen

`fxmanifest.lua:31` sets `loadscreen_manual_shutdown "yes"` and the resource has
no `client_script` at all, so it never calls `ShutdownLoadingScreen()` or
`ShutdownLoadingScreenNui()`. On a server where no other resource does that
either, players sit on this page forever after the session is ready.

This is a legitimate design — most spawn managers and character selectors shut
the screen down themselves, and that is the whole point of manual shutdown —
but it makes the resource non-obviously incomplete on a bare server. A fix would
either drop `loadscreen_manual_shutdown`, or ship a two-line client script that
shuts the screen down on `playerSpawned`.

## `window.nuiHandoverData` is used without a guard

`assets/js/main.js:164`

```js
document.querySelector(".namePlaceholder").innerText = window.nuiHandoverData.name;
```

If the handover never arrives — `server.lua` not running, another resource
deferring the connection in a way that swallows it, or simply opening
`index.html` in a browser to preview the design — this throws a `TypeError` and
the name plate keeps its placeholder text. Nothing else breaks, because this is
the last statement in `main()`, but the error is noisy.

Fix: `window.nuiHandoverData?.name ?? "..."`, or wrap the assignment in a check.

## `audio.play()` rejections are ignored and `isPlaying` lies

`assets/js/main.js:80-81` and `92-93`

`play()` returns a promise. It rejects when the file is missing or when the
embedded browser declines autoplay, but the return value is discarded and
`isPlaying = true` is set unconditionally on the next line. The play/pause
button then shows a pause icon while nothing is playing, and pressing it calls
`pause()` on a stopped element, so the user has to click twice to start the
music.

This is guaranteed to happen out of the box, because the audio files are not
shipped (see [assets.md](assets.md)).

Fix: set `isPlaying` inside a `.then()` and handle the rejection in a `.catch()`
by leaving the icon in its play state.

## The progress bar starts at 60% full

`assets/css/style.css:158` gives `.loading-bar-inner` a hardcoded `width: 60%`,
while `index.html:98` shows `0%` next to it. Until the game posts its first
`loadProgress` message the two disagree, and on a fast client that state can be
visible for a noticeable moment.

Fix: `width: 0%` in the stylesheet. `main.js` overwrites it either way.

## The slideshow breaks with fewer than three images

`assets/js/main.js:18-34`

The wrap-around arithmetic assumes at least three slides:

- with two images, the `i === 1` branch clears the class from the image the same
  tick set it, so the second slide never appears;
- with one image, `images[numberOfImages - 2]` is `images[-1]`, which is
  `undefined`, and the interval throws on every tick.

Eleven are referenced as shipped, so this only bites someone who trims the list.

Fix: bail out of `kenBurns` when `numberOfImages < 3`, or guard each index
before assigning to `.className`.

## Referenced media files are not in the repository

`index.html:39`, `index.html:50-60` and `assets/js/main.js:70` point at eleven
`.jpg` screenshots and two `.mp3` tracks that are not published. This is
deliberate rather than an oversight — the rights to the original files are
unclear — and the code was left unchanged so that dropping replacements in at
the same paths restores the original behaviour. See [assets.md](assets.md) for
the exact filenames.

## Hardcoded Discord guild id

`index.html:71` embeds `https://discord.com/widget?id=1048024138083745812`.
Anyone who installs the resource without editing that line advertises somebody
else's Discord server on their loading screen.

Fix: nothing that can be fixed in markup alone; it just needs to be the first
thing an installer changes, which is why it is called out in the README.

## Mixed interface language

The document declares `lang="en"` (`index.html:2`) and the tagline is English
(`index.html:83`), but four visible strings are German:

| String | Location |
|--------|----------|
| `Mehr Infos` | `index.html:84` |
| `Hier findest du bald mehr!` | `index.html:90` |
| `Dein Name` | `index.html:108` |
| `Fertig!` | `assets/js/main.js:56` |

There is no `locales/` folder and no translation mechanism, so these are just
literals to edit. Fix: translate them and leave `lang` as-is, or set
`lang="de"`.

## Dead CSS

`assets/css/style.css:207-213` styles `i.material-icons.stop-icon` and its hover
state in `#F55547`. Nothing in `index.html` or `main.js` ever adds a `stop-icon`
class — the music controls only swap between `play_arrow`, `pause`,
`volume_up`, `volume_off` and `skip_next`. The two rules can be deleted.

## Class naming inconsistency

`index.html:107` and `assets/css/style.css:274` use `.mrfrosthud-playername`,
while every other class on the page is prefixed `mrfrost-loading-`. Purely
cosmetic — the selector matches — but it looks like a leftover from a different
file. Fix: rename to `mrfrost-loading-playername` in both places.

## Duplicated branch in the progress handler

`assets/js/main.js:53-60`

```js
if (loaded == 100) {
    loaderIndicator.innerHTML = `${loaded}%`;
    setTimeout(() => { ... }, 2000);
} else {
    loaderIndicator.innerHTML = `${loaded}%`;
}
```

Both branches start with the same assignment. Fix: assign once before the
`if`, and keep only the `setTimeout` inside it.

Related: the `Fertig!` label only appears two seconds after the bar reaches
100%. On a server whose spawn logic dismisses the screen promptly, it is never
seen at all.

## `parseInt` on a number

`assets/js/main.js:51` calls `parseInt(e.data.loadFraction * 100)`. It works —
the number is coerced to a string first — but it is doing string parsing on a
float and quietly truncates. `Math.floor()` (or `Math.round()`) says what is
meant and skips the coercion.

## Skip can repeat the current track

`assets/js/main.js:74` picks an index at random with no memory of the previous
one, so with a two-entry playlist pressing skip replays the same track half the
time. Fix: re-roll while the picked index matches the current one, or step
through the list in order.

## The first track is requested twice

`index.html:38-40` declares a `<source>` and the element has `autoplay`, so the
browser starts fetching `noncopyright.mp3` during parsing. `main.js:76` then
assigns `audio.src`, which discards that and starts again — possibly with the
other track. Harmless, but it costs one wasted request on every connect. Fix:
drop the `<source>` element and the `autoplay` attribute, since `main.js` starts
playback itself.

## Runtime dependencies on external services

Three things are fetched from the internet while the player is connecting:
the Material Icons stylesheet (`index.html:24`), the Poppins font
(`assets/css/style.css:1`) and the Discord widget iframe (`index.html:71`). All
three fail soft, but the first one fails visibly: Material Icons works by
ligature, so without the stylesheet the three music buttons read `play_arrow`,
`volume_up` and `skip_next` in plain text. Fix: ship the icon font and the
webfont in `assets/` and reference them locally.

## Blanket reset is heavy-handed

`assets/css/style.css:9-16` applies `overflow: hidden` and
`z-index: 99999999996` to every element via `*`. The overflow rule means any
element that ever needs to scroll must re-declare it — `.info-container` already
has to (`style.css:231-232`, where `overflow: hidden` is immediately followed by
`overflow-y: auto`). The `z-index` on `*` does nothing for the many static
elements it hits. Fix: scope both to the elements that need them.

## Panels overlap at lower resolutions

Panel positions are percentages but several widths are pixels, so the layout
only holds at wide resolutions. At 1920x1080 the panels clear each other; at
1280x720 the Discord panel (`style.css:256-272`, up to 530px from the left)
runs into the info panel (`style.css:219-234`, 67% wide from the right), and the
name plate (`style.css:274-291`, 250px at `right: 10.5%`) runs into the music
controls (`style.css:169-182`, 150px at `right: 1.4%`).

Fix: express the panel widths in percentages too, or add a media query for
narrow viewports.
