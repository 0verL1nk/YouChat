import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import Store from 'electron-store'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  onLoginOrRegister,
  onLoginSuccess,
  closeWindow,
  minimizeWindow,
  winTitleOp,
  maximizeWindow
} from './ipc'
// import { tr } from 'element-plus/es/locales.mjs'
const NODE_ENV = process.env.NODE_ENV
const login_height = 330
const login_width = 300
const register_height = 450

function createWindow() {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    maximizable: false,
    icon: icon,
    width: login_width,
    height: login_height,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    resizable: false,
    frame: true,
    transparent: false,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setTitle('YouChat')
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  // 托盘
  const tray = new Tray(icon)
  var contextMenu = [
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    {
      label: 'Exit',
      click: () => {
        app.exit()
      }
    }
  ]
  const menu = Menu.buildFromTemplate(contextMenu)
  tray.setContextMenu(menu)
  tray.setToolTip('YouChat')
  tray.setTitle('YouChat')
  tray.on('click', () => {
    mainWindow.setSkipTaskbar(false)
    mainWindow.show()
  })
  //监听登陆注册
  onLoginOrRegister((isLogin) => {
    mainWindow.setResizable(true)
    if (isLogin) {
      mainWindow.setSize(login_width, login_height)
    } else {
      mainWindow.setSize(login_width, register_height)
    }
    mainWindow.setResizable(false)
  })
  //监听登陆成功
  onLoginSuccess((config) => {
    mainWindow.setOpacity(0)
    mainWindow.setResizable(true)
    mainWindow.setSize(960, 640)
    // 居中显示
    mainWindow.center()
    // 可以最大化
    mainWindow.setMaximizable(true)
    // 设置最小窗口大小
    mainWindow.setMinimumSize(800, 600)
    // TODO 管理后台,托盘操作
    if (config.admin) {
    }
    contextMenu.unshift({
      label: 'User:' + config.nickName,
      click: () => {}
    })
    setTimeout(() => {
      mainWindow.setOpacity(1)
      mainWindow.show()
      mainWindow.focus()
    }, 500)
  })
  closeWindow(() => {
    mainWindow.close()
  })
  minimizeWindow(() => {
    mainWindow.minimize()
  })
  maximizeWindow(() => {
    mainWindow.maximize()
  })
  winTitleOp((e, [action, data]) => {
    const webContents = e.sender
    const win = BrowserWindow.fromWebContents(webContents)
    switch (action) {
      case 'close': {
        // 0:直接关闭 1:隐藏关闭
        if (data.closeType == 0) {
          win.close()
        } else {
          win.setSkipTaskbar(true)
          win.hide()
        }
        break
      }
      case 'minimize': {
        win.minimize()
        break
      }
      case 'maximize': {
        win.maximize()
        break
      }
      case 'unmaximize': {
        win.unmaximize()
        break
      }
      case 'top': {
        // console.log(data)
        if (data) {
          win.setAlwaysOnTop(true)
        } else {
          win.setAlwaysOnTop(false)
        }
        break
      }
      default:
        break
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  // Store.initRenderer()
  //

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
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
