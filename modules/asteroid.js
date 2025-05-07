export let asteroid_base, asteroid_states=[], destroyed_asteroid_frames=[]

export function cloneAsterpod(){
    return $(asteroid_base)[0].cloneNode(true)
}

export function setAsteroidBase(asteroid_base) {
    self.asteroid_base=asteroid_base
}

export function addAsteroidStateFrame(asteroidframe) {
    asteroid_states.push(asteroidframe)
}

export function replaceDestroyesAsteroidFrame(asteroidframe, index) {
    destroyed_asteroid_frames[index]=asteroidframe
}

export function addDestroyesAsteroidFrame(asteroidframe) {
    destroyed_asteroid_frames.push(asteroidframe)
}

export function update_shot_asteroid(asteroid, projectile) {
    $(asteroid).attr({hp:parseInt($(asteroid).attr("hp"))-1})
    let current_hp = parseInt($(asteroid).attr("hp"))

    if (current_hp===0) {
        $(asteroid).removeClass("meteorite")
        $(asteroid).addClass("explosion")

        $(asteroid).attr({
            src: destroyed_asteroid_frames[0][0].src,
            asteroidstate: 0,
            animtimepassed: 0
        })

        setTimeout(function () {
            $(asteroid).attr({
                src: destroyed_asteroid_frames[1][0].src,
                asteroidstate: 1,
                animtimepassed: 0
            })
            setTimeout(function () {
                $(asteroid).attr({
                    src: destroyed_asteroid_frames[2][0].src,
                    asteroidstate: 2,
                    animtimepassed: 0
                })
                setTimeout(function () {
                    $(asteroid).attr({
                        src: destroyed_asteroid_frames[3][0].src,
                        asteroidstate: 3,
                        animtimepassed: 0
                    })
                    setTimeout(function () {
                        $(asteroid).attr({
                            src: destroyed_asteroid_frames[4][0].src,
                            asteroidstate: 4,
                            animtimepassed: 0
                        })
                        setTimeout(function () {
                            $(asteroid).attr({
                                src: destroyed_asteroid_frames[5][0].src,
                                asteroidstate: 5,
                                animtimepassed: 0
                            })
                            setTimeout(function () {
                                $(asteroid).attr({
                                    src: destroyed_asteroid_frames[6][0].src,
                                    asteroidstate: 6,
                                    animtimepassed: 0
                                })
                                setTimeout(function () {
                                    $(asteroid).attr({
                                        src: destroyed_asteroid_frames[7][0].src,
                                        asteroidstate: 7,
                                        animtimepassed: 0
                                    })
                                    setTimeout(function () {
                                        $(asteroid).hide()
                                        $(asteroid).remove()
                                    },destroyed_asteroid_frames[7][1])
                                },destroyed_asteroid_frames[6][1])
                            },destroyed_asteroid_frames[5][1])
                        },destroyed_asteroid_frames[4][1])
                    },destroyed_asteroid_frames[3][1])
                },destroyed_asteroid_frames[2][1])
            },destroyed_asteroid_frames[1][1])
        },destroyed_asteroid_frames[0][1])
    } else if (current_hp<=2) {
        $(asteroid).attr({
            src: asteroid_states[4].src
        })
    } else if (current_hp<=4) {
        $(asteroid).attr({
            src: asteroid_states[4].src
        })
    } else if (current_hp<=6) {
        $(asteroid).attr({
            src: asteroid_states[3].src
        })
    } else if (current_hp<=8) {
        $(asteroid).attr({
            src: asteroid_states[2].src
        })
    } else if (current_hp<=10) {
        $(asteroid).attr({
            src: asteroid_states[1].src
        })
    } else {
        $(asteroid).attr({
            src: asteroid_states[0].src
        })
    }
    $(projectile).remove()
}