import {
	app,
	shell,
	BrowserWindow,
	ipcMain,
	Notification,
	Tray,
	Menu,
} from "electron";
import { join, resolve } from "node:path";
import { exec, type ExecException } from "node:child_process";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/laravel-quick.png?asset";
import { JsonDB, Config } from "node-json-db";
import { v4 as uuidv4 } from "uuid";
import type { Preset } from "../../types/preset";

let mainWindow: BrowserWindow | null = null;
let tray = null;

function createWindow(): void {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === "linux" ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
		},
	});

	mainWindow.on("ready-to-show", () => {
		// mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
		// mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}
}

async function executeCommand(
	command: string,
	preset: Preset,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const childProcess = exec(command, { cwd: preset.cwp });

		childProcess.stdout?.on("data", (data: string) => {
			console.log(data);

			mainWindow.webContents.send("append-log", data);

			if (data.includes("Would you like to install a starter kit?")) {
				mainWindow.webContents.send("append-log", "none\n");
				childProcess.stdin?.write("none\n");
			}

			if (data.includes("Which testing framework do you prefer?")) {
				mainWindow.webContents.send("append-log", `${preset.test}\n`);
				childProcess.stdin?.write(`${preset.test}\n`);
			}

			if (data.includes("Which Breeze stack would you like to install?")) {
				mainWindow.webContents.send("append-log", `${preset.breeze_stack}\n`);
				childProcess.stdin?.write(`${preset.breeze_stack}\n`);
			}

			if (data.includes("Which Jetstream stack would you like to install?")) {
				mainWindow.webContents.send(
					"append-log",
					`${preset.jetstream_stack}\n`,
				);
				childProcess.stdin?.write(`${preset.jetstream_stack}\n`);
			}

			if (data.includes("Would you like any optional features?")) {
				const optionals = preset.jetstream_optionals.join(",");
				mainWindow.webContents.send("append-log", `${optionals}\n`);
				childProcess.stdin?.write(`${optionals}\n`);
			}

			if (data.includes("Would you like dark mode support?")) {
				mainWindow.webContents.send("append-log", "no\n");
				childProcess.stdin?.write("no\n");
			}

			if (data.includes("Would you like to initialize a Git repository?")) {
				mainWindow.webContents.send("append-log", "no\n");
				childProcess.stdin?.write("no\n");
			}

			if (data.includes("Which database will your application use?")) {
				mainWindow.webContents.send("append-log", `${preset.database}\n`);
				childProcess.stdin?.write(`${preset.database}\n`);
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

function getDb({
	filename = "database",
	save_on_push = true,
	human_readable = true,
} = {}): JsonDB {
	return new JsonDB(new Config(filename, save_on_push, human_readable, "/"));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
	// Set app user model id for windows
	electronApp.setAppUserModelId("com.electron");

	tray = new Tray(resolve(__dirname, "../../resources/laravel-quick.png"));

	const db = getDb();
	const presets = await db.getData("/presets");

	const presets_menu = presets.map((preset: Preset) => ({
		label: preset.name,
		type: "normal",
		click: () => {
			mainWindow.webContents.send("preset-selected", preset);
			mainWindow.show();
		},
	}));

	const contextMenu = Menu.buildFromTemplate([
		{ label: "New Preset", type: "normal" },
		{ type: "separator" },
		...presets_menu,
		{ type: "separator" },
		{ label: "Quit", type: "normal" },
	]);
	tray.setToolTip("This is my application.");
	tray.setContextMenu(contextMenu);

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	// IPC test
	ipcMain.on("ping", () => console.log("pong"));

	ipcMain.handle("get-presets", async () => {
		const db = getDb();
		const presets = await db.getData("/presets");

		return presets;
	});

	ipcMain.on("store-preset", async (_event, _preset) => {
		console.log(_preset);

		const preset = { id: uuidv4(), ..._preset };
		const db = getDb();

		await db.push("/presets", [preset], false);

		new Notification({
			title: "Preset criado com sucesso.",
			body: "Você pode agora criar um novo projeto com apenas um click.",
		});
	});

	ipcMain.on("create-project", async (_event, project) => {
		console.log(project);

		const db = getDb();
		const index = await db.getIndex("/presets", project.preset);
		const preset = await db.getData(`/presets[${index}]`);

		let command = "laravel new";

		if (preset.git) {
			command += " --git";
		}

		if (preset.dark_mode) {
			command += " --dark";
		}

		if (preset.scaffolding) {
			command += ` --${preset.scaffolding}`;
		}

		command += ` ${project.name}`;

		if (project.cwp) {
			preset.cwp = project.cwp;
		}

		await executeCommand(command, preset);

		const notification = new Notification({
			title: "Projeto criado com sucesso.",
			body: "Seu projeto terminou de ser criado, clique para abrir.",
		});

		notification.on("click", async () => {
			console.log("Notification clicked");

			try {
				const resp = await shell.openPath(`preset.cwp/${project.name}`);
				console.log(resp);
			} catch (error) {
				console.error(error);
			}
		});

		notification.show();
	});

	createWindow();

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
