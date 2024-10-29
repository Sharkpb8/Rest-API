<?php
require_once "./classes/DBC.php";
session_start();

edit($_POST['post_id'],$_POST['text_edit']);

function edit(int $id,string $text){
    $query = DBC::getConnection()->query("update blogs set text = '" . $text . "'  where (ID ='" . $id . "');");
}

header('Location: threads_page.php');
exit();