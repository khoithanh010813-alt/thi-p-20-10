/**
 * Script for 20/10 Website - Special Vietnamese Women's Day Experience
 * Features: Personalized name handling, Web Audio chime synthesis, 
 * interactive envelope, gift unboxing, gacha fortunes, confetti, and share links.
 */

// State Management
const state = {
    recipientName: 'Bạn Xinh Đẹp',
    isMusicPlaying: false,
    audioCtx: null,
    musicInterval: null,
    isEnvelopeOpen: false,
    isGiftOpened: false,
};

// Gen Z Greetings for Typing Effect
const greetingTemplates = [
    "Chúc {{name}} 20/10 xinh đẹp xuất sắc, visual đỉnh chóp không ai sánh bằng! ✨",
    "Chúc {{name}} ăn ngon ngủ kỹ, ví luôn dày cộp, deadline tự giác tan biến! 💸",
    "Chúc {{name}} luôn được yêu chiều như công chúa, nụ cười tỏa nắng mỗi ngày! 👑",
    "Chúc {{name}} 365 ngày trọn vẹn niềm vui, vạn sự hanh thông, triệu điều may mắn! 🌸",
    "Gửi ngàn đóa hoa và tình cảm ấm áp nhất đến {{name}} trong ngày đặc biệt hôm nay! 💐"
];

// Fortunes for Gacha Cards
const fortunes = {
    'sắc đẹp': [
        "Visual thăng hạng vượt bậc, da căng bóng không tì vết, ai nhìn cũng mê! 💅",
        "Trẻ trung bất chấp thời gian, outfit nào mặc lên cũng như người mẫu! 👗",
        "Xinh đẹp từ trong ra ngoài, thần thái ngút ngàn chuẩn minh tinh! ✨"
    ],
    'tài lộc': [
        "Tài khoản ting ting liên hồi, săn sale không cần nhìn giá! 💳",
        "Công việc thăng tiến vù vù, sếp khen đồng nghiệp quý, thưởng ngập tràn! 💰",
        "Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin! 💎"
    ],
    'tình duyên': [
        "Người yêu cưng chiều hết nấc, nếu còn độc thân thì sắp gặp đúng chân ái điểm 10! 💖",
        "Được cả thế giới bao bọc, đi đến đâu cũng có người sẵn sàng giúp đỡ! 🌹",
        "Ngập tràn quà tặng và sự ngọt ngào, trái tim lúc nào cũng nở hoa! 🥰"
    ],
    'tinh thần': [
        "Năng lượng tích cực 100%, không muộn phiền, không drama, chỉ có vui vẻ! 🥳",
        "Tâm an vạn sự an, mỗi buổi sáng thức dậy đều tràn đầy niềm hạnh phúc! ☀️",
        "Ăn thả ga mà dáng vẫn chuẩn eo thon, tinh thần sảng khoái suốt 365 ngày! 🥐"
    ]
};

// Mystery Rewards for Gift Box
const giftRewards = [
    {
        title: "VOUCHER: ĂN KHÔNG LO BÉO 🍰",
        desc: "Đặc quyền thần thánh: Ăn trà sữa full topping, đồ nướng, bánh ngọt thả ga mà cân nặng vẫn giữ số đo hoàn mỹ!",
        code: "EAT-ALL-STAY-SLIM-2010"
    },
    {
        title: "VOUCHER: VÍ DÀY TIỀN RỦNG RỈNH 💸",
        desc: "Kích hoạt vận may tài chính: Cứ shopping là được hoàn tiền, tài khoản chỉ có số dư tăng chứ không giảm!",
        code: "MONEY-MAGNET-2010"
    },
    {
        title: "VOUCHER: ĐẶC QUYỀN CÔNG CHÚA 👑",
        desc: "Mọi điều bạn muốn đều được lắng nghe và chiều chuộng. 365 ngày đều là ngày hạnh phúc của riêng bạn!",
        code: "PRINCESS-TREAT-2010"
    },
    {
        title: "VOUCHER: VẠN DẶM BÌNH AN & HẠNH PHÚC 🌈",
        desc: "Tránh xa mọi áp lực công việc, chỉ đón nhận những điều ngọt ngào, bình yên và những chuyến du lịch tuyệt vời!",
        code: "SUPER-HAPPY-2010"
    }
];

