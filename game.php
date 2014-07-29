<?php

$dbhost = "localhost"; // Имя хоста БД
$dbusername = "root"; // Пользователь БД
$dbpass = "987975"; // Пароль к базе

$dbconnect = @mysql_connect ($dbhost, $dbusername, $dbpass); 
if (!$dbconnect) { echo ("Не могу подключиться к серверу базы данных!"); }
mysql_select_db('stargazer', $dbconnect);

/* Записать результат*/
mysql_query('INSERT INTO  `table` (  `name` ,  `score` ) VALUES ("'.$_POST['name'].'",  "'.$_POST['score'].'")');

/* Подсчитать номер записи */
$res = mysql_query('SELECT MAX(`id`) as `id` FROM `table`');
$number = mysql_fetch_assoc($res);

/* Выбрать номер результата*/ 
$res = mysql_query('SET @n:=0;');
$res = mysql_query('SELECT t1.* FROM (SELECT @n:=@n+1 as rownum, `table`.* FROM `table` ORDER BY `score` desc) AS t1 WHERE t1.id='.$number['id'].';');
$my_result = mysql_fetch_assoc($res);

/* Выбор лучших результатов*/

$res = mysql_query('SELECT * FROM `table`  ORDER BY `score` DESC LIMIT 10');

$table = '<div class="score_table"><ul>';


		
$table .= '<li>
	    <span class="table_colon1 header">Позиция</span>
	    <span class="table_colon2 header">Имя</span>
	    <span class="table_colon3 header">Счет</span>
	  </li>
	  ';

$i=1;
while($row = mysql_fetch_array($res))
{

  $table .= '<li>
		<span class="table_colon1 data">' .$i.'</span>'.'
		<span class="table_colon2 data">' .$row['name'] .'</span>'.'
		<span class="table_colon3 data">' .$row['score'].'</span>
             </li>';
  $i++;
}
  $table .= '
	    <li><div class="tri">...</div></li>
	    <li>
		<span class="table_colon1 data">' .$my_result['rownum'].'</span>'.'
		<span class="table_colon2 data">' .$my_result['name'] .'</span>'.'
		<span class="table_colon3 data">' .$my_result['score'].'</span>
	     </li>';
$table .= '</ul>
<div class="new_game">Новая игра</div>


<script type="text/javascript">(function() {
  if (window.pluso)if (typeof window.pluso.start == "function") return;
  if (window.ifpluso==undefined) { window.ifpluso = 1;
    var d = document, s = d.createElement("script"), g = "getElementsByTagName";
    s.type = "text/javascript"; s.charset="UTF-8"; s.async = true;
    s.src = ("https:" == window.location.protocol ? "https" : "http")  + "://share.pluso.ru/pluso-like.js";
    var h=d[g]("body")[0];
    h.appendChild(s);
  }})();</script>
<div class="pluso" data-background="transparent" data-options="big,round,line,horizontal,nocounter,theme=07" data-services="vkontakte,odnoklassniki,facebook,twitter,google" data-url="http://stargazer.unrealprojects.com" data-title="Stargazer" data-description="Космическая аркада"></div>

</div>';

echo $table;
?>


