function Slider(id) {
  //основные переменные
  this.slider = document.getElementById(id);
  this.wrapper = this.slider.querySelector(".slider__wrapper");
  this.imgList = this.wrapper.querySelector(".slider__itemlist");
  this.indicators = this.slider.querySelector(".slider__indicators");
  this.countImgs = this.slider.querySelectorAll(".slider__item").length;
  this.imgWidth = this.imgList.querySelector(".slider__item").offsetWidth;
  this.gap = parseInt(
    getComputedStyle(this.imgList.querySelector(".slider__item")).marginRight
  );
  this.translation = this.imgWidth + this.gap;
  this.index = 0;

  this.moveSlider = () => {
    this.imgList.style.transform =
      "translateX(-" + this.translation * this.index + "px)";
  };

  this.createIndicators = () => {
    let countIndecators =
      Math.floor(
        (this.imgList.offsetWidth - this.wrapper.offsetWidth) / this.translation
      ) + 1;
    let li =
      '<li class="slider__indicator"><div class="slider__indicator-circle"></div></li>';
    for (let i = 0; i < countIndecators; i++) {
      this.indicators.insertAdjacentHTML("beforeend", li);
    }
  };
  this.createIndicators();

  this.indicatorslRow = this.slider.querySelectorAll(".slider__indicator");
  this.curentIndecator = this.indicatorslRow[0];

  this.changeCurentIndecator = () => {
    this.curentIndecator.classList.add("current");
    let prevIndecator = this.curentIndecator;
    this.curentIndecator = this.indicatorslRow[this.index];
    prevIndecator.classList.remove("current");
    this.curentIndecator.classList.add("current");
  };
  this.changeCurentIndecator();

  this.moveRight = () => {
    this.imgList.style.transition = "inherit";
    if (
      this.index <= this.countImgs - 2 &&
      this.imgList.offsetWidth -
        this.translation * this.index -
        this.wrapper.offsetWidth >=
        this.imgWidth
    ) {
      this.index += 1;
      this.changeCurentIndecator();
      this.moveSlider();
    }
  };

  this.moveLeft = () => {
    if (this.index >= 1) {
      this.imgList.style.transition = "inherit";
      this.index -= 1;
      this.changeCurentIndecator();
      this.moveSlider();
    }
  };

  this.clickOnIndecatorButton = (event) => {
    let indecator = event.target.closest("li");
    this.index = Array.from(this.indicatorslRow).indexOf(indecator);
    this.changeCurentIndecator();
    this.moveSlider();
  };

  this.swipedetect = (el) => {
    let surface = el;
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let startTime = 0;
    let elapsedTime = 0;

    let threshold = 70;
    let restraint = 100;
    let allowedTime = 350;

    surface.addEventListener(
      "mousedown",
      (e) => {
        startX = e.pageX;
        startY = e.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
      },
      false
    );

    surface.addEventListener(
      "mouseup",
      (e) => {
        distX = e.pageX - startX;
        distY = e.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= allowedTime) {
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            if (distX > 0) {
              this.moveLeft();
            } else {
              this.moveRight();
            }
          }
        }
        e.preventDefault();
      },
      false
    );

    surface.addEventListener(
      "touchstart",
      (e) => {
        let touchObj = e.changedTouches[0];
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
      },
      false
    );

    surface.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      false
    );

    surface.addEventListener(
      "touchend",
      (e) => {
        let touchObj = e.changedTouches[0];
        distX = touchObj.pageX - startX;
        distY = touchObj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        console.log(elapsedTime + "-" + allowedTime);

        if (elapsedTime <= allowedTime) {
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            if (distX > 0) {
              this.moveLeft();
            } else {
              this.moveRight();
            }
          }
        }
        e.preventDefault();
      },
      false
    );
  };
}

let aboutSlider = new Slider("slider");

aboutSlider.indicators.addEventListener(
  "click",
  aboutSlider.clickOnIndecatorButton
);
aboutSlider.swipedetect(aboutSlider.imgList);
