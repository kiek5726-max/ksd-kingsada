<?php
$servername = "localhost";
$username = "root"; // ໂດຍທົ່ວໄປແມ່ນ root
$password = "";     // ປົກກະຕິຖ້າບໍ່ໄດ້ຕັ້ງຈະຫວ່າງໄວ້
$dbname = "ksd_db"; // ຊື່ຖານຂໍ້ມູນທີ່ພວກນ້ອງສ້າງໃນ phpMyAdmin

// ສ້າງການເຊື່ອມຕໍ່
$conn = new mysqli($servername, $username, $password, $dbname);

// ກວດສອບການເຊື່ອມຕໍ່
if ($conn->connect_error) {
    die("ເຊື່ອມຕໍ່ຖານຂໍ້ມູນລົ້ມເຫຼວ: " . $conn->connect_error);
}
// ຖ້າເຊື່ອມຕໍ່ໄດ້ ບໍ່ຕ້ອງເຮັດຫຍັງ ຫຼື ຈະ echo "ເຊື່ອມຕໍ່ສຳເລັດ" ກໍໄດ້
?>