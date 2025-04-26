       // Dados dos produtos (pode ser substituído por uma chamada API)
       const products = [
        {
            id: 1,
            name: "Hambúrguer Clássico",
            description: "Pão, hambúrguer 180g, queijo, alface e tomate",
            price: 22.90,
            category: "lanches",
            images: [
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
                "https://images.unsplash.com/photo-1553979459-d2229ba7433b",
                "https://images.unsplash.com/photo-1596662951482-0c4fbd4b7a6b"
            ]
        },
        {
            id: 2,
            name: "Refrigerante Lata",
            description: "Lata 350ml - Coca-Cola, Guaraná ou Fanta",
            price: 6.50,
            category: "bebidas",
            images: [
                "https://images.unsplash.com/photo-1554866585-cd94860890b7",
                "https://images.unsplash.com/photo-1561758033-d89a9ad46330"
            ]
        },
        {
            id: 3,
            name: "Sorvete de Chocolate",
            description: "2 bolas de sorvete de chocolate com calda",
            price: 12.00,
            category: "sobremesas",
            images: [
                "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f",
                "https://images.unsplash.com/photo-1517093727349-e0d702e3b4a2"
            ]
        },
        {
            id: 4,
            name: "Combo Família",
            description: "4 hambúrgueres, 4 refrigerantes e batata frita",
            price: 89.90,
            category: "combos",
            images: [
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            ]
        },
        {
            id: 5,
            name: "Batata Frita",
            description: "Porção de batata frita crocante com cheddar",
            price: 15.00,
            category: "lanches",
            images: [
                "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5",
                "https://images.unsplash.com/photo-1576107232684-1279f390859f"
            ]
        },
        {
            id: 6,
            name: "Suco Natural",
            description: "Copo 500ml - Laranja, Maracujá ou Abacaxi",
            price: 8.00,
            category: "bebidas",
            images: [
                "https://images.unsplash.com/photo-1603569283847-aa295f0d016a",
                "https://images.unsplash.com/photo-1603569283847-aa295f0d016a"
            ]
        }
    ];
    
    // Variáveis globais
    let cart = [];
    let isLoginForm = true;
    let currentUser = null;
    
    // DOM Elements
    const productsContainer = document.getElementById('products-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryFeeElement = document.getElementById('delivery-fee');
    const totalElement = document.getElementById('total');
    const cartCountElement = document.getElementById('cart-count');
    const cartToggle = document.getElementById('cart-toggle');
    const cartElement = document.getElementById('cart');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const authContainer = document.getElementById('auth-container');
    const authTitle = document.getElementById('auth-title');
    const authSwitch = document.getElementById('auth-switch');
    const authForm = document.getElementById('auth-form');
    const nameGroup = document.getElementById('name-group');
    const addressGroup = document.getElementById('address-group');
    const authBtn = document.getElementById('auth-btn');
    
    // Inicialização
    document.addEventListener('DOMContentLoaded', () => {
        renderProducts(products);
        setupEventListeners();
        
        // Verificar se usuário está logado
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        } else {
            authContainer.classList.add('active');
        }
    });
    
    // Configurar event listeners
    function setupEventListeners() {
        // Carrinho
        cartToggle.addEventListener('click', toggleCart);
        closeCartBtn.addEventListener('click', toggleCart);
        checkoutBtn.addEventListener('click', checkout);
        
        // Categorias
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => filterProducts(button.dataset.category));
        });
        
        // Login/Cadastro
        authSwitch.addEventListener('click', toggleAuthForm);
        authForm.addEventListener('submit', handleAuth);
    }
    
    // Renderizar produtos
    function renderProducts(productsToRender) {
        productsContainer.innerHTML = '';
        
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category;
            
                        productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                    ${product.images[1] ? `<img src="${product.images[1]}" alt="${product.name}" class="product-image-secondary">` : ''}
                    ${product.images[2] ? `<img src="${product.images[2]}" alt="${product.name}" class="product-image-tertiary">` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Adicionar</button>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
            
            // Adicionar evento ao botão
            productCard.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product.id));
        });
    }
    
    // Filtrar produtos por categoria
    function filterProducts(category) {
        // Atualizar botões ativos
        categoryButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.category === category) {
                button.classList.add('active');
            }
        });
        
        if (category === 'all') {
            renderProducts(products);
        } else {
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts);
        }
    }
    
    // Adicionar ao carrinho
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: 1
            });
        }
        
        updateCart();
        showCartNotification();
    }
    
    // Atualizar carrinho
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio</p>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                        </div>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Adicionar eventos aos novos elementos
            document.querySelectorAll('.minus').forEach(btn => {
                btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, -1));
            });
            
            document.querySelectorAll('.plus').forEach(btn => {
                btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 1));
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const newQuantity = parseInt(e.target.value);
                    if (newQuantity > 0) {
                        updateQuantity(e.target.dataset.id, 0, newQuantity);
                    }
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => removeItem(e.target.dataset.id || e.target.parentElement.dataset.id));
            });
        }
        
        // Atualizar totais
        updateTotals();
    }
    
    // Atualizar quantidade
    function updateQuantity(productId, change, newQuantity = null) {
        const item = cart.find(item => item.id === parseInt(productId));
        
        if (item) {
            if (newQuantity !== null) {
                item.quantity = newQuantity;
            } else {
                item.quantity += change;
            }
            
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== item.id);
            }
            
            updateCart();
        }
    }
    
    // Remover item
    function removeItem(productId) {
        cart = cart.filter(item => item.id !== parseInt(productId));
        updateCart();
    }
    
    // Atualizar totais
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = document.getElementById('delivery').checked ? 5.00 : 0.00;
        const total = subtotal + deliveryFee;
        
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        deliveryFeeElement.textContent = `R$ ${deliveryFee.toFixed(2)}`;
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
        
        // Atualizar contador
        const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
        cartCountElement.textContent = itemCount;
    }
    
    // Alternar carrinho
    function toggleCart() {
        cartElement.classList.toggle('active');
    }
    
    // Mostrar notificação do carrinho
    function showCartNotification() {
        cartToggle.classList.add('pulse');
        setTimeout(() => {
            cartToggle.classList.remove('pulse');
        }, 500);
    }

    // Adicione ao seu script existente:

