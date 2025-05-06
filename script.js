let gamespace
let ga_width, ga_height
let player
let shootInterval=0
let shotsdiv, meteoritediv
let projectile_base
let meteorite_base
let proj_width, proj_height, proj_top
let game_timer
let seconds_elapsed=0
let time_since_last_spawn=0
let paused=false
let ship_shielded=false
let ship_hit=false
let base_ship_height, base_ship_width
let spawning_meteorites
let game_logic_repeater

$(function () {
    console.log("Site ready");

    gamespace = $("#gamespace")
    player=$("<img src='spaceship.png' alt='player spaceship' id='player'>");
    projectile_base=$("<img src='spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>");
    shotsdiv=$("#shots")
    meteorite_base = $("<img src='meteorie1.png' alt='meteorite' class='meteorite'>")
    meteoritediv=$("#meteorites")

    let player_loaded=false

    ga_width = gamespace.width();
    ga_height = gamespace.height();


    player.on('load', function () {
        if (!player_loaded) {
            console.log("loaded player")
            player.appendTo(gamespace)
            base_ship_height=player.height()*4
            base_ship_width=player.width()*4
            init_player();
            init_projectile();
            game_logic_repeater=setInterval(game_logic, 1)
            player_loaded=true
        }
    })

    projectile_base.on('load', function () {
        add_ship_eventhandlers()
        console.log("Projectile ready")
    })



    game_timer=setInterval( function () {
        seconds_elapsed+=0.5
        time_since_last_spawn+=0.5
    }, 500)


    meteorite_base.on('load', function () {
        init_meteorite();
        spawning_meteorites=setTimeout(spawn_meteorite, 2000) //should make it with random

    })


    $(gamespace).on('dragstart', function(event) { event.preventDefault(); });
})

function game_logic() {
    move_projectiles()
    move_meteorites()
    detect_projectile_hit()
    if (!ship_shielded) {
        detect_spaceshit_hit()
    }

}

function init_player() {
    $(player).attr({hp:3})
    $(player).css({
        height: base_ship_height,
        width: base_ship_width
    });
    $(player).css({top:ga_height-base_ship_height-50});
}
function add_ship_eventhandlers() {
    $(window).on('mousemove', move_player);
    $(window).on('mousedown', function (event) {
        if (event.which===1) {
            if (shootInterval===0) {
                shootInterval=setInterval(shoot_projectile, 125)
            }
        }
    });
    $(window).on('keydown', function (event) {
        if (parseInt(event.keyCode)===32) {
            if (shootInterval===0) {
                shootInterval=setInterval(shoot_projectile, 125)
            }
        }
        else if (event.keyCode===69) {
            if (!paused) {
                pause_game()
                paused=true
            } else {
                unpause_game()
                paused=false
            }

        }
    });
    $(window).on('mouseup', function (event) {
        if (event.which===1) {
            if (shootInterval !== 0) {
                clearInterval(shootInterval)
            }
            shootInterval = 0
        }
    });
    $(window).on('keyup ', function (event) {
        if (event.keyCode===32) {
            if (shootInterval !== 0) {
                clearInterval(shootInterval)
            }
            shootInterval = 0
        }
    });
}


function move_player(e) {
    let rel_mouse_pos_x = Math.ceil(e.clientX - gamespace.offset().left - base_ship_width/2);
    rel_mouse_pos_x=Math.min(Math.max(rel_mouse_pos_x,-base_ship_width/2+20),ga_width-base_ship_width/2-20);
    $(player).css({
        left:rel_mouse_pos_x
    });
}

function init_projectile() {
    proj_width=4;
    proj_height=24;
    proj_top=ga_height-base_ship_height-50;
    $(projectile_base).css({
        top: proj_top,
        height: proj_height,
        width: proj_width})
}

