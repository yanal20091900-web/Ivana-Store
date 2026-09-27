// ضع رقم الواتساب الخاص بك هنا (مع رمز الدولة بدون + أو أصفار في البداية)
const STORE_PHONE_NUMBER = "970590000000"; 

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();
});

// عرض المنتجات
function renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="desc">${product.description}</p>
                <div class="price-row">
                    <span class="price">${product.price} شيكل</span>
                    <button onclick="addToCart(${product.id})" class="btn-add">أضف للسلة</button>
                </div>
            </div>
        </div>
    `).join('');
}

// إضافة منتج للسلة
function addToCart(productId) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity++;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

// تحديث الواجهة للسلة
function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    if (cartCount) cartCount.innerText = totalQty;
    if (cartTotal) cartTotal.innerText = totalPrice + " شيكل";

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `<p class="empty-msg">السلة فارغة حالياً</p>`;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.price} × ${item.quantity} = ${item.price * item.quantity} شيكل</p>
                    </div>
                    <div class="qty-controls">
                        <button onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function changeQty(id, change) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(p => p.id !== id);
        }
    }
    updateCartUI();
}

// إرسال الطلب إلى الواتساب
function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("السلة فارغة! يرجى اختيار منتجات أولاً.");
        return;
    }

    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const address = document.getElementById("customer-address").value;
    const notes = document.getElementById("customer-notes").value || "لا يوجد";

    let itemsList = cart.map(item => `• ${item.name} (العدد: ${item.quantity}) - ${item.price * item.quantity} شيكل`).join('%0A');
    let totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    // صياغة الرسالة
    let message = `*طلب جديد من IVANA STORE*%0A%0A` +
        `*اسم الزبون:* ${name}%0A` +
        `*رقم الهاتف:* ${phone}%0A` +
        `*العنوان / الموقع:* ${address}%0A` +
        `*ملاحظات:* ${notes}%0A%0A` +
        `*الطلبات:*%0A${itemsList}%0A%0A` +
        `*المجموع الكلي:* ${totalPrice} شيكل`;

    // رابط فتح الواتساب
    let whatsappUrl = `https://wa.me/${STORE_PHONE_NUMBER}?text=${message}`;

    // فتح تطبيق الواتساب ببيانات الطلب الجاهزة
    window.open(whatsappUrl, '_blank');
}