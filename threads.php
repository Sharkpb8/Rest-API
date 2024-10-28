<?php
require_once "./classes/DBC.php";
require_once "./classes/User.php";
session_start();

$text = $_POST['text'];

// Vložení nového příspěvku do databáze
$query = DBC::getConnection()->query("call addblog('" . $text . "','" . $_SESSION["username"] . "');");

// Přesměrování na domovskou stránku nebo jinou relevantní stránku
header('Location: threads_page.php');
exit();
?>

