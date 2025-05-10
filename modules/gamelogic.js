import {
    addAsteroid,
    Asteroid,
    getAsteroids,
    getDestroyedAsteroids
} from "./asteroid.js";
import {
    getShip,
    getShipHpIndicatorIcon,
    getShipHpIndicatorImg, initializeShip
} from "./ship.js";
import {loadShip} from "./initialization.js";
self.seconds_elapsed=0
self.time_since_last_spawn=0
self.pause_button_img=[]
self.paused=true


export function startGameLogicLoop() {
    self.game_logic_loop=setInterval(function () {
        moveProjectiles()
        moveAsteroids()
        rotateDestroyedAsteroids()
        detect_projectile_hit()
        if (!getShip.shielded) {
            detect_spaceshit_hit()
        }
        updateAnimationTimes(1)
        addTimeSinceLastAsteroidSpawn(1)
    },1)
}

export function clearGameLogicLoop() {
    clearInterval(game_logic_loop)
}

export function startSecondCounter() {
    self.second_counter=setInterval(function () {
        addSecondsElapsed(1)
    },1000)
}

export function clearSecondCounter() {
    clearInterval(self.second_counter)
}

export function startLoadingInterval() {
    self.$loader=setInterval(function () {
        getLoadingIcon().animate({rotate: "+=10deg"},20)
    },5)
}

export function clearLoadingInterval() {
    clearInterval(self.$loader)
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

export function setAsteroidSpawner(asteroid_spawner) {
    self.asteroid_spawner=asteroid_spawner
}

export function getAsteroidSpawner() {
    return asteroid_spawner
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

export function setShipHpBox($ship_hpbox) {
    self.$ship_hpbox=$ship_hpbox
}

export function getShipHpBox() {
    return self.$ship_hpbox
}

export function updateShipHpBox() {
    getShipHpIndicatorIcon(getShip().hp).attr({src:getShipHpIndicatorImg(0).src}).animate({scale: 0.5},50).animate({scale: 1.2},75).animate({scale: 1},75)
}

export function refillShipHpBox() {
    for (let i = 0; i < getShip().hp; i++) {
        getShipHpIndicatorIcon(i).attr({src:getShipHpIndicatorImg(1).src})
    }
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

export function setSoundSlider($sound_slider) {
    self.$sound_slider=$sound_slider
}

export function getSoundSlider() {
    return self.$sound_slider
}

export function setPauseButton($pause_button) {
    self.$pause_button=$pause_button
}

export function getPauseButton() {
    return self.$pause_button
}

export function setRestartOverlay($restart_overlay) {
    self.$restart_overlay=$restart_overlay
}

export function getRestartOverlay() {
    return $restart_overlay
}

export function setRestartButton($restart_button) {
    self.$restart_button=$restart_button
}

export function getRestartButton() {
    return self.$restart_button
}

export function setRestartLabel($restart_label) {
    return self.$restart_label=$restart_label
}

export function getRestartLabel() {
    return self.$restart_label
}

export function setStartGameLabel($startgame_label) {
    return self.$startgame_label=$startgame_label
}

export function getStartGameLabel() {
    return self.$startgame_label
}

export function addPauseButtonImg(pause_button_img) {
    self.pause_button_img.push(pause_button_img)
}

export function getPauseButtonImg(i) {
    return self.pause_button_img[i]
}

export function setScoreLabel($score_label) {
    self.$score_label=$score_label
}

export function getScoreLabel() {
    return self.$score_label
}

export function updateScoreLabel() {
    self.$score_label.text("Score: "+getShip().score)
}

export function setPauseScreen($pause_screen) {
    self.$pause_screen=$pause_screen
}

export function getPauseScreen() {
    return self.$pause_screen
}

export function setLoadingIcon($loading_icon) {
    self.$loading_icon=$loading_icon
}

export function getLoadingIcon() {
    return self.$loading_icon
}

export function setLoadingOverlay($loading_overlay) {
    self.$loading_overlay=$loading_overlay
}

export function getLoadingOverlay() {
    return self.$loading_overlay
}


//actual functions
//moving stuff
function moveProjectiles() {
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
            //getShip().registerPlanetHit()
        }
    })
}

function rotateDestroyedAsteroids() {
    getDestroyedAsteroids().forEach(function (current_destroyed_asteroid) {
        let sign = current_destroyed_asteroid.rotationspeed<0 ? "-=" : "+="
        $(current_destroyed_asteroid.$asteroid).animate({rotate: sign+Math.abs(current_destroyed_asteroid.rotationspeed)+"deg"},1, "linear")
    })
}

