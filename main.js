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
    setShipHpBox,
    setRestartButton,
    setRestartLabel,
    setRestartOverlay,
    setSoundSlider,
    setStartGameLabel,
    setUpAfterStartGame,
    togglePauseWithoutAnimations,
    setLoadingIcon,
    startLoadingInterval,
    setLoadingOverlay, animateButton
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
    setLoadingIcon($("#loadingicon"))
    setLoadingOverlay($("#loadingoverlay"))
    startLoadingInterval()

    setShotsDiv($("#shots"))
    setAsteroidDiv($("#asteroids"))
    setScoreLabel($("#scorelabel"))
    setPauseButton($("#pausebutton"))
    setPauseScreen($("#pausescreen"))
    setSoundSlider($("#soundslider"))
    setStartGameLabel($("#startgamelabel"))


    setRestartOverlay($("#restartoverlay"))
    setRestartButton($("#restartbutton"))
    setRestartLabel($("#restartlabel"))
    setShipHpBox($("#shiphpbox"))
    setProjectileBase($("<img src='assets/spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>"))
    setAsteroidBase($("<img src='assets/asteroid1.png' alt='asteroid' class='asteroid'>"))

    initializeShip()

    $(getShip().$ship).on('load', loadShipFirst)
    //getShip().enableShipEventhandlers()

    /*projectile_base.on('load', function () {
        projectile_base.off('load')
    })*/

    $(getPauseButton()).on('click', function () {
        $(getPauseButton()).off('click')
        animateButton(getPauseButton())
        setTimeout(function () {
            setUpAfterStartGame()
            togglePauseWithoutAnimations()
        },200)

    })

    $(getGameSpace()).on('dragstart', function(event) { event.preventDefault(); });

    $(window).on('blur', function () {
        if (!isPaused()) {
            setPaused(true)
            pauseGame()
        }
    })
})