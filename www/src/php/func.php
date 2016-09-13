<?php
// CORS 요청을 어느 곳에서나 허용.
header('Access-Control-Allow-Origin: *');
include './dbconn.php';
$mode = $_GET["mode"];
$func = $_GET["func"];
$status = $_GET["status"];
$id = $_GET["id"];;
if ($func == "feed") {
    $sql = "Select today From auto_feed Where m_id='$id'";
    if ($result = mysqli_query($conn, $sql)) {
        while ($row = mysqli_fetch_row($result)) {
            if (date("Y-m-d", strtotime($row[0])) != date("Y-m-d")) {
                $sql = "Update auto_feed Set feed_cnt = 1 Where m_id='$id';";
            } else {
                $sql = "Update auto_feed Set feed_cnt=feed_cnt+1 Where m_id='$id';";
            }
            $sql .= "Select feed_cnt From auto_feed Where m_id='$id';";
            mysqli_multi_query($conn, $sql);
            while (mysqli_more_results($conn)) {
                mysqli_use_result($conn);
                mysqli_next_result($conn);
            }
            $result = mysqli_store_result($conn);
            $row = $result->fetch_row();
            echo "{\"feed_cnt\": \"" . $row[0] . "\"}";
        }
    }
} else {
    if ($status == "on") {
        $sql = "Update auto_light Set is_on = 1 Where m_id='$id';";
    } else {
        $sql = "Update auto_light Set is_on = 0 Where m_id='$id';";
    }
    $sql .= "Select is_on From auto_light Where m_id='$id';";
    mysqli_multi_query($conn, $sql);
    while (mysqli_more_results($conn)) {
        mysqli_use_result($conn);
        mysqli_next_result($conn);
    }
    $result = mysqli_store_result($conn);
    $row = $result->fetch_row();
    echo "{\"is_on\": \"" . $row[0] . "\"}";
}
mysqli_close($conn);
?>