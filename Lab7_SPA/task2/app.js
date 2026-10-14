// Данные мероприятий
const events = [
    {
        id: 1,
        title: "День открытых дверей",
        date: "2026-11-10",
        place: "Главный корпус университета",
        description: "Знакомство с университетом, факультетами и учебными программами."
    },
    {
        id: 2,
        title: "IT-конференция",
        date: "2026-11-15",
        place: "Актовый зал",
        description: "Выступления студентов и обсуждение современных IT-технологий."
    },
    {
        id: 3,
        title: "Конкурс проектов",
        date: "2026-11-20",
        place: "Компьютерная лаборатория",
        description: "Презентация студенческих проектов и обмен опытом."
    },
    {
        id: 4,
        title: "Спортивный день",
        date: "2026-11-25",
        place: "Спортивный комплекс",
        description: "Командные соревнования и спортивные активности."
    }
];

// Массив зарегистрированных участников
let participants = [];
let nextParticipantId = 1;

const content = document.querySelector("#content");
const tabs = document.querySelectorAll(".tab");

// Форматирование даты
function formatDate(dateString) {
    const parts = dateString.split("-");
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Безопасное создание текстового элемента
function createTextElement(tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    return element;
}

// Переключение вкладок
function showPage(page) {
    tabs.forEach(tab => {
        const active = tab.dataset.page === page;

        tab.classList.toggle("active", active);
        tab.setAttribute(
            "aria-current",
            active ? "page" : "false"
        );
    });

    if (page === "events") {
        renderEvents();
    } else if (page === "registration") {
        renderRegistration();
    } else if (page === "participants") {
        renderParticipants();
    }
}

// Вкладка «События»
function renderEvents() {
    content.replaceChildren();

    const heading = createTextElement("h2", "Предстоящие мероприятия");

    const section = document.createElement("section");
    section.className = "event-list";

    events.forEach(event => {
        const card = document.createElement("article");
        card.className = "event-card";

        card.appendChild(createTextElement("h3", event.title));
        card.appendChild(createTextElement(
            "p",
            `Дата: ${formatDate(event.date)}`
        ));
        card.appendChild(createTextElement(
            "p",
            `Место: ${event.place}`
        ));
        card.appendChild(createTextElement(
            "p",
            event.description
        ));

        const count = participants.filter(
            participant => participant.eventId === event.id
        ).length;

        card.appendChild(createTextElement(
            "p",
            `Зарегистрировано участников: ${count}`
        ));

        const button = createTextElement(
            "button",
            "Зарегистрироваться",
            "btn"
        );

        button.type = "button";
        button.addEventListener("click", () => {
            showPage("registration");

            const eventSelect = document.querySelector("#eventId");
            if (eventSelect) {
                eventSelect.value = String(event.id);
            }
        });

        card.appendChild(button);
        section.appendChild(card);
    });

    const wrapper = document.createElement("section");
    wrapper.className = "card";
    wrapper.appendChild(heading);

    content.appendChild(wrapper);
    content.appendChild(section);
}

// Вкладка «Регистрация»
function renderRegistration() {
    content.replaceChildren();

    const card = document.createElement("section");
    card.className = "card";

    card.appendChild(createTextElement(
        "h2",
        "Регистрация на мероприятие"
    ));

    const form = document.createElement("form");
    form.id = "registrationForm";

    const nameLabel = createTextElement("label", "Имя и фамилия");
    nameLabel.htmlFor = "participantName";

    const nameInput = document.createElement("input");
    nameInput.id = "participantName";
    nameInput.name = "name";
    nameInput.type = "text";
    nameInput.placeholder = "Введите имя и фамилию";
    nameInput.required = true;
    nameInput.minLength = 2;
    nameInput.maxLength = 60;
    nameInput.autocomplete = "name";

    const emailLabel = createTextElement("label", "Электронная почта");
    emailLabel.htmlFor = "participantEmail";

    const emailInput = document.createElement("input");
    emailInput.id = "participantEmail";
    emailInput.name = "email";
    emailInput.type = "email";
    emailInput.placeholder = "example@mail.com";
    emailInput.required = true;
    emailInput.maxLength = 100;
    emailInput.autocomplete = "email";

    const eventLabel = createTextElement(
        "label",
        "Выберите мероприятие"
    );
    eventLabel.htmlFor = "eventId";

    const eventSelect = document.createElement("select");
    eventSelect.id = "eventId";
    eventSelect.name = "eventId";
    eventSelect.required = true;

    const defaultOption = createTextElement(
        "option",
        "Выберите мероприятие"
    );
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    eventSelect.appendChild(defaultOption);

    events.forEach(event => {
        const option = createTextElement(
            "option",
            `${event.title} — ${formatDate(event.date)}`
        );
        option.value = String(event.id);
        eventSelect.appendChild(option);
    });

    const commentLabel = createTextElement(
        "label",
        "Комментарий (необязательно)"
    );
    commentLabel.htmlFor = "participantComment";

    const commentInput = document.createElement("textarea");
    commentInput.id = "participantComment";
    commentInput.name = "comment";
    commentInput.placeholder = "Дополнительная информация";
    commentInput.maxLength = 300;

    const submitButton = createTextElement(
        "button",
        "Зарегистрироваться",
        "btn"
    );
    submitButton.type = "submit";

    const message = document.createElement("div");
    message.id = "formMessage";
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");

    form.append(
        nameLabel,
        nameInput,
        emailLabel,
        emailInput,
        eventLabel,
        eventSelect,
        commentLabel,
        commentInput,
        submitButton,
        message
    );

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const comment = commentInput.value.trim();
        const eventId = Number(eventSelect.value);

        message.className = "message";
        message.textContent = "";

        if (name.length < 2 || name.length > 60) {
            showFormMessage(
                message,
                "Введите имя длиной от 2 до 60 символов.",
                false
            );
            nameInput.focus();
            return;
        }

        if (!emailInput.validity.valid || email.length > 100) {
            showFormMessage(
                message,
                "Введите корректный адрес электронной почты.",
                false
            );
            emailInput.focus();
            return;
        }

        if (!events.some(item => item.id === eventId)) {
            showFormMessage(
                message,
                "Выберите мероприятие из списка.",
                false
            );
            eventSelect.focus();
            return;
        }

        const alreadyRegistered = participants.some(participant =>
            participant.eventId === eventId &&
            participant.email.toLowerCase() === email.toLowerCase()
        );

        if (alreadyRegistered) {
            showFormMessage(
                message,
                "Этот адрес электронной почты уже зарегистрирован на выбранное мероприятие.",
                false
            );
            emailInput.focus();
            return;
        }

        const participant = {
            id: nextParticipantId++,
            name: name,
            email: email,
            eventId: eventId,
            comment: comment
        };

        participants.push(participant);

        showFormMessage(
            message,
            "Регистрация успешно выполнена!",
            true
        );

        form.reset();
    });

    card.appendChild(form);
    content.appendChild(card);
}

