# Assets

Thirteen files the page asks for are not in this repository: eleven loading
screenshots and two music tracks. They were left out on purpose because the
rights to them are unclear. The code that references them was left exactly as
it was, so the resource works the moment you drop your own files in at the
same paths.

## What the resource ships with

```
mrfrost-loading/
└── assets/
    ├── css/
    │   └── style.css
    ├── img/
    │   └── logo.svg        placeholder - see below
    └── js/
        └── main.js
```

## What you have to supply

```
mrfrost-loading/
└── assets/
    ├── audio/                      create this directory
    │   ├── noncopyright.mp3
    │   └── noncopyright1.mp3
    └── img/
        └── loading/                create this directory
            ├── loading1.jpg
            ├── loading2.jpg
            ├── loading3.jpg
            ├── loading4.jpg
            ├── loading5.jpg
            ├── loading6.jpg
            ├── loading7.jpg
            ├── loading8.jpg
            ├── loading9.jpg
            ├── loading10.jpg
            └── loading11.jpg
```

Neither `assets/audio/` nor `assets/img/loading/` exists in the repository;
create both. The filenames are matched literally by the markup and by the
script, so `loading1.jpg` cannot be `loading01.jpg` or `loading1.png` unless
you also edit the reference.

### Screenshots

| File | Referenced at |
|------|---------------|
| `assets/img/loading/loading1.jpg` | `index.html:50` |
| `assets/img/loading/loading2.jpg` | `index.html:51` |
| `assets/img/loading/loading3.jpg` | `index.html:52` |
| `assets/img/loading/loading4.jpg` | `index.html:53` |
| `assets/img/loading/loading5.jpg` | `index.html:54` |
| `assets/img/loading/loading6.jpg` | `index.html:55` |
| `assets/img/loading/loading7.jpg` | `index.html:56` |
| `assets/img/loading/loading8.jpg` | `index.html:57` |
| `assets/img/loading/loading9.jpg` | `index.html:58` |
| `assets/img/loading/loading10.jpg` | `index.html:59` |
| `assets/img/loading/loading11.jpg` | `index.html:60` |

They are drawn full-screen with `object-fit: cover` (`style.css:43`) and slowly
zoomed to 110%, so anything below 1920x1080 will look soft on a large monitor.
Landscape, 16:9, and reasonably compressed — all eleven are downloaded by every
connecting player, so keep the total size sensible.

### Music

| File | Referenced at |
|------|---------------|
| `assets/audio/noncopyright.mp3` | `index.html:39` (initial autoplay) and `main.js:70` (playlist) |
| `assets/audio/noncopyright1.mp3` | `main.js:70` (playlist) |

MP3, since the `<source>` element declares `type="audio/mp3"`. The playlist in
`main.js:70` is what actually plays: one entry is picked at random when the page
loads and again each time the skip button is pressed. The `<source>` in the
markup is only the fallback for the very first autoplay, and it is overwritten
as soon as `main.js` runs — but point it at a file that exists anyway, or the
browser logs a failed request before the script takes over.

Playback volume is 2.5% (`main.js:79`).

## Changing the lists instead

You do not have to match the shipped filenames.

**Fewer or more screenshots:** add or remove `<img>` lines in the
`.mrfrost-loading-slideshow` block (`index.html:49-61`). `main.js` iterates the
elements by index and reads the count from the DOM, so nothing else needs
updating. Keep **at least three** — the cross-fade keeps two slides visible at
once and the wrap-around arithmetic in `main.js:18-34` goes out of bounds with
one or two.

**A different playlist:** edit the array at `main.js:70`. Paths there are
relative to `index.html` and start with `./`. Any number of entries works,
including one.

**A different logo:** replace `assets/img/logo.svg`, or change the `src` at
`index.html:81`.

## If you leave them out

The resource still starts and the loading screen still appears — nothing errors
out at the Lua level. What you get instead:

- No slideshow. Every `<img>` fails to load, so the flat `#1e1e1e` page
  background shows through. Panels, progress bar and buttons all work normally.
- No music. `audio.play()` rejects; the rejection is not handled
  (`main.js:80`), so it surfaces only as an unhandled promise rejection in the
  console. `isPlaying` is set to `true` regardless, so the button shows a pause
  icon while nothing is playing.
- The console fills with failed-request lines for the missing files.

## A note on the manifest

`fxmanifest.lua` lists the assets with two globs:

```lua
files {
    "*.html",
    "assets/**/*.*",
    "assets/**/**/*.*"
}
```

Between them these cover both depths in use — `assets/audio/<file>` and
`assets/img/loading/<file>` — so newly created directories at those depths are
picked up without editing the manifest. If you nest anything deeper than
`assets/<a>/<b>/<file>` you have to add a line, or the client will never
receive it and the request will 404.
