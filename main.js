import {
    setGameSpace,
    getGameSpace,
    setShotsDiv,
    setAsteroidDiv,
    pauseGame,
    isPaused,
    setPaused,
    setScoreLabel,
    setPauseButton,
    getPauseButton,
    setPauseScreen,
    getPauseScreen,
    setShipHpBox,
    setRestartButton,
    setRestartLabel,
    setRestartOverlay, togglePause
} from "./modules/gamelogic.js";
import {
    getShip,
    initializeShip
} from "./modules/ship.js";
import {loadShipFirst} from "./modules/initialization.js";
import {setAsteroidBase} from "./modules/asteroid.js";
import {setProjectileBase} from "./modules/projectile.js";

$(function () {
    setGameSpace($("#gamespace"))
    setShotsDiv($("#shots"))
    setAsteroidDiv($("#asteroids"))
    setScoreLabel($("#scorelabel"))
    setPauseButton($("#pausebutton"))
    setPauseScreen($("#pausescreen"))

    setRestartOverlay($("#restartoverlay"))
    setRestartButton($("#restartbutton"))
    setRestartLabel($("#restartlabel"))
    setShipHpBox($("#shiphpbox"))
    getPauseScreen().hide()
    setProjectileBase($("<img src='assets/spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>"))
    setAsteroidBase($("<img src='assets/asteroid1.png' alt='asteroid' class='asteroid'>"))

    initializeShip()

    $(getShip().$ship).on('load', loadShipFirst)
    projectile_base.on('load', function () {
        getShip().enableShipEventhandlers()
        projectile_base.off('load')
    })

    $(getPauseButton()).on('click', function () {
        togglePause()
    })

    $(getGameSpace()).on('dragstart', function(event) { event.preventDefault(); });

    $(window).on('blur', function () {
        if (!isPaused()) {
            setPaused(true)
            pauseGame()
        }
    })
})