// Compliments List
const compliments = [
    "Hôm nay bạn tỏa sáng rực rỡ hơn cả ánh mặt trời đấy! ✨",
    "Nụ cười của bạn có thể làm bừng sáng cả căn phòng! 😊",
    "Bạn thông minh, duyên dáng và cực kỳ cuốn hút! 💫",
    "Thế giới này trở nên dịu dàng hơn rất nhiều vì có bạn! 🌸",
    "Bạn là phiên bản độc nhất vô nhị và siêu tuyệt vời! 💖"
];

/* ==================== 1. INITIALIZATION & NAME HANDLING ==================== */
document.addEventListener('DOMContentLoaded', () => {
    initPetals();
    checkUrlParams();
    setupEventListeners();
    startTypingEffect();
});

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');

    if (nameParam && nameParam.trim() !== '') {
        applyRecipientName(nameParam.trim());
        hideNameModal();
    } else {
        // Show modal for user to enter name
        showNameModal();
    }
}

function showNameModal() {
    const modal = document.getElementById('name-modal');
    modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    document.getElementById('input-recipient-name').focus();
}

function hideNameModal() {
    const modal = document.getElementById('name-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 500);
}

function applyRecipientName(name) {
    state.recipientName = name;
    
    // Update DOM elements
    const displayHeroName = document.getElementById('display-recipient-name');
    if (displayHeroName) displayHeroName.textContent = name;
    
    const letterToName = document.getElementById('letter-to-name');
    if (letterToName) letterToName.textContent = name;

    const rewardName = document.getElementById('reward-recipient-name');
    if (rewardName) rewardName.textContent = name;

    // Trigger sweet welcome confetti
    fireBurstConfetti();
    playChimeSound(523.25); // C5 note
}

/* ==================== 2. WEB AUDIO API SYNTHESIZER (100% RELIABLE SOUND) ==================== */
function getAudioContext() {
    if (!state.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        state.audioCtx = new AudioContext();
    }
    if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
    }
    return state.audioCtx;
}

// Gentle pleasant chime notes
function playChimeSound(freq = 440, type = 'sine', duration = 0.5) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.warn('Audio play restricted or unavailable', e);
    }
}

// Play pleasant music chords in background
function toggleBackgroundMusic() {
    const btn = document.getElementById('btn-music-toggle');
    const icon = document.getElementById('music-icon');
    const statusText = document.getElementById('music-status-text');

    if (state.isMusicPlaying) {
        // Stop music
        state.isMusicPlaying = false;
        clearInterval(state.musicInterval);
        btn.classList.add('music-paused');
        icon.className = 'ph-bold ph-speaker-slash text-slate-400 text-lg';
        statusText.textContent = 'Đã Tắt Nhạc';
        showToast('🔇 Đã tắt giai điệu');
    } else {
        // Start synthesized ambient lofi melody
        state.isMusicPlaying = true;
        btn.classList.remove('music-paused');
        icon.className = 'ph-bold ph-speaker-high text-rose-400 text-lg';
        statusText.textContent = 'Đang Phát';
        showToast('🎵 Đang phát giai điệu chúc mừng 20/10!');

        playMelodyLoop();
    }
}

function playMelodyLoop() {
    const melodyNotes = [
        523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
        587.33, 698.46, 880.00, 1046.50, // D5, F5, A5, C6
        493.88, 659.25, 783.99, 987.77,  // B4, E5, G5, B5
        440.00, 523.25, 659.25, 880.00   // A4, C5, E5, A5
    ];
    let noteIdx = 0;

    const playNext = () => {
        if (!state.isMusicPlaying) return;
        const freq = melodyNotes[noteIdx % melodyNotes.length];
        playChimeSound(freq, 'sine', 0.8);
        noteIdx++;
    };

    playNext();
    state.musicInterval = setInterval(playNext, 450);
}

/* ==================== 3. FLOATING PETALS GENERATOR ==================== */
function initPetals() {
    const container = document.getElementById('petals-container');
    if (!container) return;

    const petalCount = 18;
    for (let i = 0; i < petalCount; i++) {
        createPetal(container);
    }

    // Continuously spawn petals
    setInterval(() => {
        if (container.children.length < 25) {
            createPetal(container);
        }
    }, 1500);
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size = Math.random() * 14 + 10;
    const startLeft = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 5;

    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.left = `${startLeft}%`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    container.appendChild(petal);

    // Remove when animation finishes
    setTimeout(() => {
        petal.remove();
    }, (duration + delay) * 1000);
}

