<?php
include 'db_connect.php'; // ເຊື່ອມຕໍ່ຖານຂໍ້ມູນທີ່ເຮົາສ້າງໄວ້

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $email = $_POST['email'];
    $pass = password_hash($_POST['password'], PASSWORD_DEFAULT); // ເຂົ້າລະຫັດຜ່ານ

    // ສົ່ງຂໍ້ມູນເຂົ້າຕາຕະລາງ users
    $sql = "INSERT INTO users (username, email, password) VALUES ('$user', '$email', '$pass')";

    if ($conn->query($sql) === TRUE) {
        echo "ລົງທະບຽນສຳເລັດ! <a href='login.html'>ໄປໜ້າລັອກອິນ</a>";
    } else {
        echo "ເກີດຂໍ້ຜິດພາດ: " . $conn->error;
    }
}
$conn->close();
?>