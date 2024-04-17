"use strict";

(function () {



    function CheckLogin() {

        if(sessionStorage.getItem("user")){
            $("#login").html('<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>')
        }

        $("#logout").on("click", function (){
            sessionStorage.clear();

            $("#login").html('<a class="nav-link" href="/login"><i class="fas fa-sign-out-alt"></i> Login</a>')

            location.href = "/login"
        });

    }

    function ContactFormValidation(){
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter a valid First and Lastname")
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid contact number")
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address")
    }

    /**
     * This function validate input form text field
     * @param input_field_id
     * @param regular_expression
     * @param error_message
     */
    function ValidateField(input_field_id:string, regular_expression:RegExp,  error_message:string) {

        let messageArea = $("#messageArea").hide();

        $(input_field_id).on("blur", function () {
            //fail validation
            let inputFieldText = $(this).val() as string;
            if (!regular_expression.test(inputFieldText)) {
                //pattern fails
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            } else {
                //pass validation
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function AddContact(fullName:string, contactNumber:string, emailAddress:string) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()){
            let key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    function DisplayHomePage(){
        console.log("Called DisplayHomePage()");

        $("#AboutUsBtn").on("click", () => {
            location.href = "/about"
        });

        $("main").append(`<p id="MainParagraph" class="mt-2">This is my first paragraph</p>`);
        $("main").append(`<article class="container">
                                <p id="ArticleParagraph" class="mt-3"> This is my article paragraph</p></article>`);

    }

    function DisplayProductPage() {
        console.log("Called DisplayProductPage()");
    }

    function DisplayAboutUsPage() {
        console.log("Called DisplayAboutUsPage()");
    }

    function DisplayServicesPage() {
        console.log("Called DisplayServicePage()");
    }

    function DisplayContactUsPage() {
        console.log("Called DisplayContactUsPage()");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function (){
            location.href = "/contact-list"
        });

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function () {

            let fullName:string = document.forms[0].fullName.value;
            let contactNumber:string = document.forms[0].contactNumber.value;
            let emailAddress:string = document.forms[0].emailAddress.value;

            if (subscribeCheckbox.checked) {
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }


    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage()");

        $("a.delete").on("click", function (event) {
            if (!confirm("Delete Contact, Please confirm")) {
               event.preventDefault()
                location.href = "/contact-list"
            }
        });
    }

    function DisplayEditPage() {
        console.log("DisplayEdit Page Called...");
        ContactFormValidation();
    }

    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage()");

    }

    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage()");
    }

    function Display404Page() {
        console.log("Called Display404Page()");
    }

    function DisplayApiPage() {
        console.log("Called DisplayApiPage()");
        ApiCall();
    }

    // function to search for TV shows

    function ApiCall() {
        const form = document.querySelector('.search-form') as HTMLFormElement;
        const gallery = document.querySelector('.image-container') as HTMLDivElement;

        call("frinds");

        form.addEventListener('submit', async (e) => {
            // Prevent Default
            e.preventDefault();
            //Get Searchbar user input
            let query = (form.querySelector('input') as HTMLInputElement).value;
            //Empty Searchbar
            (form.querySelector('input') as HTMLInputElement).value = '';
            //Set an input if is empty
            if (query === '') {
                query = "all";
            }

            await call(query);
        });

        async function call(query: string) {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            const shows = await response.json();

            showImage(shows);
        }

        function showImage(images: any[]) {

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


    function Start() {
        console.log("App Started");

        let page_id = $("body")[0].getAttribute("id")



        switch (page_id){
            case "home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutUsPage();
                break;
            case "service":
                DisplayServicesPage();
                break;
            case "products":
                DisplayProductPage();
                break;
            case "contact":
                DisplayContactUsPage();
                break;
            case "contact-list":
                DisplayContactListPage();
                break;
            case "login":
                DisplayLoginPage();
                break;
            case "register":
                DisplayRegisterPage();
                break;
            case "edit":
            case "add":
                DisplayEditPage();
                break;
            case "404":
                Display404Page();
                break;
            case "api":
                DisplayApiPage();
                break;
        }
    }
    window.addEventListener("load", Start);

})()