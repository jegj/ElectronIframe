// Module to create native browser window.
const {Menu, Tray, app, BrowserWindow, ipcMain} = require('electron')

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
	const template = [
		{
			label: 'DealerWorks',
			click: function () {
				mainWindow.show();
			}
		},
		{
			label: 'Settings',
		},
		{
			label: 'Logout',
			click: function() {
				mainWindow.loadURL(url.format({
					pathname: path.join(__dirname, 'login.html'),
					protocol: 'file:',
					slashes: true
				}))
			}
		},
		{
			label: 'Exit',
			click: function () {
				app.isQuiting = true;
				app.quit();
			}
		}
	];
	// THIS COULD BE SMALL IMAGE
	const iconPath = path.join(__dirname, '/images/icon-128x128.png');
	const appIcon = new Tray(iconPath);
	const contextMenu = Menu.buildFromTemplate(template);
	appIcon.setToolTip('DealerworksLauncher');
	appIcon.setContextMenu(contextMenu);
	// Create the browser window.
	mainWindow = new BrowserWindow(
		{
			width: 1000, 
			height: 700,
			icon: path.join(__dirname, 'images/icons/icon-256x256.ico'), 
			title: 'Dealerbuilt', frame: true
		}
	);

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindow.on('minimize',function(event){
		event.preventDefault()
				mainWindow.hide();
	});

	mainWindow.on('close', function (event) {
			if( !app.isQuiting){
					event.preventDefault()
					mainWindow.hide();
			}
			return false;
	});

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	});

	let JWT;
	
	mainWindow.webContents.on('did-finish-load', () => {
		// SOCKET CONNECTION
		const ipc=require('node-ipc');
		ipc.config.id   = 'dashboard';
		ipc.config.retry= 1500;
		ipc.connectTo( 'launcher', function(){
			ipc.of.launcher.on(
					'connect',
					function(){
						console.log('=====>connected');
						// ipc.log('## connected to launcher ##'.rainbow, ipc.config.delay);
						ipc.of.launcher.emit(
							'jwt_request',
						)
					}
			);
			ipc.of.launcher.on(
					'disconnect',
					function(){
							ipc.log('disconnected from launcher'.notice);
					}
			);
			ipc.of.launcher.on(
					'message',  //any event or message type your server listens for
					function(data){
							ipc.log('got a message from launcher : '.debug, data);
					}
			);
			ipc.of.launcher.on(
					'jwt_response',  //any event or message type your server listens for
					(data) => {
							ipc.log('got a JWT from launcher : '.debug, data);
							console.log('got a JWT from launcher : ', data);
							JWT = data;
							mainWindow.webContents.send('JWT' , {JWT:JWT});
					}
			);
		});
		// mainWindow.webContents.send('JWT' , {'JWT':'JWT'});
	})
	
}



// const trayControl = new TrayControl(app, iconPath, template);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		// app.quit()
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
});

