const questions = [
    {
        title: "coeur",
        question: "question coeur",
        reponse: ["option 1", "option 2", "option 3"],
        bonneReponse: 2,
        image: "assets/Designer.png",
        complete: false
    },
    {
        title: "poumon",
        question: "Question poumon",
        reponse: ["option 1", "option 2", "option 3"],
        bonneReponse: 0,
        image: "assets/Designer (1).png",
        complete: false
    },
    {
        title: "cerveau",
        question: "Question cerveau",
        reponse: ["option 1", "option 2", "option 3"],
        bonneReponse: 1,
        image: "assets/Designer (2).png",
        complete: false
    },
    {
        title: "estomac",
        question: "Question estomac",
        reponse: ["option 2", "option 2", "option 3"],
        bonneReponse: 2,
        image: "assets/Designer (3).png",
        complete: false
    },
];

function snakeCaptcha() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const box = 20;
    const main = document.getElementsByTagName("main")[0];
    main.style.display = "none"
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

    function showExplain() {
        canvas.remove();
        closeButton.style.display = "block";
        const title = document.getElementsByClassName("modal-title")[0];
        title.innerText = "Félicitation ! Vous avez remporter votre 1ère gemme !"
        const explain = document.getElementById("resultat");
        explain.style.color = "black"
        explain.innerText = "Votre site web présente un corps humain avec quatre organes cliquables. " +
                            "Pour chaque organe, les utilisateurs doivent répondre à un quiz qui met en " +
                            "évidence les similitudes entre le corps humain et l'océan. Chaque bonne réponse " +
                            "rapporte une gemme. Le jeu se termine lorsque l'utilisateur obtient cinq gemmes.";
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

        if (score >= 3) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            clearInterval(game);
            document.getElementById('resultat').innerText = 'CAPTCHA correct';
            document.getElementById('resultat').style.color = 'green';

            setTimeout(() => {
                showExplain();
            }, 2000);
            
        }
    }

    let game = setInterval(draw, 150);
}

// snakeCaptcha()
let gemCount = 1;

// Show images
function showImage() {
    const imageContainer = document.getElementById('image-container');
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }
    questions.forEach(question => {
        const imgElement = document.createElement('img');
        imgElement.src = question.image;
        imgElement.className = 'clickable-image';
        if (!question.complete) {
            imgElement.addEventListener('click', () => handleClick(question));
        }
        imageContainer.appendChild(imgElement);
    });
}

showImage();
document.getElementById('gem-counter').innerText = `Gemmes: ${gemCount}`;

function handleClick(question) {
    // Cacher tout l'affichage précédent
    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    document.body.style.overflow = 'hidden'; 

    // Afficher l'image agrandie et le questionnaire
    const enlargedImageContainer = document.createElement('div');
    enlargedImageContainer.className = 'enlarged-image-container';

    const enlargedImage = document.createElement('img');
    enlargedImage.src = question.image;
    enlargedImage.className = 'enlarged-image';

    const questionnaire = document.createElement('div');
    questionnaire.className = 'questionnaire';
    questionnaire.innerHTML = `
        <h2>Questionnaire</h2>
        <p>${question.question}</p>
        ${question.reponse.map((option, index) => `
            <label><input type="radio" name="question1" value="${index}">${option}</label><br>
        `).join('')}
        <button onclick="submitAnswer(${questions.indexOf(question)})">Valider</button>
    `;
    enlargedImageContainer.appendChild(enlargedImage);
    enlargedImageContainer.appendChild(questionnaire);
    document.body.appendChild(enlargedImageContainer);
}

function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    alertMessage.innerText = message;
    alertBox.classList.remove('hidden');
}

function closeCustomAlert() {
    const alertBox = document.getElementById('custom-alert');
    alertBox.classList.add('hidden');
}

function submitAnswer(questionIndex) {
    document.getElementById('custom-alert-ok').removeEventListener('click', () => {
        restoreInitialView();
    });
    const question = questions[questionIndex];
    const selectedOption = document.querySelector('input[name="question1"]:checked');
    if (selectedOption) {
        const answerIndex = parseInt(selectedOption.value);
        if (answerIndex === question.bonneReponse) {
            gemCount++;
            document.getElementById('gem-counter').innerText = `Gemmes: ${gemCount}`;
            question.complete = true;
            showImage();
            alert('Bonne réponse ! Vous avez gagné une gemme.');
            restoreInitialView();


        } else {
            alert('Mauvaise réponse. Réessayez.');
        }
    } else {
        alert('Veuillez sélectionner une réponse.');
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