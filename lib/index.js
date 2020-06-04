const parseTorrentTitle = require('parse-torrent-title')
const stringSimilarity = require('string-similarity')

class TorrentFileFilter {

  constructor (options = {}) {

    this.allowedExtensions = options.allowedExtensions || ['.mp4', '.avi', '.mkv']
    this.allowSampleFiles = options.allowSampleFiles || false
    this.allowTVSeriesIfNoSE = false

    this.sc = {
      MF: 0.2,
      MN: 0.2,
      MO: 0.2,
      file: 0.6,
      path: 0.6,
      name: 0.9
    }

  }

  filter (media, torrentFileName, torrentFiles = []) {
    const torNameParsed = parseTorrentTitle.parse(torrentFileName)
  
    let ptFilesFiltered = torrentFiles
      .map(file => {
        const meta = parseTorrentTitle.parse(file.name)
        return { ...file, ...meta }
      })
      .filter(file => {
        // If our filename has the extension we can work with we return the file
        for (const extension of this.allowedExtensions) {
          if (file.name.endsWith(extension)) return true
        }
        // Otherwise we filter it out of the array
        return false
      })
    // Do some potential S/E fixing if we're dealing with a TV show
    if (media.type === 'tv_series') {
      ptFilesFiltered = ptFilesFiltered.map(file => {
        // Some torrent files have shitty naming schemes
        // ex: law.and.order.svu.1514.dvdrip.x264-ositv.mkv
        // Where we don't get season && episode params so lets do a simple manual check
        if (!file.season && !file.episode) {
          // Check if title has season and episode string
          const RegexMatch = file.title.match(/\d{4}$/gi) || file.title.match(/\d{2} \d{2}$/gi)
          const SEPMatch = RegexMatch ? RegexMatch[0].replace(' ', '') : false
  
          if (SEPMatch) {
            // Make sure there's no MULTIPLE matches like this
            if (ptFilesFiltered.filter(x => x.title.includes(RegexMatch[0])).length === 1) {
              file.title = file.title.replace(RegexMatch[0], '')
              file.season = Number(SEPMatch.slice(0, 2))
              file.episode = Number(SEPMatch.slice(2, 4))
            }
          }
        }
        return file
      })
      // Filter out files if no S/E
      if (!this.allowTVSeriesIfNoSE) {
        ptFilesFiltered = ptFilesFiltered.filter(x => x.season && x.episode)
      }
    }
    // Do some grade A filtering and return
    return ptFilesFiltered
      // Sort torrent files based on size
      .sort((a, b) => b.length - a.length)
      // Filtering
      .filter(file => {
        // File doesn't have a title
        if (!file.title) return false
        // Check if file has "-sample" in its name, if yes we skip it
        if (!this.allowSampleFiles && file.title.toLowerCase().indexOf('-sample') !== -1) return false
        // We do a string similarity check which will return a % how similar the name is to our media title
        const fileTitle = file.title.toLowerCase()
        const pathTitle = parseTorrentTitle.parse(file.path)

        const nameComp = media.name && stringSimilarity.compareTwoStrings(fileTitle, media.name.toLowerCase())
        const origComp = media.original_name && stringSimilarity.compareTwoStrings(fileTitle, media.original_name.toLowerCase())
        const fileComp = torNameParsed.title && stringSimilarity.compareTwoStrings(fileTitle, torNameParsed.title.toLowerCase())
        const pathComp = pathTitle.title && stringSimilarity.compareTwoStrings(pathTitle.title.toLowerCase(), media.name.toLowerCase())

        return (fileComp > this.sc.MF && (nameComp > this.sc.MN || origComp > this.sc.MO))
          || fileComp > this.sc.file
          || pathComp > this.sc.path
          || nameComp > this.sc.name
          || origComp > this.sc.name
      })
  }

}

module.exports = TorrentFileFilter