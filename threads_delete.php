<?php
require_once "./classes/DBC.php";
session_start();

delete($_POST['post_id']);

function delete(int $id){
    $query = DBC::getConnection()->query("delete from threads where (threads.id ='" . $id . "');");
}

header('Location: threads_page.php');
exit();