document.addEventListener('DOMContentLoaded', () => {
    const guy = document.getElementById('lilguy');
    const gameContainer = document.getElementById('gameContainer');
    const resetNum = document.getElementById('reset');

    document.getElementById('phoneNumber').textContent = "Phone Number: ";

    //the divs for the nums
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
    ]

    function randomizeNumbers() {
        //random numbersss
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

    //animation stuff
    let isMoving = false;
    let lastDirection = 'right'; 
    let isGifPlaying = false;

    let guyPosition = 4; // horizontal pos
    let guyBottom = 4; // vertical pos
    let isJumping = false; // so no flying
    const jumpHeight = 35; // how high u jump
    const gravity = 2; // makes you fall
    const jumpSpeed = 4; // how fast u jump up

    let phoneNumber = ""; // phone number string !!

    // initial pos
    guy.style.left = `${guyPosition}vw`;
    guy.style.bottom = `${guyBottom}vh`;
    stopGif();


    // handles all key presses that do things
    document.addEventListener('keydown', (event) => {

        const key = event.key;

        // getting the widths of guy and container for game bounds
        const containerRect = gameContainer.getBoundingClientRect();
        const guyRect = guy.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const guyWidth = guyRect.width;

        if (key === 'ArrowRight') {

            isMoving = true;
            lastDirection = 'right';

            guyPosition += 2;

            // so you can't go offscreen
            if (guyPosition > containerWidth - guyWidth) {
                guyPosition = containerWidth - guyWidth;
            }

            guy.style.left = `${guyPosition}vw`;

            updateDirection();
            playGif();

        } else if (key === 'ArrowLeft') {

            isMoving = true;
            lastDirection = 'left';

            guyPosition -= 2;
            
            //so you can't go off screen
            if (guyPosition < 0) {
                guyPosition = 0;
            }

            guy.style.left = `${guyPosition}vw`;

            updateDirection();
            playGif();

        } else if (key === ' ') {
            if (!isJumping) {
                jump();
            }
        }
    });

    //stops gif if player isnt moving
    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            isMoving = false;
            stopGif();
            updateDirection();
        }
    });

    function updateDirection() {
        // flip based on last direction
        guy.style.transform = lastDirection === 'left' 
            ? 'scaleX(-1)' 
            : 'scaleX(1)';
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

    // the actual jump action
    function jump() {

        isJumping = true;

        let hasGotThisJump = new Set(); //prevents same num in same jump

        let jumpUp = setInterval(() => {

            if (guyBottom >= jumpHeight) {

                clearInterval(jumpUp);

                // fall
                let fall = setInterval(() => {
                    if (guyBottom <= 4) {

                        clearInterval(fall);
                        guyBottom = 4;
                        guy.style.bottom = `${guyBottom}vh`;
                        isJumping = false;

                    } else {

                        guyBottom -= gravity;
                        guy.style.bottom = `${guyBottom}vh`;
                        checkCollision(hasGotThisJump);

                    }
                }, 4);
            } else {

                guyBottom += jumpSpeed;
                guy.style.bottom = `${guyBottom}vh`;
                checkCollision(hasGotThisJump);

            }
        }, 4);
    }

    function checkCollision(hasGotThisJump) {

        const guyRect = guy.getBoundingClientRect(); //re-get rect
        
        phoneNums.forEach((phoneNum, index) => {

            if (!phoneNum) return;
            const numRect = phoneNum.getBoundingClientRect(); //get rect

            //checks collision
            if (
                guyRect.left < numRect.right &&
                guyRect.right > numRect.left &&
                guyRect.top < numRect.bottom &&
                guyRect.bottom > numRect.top
            ) {

                const collectedNum = phoneNum.dataset.value;

                // puts the number into the string
                if (!hasGotThisJump.has(index) && phoneNumber.length <= 10) {

                    phoneNumber += collectedNum;
                    hasGotThisJump.add(index);
                    document.getElementById('phoneNumber').textContent = "Phone Number: " + phoneNumber;

                    numberDisplays[index].style.visibility = 'visible';

                }
            }
        });

        //resets the phone number
        const resetRect = resetNum.getBoundingClientRect();

        if (
            guyRect.left < resetRect.right &&
            guyRect.right > resetRect.left &&
            guyRect.top < resetRect.bottom &&
            guyRect.bottom > resetRect.top
        ) {
            document.getElementById('phoneNumber').textContent = "Phone Number: ";
            phoneNumber = " ";

            numberDisplays.forEach(p => p.style.visibility = 'hidden');
            randomizeNumbers();
        }
    }

});
