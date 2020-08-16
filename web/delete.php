<?php
  require_once('db.inc.php');

  if (empty($_REQUEST['rec'])) {
    if (count($argv) > 1) {
      $recordExternalId = $argv[1];
    } else {
      $recordExternalId = 'nosuch';
    }
  } else {
    $recordExternalId = $_REQUEST['rec'];
  }

  $db = new Db('dev');
  $db->setString('recordExternalId', $recordExternalId);
  $revisionId = $db->exec(
    ' INSERT INTO revision'
    . ' (recordId, content, isDeleted, revisionTime)'
    . ' SELECT rec.id, \'\', \'1\', NOW()'
    . ' FROM record rec'
    . ' WHERE rec.externalId = @recordExternalId');
  $db->setInteger('revisionId', $revisionId);
  $db->exec(
    'UPDATE record'
    . ' SET revisionId = @revisionId'
    . ' WHERE externalId = @recordExternalId');
?>
