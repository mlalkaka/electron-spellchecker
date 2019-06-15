require('./support');

const fs = require('fs');
const path = require('path');

const FileDownloader = require('../src/file-downloader');

describe('The File Downloader class', function() {
  const savePath = path.join(__dirname, 'test-file-downloader');

  describe('download method', function() {
    beforeEach(function() {
      if (fs.existsSync(savePath)) {
        fs.unlinkSync(savePath);
      }
    });

    it('should download a file', async function() {
      const webContents = require('electron').remote.getCurrentWebContents();

      const downloader = new FileDownloader(webContents);
      // eslint-disable-next-line no-unused-vars
      const downloadItem = await downloader.download(
        'https://file-examples.com/wp-content/uploads/2017/10/file-sample_150kB.pdf', 
        savePath
      );
      
      expect(fs.existsSync(savePath)).to.equal(true);
    });
  });
});