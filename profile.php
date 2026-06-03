<?php
// ເລີ່ມການໃຊ້ງານ Session ເພື່ອກວດສອບວ່າລັອກອິນແລ້ວຫຼືຍັງ
session_start();
include 'db_connect.php';

// ຖ້າຍັງບໍ່ໄດ້ລັອກອິນ, ໃຫ້ດີດກັບໄປໜ້າລັອກອິນ
if (!isset($_SESSION['username'])) {
    header("Location: login.html");
    exit();
}

$current_user = $_SESSION['username'];
// ດຶງຂໍ້ມູນຜູ້ໃຊ້ຈາກຖານຂໍ້ມູນ
$sql = "SELECT * FROM users WHERE username = '$current_user'";
$result = $conn->query($sql);
$user_data = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="lo">
<head>
    <meta charset="UTF-8">
    <title>ໂປຣໄຟລ໌ຂອງຂ້ອຍ</title>
    <style>
        body { font-family: sans-serif; padding: 50px; background: #f4f7f6; }
        .card { background: white; padding: 20px; border-radius: 10px; max-width: 400px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>ໂປຣໄຟລ໌ຂອງຂ້ອຍ</h1>
        <p><strong>ຊື່ຜູ້ໃຊ້:</strong> <?php echo $user_data['username']; ?></p>
        <p><strong>ອີເມວ:</strong> <?php echo $user_data['email']; ?></p>
        
        <br>
        <a href="logout.php">ອອກຈາກລະບົບ</a>
    </div>
</body>
</html>