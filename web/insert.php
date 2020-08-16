<?php
  require_once('db.inc.php');

  if (empty($_REQUEST['coll'])) {
    if (count($argv) > 1) {
      $collectionExternalId = $argv[1];
      $body = $argv[2];
    } else {
      $collectionExternalId = 'nosuch';
      $body = '{"this":"that"}';
    }
  } else {
    $collectionExternalId = $_REQUEST['coll'];
  }

  if (empty($body)) {
    $body = file_get_contents('php://input');
  }

  try {
    $object = json_decode($body);
  } catch (Exception $inner) {
    print "{\"result\":2010}";
    return;
  }

  $db = new Db('dev');
  $db->setString('collectionExternalId', $collectionExternalId);
  $object->key = $db->newId();
  $db->setString('recordExternalId', $object->key);
  $db->setString('content', json_encode($object));
  $db->exec('INSERT INTO record'
    . ' (collectionId, revisionId, externalId)'
    . ' SELECT c.id, \'0\', @recordExternalId'
    . ' FROM collection c'
    . ' WHERE c.externalId = @collectionExternalId'
    );
  $revisionId = $db->exec(
    ' INSERT INTO revision'
    . ' (recordId, content, isDeleted, revisionTime)'
    . ' SELECT rec.id, @content, \'0\', NOW()'
    . ' FROM record rec'
    . ' WHERE rec.externalId = @recordExternalId');
  $db->setInteger('revisionId', $revisionId);
  $db->exec(
    'UPDATE record'
    . ' SET revisionId = @revisionId'
    . ' WHERE externalId = @recordExternalId');
  print "{\"result\":1000,\"key\":\"$object->key\"}";
?>
