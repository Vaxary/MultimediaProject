import {
    setGameSpace,
    getGameSpace,
    setShotsDiv,
    setAsteroidDiv,
    spawn_asteroid,
    setAsteroidSpawner,
    startSecondCounter, startGameLogicLoop, pauseGame, unpauseGame, isPaused, setPaused
} from "./modules/gamelogic.js";
import {
    add_ship_eventhandlers,
    getShip, setShip,
    isShipLoaded, setShipLoaded,
    setShipHeight, setShipWidth
} from "./modules/ship.js";
import {initialization} from "./modules/initialization.js";
import {setAsteroidBase} from "./modules/asteroid.js";
import {setProjectileBase} from "./modules/projectile.js";

let pause_button

$(function () {
    console.log("Site ready");
    setGameSpace($("#gamespace"))
    setShip($("<img src='assets/spaceship.png' alt='player spaceship' id='player'>"))
    setShotsDiv($("#shots"))
    setAsteroidDiv($("#asteroids"))
    setProjectileBase($("<img src='assets/spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>"))
    setAsteroidBase($("<img src='assets/asteroid1.png' alt='asteroid' class='asteroid'>"))
    pause_button=$("#pausebutton")

    $(pause_button).on('click', function () {
        if (!isPaused()) {
            setPaused(true)
            pauseGame()
        } else {
            setPaused(false)
            unpauseGame()
        }
    })

    $(getShip()).on('load', function () {
        if (!isShipLoaded()) {
            getShip().appendTo(getGameSpace())
            setShipHeight($(getShip()).height()*4)
            setShipWidth($(getShip()).width()*4)
            initialization()

            startGameLogicLoop()
            startSecondCounter()

            setAsteroidSpawner(setTimeout(spawn_asteroid, 2000))

            setShipLoaded(true)
            console.log("Player ready")
        }
    })

    projectile_base.on('load', function () {
        add_ship_eventhandlers()
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