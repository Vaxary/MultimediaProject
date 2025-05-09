
export function cloneProjectile() {
    return $(self.projectile_base)[0].cloneNode(true)
}

export function setProjectileBase(projectile_base) {
    self.projectile_base = projectile_base
}

export function getProjectileBase() {
    return self.projectile_base
}

export function setProjWidth(proj_width) {
    self.proj_width = proj_width
}

export function getProjWidth() {
    return self.proj_width
}

export function setProjHeight(proj_height) {
    self.proj_height = proj_height
}

export function getProjHeight() {
    return self.proj_height
}

export function setProjTop(proj_top) {
    self.proj_top = proj_top
}

export function getProjTop() {
    return self.proj_top
}