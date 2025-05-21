import {
    setGameSpace, getGameSpace,
    setShotsDiv,
    setUpAfterStartGame,
    startLoadingInterval,
    animateButton
} from "./modules/gamelogic.js";
import {
    getShip,
    initializeShip
} from "./modules/ship.js";
import {initializeui, initScoreTable, loadShipFirst} from "./modules/initialization.js";
import {setAsteroidBase, setAsteroidDiv} from "./modules/asteroid.js";
import {setProjectileBase} from "./modules/projectile.js";
import {
    setPauseButton, getPauseButton, setPauseScreen,
    setShipHpBox,
    setRestartButton, setRestartLabel, setRestartOverlay,
    setSoundSlider, setSoundIcon,
    setStartGameLabel,
    setLoadingIcon, setLoadingOverlay,
    setScoreLabel, setScoreNameInput, setScoreSaveButton, setScoreInfoLabel, setScoreSystem,
    setScoreTable, setScorePlaceholder,
    togglePauseWithoutAnimations, pauseWithoutAnimations
} from "./modules/uilogic.js"

$(function () {
    setGameSpace($("#gamespace"))

    setScoreTable($("#scoretable"))
    setScorePlaceholder($("#scoreplaceholder"))

    setSoundSlider($("#soundslider"))
    setSoundIcon($("#soundicon"))

    initScoreTable()

    setScoreLabel($("#scorelabel"))

    setPauseButton($("#pausebutton"))
    setPauseScreen($("#pausescreen"))

    setStartGameLabel($("#startgamelabel"))

    setScoreSystem($("#savescoresystem"))
    setScoreInfoLabel($("#scoreinfo"))
    setScoreNameInput($("#nameinput"))
    setScoreSaveButton($("#savescorebutton"))

    setRestartOverlay($("#restartoverlay"))
    setRestartButton($("#restartbutton"))
    setRestartLabel($("#restartlabel"))

    initializeui()

    setLoadingIcon($("#loadingicon"))
    setLoadingOverlay($("#loadingoverlay"))
    startLoadingInterval()

    setShotsDiv($("#shots"))
    setAsteroidDiv($("#asteroids"))
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

    $(window).on('blur', pauseWithoutAnimations)
})