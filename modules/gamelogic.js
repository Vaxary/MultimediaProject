import {
    addAsteroid,
    Asteroid,
    getAsteroids,
    getDestroyedAsteroids, getIsThereSpecial, getPowerups, setIsThereSpecial
} from "./asteroid.js";
import {
    getShip, getShootpatterLength,
    initializeShip
} from "./ship.js";
import {loadShip} from "./initialization.js";
import {
    getLoadingIcon,
    getPauseButton,
    getPauseButtonImg,
    getPauseScreen,
    getRestartOverlay,
    getScoreLabel,
    getScoreNameInput, getScorePlaceholder,
    getScoreSaveButton,
    getScoreSystem, getScoreTable,
    getShipHpBox, getSoundSlider,
    getStartGameLabel,
    refillShipHpBox,
    togglePause, togglePauseWithoutAnimations,
    updateScoreLabel
} from "./uilogic.js";
import {getProjectiles} from "./projectile.js";
self.miliseconds_elapsed=0
self.time_since_last_spawn=0
self.saved_sound=50
self.pause_button_img=[]
self.paused=true
const game_update_time=10

export function startGameLogicLoop() {
    self.game_logic_loop=setInterval(function () {
        moveProjectiles(game_update_time)
        moveAsteroids(game_update_time)
        movePowerups(game_update_time)
        rotateDestroyedAsteroids(game_update_time)
        detectProjectileHit()
        detectSpaceshipPickup()
        detectSpaceshipHit()
        updateAnimationTimes(game_update_time)
        addTimeSinceLastAsteroidSpawn(game_update_time)
        addMiliSecondsElapsed(game_update_time)
    },game_update_time)
}

export function clearGameLogicLoop() {
    clearInterval(game_logic_loop)
}

export function startLoadingInterval() {
    self.$loader=setInterval(function () {
        getLoadingIcon().animate({rotate: "+=10deg"},20,"linear")
    },5)
}

export function clearLoadingInterval() {
    clearInterval(self.$loader)
}

export function setMiliSecondsElapsed(miliseconds_elapsed) {
    self.miliseconds_elapsed=miliseconds_elapsed
}

export function getMiliSecondsElapsed() {
    return self.miliseconds_elapsed
}

