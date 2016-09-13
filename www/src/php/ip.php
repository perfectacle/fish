<?php
// CORS 요청을 어느 곳에서나 허용.
header('Access-Control-Allow-Origin: *');
include './dbconn.php';
$mode = $_GET["mode"];
$mac = $_GET["mac"];
$p_ip = $_SERVER['REMOTE_ADDR'];
$l_ip = $_GET["l_ip"];
$port = $_GET["port"];
$m_id = $_GET["m_id"];
if ($mode == "update") {
    $sql = "update arduino set p_ip='$p_ip', l_ip='$l_ip', port='$port' Where id='$mac'";
    if (mysqli_query($conn, $sql)) {
        echo "Record updated successfully";
    } else {
        echo "Error updating record: " . mysqli_error($conn);
    }
} else if ($mode == "sel") {
    $sql = "select p_ip, l_ip, port from arduino Where m_id='$m_id'";
    if ($result = mysqli_query($conn, $sql)) {
        while ($row = mysqli_fetch_row($result)) {
            // 데이터를 JSON 형태로 뿌려줌.
            echo "{\"p_ip\": \"" . $row[0] . "\"";
            echo ",\"l_ip\": \"" . $row[1] . "\"";
            echo ",\"port\": \"" . $row[2] . "\"}";
        }
    }
}
mysqli_close($conn);
?>