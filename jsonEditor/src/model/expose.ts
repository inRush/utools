export interface BaseExposeConfig {
  language: string,
  className: string
  onlyType: boolean
}

export interface HasPackageExposeConfig extends BaseExposeConfig {
  packageName: string
}


export interface JavaExposeConfig extends HasPackageExposeConfig {
}

export interface GoExposeConfig extends HasPackageExposeConfig {
}

export interface JavaScriptExposeConfig extends BaseExposeConfig {
}
