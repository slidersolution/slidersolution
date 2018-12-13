var $slider = $(".slider");
var $slides = $slider.find(".slider-item");
var $sliderUL = $(".sliderUL");
var $sliderULItems = $sliderUL.find(".slider-menu-item");
var $navPrev = $(".prev");
var $navNext = $(".next");
var $playStopAutoplay = $(".playStopButton");
var playStop = "play";
var $showSlider = $(".showSlider");
var $sliderNav = $(".slider-nav");
var slidesNum = $slides.length;
var isSliderAnim = false;
var sliderDirection = 1;
var currentSlideID = 0;
var isAnimating = false;
var isAutoPlay = false;
var slideToGo = 0;
var pos1, pos2, pos3, pos4, pos5;

TweenLite.set($slider, {
		css: {
				transformPerspective: 400,
				perspective: 400,
				transformStyle: "preserve-3d"
		}
});

function init() {

		setSlidePos();
		$navPrev.on("click", gotoPrevSlide);
		$navNext.on("click", gotoNextSlide);
		$playStopAutoplay.on("click", playStopAutoPlay);
		$showSlider.on("click", showSliderControls);
		$sliderUL.on("click", "li", function() {
				console.log($(this).index());
				var _slide = $(this).index();
				gotoSpecificSlide(_slide, 1);
		});
}

function setSlidePos() {
		TweenLite.set($slides, {
				autoAlpha: 0
		});

		TweenLite.set($slides[currentSlideID], {
				left: pos3,
				autoAlpha: 1
		});
		if (currentSlideID == 0) {
				TweenLite.set($slides[slidesNum - 1], {
						left: pos2,
						autoAlpha: 1
				});
		} else {
				TweenLite.set($slides[currentSlideID - 1], {
						left: pos2,
						autoAlpha: 1
				});
		}
		if (currentSlideID == slidesNum - 1) {
				TweenLite.set($slides[0], {
						left: pos4,
						autoAlpha: 1
				});
		} else {
				TweenLite.set($slides[currentSlideID + 1], {
						left: pos4,
						autoAlpha: 1
				});
		}

		//set slide controls
		TweenLite.set($('.go-prev'), {
				left: pos3
		});
		TweenLite.set($('.go-next'), {
				left: pos4
		});
		TweenLite.set($sliderNav, {
				height: 0,
				padding: 0
		});
		TweenMax.to($('.outer'), 0.2, {
				scaleX: 1.6,
				x: 4
		})
		TweenMax.to($('.inner'), 0.2, {
				rotation: -45,
				x: -6,
				scaleX: 0.8,
				scaleY: 0.8
		})

		//set mask positions
		TweenLite.set($('.mask-left'), {
				left: pos2
		});
		TweenLite.set($('.mask-right'), {
				left: pos4
		});

		//set menu position
		TweenLite.set($('.slider-menu'), {
				left: pos3
		});
		highlightMenuItem(currentSlideID, 0);
}

function gotoPrevSlide() {
		slideToGo = currentSlideID - 1;
		if (slideToGo <= -1) {
				slideToGo = slidesNum - 1;
		}
		stopAutoPlay();
		gotoSlide("prev");
}

function gotoNextSlide() {
		slideToGo = currentSlideID + 1;
		if (slideToGo >= slidesNum) {
				slideToGo = 0;
		}
		stopAutoPlay();
		gotoSlide("next");
}

