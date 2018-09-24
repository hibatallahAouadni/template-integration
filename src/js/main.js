jQuery(function($) {

    var anchor = window.location.hash;
    $('.tabs').each(function(){
        var current = null;
        var id = $(this).attr('id');
        if(anchor != '' && $(this).find('a[href="' + anchor + '"]').length > 0) {
            current = anchor;
        }else if (Cookies.get('tab' + id) && $(this).find('a[href="' + Cookies.get('tab' + id) + '"]').length > 0) {
            current = Cookies.get('tab' + id);
        }else {
            current = $(this).find('a:first').attr('href');
        }
        if($('.tabs').parent('#services').length != 0) {
            $(this).find('a[href="' + current + '"]').parent('.icon').addClass('active');
        } else {
            $(this).find('a[href="' + current + '"]').addClass('active');
        }
        $(current).siblings().hide();
        $(this).find('a').click(function() {
            var link = $(this).attr('href');
            if( link == current) {
                return false;
            }else {
                if($('.tabs').parent('#services').length != 0) {
                    $(this).parent('.icon').siblings().removeClass('active');
                    $(this).parent('.icon').addClass('active');
                } else {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                }
                $(link).show().siblings().hide();
                current = link;
                Cookies.set('tab' + id, current);
            }
        });
    });

});