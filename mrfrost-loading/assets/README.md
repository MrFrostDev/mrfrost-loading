# assets

Some of the files this loading screen references are not published with it. The
eleven loading screenshots and the two music tracks were left out because the
rights to them are unclear. The references in `index.html` and `js/main.js` were
left untouched, so put your own files at the paths below and everything works
as it did.

## Missing — you supply these

```
assets/
├── audio/                 create this directory
│   ├── noncopyright.mp3
│   └── noncopyright1.mp3
└── img/
    └── loading/           create this directory
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

The filenames are matched literally, so `loading1.jpg` cannot be
`loading01.jpg` or `loading1.png` unless you edit the reference too.

- **Screenshots** — `.jpg`, landscape, 1920x1080 or larger. They are drawn
  full-screen with `object-fit: cover` and zoomed to 110% over ten seconds.
  Every connecting player downloads all eleven, so keep them compressed.
- **Music** — `.mp3`; the `<source>` element in `index.html` declares
  `type="audio/mp3"`. Playback volume is 2.5%, set in `js/main.js`.

Without them the resource still starts: the page shows its flat `#1e1e1e`
background instead of the slideshow, no music plays, and the console logs a
failed request per missing file.

## Shipped

- `css/style.css` — all styling.
- `js/main.js` — slideshow, progress bar, music controls, panel toggles.
- `img/logo.svg` — **placeholder only.** A plain black-background graphic,
  meant to be replaced with your own logo at the same path. It is displayed at
  120px wide.

## Changing the lists

- Screenshots are listed one `<img>` per file in `index.html`; `main.js` walks
  them by index, so you can add or remove lines freely. Keep at least three.
- The audio playlist is the `musicSources` array in `js/main.js`. Any number of
  entries works; one is picked at random on load and on each skip.

Full details in `../../docs/assets.md`.
