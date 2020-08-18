<?php
  require_once('data.inc.php');

  $appId = $argv[1];
  $collId = $argv[2];

  $objects = getCollection($appId, $collId);

  foreach ($objects as $object) {
    print $object->json() . "\n";
  }
?>
