import React from "react";
import {Provider} from 'react-redux'
import ReactDOM from "react-dom";
import styles from "./index.less";
import Root from "./router/index";
import store from "./store/index";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#ffc1c1',
            main: '#ed8281',
            dark: '#9c1b18',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#8b81ed',
            dark: '#ba000d',
            contrastText: '#fff',
        },
    },
});

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <Root />
        </MuiThemeProvider>
    </Provider>
    , document.getElementById("root"));

