<?php
  require_once('db.inc.php');

  if (count($argv) > 1) {
    $body = $argv[1];
  } else {
    $body = file_get_contents('php://input');
  }

  // Reject anything over 10k as suspicious
  if (strlen($body) > 10000) {
    print "{\"result\":2001}";
    return;
  }

  try {
    $object = json_decode($body);
    if (empty($object->key)) {
      print "{\"result\":2011}";
      return;
    }
  } catch (Exception $inner) {
    print "{\"result\":2010}";
    return;
  }

  $db = new Db('dev');
  $db->setString('recordExternalId', $object->key);
  $db->setString('content', $body);
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
  print "{\"result\":1000}";
?>
