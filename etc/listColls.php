<?php
  require_once('db.inc.php');

  if (count($argv) > 1) {
    $appId = $argv[1];
  } else {
    $appId = '';
  }

  $db = new Db('dev');
  $db->setString('appId', $appId);
  $colls = $db->queryAssociativeArray(
    'SELECT c.externalId, c.name'
    . ' FROM app a'
    .   ' JOIN collection c ON c.appId = a.id'
    . ' WHERE a.externalId = @appId');
  foreach ($colls as $id => $name) {
    print "$id: $name\n";
  }
?>
