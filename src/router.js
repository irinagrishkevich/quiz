import {Form} from "./components/form.js";
import {Choice} from "./components/choice.js";
import {Test} from "./components/test.js";
import {Result} from "./components/result.js";
import {Answers} from "./components/answers.js";

export class Router{
    constructor() {
        this.routers = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'style/style.css',
                load: () => {}
            },
            {
                route: '#/form',
                title: 'Регистрация',
                template: 'templates/form.html',
                styles: 'style/form.css',
                load: () => {
                    new Form()
                }
            },
            {
                route: '#/choice',
                title: 'Выбор Теста',
                template: 'templates/choice.html',
                styles: 'style/choice.css',
                load: () => {
                    new Choice()
                }
            },
            {
                route: '#/test',
                title: 'Тест',
                template: 'templates/test.html',
                styles: 'style/test.css',
                load: () => {
                    new Test()
                }
            },
            {
                route: '#/result',
                title: 'Результат',
                template: 'templates/result.html',
                styles: 'style/result.css',
                load: () => {
                    new Result()
                }
            },
            {
                route: '#/answers',
                title: 'Правильные Ответы',
                template: 'templates/answers.html',
                styles: 'style/answers.css',
                load: () => {
                    new Answers()
                }
            },
        ]
    }

    async openRoute() {
        const newRoute = this.routers.find(item => item.route === window.location.hash.split('?')[0])

    if(!newRoute){
        window.location.href = '#/'
        return
    }

    document.getElementById('content').innerHTML =
        await fetch(newRoute.template).then(response => response.text())
        document.getElementById('style').setAttribute('href', newRoute.styles)
        newRoute.load()
        document.getElementById('title-page').innerText = newRoute.title
    }

}