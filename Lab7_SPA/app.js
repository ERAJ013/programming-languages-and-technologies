const pages = {
    about: {
        title: "О себе",
        paragraphs: [
            "Привет! Меня зовут Студент.",
            "Я изучаю программирование и создаю свои первые веб-сайты.",
            "В будущем я хочу стать профессиональным разработчиком."
        ]
    },

    skills: {
        title: "Мои навыки",
        paragraphs: [
            "HTML — создание структуры веб-страниц.",
            "CSS — оформление и дизайн сайтов.",
            "JavaScript — интерактивность и работа с DOM.",
            "Работа в команде и решение задач."
        ]
    },

    contacts: {
        title: "Контакты",
        paragraphs: [
            "Электронная почта: student@example.com",
            "Город: Алматы",
            "Статус: студент"
        ]
    }
};

const content = document.querySelector("#content");
const buttons = document.querySelectorAll("[data-page]");

function showPage(pageName) {
    const page = pages[pageName];

    if (!page) {
        content.textContent = "Ошибка: раздел не найден.";
        return;
    }

    content.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = page.title;
    content.appendChild(heading);

    page.paragraphs.forEach((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        content.appendChild(paragraph);
    });

    buttons.forEach((button) => {
        const isActive = button.dataset.page === pageName;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

showPage("about");