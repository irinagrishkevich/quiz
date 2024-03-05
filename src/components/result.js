import {UrlManager} from "../utils/url-manager.js";

export class Result {
    // url:null,
    constructor() {
        this.answersButtonElement = null
        this.formDataString = null

        this.routeParams = UrlManager.getQueryParams()
        UrlManager.checkUserData(this.routeParams)
        this.formDataString = sessionStorage.getItem('formData');
        const formData = JSON.parse(this.formDataString);

        // this.url = new URL(location.href);
        document.getElementById('result-scope').innerText = formData.score +
            '/' + formData.total

        this.answersButtonElement = document.getElementById('link')
        this.answersButtonElement.addEventListener('click', function () {
            location.href = '#/answers?name=' + formData.name + '&lastName=' + formData.lastName + '&email=' + formData.email + '&results=' + formData.result;
        });

    }
}

