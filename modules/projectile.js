export let projectile_base, proj_width, proj_height, proj_top, shootInterval=0

export function cloneProjectile() {
    return projectile_base.cloneNode(true)
}

export function setShootInterval(shootinterval) {
    self.shootInterval = shootInterval
}

export function setProjectileBase(projectile_base) {
    self.projectile_base = projectile_base
}

export function setProjWidth(proj_width) {
    self.proj_width = proj_width
}

export function setProjHeight(proj_height) {
    self.proj_height = proj_height
}

export function setProjTop(proj_top) {
    self.proj_top = proj_top
}