export function addMiliSecondsElapsed(time) {
    self.miliseconds_elapsed+=time
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

export function setGameSpace($gamespace) {
    self.$gamespace = $gamespace
    self.gamespace_width=$gamespace.width()
    self.gamespace_height=$gamespace.height()
}

export function getGameSpace() {
    return self.$gamespace
}

export function getGameSpaceHeight() {
    return self.gamespace_height
}

export function getGameSpaceWidth() {
    return self.gamespace_width
}

//actual functions
//moving stuff
function moveProjectiles(time) {
    let speed=15*time/10
    getProjectiles().forEach(function (current_projectile) {
        //console.log( $(current_projectile.$projectile).css("top"))
        $(current_projectile.$projectile).animate({
            top: "-="+speed
        }, time, "linear").animate({
            top: "-="+speed
        }, time, "linear")
        if (parseInt($(current_projectile.$projectile).css("top")) <= -20) {
            current_projectile.remove()
        }
    })
}

function moveAsteroids(time) {
    getAsteroids().forEach(function (current_asteroid) {
        let sign = current_asteroid.rotationspeed<0 ? "-=" : "+="
        let rotationspeed=current_asteroid.rotationspeed*time/5
        let fallspeed=current_asteroid.fallspeed*time/5
        $(current_asteroid.$asteroid).animate({
            rotate: sign+String(Math.abs(rotationspeed))+"deg",
            top: "+="+String(fallspeed)+"px"
        },time, "linear").animate({
            rotate: sign+String(Math.abs(rotationspeed))+"deg",
            top: "+="+String(fallspeed)+"px"
        },time, "linear")
        current_asteroid.hitmarkers.forEach(function (current_hitmark) {
            $(current_hitmark.$projectile).animate({
                top: "+="+String(fallspeed)+"px"
            },time, "linear").animate({
                top: "+="+String(fallspeed)+"px"
            },time, "linear")
        })
        if (parseInt($(current_asteroid.$asteroid).css("top")) >= getGameSpaceHeight()) {
            current_asteroid.removeMarkers()
            current_asteroid.remove()
            if (current_asteroid.type==="special") {
                setIsThereSpecial(false)
            }
        }
    })
}

function movePowerups(time) {
    getPowerups().forEach(function (current_powerup) {
        let sign = current_powerup.rotationspeed<0 ? "-=" : "+="
        let rotationspeed=current_powerup.rotationspeed*time/5
        let fallspeed=current_powerup.fallspeed*time/5
        $(current_powerup.$powerup).animate({
            rotate: sign+String(Math.abs(rotationspeed))+"deg",
            top: "+="+String(fallspeed)+"px"
        },time, "linear").animate({
            rotate: sign+String(Math.abs(rotationspeed))+"deg",
            top: "+="+String(fallspeed)+"px"
        },time, "linear")
        if (parseInt($(current_powerup.$powerup).css("top")) >= getGameSpaceHeight()) {
            current_powerup.removePowerup()
        }
    })

}

function rotateDestroyedAsteroids(time) {
    getDestroyedAsteroids().forEach(function (current_destroyed_asteroid) {
        let sign = current_destroyed_asteroid.rotationspeed<0 ? "-=" : "+="
        $(current_destroyed_asteroid.$asteroid).animate({
            rotate: sign+String(Math.abs(current_destroyed_asteroid.rotationspeed*time/5))+"deg"
        },time, "linear").animate({
            rotate: sign+String(Math.abs(current_destroyed_asteroid.rotationspeed*time/5))+"deg"
        },time, "linear")
    })
}

//hit detection
export function calculate_distance(pos1, pos2) {
    return Math.pow(pos1[0]-pos2[0],2)+Math.pow(pos1[1]-pos2[1],2)
}


function detectProjectileHit() {
    getProjectiles().forEach( function (current_projectile) {
        getAsteroids().forEach(function (current_asteroid) {

            let asteroidpos=current_asteroid.getAsteroidPosition()

            let shotposl=[
                parseFloat($(current_projectile.$projectile).css("left")),
                parseFloat($(current_projectile.$projectile).css("top"))
            ]
            let shotposr=[
                parseFloat($(current_projectile.$projectile).css("left"))+parseInt($(current_projectile.$projectile).css("width")),
                parseFloat($(current_projectile.$projectile).css("top"))
            ]
            if (calculate_distance(asteroidpos, shotposl) <= Math.pow(asteroidpos[2],2) ||
                calculate_distance(asteroidpos, shotposr) <= Math.pow(asteroidpos[2],2)) {
                current_asteroid.registerHit(current_projectile)
            }
        })
    })
}

function detectSpaceshipHit() {
    if (!getShip().shielded) {
        getAsteroids().forEach(asteroid=>{
            let asteroidpos=asteroid.getAsteroidPosition()

            let shippos=getShip().getHitboxPositions()

            if (calculate_distance(asteroidpos, shippos["left"]) <= Math.pow(shippos["left"][2]+asteroidpos[2],2) ||
                calculate_distance(asteroidpos, shippos["right"]) <= Math.pow(shippos["right"][2]+asteroidpos[2],2) ||
                calculate_distance(asteroidpos, shippos["middle"]) <= Math.pow(shippos["middle"][2]+asteroidpos[2],2)) {

                asteroid.changeToDestroyed()
                asteroid.asteroid_destroyed_sound.volume=getSoundSlider().val()/100
                asteroid.asteroid_destroyed_sound.play()
                getDestroyedAsteroids().push(asteroid)
                asteroid.removeMarkers()
                $(asteroid.$asteroid).stop(true)
                asteroid.startAsteroidDestroyAnimation()
                if (asteroid.type==="special") {
                    setIsThereSpecial(false)
                }

                getShip().register_ship_hit()
            }
        })
    }
}

function detectSpaceshipPickup() {
    getPowerups().forEach(powerup=>{
        let poweruppos=powerup.getPowerupPosition()


        let shippos=getShip().getHitboxPositions()

        if (calculate_distance(poweruppos, shippos["left"]) <= Math.pow(shippos["left"][2]+poweruppos[2],2) ||
            calculate_distance(poweruppos, shippos["right"]) <= Math.pow(shippos["right"][2]+poweruppos[2],2) ||
            calculate_distance(poweruppos, shippos["middle"]) <= Math.pow(shippos["middle"][2]+poweruppos[2],2)) {
            powerup.removePowerup()
            /*asteroid.asteroid_destroyed_sound.volume=getSoundSlider().val()/100
            asteroid.asteroid_destroyed_sound.play()*/

            getShip().levelUp()
        }
    })
}

//asteroid functions

const base_asteroid_spawn=2400
const base_asteroid_speed=0.8

export function spawn_asteroid() {
    let rotation=Math.random()-0.5
    if (rotation<=0) {
        rotation=rotation-0.5
    } else {
        rotation=rotation+0.5
    }
    let chance=Math.random()
    console.log(chance)
    let spawned_asteroid
    if (getShip().lvl < getShootpatterLength() && getMiliSecondsElapsed()/1000>40*getShip().lvl+20 && chance<0.5 && !getIsThereSpecial()) {
        spawned_asteroid = new Asteroid(
            Math.random(),
            base_asteroid_speed+scaleAsteroidSpeed(),
            rotation,
            "special"
        )
    } else {
        spawned_asteroid = new Asteroid(
            Math.random(),
            base_asteroid_speed+scaleAsteroidSpeed(),
            rotation,
            "basic"
        )
    }



    addAsteroid(spawned_asteroid)
    setTimeSinceLastAsteroidSpawn(0)
    setAsteroidSpawner(setTimeout(spawn_asteroid,base_asteroid_spawn-scaleAsteroidSpawn()))
}

export function updateAnimationTimes(time) {
    getDestroyedAsteroids().forEach(asteroid=>{
        asteroid.updateAsteroidDestroyedCurrentAnimtime(time)
        asteroid.updateMarkerTimes(time)
    })
    if (getShip().shielded) {
        getShip().addAnimationTime(time)
    }
}

function scaleAsteroidSpawn() {
    const max_second_scaling=200
    const scale_per_second=8
    return Math.min(max_second_scaling,getMiliSecondsElapsed()/1000)*scale_per_second
}

function scaleAsteroidSpeed() {
    const max_second_scaling=100
    const scale_per_second=0.01
    return Math.min(max_second_scaling,getMiliSecondsElapsed()/1000)*scale_per_second
}

//pause unpause

export function pauseGame() {
    clearTimeout(getAsteroidSpawner())
    clearGameLogicLoop()
    getAsteroids().forEach(element => {
        $(element.$asteroid).stop(true)
        element.stopMarkers()
    })
    getDestroyedAsteroids().forEach(element => {
        clearTimeout(element.animtimeout)
        $(element.$asteroid).stop(true)
        $(element.$score_earned_label).stop(true)
    })
    getProjectiles().forEach(element=>  {
        $(element.$projectile).stop(true)
    })
    clearTimeout(getShip().animtimeout)
    getShip().disableShipEventhandlers()
    getPauseScreen().show()
    $(getPauseButton()).attr({
        src: getPauseButtonImg(1).src
    })
}

export function unpauseGame() {
    setAsteroidSpawner(setTimeout(spawn_asteroid,base_asteroid_spawn-scaleAsteroidSpawn()-getTimeSinceLastAsteroidSpawn()))

    startGameLogicLoop()
    getShip().enableShipEventhandlers()
    getAsteroids().forEach(element => {
        element.startMarkers()
    })

    getDestroyedAsteroids().forEach(element => {
        element.startAsteroidDestroyAnimation(element.current_destroyed_animframe,true)
    })
    if (getShip().shielded) {
        getShip().startShipHitAnimation(getShip().animframe,true)
    }
    getPauseScreen().hide()
    $(getPauseButton()).attr({
        src: getPauseButtonImg(0).src
    })
}

export function restartGame() {
    $(window).on("keydown", function (key) {
        if (key.code==="KeyP") {
            togglePause()
        }
    })

    getRestartOverlay().hide()
    getScoreSystem().hide()
    getShipHpBox().show()
    clearGameLogicLoop()
    clearTimeout(getAsteroidSpawner())
    setMiliSecondsElapsed(0)
    setTimeSinceLastAsteroidSpawn(0)
    setIsThereSpecial(false)
    initializeShip()
    refillShipHpBox()
    updateScoreLabel()

    getAsteroids().forEach(element => {
        element.$asteroid.remove()
    })
    getAsteroids().splice(0,getAsteroids().length)

    getDestroyedAsteroids().forEach(element => {
        clearTimeout(element.animtimeout)
        element.$asteroid.remove()
    })
    getDestroyedAsteroids().splice(0,getDestroyedAsteroids().length)

    getProjectiles().forEach(element => {
        clearTimeout(element.animtimeout)
        element.$projectile.remove()
    })
    getProjectiles().splice(0,getProjectiles().length)

    $(getShip().$ship).on('load', loadShip)
    $(getPauseButton()).on("click", togglePause).show()



    togglePauseWithoutAnimations()
}

export function saveScore() {
    if (getScoreNameInput().val()!==""/*&& getShip().score>0*/) {
        animateButton(getScoreSaveButton())

        let name = getScoreNameInput().val()
        let score=getShip().score
        if (localStorage.getItem(name)!=null) {
            localStorage.setItem(name, localStorage.getItem(name)+";"+score);
        } else {
            localStorage.setItem(name, score);
        }

        updateScoreTable(name, score)

        getScoreSaveButton().off("click")
        getScoreNameInput().prop({
            "disabled": true
        })
    }
}

export function animateButton($button) {
    $($button).stop(true)
    $($button).animate({scale: 1.25},75).animate({scale: 1},75)
}

export function resetSaveSystem() {
    getScoreNameInput().prop({
        "disabled": false
    })
}

export function updateScoreTable(name, score) {
    getScorePlaceholder().remove()
    getScoreTable().append("<tr><td class='namecol'>"+name+"</td><td>"+score+"</td></tr>")
}

export function setUpAfterStartGame() {
    getStartGameLabel().remove()
    $(getPauseButton()).on('click', togglePause)
    $(window).on("keydown", function (key) {
        if (key.code==="KeyP") {
            togglePause()
        }
    })
    setIsThereSpecial(false)
    $(getPauseButton()).css({left: '', top: ''})
    $(getShipHpBox()).show()
    $(getScoreLabel()).show()
}