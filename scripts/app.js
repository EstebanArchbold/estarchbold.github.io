"views strict";


(function(){


    function CheckLogin(){

        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`)
        }

        $("#logout").on("click", function (){
            sessionStorage.clear();
            location.href = "/login";
        });
    }


    function AjaxRequest(method, url, callback){

        // Step 1: instantiate an XHR object
        let xhr = new XMLHttpRequest();

        // Step 2: Open a connection to the server
        xhr.open(method, url);

        // Step 3: Add event listener for readystatechange event
        // The readysate event is being triggered when the
        // state of the document being fetched changes
        xhr.addEventListener("readystatechange", () => {

            if(xhr.readyState === 4 && xhr.status === 200){

                // Response succeeded - data is available in here only
                if(typeof callback == "function"){
                    callback(xhr.responseText);
                }else{
                    console.error("ERROR: callback not a function");
                }
            }
        });
        // Step 4: send the request
        xhr.send();
    }

    function ContactFormValidation(){
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter a valid First and Last Name");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid Contact Number");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address");
    }

    /**
     * This function validates input for text field
     * @param input_field_id
     * @param regular_expression
     * @param error_message
     */

    function ValidateField(input_field_id, regular_expression, error_message){

        let messageArea = $("#messageArea").hide();

        $(input_field_id).on("blur", function () {
            // Fail Validation
            let inputFieldText = $(this).val();
            if(!regular_expression.test(inputFieldText)){
                // pattern fails
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            } else {
                // Pass Validation
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function AddContact(fullName, contactNumber, emailAddress){
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()){
            let key = contact.fullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }

    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");
    }


    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage()");
    }

    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage()");
    }

    function DisplayServicePage(){
        console.log("Called DisplayServicePage()");
        rotation()
    }

    function DisplayContactUsPage(){
        console.log("Called DisplayContactUsPage()");

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function() {
            if(subscribeCheckbox.checked) {
                AddContact(fullName.value, contactNumber.value, emailAddress.value);
            }
        });
    }


    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage()");
        if(sessionStorage.length > 0) {
            let SSuser = sessionStorage.getItem("user");
            let userdata = SSuser.split(",")
            let user = {
                displayName: userdata[0],
                emailAddress: userdata[1],
                username: userdata[2]
            }
            $("#welcomeMessage").addClass("alert alert-success").text(`Welcome, ${user.displayName}!`).show()
        }

        if(localStorage.length > 0){

            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            let index = 1;

            for (const key of keys){
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
            location.href = "edit#add";
        });

        $("button.edit").on("click", function () {
            location.href = "edit#" + $(this).val();
        });

        $("button.delete").on("click", function () {
            if (confirm("Delete Contact? Please confirm")){
                localStorage.removeItem($(this).val());
            }
            location.href = "contact-list";
        });
    }

    function DisplayEditPage(){
        console.log("DisplayEdit Page Called ...");

        ContactFormValidation();

        let page = location.hash.substring(1);

        switch(page){
            case "add":
                // add contact chosen
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"/> Add`);

                $("#editButton").on("click", (event)=> {
                    // prevent form submission
                    event.preventDefault();
                    AddContact(fullName.value, contactNumber.value, emailAddress.value);
                    location.href = "contact-list";
                });

                $("#cancelButton").on("click", ()=> {
                    location.href = "contact-list";
                });
                break;

            default:
                // edit contact chosen
                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page));

                // Pre-populate form
                $("#fullName").val(contact.fullName);
                $("#contactNumber").val(contact.contactNumber);
                $("#emailAddress").val(contact.emailAddress);

                $("#editButton").on("click", (event) => {
                    // prevent from submission
                    event.preventDefault();
                    contact.fullName = $("#fullName").val();
                    contact.contactNumber = $("#contactNumber").val();
                    contact.emailAddress = $("#emailAddress").val();

                    localStorage.setItem(page, contact.serialize());
                    location.href = "contact-list";
                });

                $("#cancelButton").on("click", () => {
                    location.href = "contact-list";
                });
                break
        }
    }

    function DisplayLoginPage(){
        console.log("Called DisplayLoginPage()");

        let messageArea = $("#messageArea");
        messageArea.hide();

        $("#loginButton").on("click", function (){

            let success = false;
            let newUser = new core.User();
            let username = $("#username").val();
            let password = $("#password").val();

            $.get("./data/users.json", function (data) {

                let users = data.users;
                let user = users.find(x => {
                    if (x.UserName === username && x.Password === password) {
                        success = true;
                        return true; // This returns true to the find function, stopping the search
                    }
                    return false; // This is needed to continue searching for a matching user
                });

                if (user){
                    console.log(user);

                    newUser.displayName = user.DisplayName;
                    newUser.emailAddress = user.EmailAddress;
                    newUser.username = user.UserName;

                    sessionStorage.setItem("user", newUser.serialize());
                    console.log(sessionStorage);
                    location.href = "contact-list";
                }else{

                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Login Credentials")
                        .show();
                }
            });
        });

        $("#cancelButton").on("click", function(){
            document.forms[0].reset();
            location.href = "index";
        });
    }

    function DisplayRegisterPage(){
        console.log("Called DisplayRegisterPage()");

        // Attach the registerUser function to the submit event of the registration form
        document.getElementById("registerForm").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent form submission
            registerUser(); // Call the registerUser function
        });
    }

    function Display404Page(){
        console.log("Called Display404Page()");
    }

    function DisplayApiPage() {
        console.log("Called DisplayApiPage()");
        ApiCall();
        const url = "https://rickandmortyapi.com/api/character/313"

        fetch(url)
            .then(response => response.json())
            .then(x => {
                let data = {
                    name: x.name,
                    status: x.status,
                    image:x.image
                };

                console.log(data);

                let imgElement = document.getElementById("imageR");

                // Set the src attribute to the image URL from the API response
                imgElement.src = data.image;

                // Set other attributes if needed (e.g., alt, width, height)
                imgElement.alt = data.name;
                imgElement.width = 200; // Example width
                imgElement.height = 200; // Example height

                document.getElementById("imageR").appendChild(imgElement);
            });
    }

    function registerUser() {
        // Retrieve form input values
        let firstName = document.getElementById("FirstName").value.trim();
        let lastName = document.getElementById("lastName").value.trim();
        let emailAddress = document.getElementById("emailAddress").value.trim();
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        // Validate form inputs
        if (firstName === "" || lastName === "" || emailAddress === "" || password === "" || confirmPassword === "") {
            alert("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Create a new user object
        let newUser = {
            DisplayName: firstName + " " + lastName,
            EmailAddress: emailAddress,
            UserName: firstName,
            Password: password
        };

        // Fetch existing user data from the JSON file
        fetch("../data/users.json")
            .then(response => response.json())
            .then(data => {
                // Add the new user to the existing user data
                data.users.push(newUser);
                console.log(data);

                // Save the updated user data back to the JSON file
                return fetch("../data/users.json", {
                    method: "PUT",
                    body: JSON.stringify(data),
                });
            })
            .then(() => {
                // Display a success message or redirect to another page
                alert("Registration successful!");
                window.location.href = "login.html"; // Redirect to the login page
            })
            .catch(error => {
                console.error("Error updating user data:", error);
                alert("An error occurred. Please try again later.");
            });
    }



    function ActiveLinkCallBack() {
        switch(router.ActiveLink) {
            case "home": return DisplayHomePage;
            case "team": return DisplayTeamPage;
            case "service": return DisplayServicePage;
            case "portfolio": return DisplayPortfolioPage;
            case "contact": return DisplayContactUsPage;
            case "contact-list": return DisplayContactListPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "edit": return DisplayEditPage;
            case "blog": return console.log("blog");
            case "api": return DisplayApiPage;
            case "404": return Display404Page;
            default :
                console.log("ERROR callback does not exist");

        }
    }

    function LoadHeader(html_data){

        $.get("./views/components/header.html", function(html_data){

            $("header").html(html_data);

            document.title = router.ActiveLink.toLowerCase();

            $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
            CheckLogin();
        })
    }


    function LoadContent() {

        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallBack();

        $.get(`./views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data);
            callback();
        });

    }


    function LoadFooter() {
        $.get("./views/components/footer.html", function (html_data) {
            $("footer").html(html_data);
        });
    }

    function Start(){
        console.log("App Started");

        console.log(" Pathname --------------------> " , location.pathname)

        LoadHeader();
        LoadContent();
        LoadFooter();

    }
    window.addEventListener("load", Start);




    //----------------------------------------------------------------------------------------------------------------//

    //Function service rotation
    function rotation() {
        const spans = document.querySelectorAll(".mask span");
        let index = 0;

        setInterval(function () {
            const currentShow = document.querySelector("span[data-show]");
            const up = document.querySelector("span[data-up]");

            if (up) {
                up.removeAttribute("data-up");
            }

            currentShow.removeAttribute("data-show");
            currentShow.setAttribute("data-up", "");

            spans[index].setAttribute("data-show", "");
            index = (index + 1) % spans.length;
        }, 2000);
    }


    //--------------------------------------------------------------API CALL---------------------------------------------
    function ApiCall(){
        const form = document.querySelector('.search-form')
        const gallery = document.querySelector('.image-container');


        form.addEventListener('submit',(e)=>{
            // Prevent Default
            e.preventDefault();
            //Get Searchbar user input
            let query= form.querySelector('input').value;
            //Empty Searchbar
            form.querySelector('input').value='';
            //Set an input if is empty
            if(query === ''){
                query="all";
            }

            call(query);
        })

        async function call(query){
            const response= await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            const shows = await response.json();

            showImage(shows);
        }

        function showImage(images) {
            for(let image of images)
            {
                if(image.show.image)
                {
                    console.log(image.show.image.medium);
                    const img = document.createElement('img');
                    img.src=image.show.image.medium;
                    gallery.append(img);
                }
            }
        }
    }

})()