export function animateButton($button) {
    $($button).animate({scale: 1.25},75).animate({scale: 1},75)
}

//hit detection
export function calculate_distance(pos1, pos2) {
    return Math.pow(pos1[0]-pos2[0],2)+Math.pow(pos1[1]-pos2[1],2)
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
    if (!getShip().shielded) {
        getAsteroids().forEach(asteroid=>{
            let asteroidradius=parseInt($(asteroid.$asteroid).css("width"))/2
            let asteroidpos=[
                parseInt($(asteroid.$asteroid).css("left"))+parseInt($(asteroid.$asteroid).css("width"))/2,
                parseInt($(asteroid.$asteroid).css("top"))+parseInt($(asteroid.$asteroid).css("height"))/2
            ]
            let shipposleft=[
                getShip().pos+getShip().width/3.75,
                getShip().top+getShip().height/7*5,
                getShip().width/3.6
            ]
            let shipposright=[
                getShip().pos+(getShip().width-getShip().width/3.75),
                getShip().top+getShip().height/7*5,
                getShip().width/3.6
            ]
            let shippostop=[
                getShip().pos+getShip().width/2,
                getShip().top+getShip().height/4,
                getShip().width/4
            ]
            if (calculate_distance(asteroidpos, shipposleft) <= Math.pow(shipposleft[2]+asteroidradius,2) ||
                calculate_distance(asteroidpos, shipposright) <= Math.pow(shipposright[2]+asteroidradius,2) ||
                calculate_distance(asteroidpos, shippostop) <= Math.pow(shippostop[2]+asteroidradius,2)) {
                getShip().register_ship_hit()
            }
        })
    }

}

//asteroid functions

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

export function updateAnimationTimes(time) {
    getDestroyedAsteroids().forEach(asteroid=>{
        asteroid.updateAsteroidDestroyedCurrentAnimtime(time)
    })
    if (getShip().shielded) {
        getShip().addAnimationTime(time)
    }
}

//pause unpause

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
    clearTimeout(getShip().animtimeout)
    getShip().disableShipEventhandlers()
    getPauseScreen().show()
    $(getPauseButton()).css({
        "background-image": "url("+getPauseButtonImg(1).src+")"
    })
}

export function unpauseGame() {
    setAsteroidSpawner(setTimeout(spawn_asteroid,2000-Math.min(200,seconds_elapsed)*4-time_since_last_spawn))
    startGameLogicLoop()
    startSecondCounter()
    getShip().enableShipEventhandlers()
    getDestroyedAsteroids().forEach(element => {
        element.continueAsteroidDestroyAnimation()
    })
    if (getShip().shielded) {
        getShip().continueShipHitAnimation()
    }
    getPauseScreen().hide()
    $(getPauseButton()).css({
        "background-image": "url("+getPauseButtonImg(0).src+")",
    })
}

export function togglePause() {
    togglePauseWithoutAnimations()
    $(getPauseButton()).stop(true)
    animateButton(getPauseButton())
}

export function togglePauseWithoutAnimations() {
    if (!isPaused()) {
        setPaused(true)
        pauseGame()
    } else {
        setPaused(false)
        unpauseGame()
    }
}

export function setUpAfterStartGame() {
    getStartGameLabel().remove()
    $(getPauseButton()).on('click', togglePause)
    $(getPauseButton()).css({left: '', top: ''})
    $(getShipHpBox()).show()
    $(getScoreLabel()).show()
}

export function finishLoading() {
    getStartGameLabel().show()
    clearLoadingInterval()
    getLoadingOverlay().remove()
}

export function restartGame() {
    $(getRestartOverlay()).hide()
    clearGameLogicLoop()
    clearSecondCounter()
    clearTimeout(getAsteroidSpawner())
    setSecondsElapsed(0)
    setTimeSinceLastAsteroidSpawn(0)
    initializeShip()
    refillShipHpBox()
    updateScoreLabel()

    getAsteroids().forEach(element => {
        $(element.$asteroid).remove()
    })
    getAsteroids().splice(0,getAsteroids().length)

    getDestroyedAsteroids().forEach(element => {
        clearTimeout(element.animtimeout)
        $(element.$asteroid).remove()
    })
    getDestroyedAsteroids().splice(0,getDestroyedAsteroids().length)

    $(".projectile").each(function () {
        $(this).remove()
    })

    $(getShip().$ship).on('load', loadShip)
    $(getPauseButton()).on("click", togglePause).show()
    togglePauseWithoutAnimations()

    //getPauseScreen().show()
}