function gotoSpecificSlide(slideNum, time) {
		if (!isAnimating) {
				isAnimating = true;
				stopAutoPlay();
				//create timeline
				MoveSlidesTL = new TimelineMax({
						paused: true,
				});
				//locate current slides
				var slide1 = currentSlideID,
						slide2 = currentSlideID + 1,
						slide3 = currentSlideID - 1;
				if (slide2 > $slides.length - 1) {
						slide2 = 0;
				}
				if (slide3 < 0) {
						slide3 = $slides.length - 1;
				}

				//locate new slides
				currentSlideID = slideNum;
				var slide4 = slideNum,
						slide5 = slideNum + 1,
						slide6 = slideNum - 1;
				if (slide5 > $slides.length - 1) {
						slide5 = 0;
				}
				if (slide6 < 0) {
						slide6 = $slides.length - 1;
				}

				//move highlight to new slide
				highlightMenuItem(currentSlideID, 1);
				//zoom current slides away
				MoveSlidesTL
						.set($(".mask-left"), {
								autoAlpha: 0
						})
						.set($(".mask-right"), {
								autoAlpha: 0
						})
						.to($slides[slide1], 0.5, {
								z: 50,
								zIndex: 100,
								autoAlpha: 0
						}, "phase1")
						.to($slides[slide2], 0.5, {
								z: 50,
								zIndex: 100,
								autoAlpha: 0
						}, "phase1+=0.1")
						.to($slides[slide3], 0.5, {
								z: 50,
								zIndex: 100,
								autoAlpha: 0
						}, "phase1+=0.2")
						//bring slides in from back
						.set($slides[slide4], {
								z: -50,
								zIndex: 1,
								autoAlpha: 0,
								left: pos3
						}, "phase2")
						.to($slides[slide4], 0.5, {
								z: 0,
								autoAlpha: 1,
						})
						.set($slides[slide5], {
								z: -50,
								zIndex: 1,
								autoAlpha: 0,
								left: pos4
						}, "phase2+=0.05")
						.to($slides[slide5], 0.5, {
								z: 0,
								autoAlpha: 1,
						}, "phase2+=0.1")
						.set($slides[slide6], {
								z: -50,
								zIndex: 1,
								autoAlpha: 0,
								left: pos2
						}, "phase2+=0.05")
						.to($slides[slide6], 0.5, {
								z: 0,
								autoAlpha: 1,
						}, "phase2+=0.1")
						.to($(".mask-left"), 0.3, {
								autoAlpha: 1
						}, "phase2")
						.to($(".mask-right"), 0.3, {
								autoAlpha: 1
						}, "phase2")
						.set($slides, {
								z: 0
						})
				MoveSlidesTL.play();

				TweenLite.delayedCall(time, function() {
						isAnimating = false;
				});
		}
}

function gotoSlide(_direction, _time) {
		if (!isAnimating) {
				isAnimating = true;
				var slideToMove;

				var time = 1;
				if (_time != null) {
						time = _time
				}
				var direction = "next";
				if (_direction != null) {
						direction = _direction;
				}
				if (direction == "next") {
						//console.log("moving to next slide");
						//slide pos 1 - currently off screen on the left - do nothing				
						//slide pos 2 - move off screen to slide pos 1
						if ((currentSlideID - 1) < 0) {
								slideToMove = currentSlideID + (slidesNum - 1);
						} else {
								slideToMove = currentSlideID - 1;
						}
						TweenLite.fromTo($slides[slideToMove], time, {
								left: pos2,
								autoAlpha: 1
						}, {
								left: pos1,
								autoAlpha: 0,
								ease: Power2.easeInOut
						});

						//slide pos 3 - move to slide pos 2
						TweenLite.fromTo($slides[currentSlideID], time, {
								left: pos3
						}, {
								left: pos2,
								ease: Power2.easeInOut
						});
						//slide pos 4 - move to slide pos 3
						if ((currentSlideID + 1) >= slidesNum) {
								slideToMove = 0;
						} else {
								slideToMove = currentSlideID + 1;
						}
						TweenLite.fromTo($slides[slideToMove], time, {
								left: pos4
						}, {
								left: pos3,
								ease: Power2.easeInOut
						});
						//slide pos 5 - move to slide pos 4 from offscreen
						if ((slideToMove + 1) >= slidesNum) {
								slideToMove = 0;
						} else {
								slideToMove = slideToMove + 1;
						}
						TweenLite.fromTo($slides[slideToMove], time, {
								left: pos5,
								autoAlpha: 0
						}, {
								left: pos4,
								autoAlpha: 1,
								ease: Power2.easeInOut
						});

						currentSlideID += 1;
						if (currentSlideID >= slidesNum) {
								currentSlideID = 0;
						}
						//console.log("current slide: " + currentSlideID);

				} else // then it's prev
				{
						//console.log("moving to prev slide");
						//slide pos 1 - move onscreen to pos 2
						if ((currentSlideID - 2) < 0) {
								slideToMove = (currentSlideID - 2) + (slidesNum);
						} else {
								slideToMove = currentSlideID - 2;
						}
						TweenLite.fromTo($slides[slideToMove], time, {
								left: pos1,
								autoAlpha: 0
						}, {
								left: pos2,
								autoAlpha: 1,
								ease: Power2.easeInOut
						});

						//slide pos 2 - move to pos 3
						if ((currentSlideID - 1) < 0) {
								slideToMove = slidesNum - 1;
						} else {
								slideToMove = currentSlideID - 1;
						}
						TweenLite.fromTo($slides[slideToMove], time, {
								left: pos2
						}, {
								left: pos3,
								ease: Power2.easeInOut
						});

						//slide pos 3 - move to slide pos 4
						TweenLite.fromTo($slides[currentSlideID], time, {
								left: pos3
						}, {
								left: pos4,
								ease: Power2.easeInOut
						});
						//slide pos 4 - move offscreen to slide pos 5
						if ((currentSlideID + 1) >= slidesNum) {
								slideToMove = 0;
						} else {
								slideToMove = currentSlideID + 1;
						}
						TweenLite.fromTo($slides[slideToMove], time, {
								left: pos4,
								autoAlpha: 1
						}, {
								left: pos5,
								autoAlpha: 0,
								ease: Power2.easeInOut
						});
						//slide pos 5 - do nothing!

						currentSlideID -= 1;
						if (currentSlideID < 0) {
								currentSlideID = slidesNum - 1;
						}
				}
				highlightMenuItem(currentSlideID, time);
				TweenLite.delayedCall(time, function() {
						isAnimating = false;
				});
		}
}

