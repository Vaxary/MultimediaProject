let gamespace, gamespace_width, gamespace_height, shots_div, asteroid_div
let game_timer
let seconds_elapsed=0
let time_since_last_spawn=0
let pause_button
let paused=false
let spawning_meteorites
let game_logic_loop

let projectile_base, proj_width, proj_height, proj_top, shootInterval=0

let ship, ship_height, ship_width, ship_shielded=false, ship_hit=false, ship_loaded=false

let asteroid_base, asteroid_states=[], destroyed_asteroid_frames=[]

$(function () {
    console.log("Site ready");

    gamespace=$("#gamespace")
    ship=$("<img src='assets/spaceship.png' alt='player spaceship' id='player'>")
    projectile_base=$("<img src='assets/spaceshipprojectile.png' alt='player spaceship projectile' class='projectile'>")
    shots_div=$("#shots")
    asteroid_base=$("<img src='assets/asteroid1.png' alt='asteroid' class='meteorite'>")
    asteroid_div=$("#meteorites")
    pause_button=$("#pausebutton")

    gamespace_width=$(gamespace).width()
    gamespace_height=$(gamespace).height()


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

    $(ship).on('load', function () {
        if (!ship_loaded) {
            console.log("loaded player")
            ship.appendTo(gamespace)
            ship_height=$(ship).height()*4
            ship_width=$(ship).width()*4
            initialization()
            game_logic_loop=setInterval(game_logic, 1)
            ship_loaded=true
            spawning_meteorites=setTimeout(spawn_meteorite, 2000)
        }
    })

    projectile_base.on('load', function () {
        add_ship_eventhandlers()
        console.log("Projectile ready")
    })

    game_timer=setInterval( function () {
        seconds_elapsed+=0.5
        time_since_last_spawn+=0.5
        store_animation_states()
    }, 500)

    $(gamespace).on('dragstart', function(event) { event.preventDefault(); });
})

//game logic
function game_logic() {
    move_projectiles()
    move_meteorites()
    detect_projectile_hit()
    if (!ship_shielded) {
        detect_spaceshit_hit()
    }
}

function move_player(e) {
    let rel_mouse_pos_x = Math.ceil(e.clientX - gamespace.offset().left - ship_width/2);
    rel_mouse_pos_x=Math.min(Math.max(rel_mouse_pos_x,-ship_width/2+20),gamespace_width-ship_width/2-20);
    $(ship).css({
        left:rel_mouse_pos_x
    });
}

function move_projectiles() {
    $(".projectile").each(function () {
        $(this).animate({
            top: "-=10"
        }, 1)
        if (parseInt($(this).css("top")) <= -20) {
            $(this).remove()
        }

    })
}

function move_meteorites() {
    $(".meteorite").each(function () {
        let fallspeed = $(this).attr("fallspeed")

        let rotation = $(this).attr("meteorrotation")
        let sign = rotation<0 ? "-=" : "+="
        $(this).animate({rotate: sign+Math.abs(rotation)+"deg"},1, "linear")
        $(this).css( {top: "+="+fallspeed})
        if (parseInt($(this).css("top")) >= gamespace_height) {
            $(this).remove()
        }
    })
}

function store_animation_states() {
    $(".explosion").each(function () {
        let anim_time = parseInt($(this).attr("animtimepassed"))+0.5
        $(this).attr({
            animtimepassed:anim_time
        })
    })
}

function calculate_distance(pos1, pos2) {
    return Math.pow(pos1[0]-pos2[0],2)+Math.pow(pos1[1]-pos2[1],2)
}

function detect_projectile_hit() {
    $(".projectile").each( function (p_index, current_projectile) {
        $(".meteorite").each( function (m_index, current_meteorite) {
            let meteoritepos=[
                parseInt($(current_meteorite).css("left"))+parseInt($(current_meteorite).css("width"))/2,
                parseInt($(current_meteorite).css("top"))+parseInt($(current_meteorite).css("height"))/2
            ]
            let shotposl=[
                parseInt($(current_projectile).css("left")),
                parseInt($(current_projectile).css("top"))
            ]
            let shotposr=[
                parseInt($(current_projectile).css("left"))+parseInt($(current_projectile).css("width")),
                parseInt($(current_projectile).css("top"))
            ]
            if (calculate_distance(meteoritepos, shotposl) <= Math.pow(parseInt($(current_meteorite).css("width"))/2,2) ||
                calculate_distance(meteoritepos, shotposr) <= Math.pow(parseInt($(current_meteorite).css("width"))/2,2)) {
                update_shot_asteroid(current_meteorite, current_projectile)
            }
        })
    })
}

function detect_spaceshit_hit() {
    $(".meteorite").each( function () {
        let meteoritepos=[
            parseInt($(this).css("left"))+parseInt($(this).css("width"))/2,
            parseInt($(this).css("top"))+parseInt($(this).css("height"))/2
        ]
        let shippos=[
            parseInt($(ship).css("left"))+ship.width()/2,
            parseInt($(ship).css("top"))+ship.height()/4*2.5
        ]
        if (calculate_distance(meteoritepos, shippos) <= Math.pow(ship.width()/3*2,2)) {
            register_ship_hit()
        }
    })
}

