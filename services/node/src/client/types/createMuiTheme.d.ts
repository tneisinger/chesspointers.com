import * as createMuiTheme from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/createMuiTheme' {
  export interface ThemeOptions {
    sideMenuWidth?: number;
    mainMaxWidth?: number;
  }

  export interface Theme {
    sideMenuWidth: number;
    mainMaxWidth: number;
  }
}
