<?php
squares(10);
function squares($num) {
    for ($i=1;$i<$num+1;$i++) {
        echo $i*$i . " ";
    }
    echo "\n";
}
?>