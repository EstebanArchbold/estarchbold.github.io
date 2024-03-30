"use strict";
(function () {
    function AddLinkEvents(link) {
        let linkQuery = $(`a.link[data=${link}]`);
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");
        linkQuery.on("click", function () {
            LoadLink(`${link}`);
        });
        linkQuery.on("mouseover", function () {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });
        linkQuery.on("mouseout", function () {
            $(this).css("font-weight", "normal");
        });
    }
    function AddNavigationEvents() {
        let navLinks = $("ul>li>a");
        navLinks.off("click");
        navLinks.off("mouseover");
        navLinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        navLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function LoadLink(link, data = "") {
        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = capitalizeFirstCharacter(router.ActiveLink);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $(`li>a:contains(${document.title})`).addClass("active");
        LoadContent();
    }
    function AuthGuard() {
        let protected_route = ["contact-list", "statistics", "eventplanning"];
        if (protected_route.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                router.ActiveLink = "login";
            }
        }
    }
    function CheckLogin() {
        const statisticsLink = document.getElementById("statisticsLink");
        const eventLink = document.getElementById("eventLink");
        function toggleStatisticsLink() {
            const isLoggedIn = sessionStorage.getItem("user") !== null;
            if (statisticsLink) {
                statisticsLink.style.display = isLoggedIn ? "block" : "none";
                eventLink.style.display = isLoggedIn ? "block" : "none";
            }
        }
        toggleStatisticsLink();
        if (sessionStorage.getItem("user")) {
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`);
        }
        $("#logout").on("click", function () {
            sessionStorage.clear();
            $("#login").html(`<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`);
            AddNavigationEvents();
            LoadLink("login");
            toggleStatisticsLink();
        });
    }
    function ContactFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter a valid First and Last Name");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid Contact Number");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address");
    }
    function ValidateField(input_field_id, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");
    }
    function DisplayProductPage() {
        console.log("Called DisplayProductPage()");
    }
    function DisplayAboutPage() {
        console.log("Called DisplayAboutPage()");
    }
    function DisplayServicePage() {
        console.log("Called DisplayServicePage()");
    }
    function DisplayContactPage() {
        console.log("Called DisplayContactPage()");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            LoadLink("contact-list");
        });
        ContactFormValidation();
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function () {
            let fullName = document.forms[0].fullName.value;
            let contactNumber = document.forms[0].contactNumber.value;
            let emailAddress = document.forms[0].emailAddress.value;
            if (subscribeCheckbox.checked) {
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }
    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage()");
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;
            for (const key of keys) {
                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th> 
                         <td>${contact.fullName}</td>
                         <td>${contact.contactNumber}</td>
                         <td>${contact.emailAddress}</td>
                         <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                <i class="fas fa-edit fa-sm"> Edit</i>                         
                            </button>
                         </td>
                         <td class="text-center">
                            <button value="${key}" class="btn btn-danger btn-sm delete">
                                <i class="fas fa-trash-alt fa-sm"> Delete</i>                         
                            </button>
                         </td>                            
                         </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }
        $("#addButton").on("click", () => {
            LoadLink("edit", "add");
        });
        $("button.edit").on("click", function () {
            LoadLink("edit", $(this).val());
        });
        $("button.delete").on("click", function () {
            if (confirm("Delete Contact? Please confirm")) {
                localStorage.removeItem($(this).val());
            }
            LoadLink("contact-list");
        });
    }
    function DisplayEditPage() {
        console.log("DisplayEdit Page Called ...");
        ContactFormValidation();
        let page = router.LinkData;
        switch (page) {
            case "add":
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"/> Add`);
                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;
                    AddContact(fullName, contactNumber, emailAddress);
                    LoadLink("contact-list");
                });
                $("#cancelButton").on("click", () => {
                    LoadLink("contact-list");
                });
                break;
            default:
                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page));
                $("#fullName").val(contact.fullName);
                $("#contactNumber").val(contact.contactNumber);
                $("#emailAddress").val(contact.emailAddress);
                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    contact.fullName = $("#fullName").val();
                    contact.contactNumber = $("#contactNumber").val();
                    contact.emailAddress = $("#emailAddress").val();
                    localStorage.setItem(page, contact.serialize());
                    LoadLink("contact-list");
                });
                $("#cancelButton").on("click", () => {
                    LoadLink("contact-list");
                });
                break;
        }
    }
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage()");
        let messageArea = $("#messageArea");
        messageArea.hide();
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            $.get("./data/users.json", function (data) {
                for (const user of data.users) {
                    console.log(user);
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;
                    if (username === user.Username && password === user.Password) {
                        success = true;
                        newUser.fromJSON(user);
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    LoadLink("contact-list");
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Login Credentials")
                        .show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            LoadLink("home");
        });
    }
    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage()");
        AddLinkEvents("login");
        document.getElementById("registerForm")?.addEventListener("submit", function (event) {
            event.preventDefault();
            registerUser();
        });
    }
    function Display404Page() {
        console.log("Called Display404Page()");
    }
    function DisplayApiPage() {
        console.log("Called DisplayApiPage()");
        ApiCall();
    }
    function DisplayBlogPage() {
        console.log("Called DisplayBlogPage()");
    }
    function DisplayStatisticsPage() {
        console.log("Called DisplayStatisticsPage()");
    }
    function DisplayEventPlanningPage() {
        console.log("Called DisplayEventPlanningPage()");
        if (localStorage.length > 0) {
            let eventList = document.getElementById("events-list");
            let eventdata = "";
            let keys = Object.keys(localStorage);
            let index = 1;
            console.log(localStorage);
            for (const key of keys) {
                let eventData = localStorage.getItem(key);
                let event = new core.Event();
                event.deserialize(eventdata);
                eventdata += `<tr><th scope="row" class="text-center">${index}</th> 
                         <td>${event.date}</td>
                         <td>${event.name}</td>
                         <td>${event.description}</td>
                         <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                <i class="fas fa-edit fa-sm"> Edit</i>                         
                            </button>
                         </td>
                         <td class="text-center">
                            <button value="${key}" class="btn btn-danger btn-sm delete">
                                <i class="fas fa-trash-alt fa-sm"> Delete</i>                         
                            </button>
                         </td>                            
                         </tr>`;
                index++;
            }
            eventList.innerHTML = eventdata;
        }
        $("#addEvent").on("click", () => {
            LoadLink("add-event", "add");
        });
        $("button.edit").on("click", function () {
            LoadLink("add-event", $(this).val());
        });
        $("button.delete").on("click", function () {
            if (confirm("Delete Event? Please confirm")) {
                localStorage.removeItem($(this).val());
            }
            LoadLink("eventplanning");
        });
    }
    function AddEvent(date, name, description) {
        let event = new core.Event(date, name, description);
        if (event.serialize()) {
            let key = event.date.substring(0, 1) + Date.now();
            localStorage.setItem(key, event.serialize());
        }
    }
    function DisplayAddEventPage() {
        console.log("Called DisplayAddEventPage()");
        let page = router.LinkData;
        switch (page) {
            case "add":
                $("main>h1").text("Add Event");
                $("#editeventButton").html(`<i class="fas fa-plus-circle fa-sm"/> Add`);
                $("#editeventButton").on("click", (event) => {
                    event.preventDefault();
                    let date = document.forms[0].eventname.value;
                    let name = document.forms[0].eventdate.value;
                    let description = document.forms[0].eventdescription.value;
                    AddEvent(date, name, description);
                    LoadLink("eventplanning");
                });
                $("#cancelEventButton").on("click", () => {
                    LoadLink("eventplanning");
                });
                break;
        }
    }
    function ActiveLinkCallback() {
        switch (router.ActiveLink) {
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "services": return DisplayServicePage;
            case "products": return DisplayProductPage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "edit": return DisplayEditPage;
            case "404": return Display404Page;
            case "blog": return DisplayBlogPage;
            case "api": return DisplayApiPage;
            case "statistics": return DisplayStatisticsPage;
            case "eventplanning": return DisplayEventPlanningPage;
            case "add-event": return DisplayAddEventPage;
            default:
                console.error("ERROR callback does not exist " + router.ActiveLink);
                return new Function();
        }
    }
    function ApiCall() {
        const form = document.querySelector('.search-form');
        const gallery = document.querySelector('.image-container');
        call("frinds");
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let query = form.querySelector('input').value;
            form.querySelector('input').value = '';
            if (query === '') {
                query = "all";
            }
            await call(query);
        });
        async function call(query) {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            const shows = await response.json();
            showImage(shows);
        }
        function showImage(images) {
            gallery.innerHTML = '';
            for (let image of images) {
                if (image.show.image) {
                    console.log(image.show.image.medium);
                    const img = document.createElement('img');
                    img.src = image.show.image.medium;
                    gallery.append(img);
                }
            }
        }
    }
    function registerUser() {
        let firstName = document.getElementById("FirstName").value.trim();
        let lastName = document.getElementById("lastName").value.trim();
        let emailAddress = document.getElementById("emailAddress").value.trim();
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        if (firstName === "" || lastName === "" || emailAddress === "" || password === "" || confirmPassword === "") {
            alert("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        let newUser = {
            DisplayName: firstName + " " + lastName,
            EmailAddress: emailAddress,
            UserName: firstName,
            Password: password
        };
        fetch("../data/users.json")
            .then(response => response.json())
            .then((data) => {
            data.users.push(newUser);
            console.log(data);
            return fetch("../data/users.json", {
                method: "PUT",
                body: JSON.stringify(data),
            });
        })
            .then(() => {
            alert("Registration successful!");
            window.location.href = "home";
        })
            .catch(error => {
            console.error("Error updating user data:", error);
            alert("An error occurred. Please try again later.");
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
        const eventForm = document.getElementById('event-form');
        const eventsList = document.getElementById('events-list');
        eventForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const eventNameInput = document.getElementById('event-name');
            const eventDescriptionInput = document.getElementById('event-description');
            const eventPictureInput = document.getElementById('event-picture');
            const eventName = eventNameInput.value.trim();
            const eventDescription = eventDescriptionInput.value.trim();
            const eventPicture = eventPictureInput.value.trim();
            if (eventName !== '') {
                const response = await fetch('/add_event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: eventName,
                        description: eventDescription,
                        picture: eventPicture,
                    }),
                });
                if (response.ok) {
                    const eventData = await response.json();
                    const newEventItem = document.createElement('li');
                    newEventItem.textContent = eventData.name;
                    eventsList.appendChild(newEventItem);
                    eventForm.reset();
                }
                else {
                    alert('Failed to add event. Please try again.');
                }
                const newEventItem = document.createElement('li');
                newEventItem.textContent = eventName;
                eventsList.appendChild(newEventItem);
                eventForm.reset();
            }
            else {
                alert('Please enter a valid event name.');
            }
        });
    });
    function capitalizeFirstCharacter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function LoadHeader() {
        $.get("./views/components/header.html", function (html_data) {
            $("header").html(html_data);
            document.title = capitalizeFirstCharacter(router.ActiveLink);
            $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
            AddNavigationEvents();
            CheckLogin();
        });
    }
    function LoadContent() {
        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallback();
        $.get(`./views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data);
            CheckLogin();
            callback();
        });
    }
    function LoadFooter() {
        $.get("./views/components/footer.html", function (html_data) {
            $("footer").html(html_data);
        });
    }
    function Start() {
        console.log("App Started");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map