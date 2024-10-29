<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</head>
<body>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.php">Home</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="logout.php">Log out</a>
              </li>
              <li class="nav-item">
              <a class="nav-link" href="#">Threads</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
    <form action="threads.php" method="post">
      <textarea name="text" rows="3" cols="50"></textarea><br>
      <input type="submit" value="Přidat příspěvek">
    </form>
    <br>
    <br>
<?php
session_start();
require_once "./classes/DBC.php";

// Dotaz pro získání všech příspěvků
$query = DBC::getConnection()->query("call viewblogs('" . $_SESSION['username'] . "')");
$threads = $query->fetchAll();

// Vypsání příspěvků
if($_SESSION['admin'] =! 1){
foreach ($threads as $post) {
    echo '<div>';
    echo '<p>' . $post['text'] . '</p>';
    echo '<p>Author: ' . $post['username'] . '</p>';
    echo '<p>Date: ' . $post['date'] . '</p>';
    if($_SESSION['username'] == $post['username']){
        echo '<form action="threads_edit.php" method="post">';
        echo '<input type="text" name="text_edit">';
        echo '<input type="hidden" name="post_id" value="' . $post['ID'] . '">';
        echo '<input type="submit" value="Edit">';
        echo '</form>';
        echo '<form action="threads_access.php" method="post">';
        echo '<input type="text" name="user_add">';
        echo '<input type="hidden" name="post_id" value="' . $post['ID'] . '">';
        echo '<input type="submit" value="Add_User">';
        echo '</form>';
        echo '<form action="threads_delete.php" method="post">';
        echo '<input type="hidden" name="post_id" value="' . $post['ID'] . '">';
        echo '<input type="submit" value="Delete">';
        echo '</form>';
      }
    echo '</div>';
    echo '<br>';
}
}else{
    foreach ($threads as $post) {
    echo '<div>';
    echo '<p>' . $post['text'] . '</p>';
    echo '<p>Author: ' . $post['username'] . '</p>';
    echo '<p>Date: ' . $post['date'] . '</p>';
    echo '<form action="threads_edit.php" method="post">';
    echo '<input type="text" name="text_edit">';
    echo '<input type="hidden" name="post_id" value="' . $post['ID'] . '">';
    echo '<input type="submit" value="Edit">';
    echo '</form>';
    echo '<form action="threads_access.php" method="post">';
    echo '<input type="text" name="user_add">';
    echo '<input type="hidden" name="post_id" value="' . $post['ID'] . '">';
    echo '<input type="submit" value="Add_User">';
    echo '</form>';
    echo '<form action="threads_delete.php" method="post">';
    echo '<input type="hidden" name="post_id" value="' . $post['ID'] . '">';
    echo '<input type="submit" value="Delete">';
    echo '</form>';
    echo '</div>';
    echo '<br>';
  }
}
?>

</body>
</html>