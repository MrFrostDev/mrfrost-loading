-- Handover data is the only channel a loading screen has to the server: the
-- page is not an ordinary NUI frame, so it cannot receive net events. Whatever
-- is passed to deferrals.handover here is exposed to the page as
-- window.nuiHandoverData (read in assets/js/main.js).
AddEventHandler(
    "playerConnecting",
    function(_, _, deferrals)
        -- Temporary id of the connecting player, only valid inside this
        -- handler. Captured into a local because `source` is a magic global
        -- that can change across yields.
        local source = source

        -- handover() only attaches data - it does not defer the connection, so
        -- no matching deferrals.done() is needed and the player keeps
        -- connecting as normal. The name is also passed as the first callback
        -- argument; reading it back off the source keeps it identical to what
        -- the server itself has for this player.
        deferrals.handover(
            {
                name = GetPlayerName(source)
            }
        )
    end
)
