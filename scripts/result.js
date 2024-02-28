(function () {
    const Result = {
        url:null,
        answersButtonElement: null,
        init() {
            checkUserData()
            this.url = new URL(location.href);
            document.getElementById('result-scope').innerText = this.url.searchParams.get('score') +
                '/' + this.url.searchParams.get('total')

            this.answersButtonElement = document.getElementById('link')
            this.answersButtonElement.addEventListener('click', function () {
                location.href = 'answers.html' + location.search;
            });

        }
    }
    Result.init()
})()