import {
    setGameSpace,
    getGameSpace,
    setShotsDiv,
    setAsteroidDiv,
    spawn_asteroid,
    setAsteroidSpawner,
    startSecondCounter,
    startGameLogicLoop,
    pauseGame,
    unpauseGame,
    isPaused,
    setPaused,
    setScoreLabel,
    setPauseButton,
    getPauseButton, setPauseScreen, getPauseScreen, setShipHpBox, setPlanetHpBox
} from "./modules/gamelogic.js";
import {
    getShip,
    initializeShip
} from "./modules/ship.js";
import {initialization} from "./modules/initialization.js";
import {setAsteroidBase} from "./modules/asteroid.js";
import {setProjectileBase} from "./modules/projectile.js";

$(function () {
    console.log("Site ready");
    setGameSpace($("#gamespace"))
    setShotsDiv($("#shots"))
    setAsteroidDiv($("#asteroids"))
    setScoreLabel($("#scorelabel"))
    setPauseButton($("#pausebutton"))
    setPauseScreen($("#pausescreen"))
    setShipHpBox($("#shiphpbox"))
    setPlanetHpBox($("#planethpbox"))
    getPauseScreen().hide()
    setProjectileBase($("<img src='assets/spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>"))
    setAsteroidBase($("<img src='assets/asteroid1.png' alt='asteroid' class='asteroid'>"))

    initializeShip()
    $(getShip().$ship).on('load', function () {
        getShip().updateSizeAndPos()
        getShip().$ship.show()


        startGameLogicLoop()
        startSecondCounter()

        setAsteroidSpawner(setTimeout(spawn_asteroid, 2000))

        getShip().loaded=true
        console.log(getShip().loaded)
        $(getShip().$ship).off('load')
        initialization()
        console.log("Player ready")
    })




    $(getPauseButton()).on('click', function () {
        if (!isPaused()) {
            setPaused(true)
            pauseGame()
        } else {
            setPaused(false)
            unpauseGame()
        }
    })



    projectile_base.on('load', function () {
        getShip().enableShipEventhandlers()
        console.log("Projectile ready")
    })

    $(getGameSpace()).on('dragstart', function(event) { event.preventDefault(); });

    $(window).on('blur', function () {
        if (!isPaused()) {
            setPaused(true)
            pauseGame()
        }
    })
})