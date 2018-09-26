jQuery(function($) {

    var anchor = window.location.hash;
    $('.tabs').each(function(){
        var current = null;
        var id = $(this).attr('id'); console.log(id);
        if(anchor != '' && $(this).find('a[href="' + anchor + '"]').length > 0) {
            current = anchor;
        }else if (Cookies.get('tab' + id) && $(this).find('a[href="' + Cookies.get('tab' + id) + '"]').length > 0) {
            current = Cookies.get('tab' + id);
        }else {
            current = $(this).find('a:first').attr('href');
        }
        console.log(current);
        if($('.tabs').parents('#services').length != 0) {
            $(this).find('a[href="' + current + '"]').addClass('active');
            switch(current) {
                case '#bloc1':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(0%) rotate(45deg)'});
                    break;
                case '#bloc2':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(275%) rotate(45deg)'});
                    break;
                case '#bloc3':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(550%) rotate(45deg)'});
                    break;
                case '#bloc4':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(820%) rotate(45deg)'});
                    break;
                case '#bloc5':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(1090%) rotate(45deg)'});
                    break;
                default: break;
            }
        } else {
            $(this).find('a[href="' + current + '"]').addClass('active');
        }
        $(current).siblings().hide();
        $(this).find('a').click(function(evt) {
            evt.preventDefault();
            var link = $(this).attr('href');
            if( link == current) {
                return false;
            }else {
                if($('.tabs').parents('#services').length != 0) {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    switch($(this).attr('id')) {
                        case 'pos1':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(0%) rotate(45deg)'});
                            break;
                        case 'pos2':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(275%) rotate(45deg)'});
                            break;
                        case 'pos3':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(550%) rotate(45deg)'});
                            break;
                        case 'pos4':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(820%) rotate(45deg)'});
                            break;
                        case 'pos5':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(1090%) rotate(45deg)'});
                            break;
                        default: break;
                    }
                    
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