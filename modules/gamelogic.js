import {cloneAsteroid, getAsteroidBase, getAsteroidStateFrame, update_shot_asteroid} from "./asteroid.js";
import {add_ship_eventhandlers, getShip, getShipWidth, isShipShielded, register_ship_hit} from "./ship.js";
self.seconds_elapsed=0
self.time_since_last_spawn=0

export function setGameLogicLoop(game_logic_loop) {
    self.game_logic_loop=game_logic_loop
}

export function getGameLogicLoop() {
    return game_logic_loop
}

export function setSecondsElapsed(seconds_elapsed) {
    self.seconds_elapsed=seconds_elapsed
}

export function getSecondsElapsed() {
    return self.seconds_elapsed
}

export function addSecondsElapsed(time) {
    self.seconds_elapsed+=time
}

export function setTimeSinceLastSpawn(time_since_last_spawn) {
    self.time_since_last_spawn=time_since_last_spawn
}

export function getTimeSinceLastSpawn() {
    return self.time_since_last_spawn
}

export function addTimeSinceLastSpawn(time) {
    self.time_since_last_spawn+=time
}

export function setAsteroidSpawner(asteroide_spawner) {
    self.asteroide_spawner=asteroide_spawner
}

export function getAsteroidSpawner() {
    return asteroide_spawner
}

export function setShotsDiv($shotsdiv) {
    self.$shotsdiv=$shotsdiv
}
export function getShotsDiv() {
    return self.$shotsdiv
}
export function setAsteroidDiv($asteroiddiv) {
    self.$asteroiddiv=$asteroiddiv
}
export function getAsteroidDiv() {
    return self.$asteroiddiv
}

export function setGameSpace($gamespace) {
    self.$gamespace = $gamespace
    self.gamespace_width=$gamespace.width()
    self.gamespace_height=$gamespace.height()
}

export function getGameSpace() {
    return self.$gamespace
}

export function setGameSpaceHeight(gamespace_height) {
    self.gamespace_height = gamespace_height
}

export function getGameSpaceHeight() {
    return self.gamespace_height
}

export function setGameSpaceWidth(gamespace_width) {
    self.gamespace_width = gamespace_width
}

export function getGameSpaceWidth() {
    return self.gamespace_width
}


//actual functions
export function calculate_distance(pos1, pos2) {
    return Math.pow(pos1[0]-pos2[0],2)+Math.pow(pos1[1]-pos2[1],2)
}

export function game_logic() {
    move_projectiles()
    move_meteorites()
    detect_projectile_hit()
    if (!isShipShielded()) {
        detect_spaceshit_hit()
    }
    addSecondsElapsed(1)
    addTimeSinceLastSpawn(1)
    store_animation_states(1)
}

export function move_player(e) {
    let rel_mouse_pos_x = Math.ceil(e.clientX - self.$gamespace.offset().left - getShipWidth()/2);
    //console.log(getShipWidth())
    rel_mouse_pos_x=Math.min(Math.max(rel_mouse_pos_x,-getShipWidth()/2+20),self.gamespace_width-getShipWidth()/2-20);
    $(getShip()).css({
        left:rel_mouse_pos_x
    });
}

export function move_projectiles() {
    $(".projectile").each(function () {
        $(this).animate({
            top: "-=10"
        }, 1)
        if (parseInt($(this).css("top")) <= -20) {
            $(this).remove()
        }

    })
}

export function move_meteorites() {
    $(".meteorite").each(function () {
        let fallspeed = $(this).attr("fallspeed")

        let rotation = $(this).attr("meteorrotation")
        let sign = rotation<0 ? "-=" : "+="
        $(this).animate({rotate: sign+Math.abs(rotation)+"deg"},1, "linear")
        $(this).css( {top: "+="+fallspeed})
        if (parseInt($(this).css("top")) >= gamespace_height) {
            $(this).remove()
        }
    })
}

export function store_animation_states(time) {
    $(".explosion").each(function () {
        let anim_time = parseInt($(this).attr("animtimepassed"))+time
        $(this).attr({
            animtimepassed:anim_time
        })
    })
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
            parseInt($(getShip()).css("left"))+getShip().width()/2,
            parseInt($(getShip()).css("top"))+getShip().height()/4*2.5
        ]
        if (calculate_distance(meteoritepos, shippos) <= Math.pow(getShip().width()/3*2,2)) {
            register_ship_hit()
        }
    })
}

export function spawn_asteroid() {
    let size=Math.random()
    let hp
    let img
    let asteroidsize
    if (size <= 0.2) {
        hp=4
        asteroidsize=1
        size =  getAsteroidBase().width()*2
        img=getAsteroidStateFrame(4)
    } else if (size <= 0.4) {
        hp=6
        asteroidsize=2
        size = getAsteroidBase().width()*2.5
        img=getAsteroidStateFrame(3)
    } else if (size <= 0.6) {
        hp=8
        asteroidsize=3
        size = getAsteroidBase().width()*3
        img=getAsteroidStateFrame(2)
    } else if (size <= 0.8) {
        hp=10
        asteroidsize=4
        size = getAsteroidBase().width()*3.5
        img=getAsteroidStateFrame(1)
    } else {
        hp=12
        asteroidsize=5
        size = getAsteroidBase().width()*4
        img=getAsteroidStateFrame(0)
    }

    let fallspeed=0.25+Math.min(seconds_elapsed, 200)*0.0025

    let rotation=Math.random()-0.5
    if (rotation<=0) {
        rotation=rotation-0.5
    } else {
        rotation=rotation+0.5
    }

    getShotsDiv().append($(cloneAsteroid()).css({
        top: -size,
        left: Math.round(Math.random()*(getGameSpaceWidth()-size)),
        width: size,
        height: size
    }).attr({
        src: img.src,
        hp: hp,
        asteroidsize: asteroidsize,
        meteorrotation: rotation,
        fallspeed: fallspeed
    }))
    setTimeSinceLastSpawn(0)
    setAsteroidSpawner(setTimeout(spawn_asteroid,2000-Math.min(200,seconds_elapsed)*4))
}

export function pause_game() {
    clearTimeout(getAsteroidSpawner())
    clearInterval(game_logic_loop)
    $(".meteorite").each(function () {
        $(this).stop(true)
    })
    $(".projectile").each(function () {
        $(this).stop(true)
    })
    $(window).off("mousemove mousedown mouseup keyup")
}

export function unpause_game() {
    setAsteroidSpawner(setTimeout(spawn_asteroid,2000-Math.min(200,seconds_elapsed)*4-time_since_last_spawn))
    setGameLogicLoop(setInterval(game_logic,1))
    add_ship_eventhandlers()
}