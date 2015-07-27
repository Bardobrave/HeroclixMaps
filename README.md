#HeroclixMaps

This is a first approach to a board game editor. Nowadays I'm quite hooked on Heroclix, so I decided to base it in this particular game, however, the logic is quite simple and can easily be ported to other board games (square based, it could be a bit more difficult to hex ones).

#Features
<ul>
  <li>Plain javascript, no library or addons needed.</li>
  <li>Uses canvas to draw, so you'll need a compatible browser.</li>
  <li>Tested on last versions of Chrome and Firefox.</li>
  <li>It allows to load an image under the squares to work as base map, later you can change dimensions, squares size and add any type of terrain to the map just clicking on it.</li>
  <li>You can export the work to .png so you can save it to disk, resize it and send to print on the appropiate format.</li>
</ul>

#To Do list.
This has been a very brief work, about 10 hours more or less, just to fill some iddle time between "serious" works and test some ideas. A this point there are several functionalities that should be added, bugs that need to be fixed, for example:
<ul>
  <li>Maps should have a better way to resize than just by changing squares amount and size. Also, screen width shouldn't be a hard limit for map width, although while the system don't include a way to directly resize proportionally the whole map to final printing size.</li>
  <li>On certain situations, a square redraw can overwrite a change level marker between it and one of it's neighbours out of the redrawing cycle. This need to be fixed.</li>
  <li>When loading a background image, it resizes to fit map dimensions... I think that probably would be better if map dimensions resizes to background image's size.</li>
  <li>Testing, testing, testing... much more testing is needed to ensure consistent behaviour and stability.</li>
  <li>There are some dirty things out there on the code that could be refactored to a lot prettier version, on particular the code that draws elevation change points.
</ul>

Here you have a <a href="https://jsfiddle.net/bardobrave/kojLmojz/embedded/result/">jsFiddle</a> where you can see it work
