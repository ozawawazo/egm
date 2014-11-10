<?php

$sample = $_POST["item"];
$fp = fopen("/home/ozawa/public_html/TaCS/sample.txt", "rw");
if ($fp){
  fwrite($fp, "ooooo");
  echo("ooo");
}else{
  echo('ファイルロックに失敗しました');
}
fclose($fp);
#echo $sample;

?>