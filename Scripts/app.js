"use strict";


(function(){
    const myModal = document.getElementById('myModal')
    const myInput = document.getElementById('myInput')
    function DisplayHomePage(){
        console.log("Called DisplayHomePage()");
        let AboutUsButton = document.getElementById("AboutUsBtn")
        AboutUsButton.addEventListener("click", function (){
            location.href = "team.html";
        });

    }
    function DisplayProductPage(){
        console.log("Called DisplayProductPage()");

    }
    function DisplayAboutUsPage(){
        console.log("Called DisplayAboutUsPage()");

    }
    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage()");

    }
    function DisplayPortfolioPage(){
        console.log("Called Displayportfolio()");

        let sendButton = document.getElementById("sendButton");
        sendButton.addEventListener("click", function(){
            let project = new Project(imgTitle.value, imgDescription.value, imageUrl.value);
            if(project.serialize()){
             let key = project.imgTitle.substring(0,1) + Date.now();
             localStorage.setItem(key, project.serialize());
            }
        });
    }
    console.log(localStorage);
    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage()");
        if(localStorage.length > 0){
            let imgList = document.getElementById("slide-container");
            let data = "";

            let keys = Object.keys(localStorage);
            console.log(keys);
            let index = 1;

            for(const key of keys){
                let imgData = localStorage.getItem(key);
                let project = new Project();
                project.deserialize(imgData);
                let aux = "";
                aux = project.imageUrl.split("\\");
                project.imageUrl = aux[2];
                data += `<div class="box">
                            <div class="imgBx">
                                <img src="./media/${project.imageUrl}">
                            </div>
                            <div class="image-content">
                                <div>
                                    <h2>${project.imgTitle}</h2>
                                    <p>${project.imgDescription}</p>
                                </div>
                            </div>
                        </div>`;
                index++;
                imgList.innerHTML = data;
            }
        }
    }
    function Start(){
        console.log("App Started");

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "Portfolio":
                DisplayContactListPage();

                DisplayPortfolioPage();
                break;
            case "Our Services":
                DisplayAboutUsPage();
                rotation();
                break;
            case "team":
                DisplayServicesPage();
                break;
            case "portfolio":

                break;
            case "blog":
                DisplayContactListPage();
                break;
        }
    }
    window.addEventListener("load", Start);


    // Service page javascript function
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

    function insertFooter() {
        const footer = document.createElement("footer");
        footer.className = "py-3 my-4";

        // Set inner HTML content with your provided footer
        footer.innerHTML = `
            <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                <li class="nav-item"><a href="/privacy.html" class="nav-link px-2 text-muted">Privacy Policy</a></li>
                <li class="nav-item"><a href="/termofservice.html" class="nav-link px-2 text-muted">Term Of Service</a></li>
                <li class="nav-item"><a href="/contactus.html" class="nav-link px-2 text-muted">Contact Us</a></li>
            </ul>
            <p class="text-center text-muted">© 2024 Harmony HUB</p>
            <p class="text-center text-muted">by Esteban Archbold and Osvaldo Guerrero</p>
        `;

        // Append the footer to the body
        document.body.appendChild(footer);
    }

    // Call the insertFooter function to add the footer
    insertFooter();


})()