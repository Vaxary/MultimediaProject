import {ship_width, ship, ship_shielded} from "./ship.js";
import {game_logic_loop, gamespace, gamespace_width} from "./values.js";

export function game_logic() {
    move_projectiles()
    move_meteorites()
    detect_projectile_hit()
    if (!ship_shielded) {
        detect_spaceshit_hit()
    }
}

export function move_player(e) {
    let rel_mouse_pos_x = Math.ceil(e.clientX - $('#gamespace').offset().left - ship_width/2);
    rel_mouse_pos_x=Math.min(Math.max(rel_mouse_pos_x,-ship_width/2+20),gamespace_width-ship_width/2-20);
    $(ship).css({
        left:rel_mouse_pos_x
    });
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

export function store_animation_states() {
    $(".explosion").each(function () {
        let anim_time = parseInt($(this).attr("animtimepassed"))+0.5
        $(this).attr({
            animtimepassed:anim_time
        })
    })
}

function calculate_distance(pos1, pos2) {
    return Math.pow(pos1[0]-pos2[0],2)+Math.pow(pos1[1]-pos2[1],2)
}

function detect_projectile_hit() {
    $(".projectile").each( function (p_index, current_projectile) {
        $(".meteorite").each( function (m_index, current_meteorite) {
            let meteoritepos=[
                parseInt($(current_meteorite).css("left"))+parseInt($(current_meteorite).css("width"))/2,
                parseInt($(current_meteorite).css("top"))+parseInt($(current_meteorite).css("height"))/2
            ]
            let shotposl=[
                parseInt($(current_projectile).css("left")),
                parseInt($(current_projectile).css("top"))
            ]
            let shotposr=[
                parseInt($(current_projectile).css("left"))+parseInt($(current_projectile).css("width")),
                parseInt($(current_projectile).css("top"))
            ]
            if (calculate_distance(meteoritepos, shotposl) <= Math.pow(parseInt($(current_meteorite).css("width"))/2,2) ||
                calculate_distance(meteoritepos, shotposr) <= Math.pow(parseInt($(current_meteorite).css("width"))/2,2)) {
                update_shot_asteroid(current_meteorite, current_projectile)
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

export function spawn_meteorite() {
    let size=Math.random()
    let hp
    let img
    if (size <= 0.2) {
        hp=4
        size = meteorite_base.width()*2
        img=asteroid_states[4]
    } else if (size <= 0.4) {
        hp=6
        size = meteorite_base.width()*2.5
        img=asteroid_states[3]
    } else if (size <= 0.6) {
        hp=8
        size = meteorite_base.width()*3
        img=asteroid_states[2]
    } else if (size <= 0.8) {
        hp=10
        size = meteorite_base.width()*3.5
        img=asteroid_states[1]
    } else {
        hp=12
        size = meteorite_base.width()*4
        img=asteroid_states[0]
    }

    let fallspeed=0.25+Math.min(seconds_elapsed, 200)*0.0025

    let rotation=Math.random()-0.5
    if (rotation<=0) {
        rotation=rotation-0.5
    } else {
        rotation=rotation+0.5
    }

    meteoritediv.append($(cloneMeteor()).css({
        top: -size,
        left: Math.round(Math.random()*(ga_width-size)),
        width: size,
        height: size
    }).attr({
        src: img.src,
        hp: hp,
        meteorrotation: rotation,
        fallspeed: fallspeed
    }))
    time_since_last_spawn=0
    spawning_meteorites=setTimeout(spawn_meteorite,2000-Math.min(200,seconds_elapsed)*4)
}

export function pause_game() {
    clearTimeout(spawning_meteorites)
    clearInterval(game_logic_loop)
    $(".meteorite").each(function () {
        $(this).stop(true)
    })
    $(".projectile").each(function () {
        $(this).stop(true)
    })
    $(window).off("mousemove mousedown mouseup keyup")
    clearInterval(game_timer)
}

export function unpause_game() {
    spawning_meteorites=setTimeout(spawn_meteorite,2000-Math.min(200,seconds_elapsed)*4-time_since_last_spawn)
    game_logic_loop=setInterval(game_logic,1)
    add_ship_eventhandlers()
    game_timer=setInterval( function () {
        seconds_elapsed+=0.5
        time_since_last_spawn+=0.5
    }, 500)
}