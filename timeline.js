$.fn.timeline = function (opt) {
    var getDataAttr = function (element) {
        var data_option = {};
//        var keys = Object.keys(option);
        $.each(option, function(i, val) {
            if (typeof element.attr('data-tl-' + [i]) !== "undefined" && typeof element.attr('data-tl-' + [i]) !== false) {
                try {
                    data_option[[i]] = $.parseJSON(element.attr('data-tl-' + [i]));
                    return true; //continue;
                } catch (e) {}
                if (typeof data_option[i] !== "object") {
                    data_option[[i]] = element.attr('data-tl-' + [i]);
                }
            }
        });

        var data_json = (typeof element.attr('data-tl') !== "undefined" && typeof element.attr('data-tl') !== false ? $.parseJSON(element.attr('data-tl')) : []);

        $.extend(true, data_option, data_json);
        return data_option;
    };

    var screen_size;
    var self = $(this);
    var option = {
        arrowWidth: 7,
        background: "white",
        borderRadius: "0.3em",
        color: "inherit",
        lineColor: "rgba(0, 0, 0, 0.3)",
        lineThickness: "2px",
        date: "",
        dateColor: "inherit",
        datePosition: "absolute",
        fadeIn: true,
        fadeLine: true,
        lineSpeed: 1000,
        lineMaxBlur: 100,
        fadeImages: true,
        image: "transparent",
        imageBorderRadius: "0.3em",
        imageBorderWidth: 2,
        imageBorderColor: "rgba(220, 220, 220, 1)",
        distanceBetweenBoxAndImage: 5,
        orientation: [{
                min: 0,
                max: 10000,
                orientation: "vertical"
            }],
        treeView: 900
    };
    var data_option = getDataAttr($(this));

    $.extend(true, option, data_option, opt);

    var init = function () {
        self.children(".timeline-block").each(function () {
            $(this).wrapInner($("<div class='timeline-content'></div>"));
            if ($(this).children(".timeline-img").length < 1) {
                $(this).prepend($("<div class='timeline-img'></div>"));
            }
            if ($(this).children(".timeline-date").length < 1) {
                //                $(this).prepend($("<div class='timeline-date'></div>"));
            }
        });

        self.children(".timeline-block").children('.timeline-content').append("<div class='timeline-arrow'></div>");
        self.children('.timeline-block').prepend($("<div class='timeline-line'></div>"));

        if (option.fadeIn === false) {
            self.find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
        } else {
            self.find('.timeline-content').addClass('is-hidden');
            if (option.fadeImages === true) {
                self.find('.timeline-img').addClass('is-hidden');
            }
        }
    };



    var resize = function () {
        var width = 100 / self.children(".timeline-block").length;
        screen_size = (self.parent().width() > option.treeView);
        if (screen_size === true) {
            self.attr('data-tl-large', 'true');
        } else {
            self.removeAttr('data-tl-large');
        }

        self.children(".timeline-block").each(function (i) {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);

            for (var o = 0; o < box_option.orientation.length; o++) {

                if ((self.parent().width() > box_option.orientation[o].min || typeof box_option.orientation[o].min === "undefined") && (self.parent().width() < box_option.orientation[o].max || typeof box_option.orientation[o].max === "undefined") && (typeof box_option.orientation[o].min !== "undefined" || typeof box_option.orientation[o].max !== "undefined")) {
                    $(this).attr("data-tl-orient", box_option.orientation[o].orientation);
                } else {
                    $(this).attr("data-tl-orient", "vertical");
                }
            }
            if (typeof $(this).attr('data-tl-orient') === "undefined" || typeof $(this).attr('data-tl-orient') === false) {
                $(this).attr("data-tl-orient", "vertical");
            }

            if ($(this).attr('data-tl-orient') == "vertical") {

                $(this).children(".timeline-line").css('top', $(this).children(".timeline-img").outerHeight(true));
                if (self.attr('data-tl-large') == "true") {
                    $(this).children(".timeline-line").css('left', $(this).outerWidth() / 2);
                    $(this).children(".timeline-content").css('margin-left', ''); //normalize the margin on the left for the space for the image
                } else {
                    $(this).children(".timeline-line").css('left', $(this).children(".timeline-img").outerWidth() / 2);
                    $(this).children(".timeline-content").css('margin-left', $(this).children('.timeline-img').outerWidth(true) + box_option.arrowWidth + box_option.distanceBetweenBoxAndImage);
                }

                $(this).css('width', "").css('display', 'block');
            } else {
                $(this).children(".timeline-content").css('margin-left', ''); //normalize the margin on the left for the space for the image
                $(this).children(".timeline-line").css('top', $(this).children(".timeline-img").outerHeight(false) / 2); //don't count image margin
                $(this).children(".timeline-line").css('left', $(this).children(".timeline-img").outerWidth());
                $(this).css('width', width + "%").css('display', 'table-cell');
            }


            if ($(this).attr('data-tl-orient') === "vertical") {
                if (screen_size === true) {
                    if (i % 2 === 1) { //if current box is even
                        $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", box_option.background);
                        $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
                        $(this).children(".timeline-content").children('.timeline-arrow').css("left", -(box_option.arrowWidth * 2));
                    } else {
                        $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", box_option.background);
                        $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", 'transparent');
                        $(this).children(".timeline-content").children('.timeline-arrow').css("left", '100%');

                    }
                } else { //small view
                    $(this).children(".timeline-content").children('.timeline-arrow').css("left", -(box_option.arrowWidth * 2));

                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", box_option.background);
                    $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
                    $(this).children(".timeline-content").children('.timeline-date').css("color", 'white');
                }

                $(this).children(".timeline-content").children('.timeline-arrow').css("top", ($(this).children(".timeline-img").outerHeight(true) / 2) - box_option.arrowWidth);

                $(this).children(".timeline-content").children('.timeline-date').css("color", box_option.datecolor).css('position', box_option.dateposition);

            }

            $(this).children(".timeline-content").children('.timeline-arrow').css("border-bottom-color", 'transparent');

            if ($(this).attr('data-tl-orient') == "horizontal") {
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-bottom-color", box_option.background);
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-left-color", 'transparent');
                $(this).children(".timeline-content").children('.timeline-arrow').css("border-right-color", 'transparent');

                $(this).children(".timeline-content").children('.timeline-arrow').css("left", ($(this).children(".timeline-img").outerWidth(true) / 2) - box_option.arrowWidth / 2);
                $(this).children(".timeline-content").children('.timeline-arrow').css("top", -(box_option.arrowWidth * 2));
            }


        });
    };

    var scroll = function () {
        self.children(".timeline-block").each(function (i) {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);

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
                var this_outer_width = $(this).outerWidth(true) - parseInt($(this).children('.timeline-line').css('left'));
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
                if ($(this).attr('data-tl-orient') == "vertical") {
                    height = (height >= this_outer_height ? this_outer_height : height);
                    percent_scrolled = (height / this_outer_height) * 100;
                } else {
                    height = (height >= this_outer_width ? this_outer_width : height);
                    percent_scrolled = (height / this_outer_width) * 100;
                }

                if ($(this).attr('data-tl-orient') == "vertical") {
                    $(this).children('.timeline-line').css('height', height).css('width', box_option.lineThickness);
                    $(this).children(".timeline-line").css("background", "linear-gradient(180deg, " + box_option.lineColor + " " + percent_scrolled + "%, rgba(0, 0, 0, 0))");
                } else {
                    $(this).children('.timeline-line').css('width', height).css('height', box_option.lineThickness);
                    $(this).children(".timeline-line").css("background", "linear-gradient(90deg, " + box_option.lineColor + " " + percent_scrolled + "%, rgba(0, 0, 0, 0))");
                }
            }
        });
    };

    var update = function () {
        self.children(".timeline-block").each(function () {
            var box_option = $.extend(true, {}, option);
            var box_data_option = getDataAttr($(this));
            $.extend(true, box_option, box_data_option);

            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            if (pattern.test(box_option.image)) {
                box_option.image = "url('" + box_option.image + "')";
            }
            $(this).children(".timeline-img").css('background-image', box_option.image).css('border-width', box_option.imageBorderWidth).css('border-color', box_option.imageBorderColor)
                    .css('border-radius', box_option.imageBorderRadius)
                    .css('-moz-border-radius', box_option.imageBorderRadius)
                    .css('-ms-border-radius', box_option.imageBorderRadius);

            $(this).children(".timeline-content")
                    .css('border-radius', box_option.borderRadius)
                    .css('-moz-border-radius', box_option.borderRadius)
                    .css('-ms-border-radius', box_option.borderRadius);

            $(this).children('.timeline-content').css('background', box_option.background).css("color", box_option.color);
            $(this).children('.timeline-content').css('filter', 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#50990000,endColorstr=#50990000');

            $(this).children(".timeline-content").children('.timeline-arrow').css("border-width", box_option.arrowWidth);
            $(this).children(".timeline-img").css("border-width", box_option.imageBorderWidth);

            $(this).children(".timeline-date").html(box_option.date);

            $(this).children(".timeline-line").css("transition-duration", box_option.lineSpeed + "ms");
        });
    };

    init();
    resize();
    update();


    $(window).on('resize', function () {
        resize();
        scroll();
    });
    $(window).on('scroll', function () {
        scroll();
    });
};

$(function () {

    $('[data-tl-autoinit]').each(function () {
//        console.log('Timeline automatic initialization due to auto data tag.');
        $(this).timeline();
    });
});