function play() {
		gotoNextSlide();
		TweenLite.delayedCall(4, play);
}

function playStopAutoPlay() {
		if (playStop == "play") {
				TweenMax.to($('.outer'), 0.2, {
						scale: 0.8,
						x: 0
				})
				TweenMax.to($('.inner'), 0.2, {
						rotation: 0,
						x: 0,
						scaleX: 1,
						scaleY: 1
				})
				startAutoPlay();
				playStop = "stop";
		} else {
				TweenMax.to($('.outer'), 0.2, {
						scaleX: 1.6,
						x: 4
				})
				TweenMax.to($('.inner'), 0.2, {
						rotation: -45,
						x: -6,
						scaleX: 0.8,
						scaleY: 0.8
				})
				stopAutoPlay();
				playStop = "play";
		}

}

function startAutoPlay(immediate) {
		if (immediate != null) {
				immediate = false;
		}

		if (immediate) {
				gotoNextSlide();
		}
		TweenLite.delayedCall(4, play);
}

function stopAutoPlay() {
		isAutoPlay = false;
		TweenLite.killDelayedCallsTo(play);
}

function highlightMenuItem(_slide, _time) {
		TweenLite.to($sliderULItems, 0, {
				className: "slider-menu-item"
		});
		TweenLite.to($sliderULItems[_slide], 1, {
				className: "slider-menu-item current"
		});

		// now move the highlight to the current position
		var position = _slide * 25;

		HighlightTL = new TimelineMax({
				paused: true,
		});
		HighlightTL
				.to($(".highlight"), _time / 3, {
						height: '4px',
						ease: Power2.easeInOut
				})
				.to($(".highlight"), _time / 3, {
						left: position + '%',
						ease: Power2.easeInOut
				})
				.to($(".highlight"), _time / 3, {
						height: '100%',
						ease: Power2.easeInOut
				})
		HighlightTL.play();
}

function showSliderControls() {
		var time = 0.4;
		if (!isSliderAnim) {
				isSliderAnim = true;

				if (sliderDirection == 1) {
						TweenMax.to($sliderNav, time, {
								height: 18,
								paddingLeft: 30,
								paddingRight: 30,
								paddingTop: 7,
								paddingTop: 7
						});
						TweenMax.to($('.fa-angle-up'), time, {
								rotation: 180,
								transformOrigin: "50% 60%"
						});
						sliderDirection = 0;
				} else {
						TweenMax.to($sliderNav, time, {
								height: 0,
								paddingLeft: 0,
								paddingRight: 0,
								paddingTop: 0,
								paddingTop: 0
						});
						TweenMax.to($('.fa-angle-up'), time, {
								rotation: 0,
								transformOrigin: "50% 60%"
						});
						sliderDirection = 1;
				}
		}
		TweenLite.delayedCall(time, function() {
				isSliderAnim = false;
		});
}

/*****************************/

var main = function() {
		$(window).on('resize load', function() {
				var gridWidth;
				var bodyWidth = $('body').width();

				if (window.innerWidth > 850) {
						gridWidth = 650;
						$('.slider-item').css('width', gridWidth);
						$('.mask-left').css('width', gridWidth);
						$('.mask-right').css('width', gridWidth);
						$('.slider-menu').css('width', gridWidth);
				} else {
						gridWidth = bodyWidth - 40;
						$('.slider-item').css('width', gridWidth);
						$('.mask-left').css('width', gridWidth);
						$('.mask-right').css('width', gridWidth);
						$('.slider-menu').css('width', gridWidth);
				}
				var left = Math.round((bodyWidth - gridWidth) / 2),
						right = bodyWidth - gridWidth - left,
						windowWidth = window.innerWidth;

				pos1 = left - (gridWidth * 2);
				pos2 = left - gridWidth;
				pos3 = left;
				pos4 = left + gridWidth;
				pos5 = left + (gridWidth * 2);

				setSlidePos();

		}).trigger('resize');
		init()
}

$(document).ready(main);