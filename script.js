let gamespace
let ga_width, ga_height
let player
let player_width, player_height
let shootInterval=0
let shotsdiv, meteoritediv
let projectile_base
let proj_width, proj_height

$(function () {
    console.log("Site ready");

    gamespace = $("#gamespace")
    player=$("<img src='spaceship.png' alt='player spaceship' id='player'>");
    projectile_base=$("<img src='spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>");
    shotsdiv=$("#shots")
    meteorite_base=$("<img src='meteorie1.png' alt='meteorite' class='meteorite'>")
    meteoritediv=$("#meteorites")

    ga_width = gamespace.width();
    ga_height = gamespace.height();

    gamespace.append(player)

    player.on('load', function () {
        init_player();
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
            console.log("Projectile ready")
        })
        game_logic=setInterval(game_logic, 1)
    })


    meteorite_base.on('load', function () {
        init_meteorite();
        spawning_meteorites=setInterval(spawn_meteorite, 2000) //should make it with random

    })

    $(window).on('mousemove', move_player);

    $(gamespace).on('dragstart', function(event) { event.preventDefault(); });
})

function game_logic() {
    move_projectiles()
    move_meteorites()
    detect_projectile_hit()
}

function init_player() {
    $(player).css({
        height: 84
    });
    player_width = player.width();
    player_height = player.height();
    $(player).css({top:ga_height-player_height-50});
}

function move_player(e) {
    let rel_mouse_pos_x = Math.ceil(e.clientX - gamespace.offset().left - player_width/2);
    rel_mouse_pos_x=Math.min(Math.max(rel_mouse_pos_x,-player_width/2+20),ga_width-player_width/2-20);
    $(player).css({
        left:rel_mouse_pos_x
    });
}

function init_projectile() {
    $(projectile_base).css({
        height: 24,
        width: 4
    });
    proj_width=projectile_base.width();
    proj_height=projectile_base.height();
    $(projectile_base.css({top: ga_height-50-player_height-30}))
    console.log("Projectile ready")
}

function move_projectiles() {
    $(".projectile").each(function () {
        $(this).animate({
            top: "-40"
        }, 500, "linear")
        if (parseInt($(this).css("top")) <= -20) {
            $(this).remove()
        }

    })
}

function cloneProjectile(){
    return $(projectile_base)[0].cloneNode(true)
}

function cloneMeteor(){
    return $(meteorite_base)[0].cloneNode(true)
}

function shoot_projectile() {
    shotsdiv.append($(cloneProjectile()).css({
        left: Math.ceil(parseInt($(player).css("left"))+player_width/2-proj_width/2)
    }))
}

function calculate_distance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1[0]-pos2[0],2)+Math.pow(pos1[1]-pos2[1],2))
}

function init_meteorite() {
    $(meteorite_base).css({
        top: -200,
        left: 100,
        width: 84, //63 sem rossz tbh
        height: 84
    })
}

function detect_projectile_hit() {
    $(".projectile").each( function (p_index, current_projectile) {
        $(".meteorite").each( function (m_index, current_meteorite) {
            meteoritepos=[parseInt($(current_meteorite).css("left"))+parseInt($(current_meteorite).css("width"))/2,parseInt($(current_meteorite).css("top"))+parseInt($(current_meteorite).css("height"))/2]
            shotpos=[parseInt($(current_projectile).css("left"))+parseInt($(current_projectile).css("width"))/2,parseInt($(current_projectile).css("top"))]

            if (calculate_distance(meteoritepos, shotpos) <= meteorite_base.width()/2+0.05) {
                $(current_projectile).remove()
            }
        })
    })

}

function spawn_meteorite() {
    meteoritediv.append($(cloneMeteor()).css({
        top: -200,
        left: Math.round(Math.random()*(ga_width-meteorite_base.width())),
        width: 84, //63 sem rossz tbh
        height: 84
    }))
}

function move_meteorites() {
    $(".meteorite").each(function () {
        $(this).animate({top: ga_height+10, rotate: "+180deg"},15000, "linear")
        if (parseInt($(this).css("top")) >= ga_height) {
            $(this).remove()
        }
    })
}