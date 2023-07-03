const menu = document.querySelector(".burger-menu");
const burgerIco = document.querySelector(".burger-menu__ico");
const menuWrapper = document.querySelector(".burger-menu__wrapper");
const wrapperBg = document.querySelector(".burger-menu__wrapper-bg");
const input = menu.querySelector("input");


menu.onclick = function(event){
    let label = event.target.closest("label"); 

    if(label){         
        menuWrapper.classList.toggle("close"); 
        menuWrapper.classList.toggle("open");
        wrapperBg.classList.toggle("burger-menu__wrapper-bg_open");
    }
    if(!menuWrapper.contains(event.target)){
        menuWrapper.classList.toggle("close"); 
        menuWrapper.classList.toggle("open");        
        wrapperBg.classList.toggle("burger-menu__wrapper-bg_open");
        input.checked = !input.checked;
    }
};