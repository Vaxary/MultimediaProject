import {
    setGameSpace,
    getGameSpace,
    pause_game,
    unpause_game,
    game_logic,
    setShotsDiv, setAsteroidDiv, spawn_asteroid, setAsteroidSpawner, setGameLogicLoop
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
let paused=false

$(function () {
    console.log("Site ready");
    setGameSpace($("#gamespace"))
    setShip($("<img src='assets/spaceship.png' alt='player spaceship' id='player'>"))
    setShotsDiv($("#shots"))
    setAsteroidDiv($("#meteorites"))
    setProjectileBase($("<img src='assets/spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>"))
    setAsteroidBase($("<img src='assets/asteroid1.png' alt='asteroid' class='meteorite'>"))
    pause_button=$("#pausebutton")

    $(pause_button).on('click', function () {
        if (!paused) {
            console.log("paused")
            paused=true
            pause_game()
        } else {
            paused=false
            unpause_game()
        }
    })

    $(getShip()).on('load', function () {
        if (!isShipLoaded()) {
            getShip().appendTo(getGameSpace())
            setShipHeight($(getShip()).height()*4)
            setShipWidth($(getShip()).width()*4)
            initialization()
            setGameLogicLoop(setInterval(game_logic, 1))
            setShipLoaded(true)
            setAsteroidSpawner(setTimeout(spawn_asteroid, 2000))
            console.log("Player ready")
        }
    })

    projectile_base.on('load', function () {
        add_ship_eventhandlers()
        console.log("Projectile ready")
    })

    $($gamespace).on('dragstart', function(event) { event.preventDefault(); });
})