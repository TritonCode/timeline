$.fn.timeline = function (opt) {
    var getDataAttr = function (element) {
        var data_option = {};
        data_option.linecolor = element.data('tl-line_color');
        data_option.lineSpeed = element.data('tl-line_speed');
        data_option.fadeImages = element.data('tl-fade_images');
        data_option.background = element.data('tl-background');
        data_option.color = element.data('tl-color');
        data_option.image = element.data('tl-img');

        return data_option;
    }
    var screen_size;
    var self = $(this);
    var option = {
        background: "white",
        color: "inherit",
        linecolor: "rgba(0, 0, 0, 0.3)",
        datecolor: "inherit",
        dateposition: "absolute",
        fadeIn: true,
        fadeLine: true,
        lineSpeed: 1000,
        lineMaxBlur: 100,
        fadeImages: true,
        image: "transparent"
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
        screen_size = (self.parent().width() > 1170);
        if (screen_size === true) {
            self.attr('data-tl-large', 'true');
        } else {
            self.removeAttr('data-tl-large');
        }
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

            if (screen_size === true) {
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
                height = (height >= this_outer_height ? this_outer_height : height);
                $(this).children('.timeline-line').css('height', height);

                var percent_scrolled = (height / this_outer_height) * 100;

                $(this).children(".timeline-line")
                        .css("background", "linear-gradient(180deg, " + box_option.linecolor + " " + percent_scrolled + "%, rgba(0, 0, 0, 0))")
                        .css("transition", "height " + box_option.lineSpeed + "ms");
            }
        });
    };

    var update = function () {
        self.children(".timeline-block").each(function () {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);
            
            
            if ($(this).children(".timeline-img").length > 0) {
                $(this).children(".timeline-img").css('background-image', box_option.image);
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