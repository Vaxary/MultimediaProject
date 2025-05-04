let gamespace
let ga_width, ga_height
let player
let player_width, player_height
let shootInterval=0
let shots=[]
let projectile_base
let projectile_img
let proj_width, proj_height

$(function () {
    console.log("Site ready");

    gamespace = $("#gamespace")
    player=$("<img src='spaceship.png' alt='player spaceship' id='player'>");
    projectile_img="<img src='spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>"
    projectile_base=$("<img src='spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>");

    ga_width = gamespace.width();
    ga_height = gamespace.height();

    gamespace.append(player)

    moving_shots=setInterval(move_projectiles, 1)


    player.on('load', function () {
        init_player();
    })

    projectile_base.on('load', function () {
        init_projectile();
        $(window).on('mousedown', function () {
            if (shootInterval===0) {
                shootInterval=setInterval(shoot_projectile, 75)
                $(window).trigger('mousedown')
            }

        });
        $(window).on('mouseup', function () {
            if (shootInterval!==0) {
                clearInterval(shootInterval)
            }
            shootInterval=0
        });
    })

    $(window).on('mousemove', move_player);

    $(player).on('dragstart', function(event) { event.preventDefault(); });
})

function init_player() {
    $(player).css({
        height: 84
    });
    player_width = player.width();
    player_height = player.height();
    $(player).css({top:ga_height-player_height-50});
}

function init_projectile() {
    $(projectile_base).css({
        height: 24
    });
    proj_width=projectile_base.width();
    proj_height=projectile_base.height();
    $(projectile_base.css({top: ga_height-50-player_height-30}))
}

function move_player(e) {
    let rel_mouse_pos_x = Math.ceil(e.clientX - gamespace.offset().left - player_width/2);
    rel_mouse_pos_x=Math.min(Math.max(rel_mouse_pos_x,-player_width/2+20),ga_width-player_width/2-20);
    $(player).css({
        left:rel_mouse_pos_x
    });
}

function cloneProjectile(){
    return $(projectile_base)[0].cloneNode(true)
}

function shoot_projectile() {
    shots.push(cloneProjectile())
    $(shots.at(shots.length-1)).css({
        left: Math.ceil(parseInt($(player).css("left"))+player_width/2-5)
    })
    gamespace.append(shots.at(shots.length-1))
}

function move_projectiles() {
    shots.forEach(function (shot, index) {
        $(shot).animate({
            top: "-20"
        }, 500, "linear")
        console.log($(shot).css("top"))
        if (parseInt($(shot).css("top")) <= -20) {
            shots.splice(index, 1)
            $(shot).remove()
        }
    })
}