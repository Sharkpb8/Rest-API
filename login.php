<?php
require_once "./classes/User.php";
require_once "./classes/DBC.php";
session_start();
if(empty($_POST["username"]) || empty($_POST["password"])){
    header('Location: index.php');
    exit();
}

verifyUser($_POST["username"], $_POST["password"]);

function verifyUser(string $username, string $password): void
{
    $connection = DBC::getConnection();
    $statement = $connection->prepare("SELECT id, username, password FROM uzivatel WHERE username = :username LIMIT 1");
    $statement->execute([":username" => $username]);
    $result = $statement->fetch(PDO::FETCH_ASSOC);
    if ($result && password_verify($password, $result["password"])) {
        $_SESSION["user_id"] = $result["id"];
        $_SESSION["user_name"] = $result["username"];
        header("Location: /");
    } else {
        header("Location: /login");
    }
}


$username = $_POST["username"];
$_SESSION['username'] = $username;
$_SESSION["loggedin"] = true;
header('Location: data.php');
?>