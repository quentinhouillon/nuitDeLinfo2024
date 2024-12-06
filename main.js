// main.js
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.addEventListener('click', () => {
            section.classList.toggle('active');
        });
    });

    const modal = document.getElementById('myModal');
    const closeModal = document.getElementById('close');

    // Open the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks on <span> (x)
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    bubbleCaptcha();
});

// Mettre à jour l'année actuelle dans le footer
const yearSpan = document.getElementById('year');
const currentYear = new Date().getFullYear();
yearSpan.textContent = currentYear;

// Ajouter des événements de clic aux images
const questions = {
    'img-coeur': {
        question: 'Quelle est la fonction principale du cœur ?',
        choices: ['Pomper le sang', 'Filtrer le sang', 'Produire des hormones'],
        correct: 'Pomper le sang'
    },
    'img-poumons': {
        question: 'Quelle est la fonction principale des poumons ?',
        choices: ['Échanger des gaz', 'Pomper le sang', 'Produire des hormones'],
        correct: 'Échanger des gaz'
    },
    'img-sang': {
        question: 'Que transporte le sang dans le corps humain ?',
        choices: ['Nutriments', 'Gaz', 'Hormones'],
        correct: 'Nutriments'
    },
    'img-cerveau': {
        question: 'Quelle est la fonction principale du cerveau ?',
        choices: ['Contrôler le corps', 'Pomper le sang', 'Filtrer le sang'],
        correct: 'Contrôler le corps'
    }
};

function bubbleCaptcha() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let bubbles = [];
    let score = 0;
    let gameInterval;

    function createBubble() {
        return {
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            radius: Math.random() * 15 + 15,
            speed: Math.random() * 3 + 2.5
        };
    }

    function drawBubble(bubble) {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(173, 216, 230, 0.8)'; // Couleur des bulles
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();
    }

    function drawBubbles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < bubbles.length; i++) {
            let bubble = bubbles[i];
            bubble.y -= bubble.speed; // Les bulles montent
            drawBubble(bubble);

            if (bubble.y + bubble.radius < 0) {
                gameOver();
                return;
            }
        }
    }

    function checkClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        for (let i = 0; i < bubbles.length; i++) {
            let bubble = bubbles[i];
            const distance = Math.sqrt((mouseX - bubble.x) ** 2 + (mouseY - bubble.y) ** 2);
    
            // Si l'utilisateur clique sur une bulle
            if (distance < bubble.radius) {
                bubbles.splice(i, 1);
                score++;
                document.getElementById('bubble-counter').textContent = score + '/5';
    
                if (score >= 5) {
                    clearInterval(gameInterval);
                    ctx.fillStyle = 'rgba(144, 238, 144, 0.8)'; // Light green color
                    ctx.font = '40px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Félicitation', canvas.width / 2, canvas.height / 2);
                    document.getElementById('close').style.display = 'block';
                    return;
                }
            }
        }
    }

    function gameOver() {
        clearInterval(gameInterval); // Arrête le jeu
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

        // Redémarre le jeu après 2 secondes
        setTimeout(() => {
            bubbleCaptcha();
        }, 1500);
    }


    function gameLoop() {
        if (Math.random() < 0.03) { // Ajoute une bulle aléatoirement
            bubbles.push(createBubble());
        }
        drawBubbles();
    }

    canvas.addEventListener('click', checkClick);
    gameInterval = setInterval(gameLoop, 30);
}


Object.keys(questions).forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        showPopup(questions[id]);
    });
});

// Fonction pour afficher le pop-up
function showPopup(questionData) {
    const popup = document.getElementById('popup');
    const popupQuestion = document.getElementById('popup-question');
    const popupChoices = document.getElementById('popup-choices');
    const closeBtn = document.getElementsByClassName('close')[0];

    popupQuestion.textContent = questionData.question;
    popupChoices.innerHTML = '';

    questionData.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => {
            if (choice === questionData.correct) {
                alert('Bonne réponse !');
            } else {
                alert('Mauvaise réponse. Réessayez.');
            }
            popup.style.display = 'none';
        };
        popupChoices.appendChild(button);
    });

    popup.style.display = 'block';

    closeBtn.onclick = function() {
        popup.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    };
};