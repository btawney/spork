<?php
  require_once('db.inc.php');

  class CollectionMember {
    var $_db;

    function __construct($db, $json) {
      $this->_db = $db;
      $decoded = json_decode($json, true);

      foreach ($decoded as $field => $value) {
        if ($field != '_db') {
          $this->$field = $value;
        }
      }
    }

    function json() {
      $decoded = array();
      foreach (get_object_vars($this) as $field => $value) {
        if ($field != '_db') {
          $decoded[$field] = $value;
        }
      }
      return json_encode($decoded);
    }

    function update() {
      $db = $this->_db;
      $db->setString('recordExternalId', $this->key);
      $db->setString('content', $this->json());
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
    }

    function delete() {
      $db = $this->db;
      $db->setString('recordExternalId', $this->key);
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
    }
  }

  function getCollection($appExternalId, $collectionExternalId) {
    $result = array();

    $db = new Db('dev');
    $db->setString('appExternalId', $appExternalId);
    $db->setString('collectionExternalId', $collectionExternalId);

    $records = $db->queryEnumeratedArray(
      'SELECT rev.content'
      . ' FROM collection c'
      . ' JOIN record rec ON rec.collectionId = c.id'
      . ' JOIN revision rev ON rev.id = rec.revisionId'
      . ' WHERE c.externalId = @collectionExternalId'
      . ' AND rev.isDeleted = \'0\'');

    foreach ($records as $record) {
      $result[] = new CollectionMember($db, $record);
    }

    return $result;
  }
?>
