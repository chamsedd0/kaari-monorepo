export class Theme {

  static colors = {
    // Base colors
    primary: '#511B72',
    secondary: '#8F27CE',
    tertiary: 'rgba(218, 196, 233, 1)',
    quaternary: '#A089AE',
    fifth: 'rgba(218, 202, 228, 1)',
    sixth: 'rgba(218, 202, 228, 1)',
    success: 'rgba(41, 130, 45, 1)',
    warning: '#FFCE4F',
    error: 'rgba(155, 3, 3, 1)',
    blue: 'rgba(5, 149, 195, 1)',

    // Neutral colors
    white: '#FFFFFF',
    black: '#252525',
    blockScreen: '#00000025',
    gray: '#D1D1D1',
    gray2: '#767676',
    // Added commonly referenced alias for compatibility in static pages
    gray3: '#B3B3B3',
  }


  // Borders
  static borders = {
    primary: '1px solid rgba(218, 196, 233, 1)',
    button: '4px solid #8F27CE',
    buttonHover: '4px solid #511B72',
    white: '4px solid #FFFFFF',
    radius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      extreme: '100px',
      round: '50%',
      // Added alias referenced by static pages
      full: '9999px'
    }
  };

  // Typography
  static typography = {
    fonts: {
      h1: 'normal 900 64px Visby CF',
      h2: 'normal 900 48px Visby CF',
      h25: 'normal 800 40px Visby CF',
      h3: 'normal 700 32px Visby CF',
      // Added h4 alias used by some pages
      h4: 'normal 500 24px Visby CF',
      h4B: 'normal 700 24px Visby CF',
      h4DB: 'normal 600 24px Visby CF',
      extraLargeM: 'normal 500 20px Visby CF',
      extraLargeDB: 'normal 600 20px Visby CF',
      extraLargeB: 'normal 700 20px Visby CF',
      largeB: 'normal 700 16px Visby CF',
      largeM: 'normal 500 16px Visby CF',
      mediumM: 'normal 500 14px Visby CF',
      mediumB: 'normal 700 14px Visby CF',
      smallM: 'normal 500 12px Visby CF',
      smallDB: 'normal 600 12px Visby CF',
      smallB: 'normal 700 12px Visby CF',
      extraSmallB: 'normal 700 10px Visby CF',
      text16: 'normal 500 16px Visby CF',
      text14: 'normal 500 14px Visby CF',
      text12: 'normal 500 12px Visby CF',
      link14: 'normal 700 14px Visby CF',
      link16: 'normal 700 16px Visby CF'
    },

  };

}
