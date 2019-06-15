module.exports = class FileDownloader {
  constructor(webContents) {
    this.webContents = webContents;
  }

  /**
   * @public
   * @param {string} url Resource/file to download.
   * @param {string} savePath Location of where to save it.
   */
  download(url, savePath) {
    return new Promise((resolve, reject) => {
      this.webContents.session.on(
        'will-download', 
        this.generateListener(url, savePath, resolve, reject)
      );

      this.webContents.downloadURL(url);
    });
  }

  /**
   * 
   * @private
   */
  generateListener(url, savePath, resolve, reject) {
    const listener = (willDownloadEvent, item, webContents) => {
      if (item.getURL() !== url) {
        return;
      }

      item.setSavePath(savePath);
      item.on('done', (doneEvent, state) => {
        webContents.session.removeListener('will-download', listener);
        if (state === 'completed') {
          resolve(item);
        } else if (state === 'cancelled') {
          reject(new Error(`Download of ${url} was cancelled.`));
        } else if (state === 'interrupted') {
          reject(new Error(`Download of ${url} was interrupted.`));
        }
      });
    };

    return listener;
  }
};