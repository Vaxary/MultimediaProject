import {
    addAsteroid,
    Asteroid,
    getAsteroids,
    getDestroyedAsteroids
} from "./asteroid.js";
import {add_ship_eventhandlers, getShip, getShipWidth, isShipShielded, register_ship_hit} from "./ship.js";
self.seconds_elapsed=0
self.time_since_last_spawn=0
self.paused=false

export function startGameLogicLoop() {
    self.game_logic_loop=setInterval(function () {
        move_projectiles()
        moveAsteroids()
        rotateDestroyedAsteroids()
        detect_projectile_hit()
        if (!isShipShielded()) {
            detect_spaceshit_hit()
        }
        updateAnimationTimes(1)
    },1)
}

export function clearGameLogicLoop() {
    clearInterval(game_logic_loop)
}

export function startSecondCounter() {
    self.second_counter=setInterval(function () {
        addSecondsElapsed(1)
        addTimeSinceLastAsteroidSpawn(1)
    },1000)
}

export function clearSecondCounter() {
    clearInterval(self.second_counter)
}

export function isPaused() {
    return self.paused
}

export function setPaused(paused) {
    self.paused=paused
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

export function setTimeSinceLastAsteroidSpawn(time_since_last_spawn) {
    self.time_since_last_spawn=time_since_last_spawn
}

export function getTimeSinceLastAsteroidSpawn() {
    return self.time_since_last_spawn
}

export function addTimeSinceLastAsteroidSpawn(time) {
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

export function move_player(e) {
    let rel_mouse_pos_x = Math.ceil(e.clientX - self.$gamespace.offset().left - getShipWidth()/2);
    //console.log(getShipWidth())
    rel_mouse_pos_x=Math.min(Math.max(rel_mouse_pos_x,-getShipWidth()/2+20),self.gamespace_width-getShipWidth()/2-20);
    $(getShip()).css({
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

function moveAsteroids() {
    getAsteroids().forEach(function (current_asteroid) {
        let sign = current_asteroid.rotationspeed<0 ? "-=" : "+="
        $(current_asteroid.$asteroid).animate({rotate: sign+Math.abs(current_asteroid.rotationspeed)+"deg"},1, "linear")
        $(current_asteroid.$asteroid).css( {top: "+="+current_asteroid.fallspeed})
        if (parseInt($(current_asteroid.$asteroid).css("top")) >= getGameSpaceHeight()) {
            $(current_asteroid.$asteroid).remove()
            getAsteroids().splice(current_asteroid.index, 1)
            current_asteroid.updateAsteroidArrayIndexes()
        }
    })
}

function rotateDestroyedAsteroids() {
    getDestroyedAsteroids().forEach(function (current_destroyed_asteroid) {
        let sign = current_destroyed_asteroid.rotationspeed<0 ? "-=" : "+="
        $(current_destroyed_asteroid.$asteroid).animate({rotate: sign+Math.abs(current_destroyed_asteroid.rotationspeed)+"deg"},1, "linear")
    })
}

export function updateAnimationTimes(time) {
    getDestroyedAsteroids().forEach(asteroid=>{
        asteroid.updateAsteroidDestroyedCurrentAnimtime(time)
    })
}

function detect_projectile_hit() {
    $(".projectile").each( function (p_index, current_projectile) {
        getAsteroids().forEach(function (current_asteroid) {

            let asteroidpos=[
                parseInt($(current_asteroid.$asteroid).css("left"))+parseInt($(current_asteroid.$asteroid).css("width"))/2,
                parseInt($(current_asteroid.$asteroid).css("top"))+parseInt($(current_asteroid.$asteroid).css("height"))/2
            ]
            //console.log(asteroidpos)

            let shotposl=[
                parseInt($(current_projectile).css("left")),
                parseInt($(current_projectile).css("top"))
            ]
            let shotposr=[
                parseInt($(current_projectile).css("left"))+parseInt($(current_projectile).css("width")),
                parseInt($(current_projectile).css("top"))
            ]
            if (calculate_distance(asteroidpos, shotposl) <= Math.pow(parseInt($(current_asteroid.$asteroid).css("width"))/2,2) ||
                calculate_distance(asteroidpos, shotposr) <= Math.pow(parseInt($(current_asteroid.$asteroid).css("width"))/2,2)) {
                current_asteroid.registerHit(current_projectile)
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
    let rotation=Math.random()-0.5
    if (rotation<=0) {
        rotation=rotation-0.5
    } else {
        rotation=rotation+0.5
    }

    let spawned_asteroid = new Asteroid(
        Math.random(),
        0.25+Math.min(getSecondsElapsed(), 200)*0.0025,
        rotation,
        getAsteroids().length
    );

    addAsteroid(spawned_asteroid)
    getAsteroidDiv().append($(spawned_asteroid.$asteroid))
    setTimeSinceLastAsteroidSpawn(0)
    setAsteroidSpawner(setTimeout(spawn_asteroid,2000-Math.min(200,getSecondsElapsed())*4))
}

export function pauseGame() {
    clearTimeout(getAsteroidSpawner())
    clearGameLogicLoop()
    clearSecondCounter()
    getAsteroids().forEach(element => {
        $(element.$asteroid).stop(true)
    })
    getDestroyedAsteroids().forEach(element => {
        clearTimeout(element.animtimeout)
        $(element.$asteroid).stop(true)
    })
    $(".projectile").each(function () {
        $(this).stop(true)
    })
    $(window).off("mousemove mousedown mouseup keyup")
}

export function unpauseGame() {
    setAsteroidSpawner(setTimeout(spawn_asteroid,2000-Math.min(200,seconds_elapsed)*4-time_since_last_spawn))
    startGameLogicLoop()
    startSecondCounter()
    add_ship_eventhandlers()
    getDestroyedAsteroids().forEach(element => {
        element.continueAsteroidDestroyAnimation()
    })
}