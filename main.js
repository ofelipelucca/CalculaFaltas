const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const findAvailablePort = require('./src/src/NetworkUtils/findAvailablePort');

let mainWindow;
let py;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'LibrasController',
        //maxWidth: 400,
        //maxHeight: 600,
        width: 400,
        height: 600,
        minWidth: 400,
        minHeight: 600,
        fullscreenable: true,
        backgroundColor: "#141414",
        titleBarStyle: 'default',
        icon: path.join(__dirname, 'favicon.ico'),  
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: true,  
          contextIsolation: false,
          devTools: true,
        }   
    });

    mainWindow.loadURL(`file://${path.join(__dirname, 'build/index.html')}`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startPython(port) {
    const pyMainPath = path.join(__dirname, 'src/main.py');

    py = spawn('python', [pyMainPath, port]);

    py.stdout.on('data', (data) => {
        console.log('Iniciando backend.');
        console.log('Output: ', data);
    });

    py.stderr.on('data', (data) => {
        console.error(`Erro: ${data}`);
    });

    py.on('close', (code) => {
        console.log(`Processo fechou: ${code}`);
        app.quit();
    });
}

app.whenReady().then(async () => {
    try {
        const port = await findAvailablePort(8000, 8200);
        createMainWindow();
        startPython(port);
    } catch (error) {
        console.error("Erro ao encontrar porta disponível:", error);
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        const port = findAvailablePort(8000, 8200);
        createMainWindow();
        startPython(port);
    }
});

app.on('window-all-closed', () => {
    if (process.plataform !== 'darwin') {
        if (py) {
            py.kill();
        }
        app.quit();
    }
});

app.on('before-quit', () => {
    if (py) {
        py.kill();
    }
});