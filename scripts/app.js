"use strict";

(function (){

    function DisplayHomePage(){
        console.log("Called DisplayHomePage()");
        let AboutUsButton = document.getElementById("AboutUsBtn");

        AboutUsButton.addEventListener("click", function () {
            location.href = "about.html"
        });


        let MainContent = document.getElementsByTagName("main")[0];

        let MainParagraph = document.createElement("p");

        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "This is my first paragraph";
        MainContent.appendChild(MainParagraph);

        let FirstString = "this is";
        let SecondString = `${FirstString} the main paragraph`;
        MainParagraph.textContent = SecondString;
        MainContent.appendChild(MainParagraph);

        let DocumentBody = document.body;
        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">
            This is my Article Paragraph
        </p>`;
        Article.setAttribute("class", "container");
        // InnerHtml is uset to inject something to the Article in this case
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);

    }

    function DisplayProductPage(){
        console.log("Called DisplayProductPage()");
    }

    function DisplayAboutPage(){
        console.log("Called DisplayAboutPage()");
    }

    function DisplayServicePage(){
        console.log("Called DisplayServicePage()");
    }

    function DisplayContactPage(){
        console.log("Called DisplayContactPage()");
    }

    function Start() {
        console.log("App Started");

        switch (document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "Product":
                DisplayProductPage();
                break;
            case "About Us":
                DisplayAboutPage();
                break;
            case "Service":
                DisplayServicePage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
        }

    }

    window.addEventListener("load", Start);
})()