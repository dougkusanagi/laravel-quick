import { app, shell, BrowserWindow, ipcMain, Notification } from 'electron'
import { join } from 'node:path'
import { exec, type ExecException } from "node:child_process";
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

async function executeCommand(
	command: string,
	_cwp: string | null = null,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const cwp = _cwp || process.cwd();

		// Execute the command
		const childProcess = exec(command, { cwd: cwp });

		// Stream stdout
		childProcess.stdout?.on("data", (data: string) => {
			console.log(data);

			if (data.includes("Which Breeze stack would you like to install?")) {
				childProcess.stdin?.write("livewire\n");
			}

			if (data.includes("Would you like dark mode support?")) {
				childProcess.stdin?.write("yes\n");
			}

			if (data.includes("Which testing framework do you prefer?")) {
				childProcess.stdin?.write("Pest\n");
			}

			if (data.includes("Would you like to initialize a Git repository?")) {
				childProcess.stdin?.write("Yes\n");
			}

			if (data.includes("Which database will your application use?")) {
				childProcess.stdin?.write("sqlite\n");
			}
		});

		// Stream stderr
		childProcess.stderr?.on("data", (data: string) => {
			console.log(`stderr: ${data}`);
		});

		// Handle errors
		childProcess.on("error", (error: ExecException) => {
			console.log(`error: ${error.message}`);
			reject(error);
		});

		// Handle process completion
		childProcess.on("close", (code: number) => {
			console.log(`child process exited with code ${code}`);
			if (code === 0) {
				resolve(code);
			} else {
				reject(new Error(`Process exited with code ${code}`));
			}
		});
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on("teste-laravel", async () => {
    // console.log(arg) // prints "ping"

    const project = { name: "abc" };
    const cwp = "D:/laragon/www";
    const command = `laravel new --breeze ${project.name}`;

    await executeCommand(command, cwp)
    
    const notification = new Notification({
      title: "Projeto criado com sucesso.",
      body: "Seu projeto terminou de ser criado, clique para abrir.",
    });

    notification.on("click", async () => {
      console.log('Notification clicked');

      try {
        const resp = await shell.openPath(cwp);
        console.log(resp);
      } catch (error) {
        console.error(error);
      }
    })

    notification.show();
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
