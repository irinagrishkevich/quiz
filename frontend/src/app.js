import {Router} from "./router.js";

class App {
    constructor() {
        this.router = new Router()
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this))
        window.addEventListener('popstate', this.handleRouteChanging.bind(this))
        // window.addEventListener('popstate', () => {
        //     this.router.openRoute()
        // })
    }
    handleRouteChanging() {
        this.router.openRoute()
    }
}

(new App())


// SPA приложение, то не можем открыть без http server
// в json text - '' меняем на start - 'http-start
// npm start - чтобы запустить сервер