// Mostrar/ocultar detalhes do PIX
document.getElementById('pix').addEventListener('change', function() {
    document.getElementById('pix-details').style.display = this.checked ? 'block' : 'none';
});

// Copiar chave PIX
document.getElementById('copy-pix').addEventListener('click', function() {
    const pixKey = "(11) 98765-4321";
    navigator.clipboard.writeText(pixKey).then(() => {
        alert("Chave PIX copiada: " + pixKey);
    });
});

// Atualizar mensagem do WhatsApp com a forma de pagamento
function checkout() {
    // ... (código existente do checkout)
    

    
    // ... (restante do código do checkout)
}
    
    // Finalizar pedido
    function checkout() {
        if (!currentUser) {
            authContainer.classList.add('active');
            return;
        }
        
        const isDelivery = document.getElementById('delivery').checked;
        const deliveryFee = isDelivery ? 5.00 : 0.00;
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + deliveryFee;
        
        // Construir mensagem do WhatsApp
        let message = `Olá, gostaria de fazer um pedido!\n\n`;
        message += `*Cliente:* ${currentUser.name}\n`;
        message += `*Endereço:* ${isDelivery ? currentUser.address : 'Retirada no local'}\n\n`;
        message += `*Pedido:*\n`;
        
        cart.forEach(item => {
            message += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        message += `\n*Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
        if (isDelivery) {
            message += `*Taxa de entrega:* R$ ${deliveryFee.toFixed(2)}\n`;
        }
        message += `*Total:* R$ ${total.toFixed(2)}\n\n`;
        message += `Forma de recebimento: ${isDelivery ? 'Delivery' : 'Retirada no local'}`;
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        let paymentText = "";
        
        switch(paymentMethod) {
            case "pix":
                paymentText = "*Pagamento via PIX* ";
                break;
            case "card":
                paymentText = "*Pagamento no Cartão (na entrega)*";
                break;
            case "cash":
                paymentText = "*Pagamento em Dinheiro (na entrega)*";
                break;
        }
        
        // Adiciona ao texto do WhatsApp
        message += `\n*Forma de Pagamento:* ${paymentText}`;

        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Abrir WhatsApp (substitua pelo número da empresa)
        window.open(`https://wa.me/5532999182852?text=${encodedMessage}`, '_blank');
        
        // Limpar carrinho
        cart = [];
        updateCart();
        toggleCart();
    }
    
    // Alternar entre login e cadastro
    function toggleAuthForm() {
        isLoginForm = !isLoginForm;
        
        if (isLoginForm) {
            authTitle.textContent = 'Login';
            authSwitch.textContent = 'Não tem uma conta? Cadastre-se';
            authBtn.textContent = 'Entrar';
            nameGroup.style.display = 'none';
            addressGroup.style.display = 'none';
        } else {
            authTitle.textContent = 'Cadastro';
            authSwitch.textContent = 'Já tem uma conta? Faça login';
            authBtn.textContent = 'Cadastrar';
            nameGroup.style.display = 'block';
            addressGroup.style.display = 'block';
        }
    }
    
    // Manipular autenticação
    function handleAuth(e) {
        e.preventDefault();
        
        const user = document.getElementById('user').value;
        const password = document.getElementById('password').value;
        
        if (isLoginForm) {
            // Simular login (em um sistema real, seria uma chamada API)
            currentUser = {
                user,
                name: 'Usuário Teste',
                password,
                address: 'Rua Exemplo, 123'
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            authContainer.classList.remove('active');
        } else {
            // Simular cadastro
            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            
            currentUser = {
                user,
                password,
                name,
                address
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            authContainer.classList.remove('active');
            toggleAuthForm(); // Voltar para o formulário de login
        }
    }