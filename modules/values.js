export let gamespace, gamespace_width, gamespace_height, shots_div, asteroid_div
export let game_timer
export let seconds_elapsed=0
export let time_since_last_spawn=0
export let pause_button
export let paused=false
export let spawning_meteorites
export let game_logic_loop

export function setPauseButton(pause_button) {
    self.pause_button=pause_button
}

export function setPaused(paused) {
    self.paused=paused
}

export function setSecondsElapsed(seconds_elapsed) {
    self.seconds_elapsed=seconds_elapsed
}

export function setTimeSinceLastAsteroidSpawn(time_since_last_spawn) {
    self.time_since_last_spawn=time_since_last_spawn
}

export function setGameTimer(game_timer) {
    self.game_timer=game_timer
}

export function setGameLogicLoop(game_logic_loop) {
    self.game_logic_loop=game_logic_loop
}

export function setSpawningMeteorites(spawning_meteorites) {
    self.spawning_meteorites=spawning_meteorites
}

export function setGameSpace(gamespace) {
    self.gamespace = gamespace
}

export function setGameSpaceHeight(gamespace_height) {
    self.gamespace_height = gamespace_height
}

export function setGameSpaceWidth(gamespace_width) {
    self.gamespace_width = gamespace_width
}

export function setShotsDiv(shots_div) {
    self.shotsdiv = shots_div
}

export function setAsteroidDiv(asteroid_div) {
    self.asteroid_div = asteroid_div
}

