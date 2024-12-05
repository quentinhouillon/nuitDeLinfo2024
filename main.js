function snakeCaptcha() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const box = 20;
    const main = document.getElementsByTagName("main")[0];
    document.getElementsByClassName("modal")[0].style.display = "block";
    
    const closeButton = document.getElementById("close");
    closeButton.addEventListener('click', () => {
        document.getElementById("myModal").style.display = "none";
        main.style.display = "block"
    });

    let snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    let food = {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box
    };
    let score = 0;
    let direction;

    document.addEventListener('keydown', get_direction);

    function get_direction(event) {
        if (event.keyCode == 37 && direction != 'RIGHT') {
            direction = 'LEFT';
        } else if (event.keyCode == 38 && direction != 'DOWN') {
            direction = 'UP';
        } else if (event.keyCode == 39 && direction != 'LEFT') {
            direction = 'RIGHT';
        } else if (event.keyCode == 40 && direction != 'UP') {
            direction = 'DOWN';
        }
    }

    function collision(newHead, snake) {
        for (let i = 0; i < snake.length; i++) {
            if (newHead.x == snake[i].x && newHead.y == snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? 'green' : 'white';
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = 'red';
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = 'red';
        let img = new Image();
        img.src = 'assets/poisson.png';
        ctx.drawImage(img, food.x, food.y, box * 1.5, box * 1.5);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction == 'LEFT') snakeX -= box;
        if (direction == 'UP') snakeY -= box;
        if (direction == 'RIGHT') snakeX += box;
        if (direction == 'DOWN') snakeY += box;

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 19 + 1) * box,
                y: Math.floor(Math.random() * 19 + 1) * box
            };
        } else {
            snake.pop();
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(game);
            document.getElementById('resultat').innerText = 'CAPTCHA incorrect, recommence';
            document.getElementById('resultat').style.color = 'red';
            setTimeout(() => {
                document.getElementById('resultat').innerText = "";
                snakeCaptcha();
            }, 2000);
            return;
        }

        snake.unshift(newHead);

        if (score >= 5) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            clearInterval(game);
            document.getElementById('resultat').innerText = 'CAPTCHA correct';
            document.getElementById('resultat').style.color = 'green';
            closeButton.style.display = "block";
        }
    }

    let game = setInterval(draw, 150);
}

snakeCaptcha()

let gemCount = 0;
function handleClick(imageElement) {
    // Cacher tout l'affichage précédent
    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    document.body.style.overflow = 'hidden'; 

    // Afficher l'image agrandie et le questionnaire
    const enlargedImageContainer = document.createElement('div');
    enlargedImageContainer.className = 'enlarged-image-container vt323-regular';

    const enlargedImage = document.createElement('img');
    enlargedImage.src = imageElement.src;
    enlargedImage.className = 'enlarged-image';

    const questionnaire = document.createElement('div');
    questionnaire.className = 'questionnaire vt323-regular';
    questionnaire.innerHTML = `
        <h2>Questionnaire</h2>
        <p>${imageElement.getAttribute('data-question')}</p>
        <label><input type="radio" name="question1" value="option1">${imageElement.getAttribute('data-option1')}</label><br>
        <label><input type="radio" name="question1" value="option2">${imageElement.getAttribute('data-option2')}</label><br>
        <label><input type="radio" name="question1" value="option3">${imageElement.getAttribute('data-option3')}</label><br>
        <label><input type="radio" name="question1" value="option4">${imageElement.getAttribute('data-option4')}</label><br>
        <button onclick="submitAnswer('${imageElement.getAttribute('data-correct')}')">Valider</button>
    `;
    enlargedImageContainer.appendChild(enlargedImage);
    enlargedImageContainer.appendChild(questionnaire);
    document.body.appendChild(enlargedImageContainer);
}

function submitAnswer(correctOption) {
    const selectedOption = document.querySelector('input[name="question1"]:checked');
    if (selectedOption) {
        if (selectedOption.value === correctOption) {
            if (gemCount < 5) {
                gemCount++;
                document.getElementById('gem-counter').innerText = `Gemmes: ${gemCount}`;
            }
            alert('Bonne réponse! Vous avez gagné une gemme.');
        } else {
            alert('Mauvaise réponse. Essayez encore.');
        }
    } else {
        alert('Veuillez sélectionner une option.');
    }
}

function restoreInitialView() {
    document.querySelector('main').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
    document.body.style.overflow = 'auto'; // Réactiver le défilement
    const enlargedImageContainer = document.querySelector('.enlarged-image-container');
    if (enlargedImageContainer) {
        document.body.removeChild(enlargedImageContainer);
    }
}
