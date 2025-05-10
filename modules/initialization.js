import {
    addDestroyedShipFrame, addShipHpIndicatorIcon,
    addShipState,
    getDestroyedShipFrame,
    getShip,
    setDestroyedShipFrame, setShipHpIndicatorImgs
} from "./ship.js";
import {
    addPauseButtonImg,
    getGameSpaceHeight, getGameSpaceWidth,
    getPauseButton,
    getPauseButtonImg, getRestartButton, getRestartLabel, getRestartOverlay,
    getShipHpBox, setAsteroidSpawner, spawn_asteroid, startGameLogicLoop, startSecondCounter
} from "./gamelogic.js";
import {
    getProjectileBase,
    getProjHeight,
    getProjTop,
    getProjWidth,
    setProjHeight,
    setProjTop,
    setProjWidth
} from "./projectile.js";
import {
    addAsteroidStateFrame,
    addDestroyedAsteroidFrame,
    getAsteroidBase, getDestroyedAsteroidStateFrame,
    replaceDestroyedAsteroidFrame
} from "./asteroid.js";

export function initialization() {
    initRestartOverlay()
    initPauseButton()
    init_projectile()
    init_meteorite()
    initShipStates()
    initShipHpBox()
}

export function loadShip() {
    getShip().updateSizeAndPos()
    getShip().$ship.show()

    $(getShip().$ship).off('load')
}

export function loadShipFirst() {
    loadShip()
    startGameLogicLoop()
    startSecondCounter()
    setAsteroidSpawner(setTimeout(spawn_asteroid, 2000))
    initialization()
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
        "background-image": "url("+getPauseButtonImg(0).src+")"
    })
}

function initRestartOverlay() {
    getRestartOverlay().hide()
    initRestartButton()
    initRestartLabel()
}

function initRestartButton() {
    let restart_button=new Image()
    restart_button.src = "../assets/restartbutton.png"
    $(getRestartButton()).css({
        "background-image": "url("+restart_button.src+")",
        scale: 1,
        left: getGameSpaceWidth()/2-30,
        top: getGameSpaceHeight()/2-30
    })
}

function initRestartLabel() {
    $(getRestartLabel()).css({
        top: getGameSpaceHeight()/2-75
    })
}

function init_projectile() {
    setProjWidth(8);
    setProjHeight(24);
    setProjTop(getGameSpaceHeight()-getShip().height-50);
    $(getProjectileBase()).css({
        top: getProjTop(),
        height: getProjHeight(),
        width: getProjWidth()})
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
    for (let i = 1; i <= 13; i++) {
        let destroyed_ship_frame = new Image()
        destroyed_ship_frame.src="../assets/spaceshipdestroyed"+i+".png"
        addDestroyedShipFrame(destroyed_ship_frame)
    }
    setDestroyedShipFrame([getDestroyedShipFrame(0),120],0)
    setDestroyedShipFrame([getDestroyedShipFrame(1),80],1)
    setDestroyedShipFrame([getDestroyedShipFrame(2),60],2)
    setDestroyedShipFrame([getDestroyedShipFrame(3),40],3)
    setDestroyedShipFrame([getDestroyedShipFrame(4),40],4)
    setDestroyedShipFrame([getDestroyedShipFrame(5),40],5)
    setDestroyedShipFrame([getDestroyedShipFrame(6),40],6)
    setDestroyedShipFrame([getDestroyedShipFrame(7),40],7)
    setDestroyedShipFrame([getDestroyedShipFrame(8),40],8)
    setDestroyedShipFrame([getDestroyedShipFrame(9),40],9)
    setDestroyedShipFrame([getDestroyedShipFrame(10),50],10)
    setDestroyedShipFrame([getDestroyedShipFrame(11),70],11)
    setDestroyedShipFrame([getDestroyedShipFrame(12),100],12)
}

function init_meteorite() {
    $(getAsteroidBase()).css({
        top: -100,
        left: 100,
        width: 21, //63 sem rossz tbh
        height: 21
    })
    for (let i=1; i <= 6; i++) {
        let frame=new Image()
        frame.src="../assets/asteroid"+i+".png"
        addAsteroidStateFrame(frame)
    }

    for (let i=1; i <= 8; i++) {
        let frame=new Image()
        frame.src="../assets/asteroid_destroyed"+i+".png"
        addDestroyedAsteroidFrame(frame)
    }
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(0),50],0)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(1),40],1)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(2),30],2)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(3),30],3)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(4),30],4)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(5),40],5)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(6),40],6)
    replaceDestroyedAsteroidFrame([getDestroyedAsteroidStateFrame(7),50],7)
}