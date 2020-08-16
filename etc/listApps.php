<?php
  require_once('db.inc.php');

  if (count($argv) > 1) {
    $appName = $argv[1];
  } else {
    $appName = '';
  }

  $db = new Db('dev');
  $db->setString('appName', "%$appName%");
  $apps = $db->queryAssociativeArray(
    'SELECT externalId, name'
    . ' FROM app'
    . ' WHERE name LIKE @appName');
  foreach ($apps as $id => $name) {
    print "$id: $name\n";
  }
?>
