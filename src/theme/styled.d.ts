import 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color
  text6: Color
  text7: Color
  text8: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color

  modalBG: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color
  primary6: Color
  primary7: Color
  primary8: Color
  primary9: Color
  primary10: Color

  primaryText1: Color
  primaryText2: Color
  primaryText3: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // gradients
  gradient1: Color
  gradient2: Color

  // surface
  surface1: Color
  surface2: Color
  surface3: Color
  surface4: Color
  surface5: Color
  surface6: Color

  disabledSurface: Color

  // other
  red1: Color
  red2: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  blue1: Color

  avaxRed: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

export interface FontSizes {
  sm?: string
  md?: string
  xl?: string
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids
    fontSize: FontSizes

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
