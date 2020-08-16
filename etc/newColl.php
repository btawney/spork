<?php
  require_once('db.inc.php');

  $appId = $argv[1];
  $collName = $argv[2];

  $db = new Db('dev');
  $externalId = $db->newId();
  $db->setString('collExternalId', $externalId);
  $db->setString('collName', $collName);
  $db->setString('appExternalId', $appId);
  $db->exec(
    ' INSERT INTO collection'
    . ' (appId, externalId, name)'
    . ' SELECT id, @collExternalId, @collName FROM app'
    . ' WHERE externalId = @appExternalId');
  print "Collection ID: $externalId\n";
?>
