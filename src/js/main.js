jQuery(function($) {

    var anchor = window.location.hash;

    function filterClients(country, filter) {
        console.log('welcome to filterCients! Country: ' + country + ' && Filter: ' + filter);
    }

    function getCurrent(elem, anchor, id) {
        var current = null;
        if(anchor != '' && elem.find('a[href="' + anchor + '"]').length > 0) {
            current = anchor;
        }else if (Cookies.get('tab' + id) && elem.find('a[href="' + Cookies.get('tab' + id) + '"]').length > 0) {
            current = Cookies.get('tab' + id);
        }else {
            current = elem.find('a:first').attr('href');
        }
        return current;
    }
    
    $('.tabs').each(function(){
        var id = $(this).attr('id');
        if(id == 'references') {
            var current_country = getCurrent($(this).find('#country'), anchor, 'country');
            $(this).find('a[href="' + current_country + '"]').addClass('active');
            var current_filter = getCurrent($(this).find('#filter'), anchor, 'filter');
            $(this).find('a[href="' + current_filter + '"]').addClass('active');
            filterClients(current_country,current_filter);
            $(this).find('a').click(function(evt) {
                evt.preventDefault();
                var link = $(this).attr('href');
                if(link == current_country || link == current_filter) {
                    return false;
                }else {
                    if(link.indexOf('country') > -1) {
                        $(this).siblings().removeClass('active');
                        current_country = link;
                        Cookies.set('tabcountry', current_country);
                    }else {
                        $(this).closest('#filter').find('a').each(function(){
                            $(this).removeClass('active');
                        });
                        current_filter = link;
                        Cookies.set('tabfilter', current_filter);
 
                    }
                    $(this).addClass('active');
                    filterClients(current_country,current_filter);
                }
            });
        } else {
            var current = getCurrent($(this), anchor, id);
            $(this).find('a[href="' + current + '"]').addClass('active');
            switch(current) {
                case '#bloc1':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(0%) rotate(45deg)'});
                    break;
                case '#bloc2':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(250%) rotate(45deg)'});
                    break;
                case '#bloc3':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(500%) rotate(45deg)'});
                    break;
                case '#bloc4':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(750%) rotate(45deg)'});
                    break;
                case '#bloc5':
                    $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(1000%) rotate(45deg)'});
                    break;
                default: break;
            }
            $(current).siblings().hide();
            $(this).find('a').click(function(evt) {
                evt.preventDefault();
                var link = $(this).attr('href');
                if( link == current) {
                    return false;
                }else {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    switch($(this).attr('id')) {
                        case 'pos1':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(0%) rotate(45deg)'});
                            break;
                        case 'pos2':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(250%) rotate(45deg)'});
                            break;
                        case 'pos3':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(500%) rotate(45deg)'});
                            break;
                        case 'pos4':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(750%) rotate(45deg)'});
                            break;
                        case 'pos5':
                            $('.bloc-active').css({'transition': 'transform 1s linear', 'transform': 'translateX(1000%) rotate(45deg)'});
                            break;
                        default: break;
                    }
                    $(link).show().siblings().hide();
                    current = link;
                    Cookies.set('tab' + id, current);
                }
            });
        }
    });
    
});