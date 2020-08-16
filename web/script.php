<?php // script.php
  function useGroup($name) {
    $mtime = filemtime("$name.js");
    print "<script src=\"$name.js?$mtime\"></script>\n";

    foreach (glob("$name.*.js") as $js) {
      $mtime = filemtime($js);
      print "<script src=\"$js?$mtime\"></script>\n";
    }
  }

  function linkStyleSheets() {
    foreach (glob('*.css') as $css) {
      $mtime = filemtime($css);
      print "<link rel=\"stylesheet\" href=\"$css\">\n";
    }
  }
?>