/* ==================== 4. TYPING GREETINGS EFFECT ==================== */
function startTypingEffect() {
    const element = document.getElementById('typing-greeting');
    if (!element) return;

    let greetingIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const rawTemplate = greetingTemplates[greetingIndex % greetingTemplates.length];
        const currentText = rawTemplate.replace(/\{\{name\}\}/g, state.recipientName);

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentText.length) {
            speed = 2500; // Pause at end of sentence
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            greetingIndex++;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ==================== 5. ENVELOPE INTERACTION ==================== */
function toggleEnvelope() {
    const envelope = document.getElementById('envelope');
    const tip = document.getElementById('envelope-tip');

    state.isEnvelopeOpen = !state.isEnvelopeOpen;
    envelope.classList.toggle('open', state.isEnvelopeOpen);

    if (state.isEnvelopeOpen) {
        tip.textContent = "💌 Chúc bạn đọc thư vui vẻ! Nhấp lại để gập phong bì";
        playChimeSound(659.25, 'triangle', 0.6); // E5
        setTimeout(() => playChimeSound(880, 'sine', 0.8), 200); // A5
        fireHeartConfetti();
    } else {
        tip.textContent = "👉 Nhấp vào phong bì để mở ra đọc thư 👈";
        playChimeSound(392.00, 'sine', 0.3); // G4
    }
}

/* ==================== 6. GIFT BOX UNBOXING ==================== */
function openGiftBox() {
    const giftBox = document.getElementById('gift-box');
    const rewardCard = document.getElementById('gift-reward-card');
    const rewardTitle = document.getElementById('reward-title');
    const rewardDesc = document.getElementById('reward-desc');

    if (giftBox.classList.contains('opened')) return;

    giftBox.classList.add('opened');
    
    // Pick random reward
    const randomReward = giftRewards[Math.floor(Math.random() * giftRewards.length)];
    rewardTitle.textContent = randomReward.title;
    rewardDesc.textContent = randomReward.desc;

    // Sounds & Big Confetti
    playChimeSound(523.25, 'triangle', 0.2);
    setTimeout(() => playChimeSound(659.25, 'triangle', 0.2), 100);
    setTimeout(() => playChimeSound(783.99, 'triangle', 0.4), 200);
    setTimeout(() => playChimeSound(1046.50, 'sine', 0.8), 300);

    fireCelebrationConfetti();

    setTimeout(() => {
        rewardCard.classList.remove('hidden');
        rewardCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
}

function resetGiftBox() {
    const giftBox = document.getElementById('gift-box');
    const rewardCard = document.getElementById('gift-reward-card');

    giftBox.classList.remove('opened');
    rewardCard.classList.add('hidden');
    playChimeSound(440, 'sine', 0.2);
    showToast('🎁 Đã gói lại hộp quà! Bạn có thể mở lại lần nữa');
}

/* ==================== 7. GACHA FORTUNE CARDS ==================== */
window.revealCard = function(cardElement, category) {
    const contentElement = cardElement.querySelector('.card-content');
    const categoryFortunes = fortunes[category] || fortunes['sắc đẹp'];
    const randomFortune = categoryFortunes[Math.floor(Math.random() * categoryFortunes.length)];

    cardElement.classList.add('flipped');
    contentElement.textContent = randomFortune;
    contentElement.className = "text-xs font-semibold text-rose-200 card-content animate-fade-in mt-1";

    playChimeSound(783.99, 'sine', 0.4);
    fireMiniConfetti(cardElement);
};

/* ==================== 8. CONFETTI ANIMATIONS ==================== */
function fireBurstConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#ffffff']
    });
}

function fireHeartConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        shapes: ['circle'],
        colors: ['#e11d48', '#f43f5e', '#fb7185']
    });
}

function fireCelebrationConfetti() {
    if (typeof confetti !== 'function') return;
    const count = 200;
    const defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

function fireMiniConfetti(element) {
    if (typeof confetti !== 'function') return;
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
        particleCount: 25,
        spread: 40,
        origin: { x, y },
        colors: ['#fb7185', '#fbbf24', '#c084fc']
    });
}

/* ==================== 9. SHARE LINK MODAL ==================== */
function openShareModal() {
    const modal = document.getElementById('share-modal');
    const inputFriendName = document.getElementById('share-friend-name');
    const outputLink = document.getElementById('generated-share-link');
    const successMsg = document.getElementById('copy-success-msg');

    modal.classList.remove('hidden');
    successMsg.classList.add('hidden');
    inputFriendName.value = '';

    // Default link
    const baseUrl = window.location.origin + window.location.pathname;
    outputLink.value = baseUrl;

    inputFriendName.focus();
}

