// A palavra 'export' torna este objeto importável por outros scripts.
export const quizEngine = {
    timerInterval: null,

    database: {
        "Cpp-While-Prova1": {
            timeLimit: 15,
            allowConsultation: true,
            answers: { q1: 'c', q2: 'a', q3: 'c', q4: 'c', q5: 'a', q6: 'c', q7: 'b', q8_blank: ['num += 2;', 'num = num + 2;'], q9_blank: ['valor != -1'], q10_blank: ['vida--;', 'vida -= 1;', 'vida = vida - 1;'] }
        },
        "Cpp-While-Prova2": {
            timeLimit: 25,
            allowConsultation: false,
            answers: { q1: 'c', q2: 'a', q3_blank: ['fatorial *= i;', 'fatorial = fatorial * i;'], q4_blank: ['*ptr', '*ptr != \'\\0\''], q5_blank: ['continue;'], q6_blank: ['num % 7 != 0'], q7: 'b', q8: 'c', q9_blank: ['tentativa != senha_correta && tentativas < 3'], q10_blank: ['invertido = invertido * 10 + digito;'] }
        }
    },

    init(namespace) {
        const config = this.database[namespace];
        if (!config) return;

        const quizForm = document.getElementById('quiz-form');
        const submitButton = document.getElementById('submit-quiz');

        this.cleanup(); // Garante que qualquer estado anterior seja limpo
        
        this.startTimer(config.timeLimit);

        const consultationArea = document.getElementById('consultation-area');
        if (config.allowConsultation && consultationArea) {
            consultationArea.style.display = 'flex';
        }

        submitButton.addEventListener('click', () => this.handleSubmission(config));
    },

    cleanup() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        const oldButton = document.getElementById('submit-quiz');
        if (oldButton) {
            const newButton = oldButton.cloneNode(true); // Recria o botão para remover listeners
            oldButton.parentNode.replaceChild(newButton, oldButton);
        }
    },

    handleSubmission(config) {
        const confirmation = confirm("Você tem certeza que deseja finalizar a prova? Esta ação não pode ser desfeita.");
        if (confirmation) {
           this.finalizeQuiz(config);
        }
    },

    startTimer(minutes) {
        const timerDisplay = document.getElementById('timer');
        if (!timerDisplay) return;

        let totalTime = minutes * 60;
        if (isNaN(totalTime) || totalTime <= 0) {
            timerDisplay.textContent = "Sem Limite";
            return;
        }

        this.timerInterval = setInterval(() => {
            const mins = Math.floor(totalTime / 60);
            let secs = totalTime % 60;
            timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            if (totalTime < 0) {
                this.cleanup();
                alert("O tempo acabou! A prova será finalizada agora.");
                const currentNamespace = document.querySelector('[data-barba-namespace]').getAttribute('data-barba-namespace');
                this.finalizeQuiz(this.database[currentNamespace]);
            }
            totalTime--;
        }, 1000);
    },

    finalizeQuiz(config) {
        this.cleanup();
        let score = 0;
        const totalQuestions = Object.keys(config.answers).length;

        for (const questionKey in config.answers) {
            const questionId = questionKey.split('_')[0];
            const questionBlock = document.getElementById(questionId);
            if (!questionBlock) continue;

            let isCorrect = false;
            let correctAnswerText = '';

            if (questionKey.includes('_blank')) {
                const inputEl = document.getElementById(questionKey);
                const userAnswer = inputEl.value.trim().replace(/\s+/g, ' ');
                isCorrect = config.answers[questionKey].some(ans => ans.trim().replace(/\s+/g, ' ') === userAnswer);
                correctAnswerText = `<pre class="code" style="margin: 0.5rem 0 0 0;">${config.answers[questionKey][0]}</pre>`;
            } else {
                const selectedOption = document.querySelector(`input[name="${questionKey}"]:checked`);
                isCorrect = selectedOption && selectedOption.value === config.answers[questionKey];
                const correctLabel = document.querySelector(`input[name="${questionKey}"][value="${config.answers[questionKey]}"]`)?.parentElement;
                if (correctLabel) correctAnswerText = `"${correctLabel.textContent.trim()}"`;
            }

            if (isCorrect) score++;
            this.markQuestion(questionBlock, isCorrect, correctAnswerText);
        }
        
        this.displayResults(score, totalQuestions);
        this.disableForm();
    },

    markQuestion(questionBlock, isCorrect, correctAnswerText) {
        questionBlock.classList.remove('correct', 'incorrect');
        const oldFeedback = questionBlock.querySelector('.feedback-correct-answer');
        if (oldFeedback) oldFeedback.remove();

        if (isCorrect) {
            questionBlock.classList.add('correct');
        } else {
            questionBlock.classList.add('incorrect');
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'feedback-correct-answer';
            feedbackDiv.innerHTML = `<strong style="color: var(--danger-color);">Resposta Correta:</strong> ${correctAnswerText}`;
            questionBlock.appendChild(feedbackDiv);
        }
    },

    displayResults(score, total) {
        const oldResult = document.getElementById('result-container');
        if (oldResult) oldResult.remove();
        
        const resultContainer = document.createElement('div');
        resultContainer.id = 'result-container';
        let percentage = (score / total) * 100;
        let message = percentage >= 70 ? "Excelente! Você dominou o conteúdo." : "Continue estudando para melhorar.";
        
        resultContainer.innerHTML = `<h2>Resultado Final</h2><p class="final-score">Você acertou ${score} de ${total} questões!</p><p>${message}</p>`;
        document.getElementById('quiz-form').parentNode.insertBefore(resultContainer, document.getElementById('quiz-form'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    disableForm() {
        document.querySelectorAll('#quiz-form input').forEach(input => input.disabled = true);
        const submitButton = document.getElementById('submit-quiz');
        if (submitButton) {
           submitButton.disabled = true;
           submitButton.style.cursor = 'not-allowed';
        }
    }
};