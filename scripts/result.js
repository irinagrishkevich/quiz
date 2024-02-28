(function () {
    const Result = {
        // url:null,
        answersButtonElement: null,
        formDataString: null,
        init() {
            checkUserData()
            this.formDataString = sessionStorage.getItem('formData');
            const formData = JSON.parse(this.formDataString);

            // this.url = new URL(location.href);
            document.getElementById('result-scope').innerText = formData.score +
                '/' + formData.total

            this.answersButtonElement = document.getElementById('link')
            this.answersButtonElement.addEventListener('click', function () {
                location.href = 'answers.html' + location.search;
            });

        }
    }
    Result.init()
})()