function spawn_meteorite() {
    let size=Math.random()
    let hp
    let img
    if (size <= 0.2) {
        hp=4
        size = asteroid_base.width()*2
        img=asteroid_states[4]
    } else if (size <= 0.4) {
        hp=6
        size = asteroid_base.width()*2.5
        img=asteroid_states[3]
    } else if (size <= 0.6) {
        hp=8
        size = asteroid_base.width()*3
        img=asteroid_states[2]
    } else if (size <= 0.8) {
        hp=10
        size = asteroid_base.width()*3.5
        img=asteroid_states[1]
    } else {
        hp=12
        size = asteroid_base.width()*4
        img=asteroid_states[0]
    }

    let fallspeed=0.25+Math.min(seconds_elapsed, 200)*0.0025

    let rotation=Math.random()-0.5
    if (rotation<=0) {
        rotation=rotation-0.5
    } else {
        rotation=rotation+0.5
    }

    asteroid_div.append($(cloneAsteroid()).css({
        top: -size,
        left: Math.round(Math.random()*(gamespace_width-size)),
        width: size,
        height: size
    }).attr({
        src: img.src,
        hp: hp,
        meteorrotation: rotation,
        fallspeed: fallspeed
    }))
    time_since_last_spawn=0
    spawning_meteorites=setTimeout(spawn_meteorite,2000-Math.min(200,seconds_elapsed)*4)
}

function pause_game() {
    clearTimeout(spawning_meteorites)
    clearInterval(game_logic_loop)
    $(".meteorite").each(function () {
        $(this).stop(true)
    })
    $(".projectile").each(function () {
        $(this).stop(true)
    })
    $(window).off("mousemove mousedown mouseup keyup")
    clearInterval(game_timer)
}

function unpause_game() {
    spawning_meteorites=setTimeout(spawn_meteorite,2000-Math.min(200,seconds_elapsed)*4-time_since_last_spawn)
    game_logic_loop=setInterval(game_logic,1)
    add_ship_eventhandlers()
    game_timer=setInterval( function () {
        seconds_elapsed+=0.5
        time_since_last_spawn+=0.5
    }, 500)
}

/*projectile*/
function cloneProjectile() {
    return $(projectile_base)[0].cloneNode(true)
}

//init
function initialization() {
    init_player()
    init_projectile()
    init_asteroid()
}

function init_projectile() {
    proj_width=8;
    proj_height=24;
    proj_top=gamespace_height-ship_height-50;
    $(projectile_base).css({
        top: proj_top,
        height: proj_height,
        width: proj_width})
}

function init_player() {
    $(ship).attr({hp:3})
    $(ship).css({
        height: ship_height,
        width: ship_width
    });
    $(ship).css({top:gamespace_height-ship_height-50});
}

function init_asteroid() {
    $(asteroid_base).css({
        top: -21,
        left: 100,
        width: 21, //63 sem rossz tbh
        height: 21
    })
    for (let i=1; i <= 6; i++) {
        let frame=new Image()
        frame.src="assets/asteroid"+i+".png"
        asteroid_states.push(frame)
    }

    for (let i=1; i <= 8; i++) {
        let frame=new Image()
        frame.src="assets/asteroid_destroyed"+i+".png"
        destroyed_asteroid_frames.push(frame)
    }
    destroyed_asteroid_frames[0]=[destroyed_asteroid_frames[0],60]
    destroyed_asteroid_frames[1]=[destroyed_asteroid_frames[1],40]
    destroyed_asteroid_frames[2]=[destroyed_asteroid_frames[2],30]
    destroyed_asteroid_frames[3]=[destroyed_asteroid_frames[3],30]
    destroyed_asteroid_frames[4]=[destroyed_asteroid_frames[4],30]
    destroyed_asteroid_frames[5]=[destroyed_asteroid_frames[5],40]
    destroyed_asteroid_frames[6]=[destroyed_asteroid_frames[6],40]
    destroyed_asteroid_frames[7]=[destroyed_asteroid_frames[7],50]
}

//ship

export function add_ship_eventhandlers() {
    $(window).on('mousemove', move_player);
    $(window).on('mousedown', function (event) {
        if (event.which===1) {
            if (shootInterval===0) {
                shootInterval=setInterval(shoot_projectile, 125)
            }
        }
    });
    $(window).on('keydown', function (event) {
        if (parseInt(event.keyCode)===32) {
            if (shootInterval===0) {
                shootInterval=setInterval(shoot_projectile, 125)
            }
        }
    });
    $(window).on('mouseup', function (event) {
        if (event.which===1) {
            if (shootInterval !== 0) {
                clearInterval(shootInterval)
            }
            shootInterval=0
        }
    });
    $(window).on('keyup ', function (event) {
        if (event.keyCode===32) {
            if (shootInterval !== 0) {
                clearInterval(shootInterval)
            }
            shootInterval=0
        }
    });
}

function shoot_projectile() {
    if (!ship_hit) {
        shots_div.append($(cloneProjectile()).css({
            left: Math.ceil(parseInt($(ship).css("left"))+ship_width/2-proj_width/2)
        }))
    }
}

export function register_ship_hit() {
    console.log("Ship hit")
    ship_shielded=true
    ship_hit=true
    $(ship).attr({src: "spaceshiphit.gif"})
    setTimeout(function () {
        $(ship).attr({src: "spaceshipshielded.png"})
        ship_hit=false
    }, 1000)
    setTimeout(function () {
        $(ship).attr({src: "spaceship.png"})
        ship_shielded=false
    }, 4000)
}

//asteroid
function cloneAsteroid(){
    return $(asteroid_base)[0].cloneNode(true)
}


function update_shot_asteroid(asteroid, projectile) {
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
            src: asteroid_states[5].src
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