$.fn.timeline = function(opt) {
    var self = $(this);
    var option = {
        background: "white",
        color: "inherit",
        linecolor: "rgba(0, 0, 0, 0.3)",
        datecolor: "inherit",
        dateposition: "absolute",
        fadeIn: true
    };
    $.extend(true, option, opt);
    $(this).find('.timeline-content').css('background', option.background).css("color", option.color).append("<div class='timeline-arrow'></div>");
    
    if(option.fadeIn === false) {
        $(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
    }
    
    var resize = function() {
        var size;
        if(parseInt(self.find('.timeline-content:first').css('margin-left')) <= 60) {
            size = 'small';
        } else {
            size = 'large';
        }
        //console.log(size);
        self.find(".timeline-block").prepend($("<div class='timeline-line'></div>").css("background-color", option.linecolor));
        
        if(size === 'large') {
            self.find('.timeline-block:nth-child(odd) .timeline-arrow').css("border-left-color", option.background);
            self.find('.timeline-block:nth-child(odd) .timeline-arrow').css("border-right-color", 'transparent');
            self.find('.timeline-block:nth-child(even) .timeline-arrow').css("border-right-color", option.background);
            
            self.find('.timeline-date').css("color", option.datecolor).css('position', option.dateposition);
        } else {
            self.find('.timeline-arrow').css("border-right-color", option.background);
            self.find('.timeline-block .timeline-arrow').css("border-left-color", 'transparent');
            
            self.find('.timeline-date').css("color", 'white');
        }
        
        
    };
    resize();
    
    
    $(window).on('resize', function() {
        resize();
    });
};

$(function() {
    
    var scroll = function() {
        $('.timeline-block').each(function(){
            if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && $(this).find('.timeline-img').hasClass('is-hidden')) {
                $(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
            } else {
//            $(this).find('.timeline-img, .timeline-content').addClass('is-hidden').removeClass('bounce-in');
            }
        });
    };
    
    
    $('.timeline-block').find('.timeline-img, .timeline-content').addClass('is-hidden');
    scroll();
    
    
    $(window).on('scroll', function() {
        scroll();
    });
    $(window).on('resize', function() {
        scroll();
    });
});
