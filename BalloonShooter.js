document.addEventListener("DOMContentLoaded", function () {

    // Constants
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const balloonImage = new Image();
    const balloons = [];
    balloonImage.src = "red-balloon.png";

    // Variables
    let score = 0;
    let isGameOver = false;
    let isGameStarted = false;

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Draw Crosshair
    const crosshair = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 30,
        height: 30,
        draw() {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            // Draw X shape
            ctx.moveTo(this.x - this.width / 2, this.y - this.height / 2);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
            ctx.moveTo(this.x + this.width / 2, this.y - this.height / 2);
            ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2);
            ctx.stroke();
        }
    };

    // Balloon class
    class Balloon {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.radius = 20;
            this.speed = Math.random() * 2 + 1;
            const colors = ['red', 'green', 'blue'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.wobble = Math.random() * Math.PI * 2;
        }

        update() {
            this.y -= this.speed;
            this.x += Math.sin(this.wobble) * 2;
            this.y -= this.speed;
            this.wobble += 0.1;

            if (this.wobble > Math.PI * 2) {
                this.wobble -= Math.PI * 2;
            }
        }

        draw() {
            if (this.color === 'red') {
                balloonImage.src = "Images/red-balloon.png";
            } else if (this.color === 'green') {
                balloonImage.src = "Images/green-balloon.png";
            } else if (this.color === 'blue') {
                balloonImage.src = "Images/blue-balloon.png";
            }

            ctx.drawImage(
                balloonImage,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 3
            );
        }
    }

    // Mouse Movement
    canvas.addEventListener("mousemove", function (event) {
        crosshair.x = event.clientX - canvas.getBoundingClientRect().left;
        crosshair.y = event.clientY - canvas.getBoundingClientRect().top;
    });

    // Handle mouse click event
    canvas.addEventListener("click", function () {
        if (isGameOver) return;

        // Iterate through balloons and check for clicks
        for (let i = balloons.length - 1; i >= 0; i--) {
            const balloon = balloons[i];
            const dx = balloon.x - crosshair.x;
            const dy = balloon.y - crosshair.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < balloon.radius * 1.8) {
                balloons.splice(i, 1);
                score++;
            }
        }
    });
      // Touch Movement for Mobile Devices
      canvas.addEventListener("touchmove", function (event) {
        event.preventDefault();
        const touch = event.touches[0];
        crosshair.x = touch.clientX - canvas.getBoundingClientRect().left;
        crosshair.y = touch.clientY - canvas.getBoundingClientRect().top;
    });

    // Handle touch events similar to mouse click
    canvas.addEventListener("touchstart", function (event) {
        event.preventDefault(); // Prevent scrolling on touch devices
        const touch = event.touches[0];
        crosshair.x = touch.clientX - canvas.getBoundingClientRect().left;
        crosshair.y = touch.clientY - canvas.getBoundingClientRect().top;
    
        if (isGameOver) return;

        // Iterate through balloons and check for clicks
        for (let i = balloons.length - 1; i >= 0; i--) {
            const balloon = balloons[i];
            const dx = balloon.x - crosshair.x;
            const dy = balloon.y - crosshair.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < balloon.radius * 1.8) {
                balloons.splice(i, 1);
                score++;
            }
        }
    });

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGameOver) {
        balloons.forEach(balloon => {
            balloon.update();
            balloon.draw();

            if (balloon.y < 0) {
                balloons.splice(balloons.indexOf(balloon), 1);
                score--;
            }
        });

        crosshair.draw();

     // Function to draw the score meter
    function drawMeter() {
    const maxWidth = 200;
    const height = 20;
    let currentWidth = 0;
    let fillColor = "green";
    let borderColor = "white";
    let textColor = "white";

    if (score > 0) {
        currentWidth = (score / 10) * maxWidth;
    } else if (score < 0) {
        currentWidth = (-score / 10) * maxWidth;
        fillColor = "red";
    }

    // Draw the white border for the meter
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width / 2 - maxWidth / 2, 50, maxWidth, height);

    // Fill the meter with the score color
    ctx.fillStyle = fillColor;
    ctx.fillRect(canvas.width / 2 - maxWidth / 2, 50, currentWidth, height);

    // Draw score text inside the meter with white color
    ctx.fillStyle = textColor;
    ctx.font = "20px Arial";
    const scoreText = `Score: ${score}`;
    const textWidth = ctx.measureText(scoreText).width;
    const textX = canvas.width / 2 - textWidth / 2;
    const textY = 50 + height / 2 + 7;
    ctx.fillText(scoreText, textX, textY);
}

        // Call drawMeter() function to draw the score meter
        drawMeter();

        if (score >= 10) {
            isGameOver = true;
            drawEndText("Well done!");
        } else if (score <= -10) {
            isGameOver = true;
            drawEndText("Game Over");
        }
    }

    if (!isGameOver && isGameStarted) {
        requestAnimationFrame(gameLoop);
    }
}


    // Create balloons at intervals
    setInterval(() => {
        if (!isGameOver) {
            const balloon = new Balloon();
            balloons.push(balloon);
        }
    }, 1000);

    //Restart game function
    function restartGame() {
        balloons.length = 0;
        score = 0;
        isGameOver = false;
    }

    // Draw start screen function
    function drawStartScreen() {
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, "red");
        gradient.addColorStop(1, "darkred");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        const instruction = "Shoot as many balloons as you can!";
        const instructionWidth = ctx.measureText(instruction).width;
        const xPosition = (canvas.width - instructionWidth) / 2;
        ctx.fillText(instruction, xPosition, canvas.height / 2 - 20);

        const startButtonWidth = 150;
        const startButtonHeight = 40;
        const startButtonX = (canvas.width - startButtonWidth) / 2;
        const startButtonY = canvas.height / 2 + 50;

        ctx.fillStyle = "black";
        ctx.fillRect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        const buttonText = "Start";
        const buttonTextWidth = ctx.measureText(buttonText).width;
        const buttonTextXPosition = startButtonX + (startButtonWidth - buttonTextWidth) / 2;
        const buttonTextYPosition = startButtonY + startButtonHeight / 2 + 7;
        ctx.fillText(buttonText, buttonTextXPosition, buttonTextYPosition);

        canvas.addEventListener("click", function handleStartClick(event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (
                mouseX >= startButtonX &&
                mouseX <= startButtonX + startButtonWidth &&
                mouseY >= startButtonY &&
                mouseY <= startButtonY + startButtonHeight
            ) {
                canvas.removeEventListener("click", handleStartClick);
                isGameStarted = true;
                gameLoop();
            }
        });
    }

    // Draw end game text and restart button function
    function drawEndText(text) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(text, canvas.width / 2 - 80, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Click the Left Mouse Button to Restart", canvas.width / 2 - 160, canvas.height / 2 + 30);

        canvas.addEventListener("click", function handleRestartClick() {
            restartGame();
            canvas.removeEventListener("click", handleRestartClick);
            gameLoop();
        });
    }

    // Initial draw of the start screen
    drawStartScreen();
});
