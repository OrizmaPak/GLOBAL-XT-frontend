/*-----------------------------------------------------------------------------------
 /* Styles Switcher
 -----------------------------------------------------------------------------------*/

window.console = window.console || (function() {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
    return c;
})();

function makeTimeStamp() {
    return timestamp = Date.now().toString();
}

jQuery(document).ready(function($) {

    var colors = '';

    //initially if rtl add switcher rtl:
    if ($("html").attr("dir") == "rtl") {
        $('<link href="color-switcher/css/color-switcher-rtl.css" rel="stylesheet" type="text/css" id="link-switcher-rtl">').appendTo('body');
        // Style switcher (ACTIVE)
        $('#style-switcher').animate({
            right: '-270px'
        });
    } else {
        // Style switcher (ACTIVE)
        $('#style-switcher').animate({
            left: '-270px'
        });
    }

    $('#style-switcher .switcher-toggle').on('click', function(e) {
        e.preventDefault();
        var div = $('#style-switcher');
        if ($(this).hasClass('closed')) {
            if ($("html").attr("dir") == "rtl") {
                $('#style-switcher').animate({
                    right: '0px'
                });
            } else {
                $('#style-switcher').animate({
                    left: '0px'
                });
            }

            // open switcher and add class open
            $(this).addClass('open');
            $(this).removeClass('closed');

        } else {
            if ($("html").attr("dir") == "rtl") {
                $('#style-switcher').animate({
                    right: '-270px'
                });
            } else {
                $('#style-switcher').animate({
                    left: '-270px'
                });
            }
            // close switcher and add closed
            $(this).addClass('closed');
            $(this).removeClass('open');
        }
    })


    //1. Theme Skins Color change (ACTIVE):
    $('#switcher-theme-custom-color li a').on('click', function(e) {
        if ($("#mascot-primary-theme-color-css").length == 0) {
            $('<link href="" rel="stylesheet" type="text/css" id="mascot-primary-theme-color-css">').appendTo('body');
        }
        var color_code = $(this).data('color-set');
        $(this).parent().parent().find('li').removeClass('active');
        $("#mascot-primary-theme-color-css").attr("href", MascotCore_theme_skin_folder_url + color_code + ".css?" + makeTimeStamp());
        $(this).parent().addClass('active');
        //$.cookie("layout_color", server_url + color_code +".css");
        return false;
    });

    //auto bg image
    $('#switcher-theme-custom-color .color').each(function() {
        $(this).css('background-color', $(this).data("color"));
    });









    //color palatte:
    $(document).on('click', '.tm-color-switcher img', function(el) {
        $('.tm-color-switcher').removeClass('closed');
    });

    $('.tm-color-switcher').on('click', '.close', function(el) {
        $('.tm-color-switcher').addClass('closed');
    });

    $('.tm-color-selector').each(function(i, el) {
        var field = $(el).data('field'),
            bodyStyles = window.getComputedStyle(document.body),
            color = $.trim(bodyStyles.getPropertyValue('--' + field)),
            elId = $(el).attr('id'),
            valId = elId + '-' + 'val';

        $('#' + elId).ColorPicker({
            color: color,
            onShow: function(colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function(colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onChange: function(hsb, hex, rgb) {
                bodyStyles = window.getComputedStyle(document.body);
                $('#' + valId).css('background-color', '#' + hex);
                document.documentElement.style.setProperty('--' + field, '#' + hex, 'important');
            }
        });
    });

    setTimeout(
        function() {
            $('.tm-color-switcher').fadeIn();
        }, 2000
    );

    function ltxColorLuminance(hex, lum) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;
        var rgb = "#",
            c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    }
});