<?php
// CORS 요청을 어느 곳에서나 허용.
header('Access-Control-Allow-Origin: *');
include './dbconn.php';
$id = $_GET["id"];
$mode = $_GET["mode"];
$func = $_GET["func"];
$feed_time = $_GET["feed_time"];
$wait_time = $_GET["wait_time"];
$on_time = $_GET["onTime"];
$off_time = $_GET["offTime"];
if ($mode == "upd") { // 데이터를 입력한 경우.
    if ($func == "feed") {
        $sql = "Update auto_feed Set feed_time='$feed_time', wait_time=$wait_time Where m_id='$id'";
    } else {
        $sql = "Update auto_light Set on_time='$on_time', off_time='$off_time' Where m_id='$id'";
    }
    mysqli_query($conn, $sql);
    echo 1;
} else { // 데이터를 불러오는 경우
    if ($func == "feed") {
        $sql = "Select today From auto_feed Where m_id='$id'";
        if ($result = mysqli_query($conn, $sql)) {
            while ($row = mysqli_fetch_row($result)) {
                if (date("Y-m-d", strtotime($row[0])) != date("Y-m-d")) {
                    $sql = "Update auto_feed Set feed_cnt = 0 Where m_id='$id'";
                    mysqli_query($conn, $sql);
                }
            }
        }
        $sql = "Select feed_time, wait_time, feed_cnt From auto_feed Where m_id='$id'";
        if ($result = mysqli_query($conn, $sql)) {
            while ($row = mysqli_fetch_row($result)) {
                // 데이터를 JSON 형태로 뿌려줌.
                echo "{\"feed_time\": \"" . $row[0] . "\"";
                echo ",\"wait_time\": \"" . $row[1] . "\"";
                echo ",\"feed_cnt\": \"" . $row[2] . "\"}";
            }
        }
    } else {
        $sql = "Select on_time, off_time, is_on From auto_light Where m_id='$id'";
        if ($result = mysqli_query($conn, $sql)) {
            while ($row = mysqli_fetch_row($result)) {
                // 데이터를 JSON 형태로 뿌려줌.
                echo "{\"on_time\": \"" . $row[0] . "\"";
                echo ",\"off_time\": \"" . $row[1] . "\"";
                echo ",\"is_on\": \"" . $row[2] . "\"}";
            }
        }
    }
}
mysqli_close($conn);
?>