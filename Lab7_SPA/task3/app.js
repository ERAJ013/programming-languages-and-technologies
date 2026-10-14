const questions = [
    {
        question: "1. Что означает аббревиатура SPA?",
        options: [
            "Single Page Application",
            "Simple Programming Algorithm",
            "System Page Access",
            "Style Programming Application"
        ],
        correct: 0
    },
    {
        question: "2. Какой язык используется для управления DOM?",
        options: [
            "SQL",
            "JavaScript",
            "CSS",
            "XML"
        ],
        correct: 1
    },
    {
        question: "3. Для чего используется addEventListener()?",
        options: [
            "Для создания таблиц",
            "Для изменения цвета текста",
            "Для обработки событий",
            "Для подключения CSS"
        ],
        correct: 2
    },
    {
        question: "4. Что делает textContent?",
        options: [
            "Добавляет обработчик событий",
            "Изменяет содержимое элемента в виде текста",
            "Перезагружает страницу",
            "Создает новый CSS-файл"
        ],
        correct: 1
    },
    {
        question: "5. Как получить элемент по идентификатору?",
        options: [
            "document.getElementById()",
            "document.createElement()",
            "document.addEventListener()",
            "document.writeCSS()"
        ],
        correct: 0
    }
];

const content = document.querySelector("#content");
const tabs = document.querySelectorAll(".tab");

let currentPage = "questions";
let answers = {};
let testResult = null;
let submitted = false;

function showPage(page) {
    currentPage = page;

    tabs.forEach(tab => {
        const isActive = tab.dataset.page === page;

        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-current", isActive ? "page" : "false");
    });

    if (page === "questions") {
        renderQuestions();
    } else if (page === "results") {
        renderResults();
    } else if (page === "rules") {
        renderRules();
    }
}

function renderQuestions() {
    content.replaceChildren();

    const card = document.createElement("section");
    card.className = "card";

    const heading = document.createElement("h2");
    heading.textContent = "Тест по JavaScript и SPA";
    card.appendChild(heading);

    const description = document.createElement("p");
    description.textContent =
        "Выберите один правильный ответ на каждый вопрос.";
    card.appendChild(description);

    const form = document.createElement("form");
    form.id = "testForm";

    questions.forEach((item, index) => {
        const questionBlock = document.createElement("div");
        questionBlock.className = "question";

        const title = document.createElement("p");
        title.textContent = item.question;
        questionBlock.appendChild(title);

        item.options.forEach((option, optionIndex) => {
            const label = document.createElement("label");
            label.className = "option";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `question-${index}`;
            input.value = optionIndex;
            input.checked = answers[index] === optionIndex;

            input.addEventListener("change", () => {
                answers[index] = optionIndex;
                testResult = null;
                submitted = false;
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            questionBlock.appendChild(label);
        });

        form.appendChild(questionBlock);
    });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "btn";
    submitButton.textContent = "Завершить тест";
    form.appendChild(submitButton);

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (Object.keys(answers).length !== questions.length) {
            let message = document.querySelector("#formMessage");

            if (!message) {
                message = document.createElement("p");
                message.id = "formMessage";
                message.className = "error";
                form.appendChild(message);
            }

            message.textContent =
                "Ответьте на все вопросы перед завершением теста.";
            return;
        }

        let score = 0;

        questions.forEach((question, index) => {
            if (answers[index] === question.correct) {
                score++;
            }
        });

        testResult = {
            score: score,
            total: questions.length,
            percent: Math.round(score / questions.length * 100)
        };

        submitted = true;
        showPage("results");
    });

    card.appendChild(form);
    content.appendChild(card);
}

function renderResults() {
    content.replaceChildren();

    const card = document.createElement("section");
    card.className = "card";

    const heading = document.createElement("h2");
    heading.textContent = "Результаты тестирования";
    card.appendChild(heading);

    if (!submitted || !testResult) {
        const message = document.createElement("p");
        message.textContent =
            "Вы еще не завершили тест. Перейдите во вкладку «Вопросы».";
        card.appendChild(message);
    } else {
        const score = document.createElement("p");
        score.className = "result";
        score.textContent =
            `Ваш результат: ${testResult.score} из ${testResult.total} (${testResult.percent}%).`;
        card.appendChild(score);

        const evaluation = document.createElement("p");
        evaluation.className = "result";

        if (testResult.percent >= 80) {
            evaluation.textContent = "Отличный результат! Вы хорошо знаете тему.";
            evaluation.classList.add("success");
        } else if (testResult.percent >= 60) {
            evaluation.textContent = "Хороший результат. Есть темы для повторения.";
        } else {
            evaluation.textContent = "Рекомендуется повторить учебный материал.";
            evaluation.classList.add("error");
        }

        card.appendChild(evaluation);

        const details = document.createElement("h3");
        details.textContent = "Проверка ответов";
        card.appendChild(details);

        questions.forEach((question, index) => {
            const line = document.createElement("p");
            const isCorrect = answers[index] === question.correct;

            line.className = "result";
            line.textContent =
                `${question.question} Ваш ответ: ${question.options[answers[index]]}. ` +
                (isCorrect
                    ? "Правильно."
                    : `Неправильно. Верный ответ: ${question.options[question.correct]}.`);

            line.classList.add(isCorrect ? "success" : "error");
            card.appendChild(line);
        });

        const retryButton = document.createElement("button");
        retryButton.className = "btn";
        retryButton.textContent = "Пройти тест заново";

        retryButton.addEventListener("click", () => {
            answers = {};
            testResult = null;
            submitted = false;
            showPage("questions");
        });

        card.appendChild(retryButton);
    }

    content.appendChild(card);
}

function renderRules() {
    content.replaceChildren();

    const card = document.createElement("section");
    card.className = "card";

    const heading = document.createElement("h2");
    heading.textContent = "Правила тестирования";
    card.appendChild(heading);

    const rules = [
        "Тест содержит 5 вопросов по теме JavaScript и SPA.",
        "В каждом вопросе необходимо выбрать один вариант ответа.",
        "Для завершения теста нужно ответить на все вопросы.",
        "После завершения теста система автоматически подсчитает баллы.",
        "Во вкладке «Результаты» можно посмотреть правильные ответы.",
        "Чтобы пройти тест повторно, нажмите кнопку «Пройти тест заново»."
    ];

    const list = document.createElement("ul");
    list.style.paddingLeft = "22px";

    rules.forEach(rule => {
        const item = document.createElement("li");
        item.textContent = rule;
        item.style.marginBottom = "12px";
        list.appendChild(item);
    });

    card.appendChild(list);
    content.appendChild(card);
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        showPage(tab.dataset.page);
    });
});

showPage("questions");