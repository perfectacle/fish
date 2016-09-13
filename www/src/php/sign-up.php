<?php
// CORS 요청을 어느 곳에서나 허용.
header('Access-Control-Allow-Origin: *');
include './dbconn.php';
$mode = $_GET["mode"];
$arduino_id = strtoupper($_GET["arduinoId"]);
$id = $_GET["id"];
$pw = $_GET["pw"];
$options = array('cost' => 12);
$hashPW = password_hash($pw, PASSWORD_BCRYPT, $options);
if ($mode == "chkArduino") { // 아두이노 ID가 유효한지 파악.
    $sql = "Select id From arduino Where id='$arduino_id'";
    if ($result = mysqli_query($conn, $sql)) {
        while ($row = mysqli_fetch_row($result)) {
            echo 1;
        }
    }
} else if ($mode == "chkArduino2") { // 아두이노 ID 중복 검사.
    $sql = "Select a_id From member Where a_id='$arduino_id'";
    if ($result = mysqli_query($conn, $sql)) {
        while ($row = mysqli_fetch_row($result)) {
            echo 1;
        }
    }
} else if ($mode == "chkId") { // 아이디 중복 검사.
    $sql = "Select id From member Where id='$id'";
    if ($result = mysqli_query($conn, $sql)) {
        while ($row = mysqli_fetch_row($result)) {
            echo 1;
        }
    }
} else { // 회원 가입
    $sql = "Insert Into member Values('$id', '$hashPW', '$arduino_id');";
    $sql .= "Select * From member;";
    $sql .= "Insert Into auto_feed (m_id) Values('$id');";
    $sql .= "Insert Into auto_light (m_id) Values('$id');";
    $sql .= "Update arduino Set m_id='$id' Where id='$arduino_id';";
    $result = mysqli_multi_query($conn, $sql);
    echo 1;
}
mysqli_close($conn);
?>