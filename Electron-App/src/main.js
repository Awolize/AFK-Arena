const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

var config = require('./config.json');

require('@electron/remote/main').initialize()
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

var iconPath = path.join(__dirname, '../icon.ico') // path of y
let mainWindow;
let tray = null;

const schedule = require('node-schedule');
const job = schedule.scheduleJob('*/5 * * * *', function () {
    console.log('The answer to life, the universe, and everything!');
});


function createTray() {
    tray = new Tray(iconPath)

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                mainWindow.show()
            }, type: 'normal'
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true
                app.quit()
            }, type: 'normal'
        }
    ])

    tray.on('click', function (e) {
        mainWindow.show()
    });

    tray.setContextMenu(contextMenu)
    tray.setToolTip('AFK Helper')
}

function clearTray() {
    if (tray)
        tray.destroy()
    tray = null
}

const createMainWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 925, //(config.debug ? 200 : 0)
        height: 980,
        frame: true,
        icon: iconPath,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Open the DevTools.
    if (config.debug) {
        devtools = new BrowserWindow()
        mainWindow.webContents.setDevToolsWebContents(devtools.webContents)
        mainWindow.webContents.openDevTools({ mode: 'detach' })
    }

    mainWindow.setMenuBarVisibility(false)

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '/main/index.html'));

    mainWindow.on('closed', function (event) {
        clearTray()
        app.quit();
    })

    mainWindow.on('show', function (event) {
        clearTray()
    })

    mainWindow.on('minimize', function (event) {
        event.preventDefault()
        mainWindow.hide()
        createTray()
    })

    return mainWindow;
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    mainWindow = createMainWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});