function move_projectiles() {
    $(".projectile").each(function () {
        $(this).animate({
            top: "-=10"
        }, 1)
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
    if (!ship_hit) {
        shotsdiv.append($(cloneProjectile()).css({
            left: Math.ceil(parseInt($(player).css("left"))+base_ship_width/2-proj_width/2)
        }))
    }

}

function calculate_distance(pos1, pos2) {
    return Math.pow(pos1[0]-pos2[0],2)+Math.pow(pos1[1]-pos2[1],2)
}

function init_meteorite() {
    $(meteorite_base).css({
        top: -21,
        left: 100,
        width: 21, //63 sem rossz tbh
        height: 21
    })
}

function detect_projectile_hit() {
    $(".projectile").each( function (p_index, current_projectile) {
        $(".meteorite").each( function (m_index, current_meteorite) {
            let meteoritepos=[
                parseInt($(current_meteorite).css("left"))+parseInt($(current_meteorite).css("width"))/2,
                parseInt($(current_meteorite).css("top"))+parseInt($(current_meteorite).css("height"))/2
            ]
            let shotpos=[
                parseInt($(current_projectile).css("left"))+parseInt($(current_projectile).css("width"))/2,
                parseInt($(current_projectile).css("top"))
            ]
            if (calculate_distance(meteoritepos, shotpos) <= Math.pow(parseInt($(current_meteorite).css("width"))/2,2)) {
                $(current_meteorite).attr({hp:parseInt($(current_meteorite).attr("hp"))-1})
                if (parseInt($(current_meteorite).attr("hp"))===0) {
                    $(current_meteorite).remove()
                }
                $(current_projectile).remove()
            }
        })
    })
}

function detect_spaceshit_hit() {
    $(".meteorite").each( function () {
        let meteoritepos=[
            parseInt($(this).css("left"))+parseInt($(this).css("width"))/2,
            parseInt($(this).css("top"))+parseInt($(this).css("height"))/2
        ]
        let shippos=[
            parseInt($(player).css("left"))+player.width()/2,
            parseInt($(player).css("top"))+player.height()/4*2.5
        ]
        if (calculate_distance(meteoritepos, shippos) <= Math.pow(player.width()/3*2,2)) {
            register_ship_hit()
        }
    })
}

function register_ship_hit() {
    console.log("Ship hit")
    ship_shielded=true
    ship_hit=true
    $(player).attr({src: "spaceshiphit.gif"})
    setTimeout(function () {
        $(player).attr({src: "spaceshipshielded.png"})
        ship_hit=false
    }, 1000)
    setTimeout(function () {
        $(player).attr({src: "spaceship.png"})
        ship_shielded=false
    }, 4000)
}

function spawn_meteorite() {
    let size=Math.random()
    let hp
    if (size <= 0.2) {
        hp=4
        size = meteorite_base.width()*2
    } else if (size <= 0.4) {
        hp=6
        size = meteorite_base.width()*2.5
    } else if (size <= 0.6) {
        hp=8
        size = meteorite_base.width()*3
    } else if (size <= 0.8) {
        hp=10
        size = meteorite_base.width()*3.5
    } else {
        hp=12
        size = meteorite_base.width()*4
    }

    let fallspeed=0.25+Math.min(seconds_elapsed, 200)*0.0025

    let rotation=Math.random()-0.5
    if (rotation<=0) {
        rotation=rotation*1.5-1.5
    } else {
        rotation=rotation*1.5+1.5
    }

    meteoritediv.append($(cloneMeteor()).css({
        top: -size,
        left: Math.round(Math.random()*(ga_width-size)),
        width: size,
        height: size
    }).attr({
        hp: hp,
        meteorrotation: rotation,
        fallspeed: fallspeed
    }))
    time_since_last_spawn=0
    spawning_meteorites=setTimeout(spawn_meteorite,2000-Math.min(200,seconds_elapsed)*4)

}

function move_meteorites() {
    $(".meteorite").each(function () {
        let fallspeed = $(this).attr("fallspeed")

        let rotation = $(this).attr("meteorrotation")
        let sign = rotation<0 ? "-=" : "+="
        $(this).animate({rotate: sign+Math.abs(rotation)+"deg"},1, "linear")
        $(this).css( {top: "+="+fallspeed})
        if (parseInt($(this).css("top")) >= ga_height) {
            $(this).remove()
        }
    })
}

function pause_game() {
    clearTimeout(spawning_meteorites)
    clearInterval(game_logic_repeater)
    $(".meteorite").each(function () {
        $(this).stop(true)
    })
    $(".projectile").each(function () {
        $(this).stop(true)
    })
    $(window).off("mousemove mousedown mouseup keyup")
    clearInterval(game_timer)
    //time_since_last_spawn for next meteorite spawn
}

function unpause_game() {
    spawning_meteorites=setTimeout(spawn_meteorite,2000-Math.min(200,seconds_elapsed)*4-time_since_last_spawn)
    game_logic_repeater=setInterval(game_logic,1)
    add_ship_eventhandlers()
    game_timer=setInterval( function () {
        seconds_elapsed+=0.5
        time_since_last_spawn+=0.5
    }, 500)
}