<?php
require_once "./classes/DBC.php";
session_start();

addaccess($_POST['post_id'],$_POST['user_add']);

function addaccess(int $id,string $user){
    $query = DBC::getConnection()->query("call addaccess('" . $id . "','" . $user . "');");
}

header('Location: threads_page.php');
exit();