import {getShip, getShipHpIndicatorIcon, getShipHpIndicatorImg} from "./ship.js";
import {animateButton, clearLoadingInterval, pauseGame, unpauseGame} from "./gamelogic.js";

self.saved_sound=50

export function setShipHpBox($ship_hpbox) {
    self.$ship_hpbox=$ship_hpbox
}

export function getShipHpBox() {
    return self.$ship_hpbox
}

export function updateShipHpBox() {
    getShipHpIndicatorIcon(getShip().hp).attr({src:getShipHpIndicatorImg(0).src}).animate({scale: 0.5},50).animate({scale: 1.2},75).animate({scale: 1},75)
}

export function refillShipHpBox() {
    for (let i = 0; i < getShip().hp; i++) {
        getShipHpIndicatorIcon(i).attr({src:getShipHpIndicatorImg(1).src})
    }
}

export function setSoundSlider($sound_slider) {
    self.$sound_slider=$sound_slider
}

export function getSoundSlider() {
    return self.$sound_slider
}

export function setSoundIcon($sound_icon) {
    self.$sound_icon=$sound_icon
}

export function getSoundIcon() {
    return $sound_icon
}

export function setSoundMuted(sound_muted) {
    self.sound_muted=sound_muted
}

export function getSoundMuted() {
    return sound_muted
}

export function setSavedSound(saved_sound) {
    self.saved_sound=saved_sound
}

export function getSavedSound() {
    return saved_sound
}

export function setRestartOverlay($restart_overlay) {
    self.$restart_overlay=$restart_overlay
}

export function getRestartOverlay() {
    return $restart_overlay
}

export function setRestartButton($restart_button) {
    self.$restart_button=$restart_button
}

export function getRestartButton() {
    return self.$restart_button
}

export function setRestartLabel($restart_label) {
    return self.$restart_label=$restart_label
}

export function getRestartLabel() {
    return self.$restart_label
}

export function setStartGameLabel($startgame_label) {
    return self.$startgame_label=$startgame_label
}

export function getStartGameLabel() {
    return self.$startgame_label
}

export function setScoreLabel($score_label) {
    self.$score_label=$score_label
}

export function getScoreLabel() {
    return self.$score_label
}

export function updateScoreLabel() {
    self.$score_label.text("Score: "+getShip().score)
}

//Pause system parts

export function setPauseScreen($pause_screen) {
    self.$pause_screen=$pause_screen
}

export function getPauseScreen() {
    return self.$pause_screen
}

export function addPauseButtonImg(pause_button_img) {
    self.pause_button_img.push(pause_button_img)
}

export function getPauseButtonImg(i) {
    return self.pause_button_img[i]
}

export function setPauseButton($pause_button) {
    self.$pause_button=$pause_button
}

export function getPauseButton() {
    return self.$pause_button
}


//Loading overlay parts

export function setLoadingIcon($loading_icon) {
    self.$loading_icon=$loading_icon
}

export function getLoadingIcon() {
    return self.$loading_icon
}

export function setLoadingOverlay($loading_overlay) {
    self.$loading_overlay=$loading_overlay
}

export function getLoadingOverlay() {
    return self.$loading_overlay
}

//Score system parts

export function setScoreInfoLabel($score_info_label) {
    self.$score_info_label=$score_info_label
}

export function getScoreInfoLabel() {
    return self.$score_info_label
}

export function setScoreSaveButton($score_save_button) {
    self.$score_save_button=$score_save_button
}

export function getScoreSaveButton() {
    return self.$score_save_button
}

export function setScoreNameInput($score_name_input) {
    self.$score_name_input=$score_name_input
}

export function getScoreNameInput() {
    return self.$score_name_input
}

export function setScoreSystem($score_system) {
    self.$score_system=$score_system
}

export function getScoreSystem() {
    return self.$score_system
}

//Score table parts

export function setScoreTable($score_table) {
    self.$score_table=$score_table
}

export function getScoreTable() {
    return self.$score_table
}

//Score placeholder

export function setScorePlaceholder($score_placeholder) {
    self.$score_placeholder=$score_placeholder
}

export function getScorePlaceholder() {
    return self.$score_placeholder
}


export function isPaused() {
    return self.paused
}

export function setPaused(paused) {
    self.paused=paused
}

export function togglePause() {
    togglePauseWithoutAnimations()
    animateButton(getPauseButton())
}

export function togglePauseWithoutAnimations() {
    if (!isPaused()) {
        setPaused(true)
        pauseGame()
    } else {
        setPaused(false)
        unpauseGame()
    }
}

export function pauseWithoutAnimations() {
    if (!isPaused()) {
        setPaused(true)
        pauseGame()
    }
}

export function finishLoading() {
    getStartGameLabel().show()
    clearLoadingInterval()
    getLoadingOverlay().remove()
}