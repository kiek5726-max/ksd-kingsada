// ຟັງຊັນສຳລັບໜ້າຫຼັກ (index.html) ເວລາກົດປຸ່ມຊື້ສິນຄ້າ
function addToCart(id, name, price, image) {
    // ດຶງຂໍ້ມູນກະຕ່າເກົ່າມາ (ຖ້າມີ)
    let cart = JSON.parse(localStorage.getItem('ksd_cart')) || [];
    
    // ກວດເບິ່ງວ່າມີສິນຄ້ານີ້ໃນກະຕ່າແລ້ວຫຼືບໍ່
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity) + 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: Number(price),
            image: image,
            quantity: 1
        });
    }
    
    // ເຊຟລົງ LocalStorage
    localStorage.setItem('ksd_cart', JSON.stringify(cart));
    
    // ເຕືອນຂໍ້ຄວາມ
    alert(`🛒 ເພີ່ມ "${name}" ເຂົ້າກະຕ່າຮຽບຮ້ອຍແລ້ວ!`);
}
