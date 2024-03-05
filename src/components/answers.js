export class Answers {
    constructor() {
        this.quiz = null
        this.questionElement = null
        this.resultButtonElement = null
        this.optionsElement = null
        this.optionElement = null
        this.currentQuestionIndex = 0
        this.chosenAnswersIds = []
        this.quizAnswersRight = []
        checkUserData()
        // const url = new URL(location.href)
        // const testId = url.searchParams.get('id')
        // const nameUser = url.searchParams.get('name')
        // const lastName = url.searchParams.get('lastName')
        // const email = url.searchParams.get('email')
        // this.chosenAnswersIds = url.searchParams.get('results').split(",");
        this.formDataString = sessionStorage.getItem('formData');
        const formData = JSON.parse(this.formDataString);
        this.chosenAnswersIds = formData.result.split(",")

        if (formData.id) {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', 'https://testologia.site/get-quiz?id=' + formData.id, false)
            xhr.send()
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText)

                } catch (e) {
                    location.href = '#/'
                }
            } else {
                location.href = '#/'
            }
        } else {
            location.href = '#/'
        }
        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + formData.id, false)
        xhr.send()
        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.quizAnswersRight = JSON.parse(xhr.responseText)
            } catch (e) {
                location.href = '#/'
            }

        } else {
            location.href = '#/'
        }
        this.start()
        document.getElementById('test-name').innerText = this.quiz.name
        document.getElementById('test-user').innerHTML = 'Тест выполнил: ' + '<span>' + formData.name + ' ' + formData.lastName + ', ' + formData.email + '</span>'
        this.resultButtonElement = document.getElementById('link')
        this.resultButtonElement.addEventListener('click', function () {
            location.href = 'result.html' + location.search;
        });
    }

    start() {
        this.quiz.questions.forEach((question, index) => {
            this.currentQuestionIndex = index + 1;
            this.showQuestion();
        });
    }

    showQuestion() {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];

        const questionElement = document.createElement('div');
        questionElement.className = 'common-question-title';
        questionElement.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex + ': </span>' + activeQuestion.question;

        const optionsElement = document.createElement('div');
        optionsElement.className = 'answers-options';

        const allQuestionAndAnswers = document.createElement('div');
        allQuestionAndAnswers.className = 'all-question-and-answers'


        activeQuestion.answers.forEach(answer => {

            const optionElement = document.createElement('div');
            optionElement.className = 'answers-question-option';

            const inputId = answer.id;
            const inputName = activeQuestion.id;
            const inputElement = document.createElement('input');
            inputElement.className = 'option-answer';
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', inputName);
            inputElement.setAttribute('value', answer.id);
            inputElement.setAttribute('disabled', 'disabled');


            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);

            optionsElement.appendChild(optionElement);
            allQuestionAndAnswers.appendChild(questionElement);
            allQuestionAndAnswers.appendChild(optionsElement);
            if (this.chosenAnswersIds.includes(answer.id.toString())) {
                inputElement.setAttribute('checked', 'checked');
                const correctAnswer = this.quizAnswersRight.find(correct => correct === answer.id);
                if (correctAnswer) {
                    inputElement.classList.add('correct');
                } else {
                    inputElement.classList.add('un-correct');
                }
            }
        });
        document.getElementById('question').appendChild(allQuestionAndAnswers)

    }
}



