# Configuration

`mrfrost-loading` has no `config.lua` and no shared config table. A loading
screen is a plain web page, so everything is configured by editing the three
source files directly:

- `index.html` — the markup and all visible text
- `assets/css/style.css` — layout, colours and animation timing
- `assets/js/main.js` — behaviour: slideshow timing, playlist, volume

Line numbers below refer to the files as published. Nothing here needs a server
restart beyond restarting the resource, but note that a loading screen is only
re-read when a client connects.

## Text

All of these are literal strings in the markup. The page is served with
`lang="en"` but several of the default strings are German — see
[known-issues.md](known-issues.md).

| Value | Location | Default | Notes |
|-------|----------|---------|-------|
| Page title | `index.html:11` | `MrFrost` | Not visible in game; only the window title. |
| Server name | `index.html:82` | `MrFrost` | The large heading on the left-hand panel. |
| Tagline | `index.html:83` | `Your server tagline goes here` | Contains a trailing `<br />`; extra lines can be added here. |
| Info button label | `index.html:84` | `Mehr Infos` | German for "more info". |
| Discord button label | `index.html:85` | `Discord` | |
| Info panel body | `index.html:90` | `Hier findest du bald mehr!` | Plain text; any HTML you put here is rendered. The panel scrolls if the content is taller than 70% of the screen. |
| Player name placeholder | `index.html:108` | `Dein Name` | Replaced at runtime by the real name (see "Player name" below). Only visible if the handover never arrives. |
| Initial progress label | `index.html:98` | `0%` | Overwritten by the first progress message. |
| Completion label | `main.js:56` | `Fertig!` | German for "done". Shown 2 seconds after the bar reaches 100%. |

## Discord widget

| Value | Location | Default | Description |
|-------|----------|---------|-------------|
| Guild id | `index.html:71` | `1048024138083745812` | The `id=` parameter of the widget URL. Replace it with your own guild id. |
| Widget theme | `index.html:71` | `dark` | The `theme=` parameter; Discord accepts `dark` or `light`. |

The guild must have **Enable Server Widget** switched on in its server
settings, otherwise Discord returns an error page inside the iframe. The panel
is hidden until the Discord button is clicked.

## Slideshow

| Value | Location | Default | Type | Description |
|-------|----------|---------|------|-------------|
| Image list | `index.html:50-60` | 11 `<img>` elements | markup | One element per slide. `main.js` walks them by index, so filenames do not matter — add or remove `<img>` lines freely, but keep at least three. |
| Seconds per slide | `main.js:39` | `7000` | number (ms) | Interval between slide changes. |
| Cross-fade / zoom duration | `style.css:46` | `3s, 10s` | CSS | Read in pairs with `transition-property: opacity, transform` on the line above: 3s fade, 10s zoom. The 7s interval sits between the two deliberately. |
| Zoom target | `style.css:68` | `scale(1.1)` | CSS | How far a slide zooms in over its 10s. |
| Zoom direction | `style.css:47`, `54`, `58`, `62` | four corners | CSS | `transform-origin` per slide; the `nth-child` rules overlap and the last matching one wins. |

## Colours and layout

The palette is a dark grey base with one purple accent.

| Value | Location | Default | Description |
|-------|----------|---------|-------------|
| Page background | `style.css:23` | `#1e1e1e` | Visible before any slide has loaded. |
| Panel background | `style.css:77`, `104`, `174`, `225`, `261`, `279` | `#1e1e1e99` | The same grey at 60% alpha, on every panel. |
| Panel blur | same lines as above | `blur(50px)` | `backdrop-filter`; drop it if the blur costs too much on low-end clients. |
| Accent | `style.css:161`, `200`, `238` | `#904BDE` | Progress bar fill, buttons, music icon hover. |
| Accent (button hover) | `style.css:250` | `#5e3191` | |
| Progress bar track | `style.css:147` | `#141414` | |
| Body font | `style.css:1`, `19` | Poppins, from Google Fonts | The `@import` on line 1 is the network fetch; line 19 is where it is applied. |
| Logo size | `style.css:117` | `120px` wide | |
| Info panel geometry | `style.css:219-234` | top `11.5%`, right `1.4%`, `67%` x `70%` | |
| Discord panel geometry | `style.css:256-272` | top `2.5%`, left `1.5%`, max `530px` x `45.5%` | |
| Name plate geometry | `style.css:274-291` | top `2.5%`, right `10.5%`, `250px` x `46px` | |
| Music controls geometry | `style.css:169-182` | top `2.5%`, right `1.4%`, `150px` wide | |

Most positions are percentages, so the layout scales with resolution, but the
panels have fixed pixel widths and the main overlay is pinned to `top: 66.5%`
(`style.css:73`). Very tall or very wide screens may need those adjusted.

## Music

| Value | Location | Default | Type | Description |
|-------|----------|---------|------|-------------|
| Playlist | `main.js:70` | `["./assets/audio/noncopyright.mp3", "./assets/audio/noncopyright1.mp3"]` | array of strings | The real playlist. One entry is picked at random on load and again on every press of the skip button. |
| Volume | `main.js:79` | `0.025` | 0-1 float | 2.5%. There is no in-page volume control, so this is the only place to change it. |
| Fallback source | `index.html:39` | `assets/audio/noncopyright.mp3` | markup | Only used for the initial autoplay before `main.js` runs; it is overwritten immediately. Keep it pointing at a file that exists. |
| Loop | `index.html:36` | `loop` attribute present | markup | The selected track repeats until the player skips it. Remove the attribute for one-shot playback — nothing advances the playlist automatically. |

The audio files are not shipped with this resource; see [assets.md](assets.md).

## Icons

The three music buttons use Material Icons ligatures — the icon name is the
text content of the `<i>` element, so changing the icon means changing the
word.

| Button | Location | Default |
|--------|----------|---------|
| Play / pause (markup) | `index.html:113` | `play_arrow` |
| Mute (markup) | `index.html:116` | `volume_up` |
| Skip | `index.html:119` | `skip_next` |
| Play / pause (runtime swap) | `main.js:109` | `pause` / `play_arrow` |
| Mute (runtime swap) | `main.js:114` | `volume_off` / `volume_up` |

The play/pause and mute icons are written twice — once in the markup and once
in `main.js` — so both places have to be changed together.

## Player name

`server.lua` sends the connecting player's name to the page:

```lua
deferrals.handover({ name = GetPlayerName(source) })
```

The page reads it back as `window.nuiHandoverData.name` (`main.js:164`) and
writes it into `.namePlaceholder`. To show something else, add more keys to the
table in `server.lua` and read them in the same place. This is the only channel
between the server and a loading screen — the page is not an ordinary NUI
frame, so it cannot receive net events.

## Progress bar

The bar is driven by the `loadProgress` message the game posts into the page
(`main.js:49-62`); `e.data.loadFraction` is a 0-1 float. No other loading-screen
event is handled. There is nothing to configure here except the labels and the
colours listed above.
