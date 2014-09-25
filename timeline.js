$.fn.timeline = function (opt) {
    var getDataAttr = function (element) {
        var data_option = {};
        data_option.linecolor = element.data('tl-line_color');
        data_option.lineThickness = element.data('tl-line_thickness');
        data_option.lineSpeed = element.data('tl-line_speed');
        data_option.fadeImages = element.data('tl-fade_images');
        data_option.background = element.data('tl-background');
        data_option.color = element.data('tl-color');
        data_option.image = element.data('tl-img');
        data_option.orientation = (element.data('tl-orientation'));

        return data_option;
    };
    var rgba2hex = function (r, g, b, a) {
        if (r > 255 || g > 255 || b > 255 || a > 255)
            throw "Invalid color component";
        return (256 + r).toString(16).substr(1) + ((1 << 24) + (g << 16) | (b << 8) | a).toString(16).substr(1);
    };
    var screen_size;
    var self = $(this);
    var option = {
        background: "white",
        color: "inherit",
        linecolor: "rgba(0, 0, 0, 0.3)",
        lineThickness: "2px",
        datecolor: "inherit",
        dateposition: "absolute",
        fadeIn: true,
        fadeLine: true,
        lineSpeed: 1000,
        lineMaxBlur: 100,
        fadeImages: true,
        image: "transparent",
        imageBorderRadius: "10%",
        orientation: [{min: 0, max: 10000, orientation: "vertical"}]
    };
    var data_option = getDataAttr($(this));

    $.extend(true, option, data_option, opt);
    /* 	console.log(option); */
    $(this).children().children('.timeline-content').append("<div class='timeline-arrow'></div>");
    $(this).children('.timeline-block').prepend($("<div class='timeline-line'></div>"));

    $(this).children(".timeline-block").each(function () {
        if ($(this).children(".timeline-img").length < 1) {
            $(this).prepend($("<div class='timeline-img'></div>"));
        }
    });

    if (option.fadeIn === false) {
        $(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
    } else {
        self.find('.timeline-content').addClass('is-hidden');
        if (option.fadeImages === true) {
            self.find('.timeline-img').addClass('is-hidden');
        }
    }

    var resize = function () {
        var width = 100/self.children(".timeline-block").length;
        screen_size = (self.parent().width() > 1170);
        if (screen_size === true) {
            self.attr('data-tl-large', 'true');
        } else {
            self.removeAttr('data-tl-large');
        }
        
        self.children(".timeline-block").each(function () {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);
            
            for(var i = 0; i < box_option.orientation.length; i++) {
                if(self.parent().width() > box_option.orientation[i].min && self.parent().width() < box_option.orientation[i].max) {
                    $(this).attr("data-tl-orient", box_option.orientation[i].orientation);
                }
            }
            
            if($(this).data('tl-orient') == "vertical") {
                $(this).children(".timeline-line").css('top', $(this).children(".timeline-img").height());
                if(self.attr('data-tl-large') == "true") {
                    $(this).children(".timeline-line").css('left', $(this).outerWidth() / 2);
                } else {
                    $(this).children(".timeline-line").css('left', $(this).children(".timeline-img").outerWidth() / 2);
                }
            } else {
                $(this).css('width', width + "%");
                $(this).children(".timeline-line").css('top', $(this).children(".timeline-img").height() / 2);
                $(this).children(".timeline-line").css('left', $(this).children(".timeline-img").outerWidth());
            }
            
           
        });
    };

    $(window).on('resize', function () {
        resize();
        scroll();
    });
    $(window).on('scroll', function () {
        scroll();
    });

    var scroll = function () {
        self.children(".timeline-block").each(function (i) {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);

            $(this).children('.timeline-content').css('background', box_option.background).css("color", box_option.color);
            $(this).children('.timeline-content').css('filter', 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#50990000,endColorstr=#50990000');

            if (screen_size === true && $(this).data('tl-orient') == "vertical") {
                if (i % 2 === 1) { //if current box is odd
                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", box_option.background);
                } else {
                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", box_option.background);
                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", 'transparent');
                }

                $(this).children(".timeline-content").children('.timeline-date').css("color", box_option.datecolor).css('position', box_option.dateposition);

            } else {

                $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", box_option.background);
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
                $(this).children(".timeline-content").children('.timeline-date').css("color", 'white');
            }
            
            if($(this).data('tl-orient') == "horizontal") {
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-bottom-color", box_option.background);
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", 'transparent');
            }


            if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && ($(this).children('.timeline-img').hasClass('is-hidden') || $(this).children('.timeline-content').hasClass('is-hidden'))) {
                $(this).find('.timeline-content').removeClass('is-hidden').addClass('bounce-in');
                if (box_option.fadeImages === true) {
                    $(this).find('.timeline-img').removeClass('is-hidden').addClass('bounce-in');
                    resize();
                }
            } else {
//            $(this).find('.timeline-img, .timeline-content').addClass('is-hidden').removeClass('bounce-in');
            }

            if (box_option.fadeLine === true) {
                var this_outer_height = $(this).outerHeight(true) - $(this).children('.timeline-img').outerHeight();
                var this_outer_width = $(this).width() - parseInt($(this).children('.timeline-line').css('left'));
                var distance_bottom = $(document).height() - $(this).offset().top;
                var scroll_left = $(document).height() - $(window).scrollTop() - $(window).height();
                var offset = $(window).height() / 2;

                var height = $(this).offset().top - $(window).scrollTop();
                height = -height;
                height += offset;

                if (distance_bottom - this_outer_height <= offset) {
                    height = -(scroll_left + distance_bottom);
                    height -= offset;
                    height = -scroll_left + this_outer_height;
                }
                var percent_scrolled = 0;
                if($(this).data('tl-orient') == "vertical") {
                    height = (height >= this_outer_height ? this_outer_height : height);
                    percent_scrolled = (height / this_outer_height) * 100;
                } else {
                    height = (height >= this_outer_width ? this_outer_width : height);
                    percent_scrolled = (height / this_outer_width) * 100;
                }

                $(this).children(".timeline-line").css("transition", "all " + box_option.lineSpeed + "ms");
                
                if($(this).data('tl-orient') == "vertical") {
                    $(this).children('.timeline-line').css('height', height).css('width', box_option.lineThickness);
                    $(this).children(".timeline-line").css("background", "linear-gradient(180deg, " + box_option.linecolor + " " + percent_scrolled + "%, rgba(0, 0, 0, 0))");
                } else {
                    $(this).children('.timeline-line').css('width', height).css('height', box_option.lineThickness);
                    $(this).children(".timeline-line").css("background", "linear-gradient(90deg, " + box_option.linecolor + " " + percent_scrolled + "%, rgba(0, 0, 0, 0))");
                }
            }
        });
    };

    var update = function () {
        self.children(".timeline-block").each(function () {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);
                       
            if ($(this).children(".timeline-img").length > 0) {
                $(this).children(".timeline-img").css('background-image', box_option.image)
                        .css('border-radius', box_option.imageBorderRadius)
                        .css('-moz-border-radius', box_option.imageBorderRadius)
                        .css('-ms-border-radius', box_option.imageBorderRadius);
            }
        });
    };

    resize();
    update();
};

$(function () {

    $('[data-tl-autoinit]').each(function () {
        console.log('Timeline automatic initialization due to auto data tag.');
        $(this).timeline();
    });
});