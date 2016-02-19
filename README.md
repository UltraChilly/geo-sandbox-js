Toying with a fork of NBrignol's Geo Sandbox
(https://github.com/nbrignol/geo-sandbox-js)

The original idea was to get used to leafletjs but... I kinda got carried away and made something completely different out of it (I still use lefletjs and NBrignol's orginal work as a debugging tool and am immensely glad for his invaluable geodistance function, I would have never figured that one out by myself TBH. Maths is really not my thing...)

The code is a mess right now and probably only works on iOS Safari (I don't have any Android device handy and the compass is said to be handled differently depending on the platform...)

The idea is to display orientation to a target using 'subtle' hints in the UI (nothing really subtle right now, that's my next step)

The debug button shows the map and other useful infos (most of them stolen from NBrignol's original repo)

To do : 
- animate glitch levels
- replace (or move) original marker instead of adding one in debug (or not?)
- test on different browsers and modify accordingly
- refactor all the things! http://cdn.meme.am/instances/400x/62098031.jpg