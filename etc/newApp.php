<?php
  require_once('db.inc.php');

  if (count($argv) > 1) {
    $appName = $argv[1];
  } else {
    $appName = 'New App';
  }

  $db = new Db('dev');
  $externalId = $db->newId();
  $db->setString('appExternalId', $externalId);
  $db->setString('appName', $appName);
  $db->exec(
    ' INSERT INTO app'
    . ' (externalId, name)'
    . ' VALUES (@appExternalId, @appName)');
  print "App ID: $externalId\n";
?>
