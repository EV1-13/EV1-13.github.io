document.addEventListener('DOMContentLoaded', () => {
    const guy = document.getElementById('lilguy');
    const gameContainer = document.getElementById('gameContainer');
    const resetNum = document.getElementById('reset');
    const enterNum = document.getElementById('enter');

    document.getElementById('phoneNumber').textContent = "Phone Number: ";

    const phoneNums = [
        document.getElementById('num0'),
        document.getElementById('num1'),
        document.getElementById('num2'),
        document.getElementById('num3'),
        document.getElementById('num4'),
        document.getElementById('num5'),
        document.getElementById('num6'),
        document.getElementById('num7'),
        document.getElementById('num8'),
        document.getElementById('num9'),
    ];

    const platforms = [
        document.getElementById('plat0'),
        document.getElementById('plat1'),
        document.getElementById('plat2'),
        document.getElementById('plat3'),
        document.getElementById('plat4'),
        document.getElementById('plat5'),
        document.getElementById('plat6'),
        document.getElementById('plat7'),
        document.getElementById('plat8'),
        document.getElementById('plat9'),
        document.getElementById('platReset'),
    ];

    function randomizeNumbers() {
        const numbers = [...Array(10).keys()].sort(() => Math.random() - 0.5);
        phoneNums.forEach((num, index) => {
            if (num) {
                num.querySelector('p').textContent = numbers[index];
                num.dataset.value = numbers[index];
            }
        });
    }

    randomizeNumbers();

    const numberDisplays = phoneNums.map(num => num.querySelector('p'));

    let lastDirection = 'right'; 
    let isGifPlaying = false;
    let isMoving = false;
    let guyPosition = 4;
    let guyBottom = 4;
    const gravity = 0.25;
    const jumpSpeed = 4;
    let phoneNumber = "";

    let velocityY = 0;
    let isOnPlatform = false;
    let currentJumpCollected = new Set();

    guy.style.left = `${guyPosition}vw`;
    guy.style.bottom = `${guyBottom}vh`;
    stopGif();

    function updatePhysics() {
        checkCollision();
        
        if (!isOnPlatform) {
            velocityY -= gravity;
            guyBottom += velocityY;
            
            if (guyBottom <= 4) {
                guyBottom = 4;
                velocityY = 0;
                isOnPlatform = true;
                currentJumpCollected.clear();
            }
            
            guy.style.bottom = `${guyBottom}vh`;
        }
        
        requestAnimationFrame(updatePhysics);
    }

    updatePhysics();

    document.addEventListener('keydown', (event) => {
        const containerRect = gameContainer.getBoundingClientRect();
        const guyRect = guy.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const guyWidth = guyRect.width;

        if (event.key === 'ArrowRight') {
            isMoving = true;
            lastDirection = 'right';
            guyPosition = Math.min(guyPosition + 2, containerWidth - guyWidth);
            guy.style.left = `${guyPosition}vw`;
            updateDirection();
            playGif();
        } else if (event.key === 'ArrowLeft') {
            isMoving = true;
            lastDirection = 'left';
            guyPosition = Math.max(guyPosition - 2, 0);
            guy.style.left = `${guyPosition}vw`;
            updateDirection();
            playGif();
        } else if (event.key === ' ' && (isOnPlatform || guyBottom <= 4)) {
            currentJumpCollected.clear(); 
            jump();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            isMoving = false;
            stopGif();
            updateDirection();
        }
    });

    function updateDirection() {
        guy.style.transform = lastDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
    }

    function playGif() {
        if (!isGifPlaying) {
            guy.style.backgroundImage = 'url(assets/mario.gif)';
            isGifPlaying = true;
        }
    }

    function stopGif() {
        if (isGifPlaying) {
            guy.style.backgroundImage = 'url(assets/mario_still.gif)';
            isGifPlaying = false;
        }
    }

    function jump() {
        if (isOnPlatform || guyBottom <= 4) {
            isOnPlatform = false;
            velocityY = jumpSpeed;
        }
    }

    function checkCollision() {
        const guyRect = guy.getBoundingClientRect();
        
        isOnPlatform = false;

        platforms.forEach(platform => {
            if (!platform) return;
            const platRect = platform.getBoundingClientRect();
            
            if (
                guyRect.bottom >= platRect.top &&
                guyRect.bottom <= platRect.top + 20 &&
                guyRect.right > platRect.left &&
                guyRect.left < platRect.right &&
                velocityY <= 0
            ) {
                isOnPlatform = true;
                const platformTopVH = (platRect.top / window.innerHeight) * 100;
                guyRect.bottom = platformTopVH + 0.5;
                guy.style.bottom = `${guyBottom}vh`;
                velocityY = 0;
            }
        });

        phoneNums.forEach((phoneNum, index) => {
            if (!phoneNum || currentJumpCollected.has(index) || phoneNumber.length >= 10) return;
            const numRect = phoneNum.getBoundingClientRect();

            if (
                guyRect.left < numRect.right &&
                guyRect.right > numRect.left &&
                guyRect.top < numRect.bottom &&
                guyRect.bottom > numRect.top &&
                !currentJumpCollected.has(index)
            ) {
                const collectedNum = phoneNum.dataset.value;
                phoneNumber += collectedNum;
                currentJumpCollected.add(index);
                document.getElementById('phoneNumber').textContent = "Phone Number: " + phoneNumber;
            }
        });

        const resetRect = resetNum.getBoundingClientRect();
        if (
            guyRect.left < resetRect.right &&
            guyRect.right > resetRect.left &&
            guyRect.top < resetRect.bottom &&
            guyRect.bottom > resetRect.top
           ) {
            document.getElementById('phoneNumber').textContent = "Phone Number: ";
            phoneNumber = "";
            randomizeNumbers();
        }

    const enterRect = enterNum.getBoundingClientRect();
        if (
            guyRect.left < enterRect.right &&
            guyRect.right > enterRect.left &&
            guyRect.top < enterRect.bottom &&
            guyRect.bottom > enterRect.top &&
            phoneNumber.length == 10
           ) {
            document.getElementById('phoneNumber').textContent = "Your Phone Number Is: " + formatPhoneNumber(phoneNumber);
        }
    }

    function formatPhoneNumber(rawNumber) {
        const cleaned = rawNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}` : rawNumber;
    }
});