// Сообщения формы
function showFormMessage(element, text, success) {
    element.textContent = text;
    element.className = success
        ? "message success"
        : "message error";
}

// Вкладка «Участники»
function renderParticipants() {
    content.replaceChildren();

    const card = document.createElement("section");
    card.className = "card";

    card.appendChild(createTextElement("h2", "Список участников"));

    card.appendChild(createTextElement(
        "span",
        `Всего регистраций: ${participants.length}`,
        "counter"
    ));

    if (participants.length === 0) {
        card.appendChild(createTextElement(
            "p",
            "Пока нет зарегистрированных участников.",
            "empty"
        ));
    } else {
        participants.forEach(participant => {
            const event = events.find(
                item => item.id === participant.eventId
            );

            const item = document.createElement("article");
            item.className = "participant";

            item.appendChild(createTextElement(
                "h3",
                participant.name
            ));

            item.appendChild(createTextElement(
                "p",
                `Электронная почта: ${participant.email}`
            ));

            item.appendChild(createTextElement(
                "p",
                `Мероприятие: ${event ? event.title : "Не найдено"}`
            ));

            if (participant.comment) {
                item.appendChild(createTextElement(
                    "p",
                    `Комментарий: ${participant.comment}`
                ));
            }

            const deleteButton = createTextElement(
                "button",
                "Удалить регистрацию",
                "btn btn-secondary"
            );

            deleteButton.type = "button";
            deleteButton.addEventListener("click", () => {
                participants = participants.filter(
                    item => item.id !== participant.id
                );

                renderParticipants();
            });

            item.appendChild(deleteButton);
            card.appendChild(item);
        });
    }

    content.appendChild(card);
}

// Обработчики навигации
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        showPage(tab.dataset.page);
    });
});

// Начальная вкладка
showPage("events");