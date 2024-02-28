(function () {
    const Test = {
        quiz: null,
        formDataString: null,
        progressBarElement: null,
        questionTitleElement: null,
        passButtonElement: null,
        nextButtonElement: null,
        prevButtonElement: null,
        optionsElement: null,
        currentQuestionIndex: 1,
        userResult: [],
        init() {
            checkUserData()
            // const url = new URL(location.href)
            // const testId = url.searchParams.get('id')
            this.formDataString = sessionStorage.getItem('formData');
            if (this.formDataString) {
                const formData = JSON.parse(this.formDataString);
                if (formData.id) {
                    const xhr = new XMLHttpRequest()
                    xhr.open('GET', 'https://testologia.site/get-quiz?id=' + formData.id, false)
                    xhr.send()
                    if (xhr.status === 200 && xhr.responseText) {
                        try {
                            this.quiz = JSON.parse(xhr.responseText)
                        } catch (e) {
                            location.href = 'index.html'
                        }
                        this.startQuiz()
                    } else {
                        location.href = 'index.html'
                    }
                } else {
                    location.href = 'index.html'
                }
            }else {
                location.href = 'index.html'
            }

        },
        startQuiz() {
            this.progressBarElement = document.getElementById('progress-bar')
            this.questionTitleElement = document.getElementById('title')
            this.optionsElement = document.getElementById('options')
            this.nextButtonElement = document.getElementById('next')
            this.nextButtonElement.onclick = this.move.bind(this, 'next')
            this.passButtonElement = document.getElementById('pass')
            this.passButtonHandler = this.move.bind(this, 'pass');
            this.passButtonElement.addEventListener('click', this.passButtonHandler);
            document.getElementById('pre-title').innerText = this.quiz.name
            this.prevButtonElement = document.getElementById('previous')
            this.prevButtonElement.onclick = this.move.bind(this, 'prev')

            this.prepareProgressBar()
            this.showQuestion()

            const timerElement = document.getElementById('timer')
            let seconds = 59
            const interval = setInterval(function() {
                    seconds--
                    timerElement.innerText = seconds
                    if(seconds === 0) {
                        clearInterval(interval)
                        this.complete()
                    }
                }.bind(this),1000)

        },
        prepareProgressBar() {
            for(let i=0; i < this.quiz.questions.length; i++) {
                const itemElement = document.createElement('div')
                itemElement.className = 'test-progress-bar-item' + (i === 0 ? ' active' : '')

                const itemCircleElement = document.createElement('div')
                itemCircleElement.className = 'test-progress-bar-item-circle'

                const itemTextElement = document.createElement('div')
                itemTextElement.className = 'test-progress-bar-item-text'
                itemTextElement.innerText = 'Вопрос '+ (i+1)

                itemElement.appendChild(itemCircleElement)
                itemElement.appendChild(itemTextElement)

                this.progressBarElement.appendChild(itemElement)

            }
        },
        showQuestion() {
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1]
            const chosenOption = this.userResult.find(item => item.questionId === activeQuestion.id)

            this.questionTitleElement.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex
                + ': </span>' + activeQuestion.question

            this.optionsElement.innerHTML = ''
            activeQuestion.answers.forEach(answer => {
                const that = this

                const optionElement = document.createElement('div')
                optionElement.className = 'test-question-option'

                const inputId = 'answer-' + answer.id
                const inputElement = document.createElement('input')
                inputElement.className = 'option-answer'
                inputElement.setAttribute('id', inputId)
                inputElement.setAttribute('type', 'radio')
                inputElement.setAttribute('name', 'answer')
                inputElement.setAttribute('value', answer.id)
                if(chosenOption && chosenOption.chosenAnswerId === answer.id){
                    inputElement.setAttribute('checked', 'checked')

                }

                inputElement.onchange = function () {
                    that.passButtonElement.classList.add('disabled');
                    that.passButtonElement.removeEventListener('click', that.passButtonHandler);
                    that.chooseAnswer()
                }


                const labelElement = document.createElement('label')
                labelElement.setAttribute('for', inputId)
                labelElement.innerText = answer.answer

                optionElement.appendChild(inputElement)
                optionElement.appendChild(labelElement)

                this.optionsElement.appendChild(optionElement)
            })
            if (chosenOption && chosenOption.chosenAnswerId){
                this.nextButtonElement.removeAttribute('disabled')
                this.passButtonElement.classList.add('disabled');
                this.passButtonElement.removeEventListener('click', this.passButtonHandler);
            }else{
                this.nextButtonElement.setAttribute('disabled', 'disabled')
                this.passButtonElement.classList.remove('disabled');
                this.passButtonElement.addEventListener('click', this.passButtonHandler);
            }


            if (this.currentQuestionIndex === this.quiz.questions.length) {
                this.nextButtonElement.innerText = 'Завершить'
            } else {
                this.nextButtonElement.innerText = 'Дальше'
            }
            if (this.currentQuestionIndex > 1) {
                this.prevButtonElement.removeAttribute('disabled')
            } else {
                this.prevButtonElement.setAttribute('disabled', 'disabled')
            }
        },
        chooseAnswer() {

            this.nextButtonElement.removeAttribute('disabled')

        },
        move(action) {
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1]
            const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => {
                return element.checked
            })
            let chosenAnswerId = null
            if (chosenAnswer && chosenAnswer.value) {
                chosenAnswerId = Number(chosenAnswer.value)
            }
            const existingResult = this.userResult.find(item => {
                return item.questionId === activeQuestion.id
            })
            if (existingResult) {
                existingResult.chosenAnswerId = chosenAnswerId
                console.log(chosenAnswerId)
            } else {
                this.userResult.push({
                    questionId: activeQuestion.id,
                    chosenAnswerId: chosenAnswerId,
                })
            }

            if (action === 'next' || action === 'pass') {
                this.currentQuestionIndex++

            } else {
                this.currentQuestionIndex--
            }

            if (this.currentQuestionIndex > this.quiz.questions.length) {
                this.complete()
                return
            }

            Array.from(this.progressBarElement.children).forEach((item,index) =>{
                const currentItemIndex = index + 1
                item.classList.remove('complete')
                item.classList.remove('active')
                if(currentItemIndex === this.currentQuestionIndex){
                    item.classList.add('active')
                } else if(currentItemIndex<this.currentQuestionIndex){
                    item.classList.add('complete')
                }
            })

            this.showQuestion()
        },
        complete(){
            // const url = new URL(location.href)
            // const testId = url.searchParams.get('id')
            // const name = url.searchParams.get('name')
            // const lastName = url.searchParams.get('lastName')
            // const email = url.searchParams.get('email')
            const userResultString = this.userResult.map(answer => answer.chosenAnswerId).join(",");

            const formData = JSON.parse(this.formDataString)

            formData.result = userResultString;
            sessionStorage.setItem('formData', JSON.stringify(formData))

            const xhr = new XMLHttpRequest()
            xhr.open('POST','https://testologia.site/pass-quiz?id=' + formData.id, false)
            xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
            // const userResultString = this.userResult.map(answer => answer.chosenAnswerId).join(",");
            xhr.send(JSON.stringify({
                name: formData.name,
                lastName: formData.lastName,
                email: formData.email,
                results: this.userResult
            }))

            if (xhr.status === 200 && xhr.responseText) {
                let result = null
                try {
                    result = JSON.parse(xhr.responseText)
                    formData.score = result.score
                    formData.total = result.total
                    sessionStorage.setItem('formData', JSON.stringify(formData))
                } catch (e) {
                    location.href = 'index.html'
                }
                if (result){
                    location.href = 'result.html' + location.search
                        // + '&score=' + formData.score  + '&total=' + formData.total + '&results=' + formData.result ;
                }
            } else {
                location.href = 'index.html'
            }
        }
    }

    Test.init()
})()