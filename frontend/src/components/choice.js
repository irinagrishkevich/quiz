import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Choice {

    constructor() {
        this.quizzes = []
        this.routeParams = UrlManager.getQueryParams()

        this.init()

    }
    async init(){
        try {
            const result = await CustomHttp.request(config.host + '/tests')

            if (result) {
                if (result.error) {
                    throw new Error(result.error)
                }

                this.quizzes = result
                this.processQuizzes()
            }

        } catch (error) {
            console.error(error)
        }
    }

    processQuizzes() {
        const choiceOptionsElement = document.getElementById('choice-options')
        if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
                const that = this
                const choiceOptionElement = document.createElement('div')
                choiceOptionElement.className = 'choice-option'
                choiceOptionElement.setAttribute('data-id', quiz.id)
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this)
                }

                const choiceOptionTextElement = document.createElement('div')
                choiceOptionTextElement.className = 'choice-option-text'
                choiceOptionTextElement.innerText = quiz.name

                const choiceOptionArrowElement = document.createElement('div')
                choiceOptionArrowElement.className = 'choice-option-arrow'

                const choiceOptionImageElement = document.createElement('img')
                choiceOptionImageElement.setAttribute('src', '/img/arrow.png')
                choiceOptionImageElement.setAttribute('alt', 'arrow')

                choiceOptionArrowElement.appendChild(choiceOptionImageElement)
                choiceOptionElement.appendChild(choiceOptionTextElement)
                choiceOptionElement.appendChild(choiceOptionArrowElement)


                choiceOptionsElement.appendChild(choiceOptionElement)
            })
        }
    }

    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id')
        if (dataId) {
            const formDataString = sessionStorage.getItem('formData')
            if (formDataString) {
                const formData = JSON.parse(formDataString)
                formData.id = dataId;
                sessionStorage.setItem('formData', JSON.stringify(formData))
                location.href = '#/test?name=' + formData.name + '&lastName=' + formData.lastName + '&email=' + formData.email
                // + '&id=' + formData.id;

            }
            // location.href = 'test.html' + location.search + '&id=' + dataId
        }
    }
}
