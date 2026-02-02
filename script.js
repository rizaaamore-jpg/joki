// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initGameTabs();
    initGameIcons();
    initServiceButtons();
    initMobileMenu();
    initOrderModal();
    initTypingEffect();
});

// Game Tabs
function initGameTabs() {
    const tabs = document.querySelectorAll('.game-tab');
    const contents = document.querySelectorAll('.game-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const game = tab.dataset.game;
            document.getElementById(`${game}-content`).classList.add('active');
            
            // Update preview
            updateOrderPreview(game);
        });
    });
}

// Game Icons in Hero
function initGameIcons() {
    const icons = document.querySelectorAll('.game-icon');
    const previewGame = document.getElementById('preview-game');
    const previewService = document.getElementById('preview-service');
    const previewPrice = document.getElementById('preview-price');
    const previewTime = document.getElementById('preview-time');
    
    const gameData = {
        ml: {
            name: 'Mobile Legends',
            service: 'Rank Up Mythic',
            price: 'Rp 150.000',
            time: '1-3 Hari'
        },
        ff: {
            name: 'Free Fire',
            service: 'KD Boosting 3.0',
            price: 'Rp 120.000',
            time: '2-4 Hari'
        },
        fish: {
            name: 'Fishing Game',
            service: 'Level Boosting 100',
            price: 'Rp 200.000',
            time: '3-5 Hari'
        }
    };
    
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            // Remove active class from all icons
            icons.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked icon
            icon.classList.add('active');
            
            // Update preview
            const game = icon.dataset.game;
            const data = gameData[game];
            
            previewGame.textContent = data.name;
            previewService.textContent = data.service;
            previewPrice.textContent = data.price;
            previewTime.textContent = data.time;
        });
    });
}

// Service Buttons
function initServiceButtons() {
    const buttons = document.querySelectorAll('.btn-service');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const service = button.dataset.service;
            const modal = document.getElementById('orderModal');
            
            // Set service in form
            document.getElementById('service').value = service;
            
            // Show modal
            modal.style.display = 'flex';
            
            // Add animation
            modal.querySelector('.modal-content').style.animation = 'slideIn 0.3s ease';
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        menuBtn.innerHTML = navLinks.style.display === 'flex' 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Order Modal
function initOrderModal() {
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close-modal');
    const orderForm = document.getElementById('orderForm');
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            game: document.getElementById('game').value,
            service: document.getElementById('service').value,
            currentRank: document.getElementById('currentRank').value,
            targetRank: document.getElementById('targetRank').value,
            email: document.getElementById('email').value,
            whatsapp: document.getElementById('whatsapp').value,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In production, this would be an actual API call
            saveOrder(formData);
            
            // Reset form
            orderForm.reset();
            
            // Hide modal
            modal.style.display = 'none';
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Pesanan Berhasil!',
                text: 'Kami akan menghubungi Anda via WhatsApp untuk konfirmasi pembayaran.',
                confirmButtonColor: '#ff6b35'
            });
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Save Order (Simulate backend)
function saveOrder(orderData) {
    // In production, this would be a fetch() to your backend
    console.log('Order saved:', orderData);
    
    // Save to localStorage for demo
    let orders = JSON.parse(localStorage.getItem('eliteboost_orders') || '[]');
    orderData.id = 'ELB-' + Date.now();
    orders.push(orderData);
    localStorage.setItem('eliteboost_orders', JSON.stringify(orders));
}

// Typing Effect
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    const texts = ['Mythic', 'Heroic', 'Legendary', 'Grandmaster'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}

// Update Order Preview
function updateOrderPreview(game) {
    const gameData = {
        ml: {
            name: 'Mobile Legends',
            service: 'Rank Up Mythic',
            price: 'Rp 150.000',
            time: '1-3 Hari'
        },
        ff: {
            name: 'Free Fire',
            service: 'KD Boosting 3.0',
            price: 'Rp 120.000',
            time: '2-4 Hari'
        },
        fish: {
            name: 'Fishing Game',
            service: 'Level Boosting 100',
            price: 'Rp 200.000',
            time: '3-5 Hari'
        }
    };
    
    const data = gameData[game];
    if (!data) return;
    
    document.getElementById('preview-game').textContent = data.name;
    document.getElementById('preview-service').textContent = data.service;
    document.getElementById('preview-price').textContent = data.price;
    document.getElementById('preview-time').textContent = data.time;
    
    // Update game icons
    document.querySelectorAll('.game-icon').forEach(icon => {
        icon.classList.remove('active');
        if (icon.dataset.game === game) {
            icon.classList.add('active');
        }
    });
}
