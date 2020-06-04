const TorrentFileFilter = require('./lib/index') // require('torrent-file-filter')
const tff = new TorrentFileFilter()

const media = {
  "type": "tv_series",
  "original_name": "Заголовок примера",
  "name": "Example Title",
}
const torrentFileName = "Example.Title.S01.Complete.1080p.NF.WEB-DL.DDP5.1.x264-Ao.torrent"
const torrentFiles = [
  {
    path: 'Example Title\\Example.Title.S01E01.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    name: 'Example.Title.S01E01.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    length: 2121902522,
    offset: 0
  },
  {
    path: 'Example Title\\Заголовок.примера.S01E02.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    name: 'Заголовок.примера.S01E02.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    length: 1185213274,
    offset: 2121902522
  },
  {
    path: 'Example Title\\example title.S01E03.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    name: 'example title.S01E03.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    length: 1482082825,
    offset: 3307115796
  },
  {
    path: 'Example Title\\exmple.titl.S01E04.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    name: 'exmple.titl.S01E04.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    length: 1933563326,
    offset: 4789198621
  },
  {
    path: 'Example Title\\S01E05.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    name: 'S01E05.1080p.NF.WEB-DL.DDP5.1.x264-Ao.mkv',
    length: 1348773328,
    offset: 6722761947
  },
  {
    path: 'Example Title\\Bad.File.mkv',
    name: 'Bad.File.mkv',
    length: 618635516,
    offset: 8071535275
  },
  {
    path: 'Bad.File.S01.E99.mkv',
    name: 'Bad.File.S01.E99.mkv',
    length: 618635516,
    offset: 8071535275
  },
  {
    path: 'Example Title\\Example.Title.S01E07.1080p.NF.WEB-DL.DDP5.1.x264-Ao-sample.mkv',
    name: 'Example.Title.S01E07.1080p.NF.WEB-DL.DDP5.1.x264-Ao-sample.mkv',
    length: 1783594679,
    offset: 8690170791
  },
  {
    path: 'Example Title\\README.nfo',
    name: 'README.nfo',
    length: 1553953414,
    offset: 10473765470
  }
]

const usableFiles = tff.filter(media, torrentFileName, torrentFiles)
console.log(usableFiles)