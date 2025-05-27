import {
    addDestroyedShipFrame,
    addShipHpIndicatorIcon, setShipHpIndicatorImgs,
    addShipState,
    getShip,
} from "./ship.js";
import {
    animateButton,
    getGameSpaceHeight, getGameSpaceWidth,
} from "./gamelogic.js";
import {
    getProjectileBase,
    getProjHeight, setProjWidth,
    getProjTop, setProjTop,
    getProjWidth, setProjHeight, addProjectileHitFrame, addProjectileImg,
} from "./projectile.js";
import {
    addAsteroidStateFrame,
    addDestroyedAsteroidFrame,
    getAsteroidBase, setPowerupImg,
} from "./asteroid.js";
import {
    addPauseButtonImg,
    getPauseButton,
    getPauseButtonImg,
    getSavedSound,
    getScorePlaceholder,
    getScoreTable,
    getShipHpBox, getSoundIcon, getSoundMuted, getSoundSlider,
    setSavedSound, setSoundMuted,
    finishLoading, getRestartOverlay, getScoreSystem,
} from "./uilogic.js"

export function initialization() {
    initProjectile()
    initAsteroid()
    initPowerup()
    initShipStates()
    initShipHpBox()
}

export function initializeui() {
    initRestartOverlay()
    initPauseButton()
    initScoreSaveSystem()
    initSoundSlider()
}

export function loadShip() {
    getShip().updateSizeAndPos()
    getShip().$ship.show()

    $(getShip().$ship).off('load')
}

export function loadShipFirst() {
    loadShip()
    initialization()
    getPauseButton().css({
        top: getGameSpaceHeight()/2-parseInt(getPauseButton().css("height"))/2,
        left: getGameSpaceWidth()/2-parseInt(getPauseButton().css("width"))/2
    })
    setTimeout(finishLoading, 1000)
}

function initShipHpBox() {
    let ship_hpbox_depleted_img = new Image()
    ship_hpbox_depleted_img.src = "../assets/spaceshipdepleted.png"
    let ship_hpbox_full_img = new Image()
    ship_hpbox_full_img.src = "../assets/spaceship.png"
    setShipHpIndicatorImgs(ship_hpbox_depleted_img, ship_hpbox_full_img)
    for (let i = 0; i < getShip().hp; i++) {
        let $ship_hpicon=$("<img src='"+ship_hpbox_full_img.src+"' alt='ship hpbox indicator' class='shiphpicon'>")
        $ship_hpicon.css({
            scale:1,
            right: 40*i+5
        })
        getShipHpBox().append($ship_hpicon)
        addShipHpIndicatorIcon($ship_hpicon)
    }
}

function initPauseButton() {
    let pause_button_pause=new Image()
    pause_button_pause.src = "../assets/pausebutton1.png"
    addPauseButtonImg(pause_button_pause)
    let pause_button_play=new Image()
    pause_button_play.src = "../assets/pausebutton2.png"
    addPauseButtonImg(pause_button_play)
    $(getPauseButton()).css({
        scale: 1,
        "background-image": "url("+getPauseButtonImg(1).src+")"
    })
}

export function initScoreTable() {
    let empty=true
    for (let player in localStorage) {
        if (localStorage.getItem(player)!=null) {
            empty=false
            let scores=localStorage.getItem(player).split(";")
            for (let score in scores)
            getScoreTable().append("<tr><td class='namecol'>"+player+"</td><td>"+scores[score]+"</td></tr>")
        }
    }
    if (!empty) {
        getScorePlaceholder().remove()
    }
}

function initScoreSaveSystem() {
    getScoreSystem().hide()
}

function initRestartOverlay() {
    getRestartOverlay().hide()
}

function initProjectile() {
    setProjWidth(8);
    setProjHeight(24);
    setProjTop(getGameSpaceHeight()-getShip().height-50);
    $(getProjectileBase()).css({
        top: getProjTop(),
        width: getProjWidth(),
        height: getProjHeight()
    })

    let frames=[30,30,30,30]
    for (let i = 1; i <= frames.length; i++) {
        let projectile_hit_frame=new Image()
        projectile_hit_frame.src="../assets/projectilehit"+i+".png"
        addProjectileHitFrame([projectile_hit_frame, frames[i-1]])
    }

    for (let i = 1; i <= 2; i++) {
        let bullet=new Image()
        bullet.src="../assets/projectile"+i+".png"
        addProjectileImg(bullet)
    }
}

function initShipStates() {
    let base_ship=new Image()
    base_ship.src="../assets/spaceship.png"
    addShipState(base_ship)
    let ship_hit=new Image()
    ship_hit.src="../assets/spaceshiphit.png"
    addShipState(ship_hit)
    let ship_shielded=new Image()
    ship_shielded.src="../assets/spaceshipshielded.png"
    addShipState(ship_shielded)
    let ship_lvlup=new Image()
    ship_lvlup.src="../assets/spaceshiplvlup.png"
    addShipState(ship_lvlup)

    let frametimes=[120,80,60,40,40,40,40,40,40,40,50,70,100,500]
    for (let i = 1; i <= frametimes.length; i++) {
        let destroyed_ship_frame = new Image()
        destroyed_ship_frame.src="../assets/spaceshipdestroyed"+i+".png"
        addDestroyedShipFrame([destroyed_ship_frame,frametimes[i-1]])
    }
}

function initAsteroid() {

    $(getAsteroidBase()).css({
        top: -100,
        left: 100,
        width: 21, //63 sem rossz tbh
        height: 21
    })
    for (let i=1; i <= 6; i++) {
        let frame=new Image()
        frame.src="../assets/asteroid"+i+".png"
        addAsteroidStateFrame(frame, "basic")
    }
    for (let i=1; i <= 6; i++) {
        let frame=new Image()
        frame.src="../assets/special_asteroid"+i+".png"
        addAsteroidStateFrame(frame, "special")
    }

    let frametimes=[50,40,30,30,30,80,80,250]
    for (let i=1; i <= frametimes.length; i++) {
        let frame=new Image()
        frame.src="../assets/asteroid_destroyed"+i+".png"
        addDestroyedAsteroidFrame([frame,frametimes[i-1]],"basic")
    }
    for (let i=1; i <= frametimes.length; i++) {
        let frame=new Image()
        frame.src="../assets/special_asteroid_destroyed"+i+".png"
        addDestroyedAsteroidFrame([frame,frametimes[i-1]],"special")
    }
}

function initPowerup() {
    let img=new Image()
    img.src="../assets/powerup.png"
    setPowerupImg(img)
}

function initSoundSlider() {
    getSoundSlider().on("input",function () {
        let val=parseInt(this.value)
        if (val === 0) {
            setSoundMuted(true)
            getSoundIcon().attr({src: "assets/audiomute.png"})
        } else if (val<=33) {
            setSoundMuted(false)
            getSoundIcon().attr({src: "assets/audiolow.png"})
        } else if (val<=66) {
            setSoundMuted(false)
            getSoundIcon().attr({src: "assets/audiomedium.png"})
        } else {
            setSoundMuted(false)
            getSoundIcon().attr({src: "assets/audiohigh.png"})
        }
    })
    getSoundSlider().trigger("input")

    getSoundIcon().on("click", function () {
        if (getSoundMuted()) {
            setSoundMuted(false)
            getSoundSlider().val(getSavedSound())
        } else {
            setSavedSound(getSoundSlider().val())
            getSoundSlider().val(0)
            setSoundMuted(true)
        }
        getSoundSlider().trigger("input")
        animateButton(getSoundIcon())
    })
}