function closeShareModal() {
    document.getElementById('share-modal').classList.add('hidden');
}

function updateGeneratedShareLink() {
    const friendName = document.getElementById('share-friend-name').value.trim();
    const outputLink = document.getElementById('generated-share-link');
    const baseUrl = window.location.origin + window.location.pathname;

    if (friendName) {
        outputLink.value = `${baseUrl}?name=${encodeURIComponent(friendName)}`;
    } else {
        outputLink.value = baseUrl;
    }
}

function copyShareLink() {
    const outputLink = document.getElementById('generated-share-link');
    const successMsg = document.getElementById('copy-success-msg');

    outputLink.select();
    outputLink.setSelectionRange(0, 99999); // Mobile devices

    navigator.clipboard.writeText(outputLink.value).then(() => {
        successMsg.classList.remove('hidden');
        showToast('📋 Đã sao chép liên kết cá nhân hóa!');
        playChimeSound(880, 'sine', 0.2);
    }).catch(() => {
        // Fallback execCommand
        document.execCommand('copy');
        successMsg.classList.remove('hidden');
        showToast('📋 Đã sao chép liên kết!');
    });
}

/* ==================== 10. TOAST NOTIFICATION ==================== */
function showToast(text) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    toastText.textContent = text;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2800);
}

/* ==================== 11. EVENT LISTENERS SETUP ==================== */
function setupEventListeners() {
    // Form Name Submission
    const nameForm = document.getElementById('name-form');
    if (nameForm) {
        nameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputVal = document.getElementById('input-recipient-name').value.trim();
            if (inputVal) {
                applyRecipientName(inputVal);
                hideNameModal();
                showToast(`Chào mừng ${inputVal} đến với ngày hội 20/10! 🌸`);
            }
        });
    }

    // Change Name Button
    const btnChangeName = document.getElementById('btn-change-name');
    if (btnChangeName) {
        btnChangeName.addEventListener('click', () => {
            showNameModal();
        });
    }

    // Music Toggle
    const btnMusic = document.getElementById('btn-music-toggle');
    if (btnMusic) {
        btnMusic.addEventListener('click', toggleBackgroundMusic);
    }

    // Fire Confetti Button
    const btnConfetti = document.getElementById('btn-fire-confetti');
    if (btnConfetti) {
        btnConfetti.addEventListener('click', () => {
            fireCelebrationConfetti();
            playChimeSound(659.25, 'triangle', 0.3);
            showToast('🎆 Bắn tim và pháo hoa rực rỡ chúc mừng bạn!');
        });
    }

    // Quick Compliment Button
    const btnCompliment = document.getElementById('btn-quick-compliment');
    if (btnCompliment) {
        btnCompliment.addEventListener('click', () => {
            const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
            showToast(randomCompliment);
            playChimeSound(783.99, 'sine', 0.25);
            fireBurstConfetti();
        });
    }

    // Envelope Click
    const envelope = document.getElementById('envelope');
    if (envelope) {
        envelope.addEventListener('click', toggleEnvelope);
    }

    // Gift Box Click
    const giftBox = document.getElementById('gift-box');
    if (giftBox) {
        giftBox.addEventListener('click', openGiftBox);
    }

    const btnReopenGift = document.getElementById('btn-reopen-gift');
    if (btnReopenGift) {
        btnReopenGift.addEventListener('click', resetGiftBox);
    }

    // Share Modal
    const btnShareModal = document.getElementById('btn-share-modal');
    if (btnShareModal) {
        btnShareModal.addEventListener('click', openShareModal);
    }

    const btnCloseShare = document.getElementById('btn-close-share');
    if (btnCloseShare) {
        btnCloseShare.addEventListener('click', closeShareModal);
    }

    const shareFriendName = document.getElementById('share-friend-name');
    if (shareFriendName) {
        shareFriendName.addEventListener('input', updateGeneratedShareLink);
    }

    const btnCopyLink = document.getElementById('btn-copy-link');
    if (btnCopyLink) {
        btnCopyLink.addEventListener('click', copyShareLink);
    }

    // Close modals on clicking backdrop
    window.addEventListener('click', (e) => {
        const shareModal = document.getElementById('share-modal');
        if (e.target === shareModal) {
            closeShareModal();
        }
    });
}
