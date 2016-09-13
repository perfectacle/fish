<?php
session_start();
// CORS 요청을 어느 곳에서나 허용.
header('Access-Control-Allow-Origin: *');
include './dbconn.php';
$mode = $_GET["mode"];
$id = $_GET["id"];
$pw = $_GET["pw"];
if ($mode == "chkId") { // 아이디 중복 검사.
    $sql = "Select id From member Where id='$id'";
    if ($result = mysqli_query($conn, $sql)) {
        while ($row = mysqli_fetch_row($result)) {
            echo 1;
        }
    }
} else { // 비밀번호 확인
    $sql = "Select pw From member Where id='$id'";
    if ($result = mysqli_query($conn, $sql)) {
        while ($row = mysqli_fetch_row($result)) {
            if (password_verify($pw, $row[0])) {
                echo $id;
                $_SESSION['id'] = $id;
            }
        }
    }
}
mysqli_close($conn);
?>