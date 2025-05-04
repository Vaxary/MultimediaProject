let gamespace
let ga_width, ga_height
let player
let player_width, player_height

$(function () {
    console.log("Site ready");

    gamespace = $("#gamespace")
    player=$("<img src='spaceship.png' alt='player spaceship' id='player'>");

    ga_width = gamespace.width();
    ga_height = gamespace.height();

    gamespace.append(player)

    player.on('load', function () {
        init_player();
    })

    $(window).on('mousemove', move_player);
    $(player).on('dragstart', function(event) { event.preventDefault(); });



    //let player_height = player.height();
})

function init_player() {
    $(player).css({
        height: 84
    });
    player_width = player.width();
    player_height = player.height();
    $(player).css({top:ga_height-player_height-50})
}

function move_player(e) {
    let rel_mouse_pos_x = Math.ceil(e.clientX - gamespace.offset().left - player_width/2)
    rel_mouse_pos_x=Math.min(Math.max(rel_mouse_pos_x,-player_width/2+20),ga_width-player_width/2-20)
    $(player).css(
        {left:rel_mouse_pos_x})
}
