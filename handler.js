const {
  remote: { BrowserWindow }
} = require('electron');
const { remote } = require('electron');
const ipc = require('electron').ipcRenderer;

class Fetcher {
  constructor () {
    this.cache = {};
  }

  createWindow () {
    const window = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      }
    });
    return window;
  }

  fetchBot (bot) {
    return new Promise((resolve, reject) => {
      const window = this.createWindow();
      window.openDevTools();
      window.webContents.on('did-finish-load', () => {
        ipc.on(
          'discord-bot-info',
          (event, message) => {
            try {
              window.close();
            } catch { }
            console.log(message);
            if (message) {
              resolve(message);
            }
            resolve();
          }
        );
        window.webContents.executeJavaScript(`
                        while (!document.querySelector(".longdescription") && !document.querySelector(".error-banner-bottom")) {
                        }
                        require("electron").ipcRenderer.sendTo(${
  remote.getCurrentWindow().webContents.id
}, "discord-bot-info", (document.querySelector(".longdescription") || {}).innerHTML);
`);
      });
      window.loadURL(
        `https://top.gg/bot/${bot}`
      );
    });
  }

  /*
   * 	let translatePromise = (resolve, reject) => {
   * 		setTimeout(async () => {
   * 			const finished = Date.now();
   */

  /*
   * 			const excepted = this.removeExceptions(text);
   * 			let translatedText;
   * 			let tries = 0;
   */

  /*
   * 			while (!translatedText && tries < 3) {
   * 				tries++;
   * 				try {
   * 					translatedText = await translateFunctions[engine](
   * 						excepted.text,
   * 						language
   * 					);
   * 				} catch (e) { }
   * 			}
   */

  // 			if (!translatedText) reject();

  /*
   * 			const results = this.addExceptions(
   * 				translatedText,
   * 				excepted.exceptions
   * 			);
   */

  /*
   * 			resolve(results);
   * 		}, timeout);
   * 	};
   */

  /*
   * 	if (async) {
   * 		return await new Promise(translatePromise);
   * 	}
   * 	return new Promise(translatePromise);
   * };
   */

  /*
   * translateMessage = async (message, language, engine, async = true) => {
   * 	// If any of the properties don't exist, make them.
   * 	if (!this.cache[message.channel_id]) {
   * 		this.cache[message.channel_id] = {};
   * 	}
   * 	if (!this.cache[message.channel_id][message.id]) {
   * 		this.cache[message.channel_id][message.id] = {
   * 			channelID: message.channel_id,
   * 			currentLanguage: "original",
   * 			engines: {},
   * 			originalContent: message.content
   * 		}
   * 	}
   * 	if (!this.cache[message.channel_id][message.id].engines[engine]) {
   * 		this.cache[message.channel_id][message.id].engines[engine] = {};
   * 	}
   * 	if (!this.cache[message.channel_id][message.id].engines[engine][language]) {
   * 		this.cache[message.channel_id][message.id].engines[engine][language] = {};
   * 	}
   */

  /*
   * 	// If the target language is the original language, set it back.
   * 	const settings = SettingsHandler.getSettings();
   * 	// If the target language is cached, use it.
   * 	if (language == "original") {
   * 		this.cache[message.channel_id][message.id].currentLanguage = "original";
   * 		message.content =
   * 			this.cache[message.channel_id][message.id].originalContent;
   * 	} else if (this.cache[message.channel_id][message.id].engines[engine][language].content) {
   * 		this.cache[message.channel_id][message.id].currentLanguage = language;
   * 		message.content =
   * 			this.cache[message.channel_id][message.id].engines[engine][language].content;
   * 	} else {
   * 		const translatePromise = (resolve, reject) => {
   * 			this.translate(message.content, language, engine, async)
   * 				.then((results) => {
   * 					message.content = results;
   * 					this.cache[message.channel_id][message.id].currentLanguage = language;
   * 					this.cache[message.channel_id][message.id].engines[engine][language].content = results;
   * 					resolve(message);
   * 				})
   * 				.catch((e) => {
   * 					reject(e);
   * 				});
   * 		};
   */

  /*
   * 		if (async) {
   * 			return await new Promise(translatePromise);
   * 		}
   * 		return new Promise(translatePromise);
   * 	}
   */

  /*
   * 	if (async) {
   * 		return await new Promise((resolve) => {
   * 			resolve(message);
   * 		});
   * 	}
   * 	return new Promise((resolve) => {
   * 		resolve(message);
   * 	});
   * };
   */


  /*
   * updateMessage(message) {
   * 	dispatcher.dispatch({
   * 		translation: true,
   * 		type: "MESSAGE_UPDATE",
   * 		message
   * 	});
   * };
   */

  /*
   * clearCache = () => {
   * 	for (let channelID in this.cache) {
   * 		for (let messageID in this.cache[channelID]) {
   * 			this.removeMessage(channelID, messageID);
   * 		}
   * 	}
   * 	this.cache = {};
   * };
   */

  /*
   * removeMessage = (channelID, messageID, reset = true) => {
   * 	let message = getMessage(channelID, messageID);
   * 	if (reset) {
   * 		message.content = this.cache[channelID][messageID].originalContent;
   * 		this.updateMessage(message);
   * 	}
   * 	delete this.cache[channelID][messageID];
   * };
   */
}

module.exports = new Fetcher();
