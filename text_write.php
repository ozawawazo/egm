<?php

$sample = $_POST["item"];
$fp = fopen("/home/ozawa/public_html/system/nodevis/tacs/sample.txt", "w");
if ($fp){
  $repsample1 = str_replace('","', "\n", $sample);
  $repsample2 = str_replace('["', "", $repsample1);
  $repsample3 = str_replace('"]', "", $repsample2);
  fwrite($fp, $repsample3);
  echo($repsample3);
}else{
  echo('ファイルロックに失敗しました');
}
fclose($fp);
#echo $sample;

?>