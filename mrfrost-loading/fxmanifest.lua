fx_version "cerulean"
game "gta5"
lua54 "yes"

name "mrfrost-loading"
description "mrfrost-loading"
author "MrFrost"
version "1.0.0"

-- The only server-side code here exists to hand the connecting player's name
-- to the loading screen; there is no client script in this resource.
server_scripts {
    "server.lua"
}

-- Everything the loading screen page pulls in has to be listed here or the
-- client never receives it. The two asset globs cover the two directory depths
-- actually in use: assets/<type>/<file> for css, js and audio, and the extra
-- level for assets/img/loading/<file>. Anything nested deeper needs its own
-- line.
files {
    "*.html",
    "assets/**/*.*",
    "assets/**/**/*.*"
}
loadscreen "index.html"
-- Manual shutdown: the game will not dismiss this page by itself. Something
-- else on the client - normally the spawn manager or the character selector -
-- has to call ShutdownLoadingScreen() and ShutdownLoadingScreenNui(). Without
-- such a resource the player stays on this screen after the session is ready.
loadscreen_manual_shutdown "yes"
-- Enables a mouse cursor over the loading screen so the info, Discord and
-- music buttons can actually be clicked.
loadscreen_cursor "yes"
