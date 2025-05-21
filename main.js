import {
    setGameSpace,
    getGameSpace,
    setShotsDiv,
    setAsteroidDiv,
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
    setLoadingOverlay,
    animateButton,
    setScoreNameInput,
    setScoreSaveButton,
    setScoreInfoLabel,
    setScoreSystem,
    pauseWithoutAnimations,
    setScoreTable,
    setScorePlaceholder,
    getSoundSlider,
    setSoundIcon,
    getSoundIcon,
    setSavedSound, getSoundIconMuted, setSoundIconMuted, getSavedSound
} from "./modules/gamelogic.js";
import {
    getShip,
    initializeShip
} from "./modules/ship.js";
import {initScoreTable, loadShipFirst} from "./modules/initialization.js";
import {setAsteroidBase} from "./modules/asteroid.js";
import {setProjectileBase} from "./modules/projectile.js";

$(function () {
    setScoreTable($("#scoretable"))
    setScorePlaceholder($("#scoreplaceholder"))
    setSoundSlider($("#soundslider"))
    setSoundIcon($("#soundicon"))
    getSoundSlider().on("input",function () {
        let val=parseInt(this.value)
        if (val === 0) {
            setSoundIconMuted(true)
            getSoundIcon().attr({src: "assets/audiomute.png"})
        } else if (val<=33) {
            setSoundIconMuted(false)
            getSoundIcon().attr({src: "assets/audiolow.png"})
        } else if (val<=66) {
            setSoundIconMuted(false)
            getSoundIcon().attr({src: "assets/audiomedium.png"})
        } else {
            setSoundIconMuted(false)
            getSoundIcon().attr({src: "assets/audiohigh.png"})
        }
    })
    getSoundSlider().trigger("input")

    getSoundIcon().on("click", function () {
        if (getSoundIconMuted()) {
            setSoundIconMuted(false)
            getSoundSlider().val(getSavedSound())
        } else {
            setSavedSound(getSoundSlider().val())
            getSoundSlider().val(0)
            setSoundIconMuted(true)
        }
        getSoundSlider().trigger("input")
    })




    initScoreTable()
    setGameSpace($("#gamespace"))
    setLoadingIcon($("#loadingicon"))
    setLoadingOverlay($("#loadingoverlay"))
    startLoadingInterval()

    setShotsDiv($("#shots"))
    setAsteroidDiv($("#asteroids"))
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