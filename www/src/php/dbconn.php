<?php
// DB 정보 입력.
$host = "host";
$user = "id";
$pw = "pw";
$db = "db";

// Create connection
$conn = new mysqli($host, $user, $pw, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>