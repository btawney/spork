<?php // db.inc.php
  class Record {
  }

  class Db {
    var $connection;

    function __construct($environment) {
      $config = parse_ini_file('/etc/spork.conf', true);

      if (isset($config[$environment])) {
        $ec = $config[$environment];

        if (isset($ec['host']) && isset($ec['username']) && isset($ec['password'])
          && isset($ec['dbname'])) {
          $this->connection = new mysqli($ec['host'], $ec['username'],
            $ec['password'], $ec['dbname']);

          if ($this->connection === false) {
            die("Failed to connect to database");
          }
        } else {
          die("Environment not fully configured: $environment");
        }
      } else {
        die("Environment not configured: $environment");
      }
    }

    function newId() {
      return str_replace('/', '_', base64_encode(random_bytes(6)));
    }

    function exec($sql) {
      $statement = $this->connection->prepare($sql);
      $statement->execute();
      return $this->connection->insert_id;
    }

    function queryScalar($sql) {
      $result = false;
      if ($qr = $this->connection->query($sql)) {
        $result = $qr->fetch_row()[0];
        $qr->free();
      }
      return $result;
    }

    function queryEnumeratedArray($sql) {
      $result = array();
      if ($qr = $this->connection->query($sql)) {
        while ($row = $qr->fetch_row()) {
          $result[] = $row[0];
        }
        $qr->free();
      }
      return $result;
    }

    function queryAssociativeArray($sql) {
      $result = array();
      if ($qr = $this->connection->query($sql)) {
        while ($row = $qr->fetch_row()) {
          $result[$row[0]] = $row[1];
        }
        $qr->free();
      }
      return $result;
    }

    function query($sql) {
      $result = array();
      if ($qr = $this->connection->query($sql)) {
        while ($row = $qr->fetch_assoc()) {
          $o = new Record();
          foreach ($row as $field => $value) {
            $o->$field = $value;
          }
          $result[] = $o;
        }
        $qr->free();
      }
      return $result;
    }

    function populate($object, $sql) {
      if ($qr = $this->connection->query($sql)) {
        if ($row = $qr->fetch_assoc()) {
          foreach ($row as $field => $value) {
            $object->$field = $value;
          }
          $qr->free();
          return true;
        }
      }
      return false;
    }

    function applyOverObjects($f, $init, $sql) {
      $next = $init;
      if ($qr = $this->connection->query($sql)) {
        while ($row = $qr->fetch_field()) {
          $next = $f($next, $row);
        }
      }
      return $next;
    }

    function clean($name) {
      return preg_replace('[^a-zA-Z0-9_-]', '', $name);
    }

    function set($name, $type, $value) {
      $nameToUse = $this->clean($name);
      $statement = $this->connection->prepare("SELECT @$nameToUse := ?");
      $statement->bind_param($type, $value);
      $statement->bind_result($result);
      $statement->execute();
      return $result;
    }

    function setInteger($name, $value) {
      $this->set($name, 'i', $value);
    }

    function setString($name, $value) {
      $this->set($name, 's', $value);
    }

    function setDouble($name, $value) {
      $this->set($name, 'd', $value);
    }

    function setBinary($name, $value) {
      $this->set($name, 'b', $value);
    }
  }
?>
