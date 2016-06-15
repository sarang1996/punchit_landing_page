/**
 * Created by jay on 18/05/2016.
 */
var is_srolling = false;
var scroll_obj = {last_scroll_top : 0};

$(document).ready(function(){

    documentResize();

    $('.modal-trigger').leanModal();

    navbarEditOnScroll();

    typeAnimation();

    $('.slider').slider();
    $('ul.tabs').tabs();

    // $("nav").css("background-color", "rgba(255,255,255,0)");
    // $("nav").css("box-shadow", "none");

    $(document).on("scroll", function(event){
        navbarEditOnScroll();
        // smoothScrollFunction(scroll_obj.last_scroll_top, event);
    });

    $(".brand-logo").on("click", function(){
        $.smoothScroll({
            scrollTarget: 0
        });
    });


    $('#textarea1').trigger('autoresize');

    $(document).resize(function(){
        documentResize();
    });

});

$(window).resize(function(){
    documentResize();
});


function documentResize(){
    if($(document).width() < 700){
        $("blockquote").hide();
        $(".slider").hide();
        $(".section_title").css("font-size", "18pt");
    }
    else{
        $("blockquote").show();
        $(".slider").show();
        $(".section_title").css("font-size", "30pt");
    }
}

function navbarEditOnScroll(){
    var nav_dom = $("nav");

    if($(document).scrollTop() > 150){

        console.log(1);

        nav_dom.removeClass();

        nav_dom.addClass("navbar_after_scroll");

    }
    else{

        console.log(2);

        nav_dom.removeClass();

        nav_dom.addClass("navbar_before_scroll");
    }

}

function smoothScrollFunction(last_scroll_top, event){

    //console.log($("div.section:visible").attr("id"));

    event.preventDefault();
    var st = $(this).scrollTop();

    var section_1_offset = $("#section_1").offset();
    var section_2_offset = $("#section_2").offset();
    var section_3_offset = $("#section_3").offset();
    var section_4_offset = $("#section_4").offset();

    // Check if scroll is down or up
    if(st > last_scroll_top && is_srolling == false) {
        // if scroll down

        if( scroll_obj.last_scroll_top == 0 ) {
            $("body").animate(
                {scrollTop: section_2_offset.top},
                {
                    start: function() {
                        is_srolling = true
                    },
                    complete: function() {
                        is_srolling = false
                    }
                }, 1000
            );
        } else if(scroll_obj.last_scroll_top < section_2_offset.top) {
            $("body").animate(
                {scrollTop: section_3_offset.top},
                {
                    start: function() {
                        is_srolling = true
                    },
                    complete: function() {
                        is_srolling = false
                    }
                }, 1000
            );
        } else if(scroll_obj.last_scroll_top < section_3_offset.top) {
            $("body").animate(
                {scrollTop: section_4_offset.top},
                {
                    start: function() {
                        is_srolling = true
                    },
                    complete: function() {
                        is_srolling = false
                    }
                }, 1000
            );
        }

    } else if(st < scroll_obj.last_scroll_top && is_srolling == false) {
        // if scroll up

        if( scroll_obj.last_scroll_top > section_3_offset.top ) {
            $("body").animate(
                {scrollTop: section_3_offset.top},
                {
                    start: function() {
                        is_srolling = true
                    },
                    complete: function() {
                        is_srolling = false
                    }
                }, 1000
            );
        } else if(scroll_obj.last_scroll_top > section_2_offset.top) {
            $("body").animate(
                {scrollTop: section_2_offset.top},
                {
                    start: function() {
                        is_srolling = true
                    },
                    complete: function() {
                        is_srolling = false
                    }
                }, 1000
            );
        } else if(scroll_obj.last_scroll_top > section_1_offset.top) {
            $("body").animate(
                {scrollTop: 0},
                {
                    start: function() {
                        is_srolling = true
                    },
                    complete: function() {
                        is_srolling = false
                    }
                }, 1000
            );
        }

    }

    scroll_obj.last_scroll_top = st;
}

function typeAnimation(){
    $("#type_anim").typed({
        strings: ["Entertainment", "Awareness", "Marketing"],
        typeSpeed: 100,
        loop: true,
        backDelay: 1000,
        backSpeed: 100,
        contentType: "text"
    });
}