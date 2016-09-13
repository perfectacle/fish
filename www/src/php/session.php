<?php
session_start();
$id = $_SESSION['id'];
$mode = $_GET['mode'];
if ($mode == 'get') {
    if ($id != "") {
        echo $_SESSION['id'];
    }
} else {
    session_unset('id');
}
?>