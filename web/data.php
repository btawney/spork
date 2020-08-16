{<?php
  require_once('db.inc.php');

  if (empty($_REQUEST['app'])) {
    if (count($argv) > 1) {
      $appExternalId = $argv[1];
    } else {
      $appExternalId = 'nosuch';
    }
  } else {
    $appExternalId = $_REQUEST['app'];
  }

  $db = new Db('dev');
  $db->setString('appExternalId', $appExternalId);

  $collections = $db->queryAssociativeArray(
    'SELECT c.externalId, c.name'
    . ' FROM app a'
    . ' JOIN collection c ON c.appId = a.id'
    . ' WHERE a.externalId = @appExternalId');

  $first = true;
  foreach ($collections as $id => $name) {
    if ($first) {
      $first = false;
    } else {
      print ",\n";
    }

    print "\"$name\":{\"key\":\"$id\",\"data\":[";
    $db->setString('collectionExternalId', $id);
    $records = $db->queryEnumeratedArray(
      'SELECT rev.content'
      . ' FROM collection c'
      . ' JOIN record rec ON rec.collectionId = c.id'
      . ' JOIN revision rev ON rev.id = rec.revisionId'
      . ' WHERE c.externalId = @collectionExternalId'
      . ' AND rev.isDeleted = \'0\'');

    $first = true;
    foreach ($records as $record) {
      if ($first) {
        $first = false;
      } else {
        print ',';
      }
      print "\n" . $record;
    }

    print "]}";
  }
?>}
