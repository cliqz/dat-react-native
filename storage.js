// copied from https://github.com/RangerMauve/random-access-rn-file
import pathAPI from 'path'
import randomAccess from 'random-access-storage'
import RNFS from 'react-native-fs'

const prefix = RNFS.DocumentDirectoryPath+'/';

async function open (name) {
  await ensureFileFolder(name)

  const exists = await RNFS.exists(name)
  if (!exists) {
    await RNFS.writeFile(name, '', 'utf8')
  }
}

async function ensureFileFolder (name) {
  const dir = pathAPI.dirname(name)

  const exists = await RNFS.exists(dir)

  if (!exists) await ensureFileFolder(dir)

  await RNFS.mkdir(dir)
}

export default (folder) => (name) => {
  name = prefix + folder + '/' + name;
  return randomAccess({
    open (req) {
      open(name).then(
        () => {
          req.callback(null)
        },
        err => {
          req.callback(err)
        }
      )
    },
    read (req) {
      RNFS.read(name, req.size, req.offset, 'base64').then(
        data => {
          const buffer = Buffer.from(data, 'base64')
          if (buffer.length !== req.size) {
            req.callback(new Error('Range not satisfiable'))
          } else {
            req.callback(null, buffer)
          }
        },
        err => {
          req.callback(err)
        }
      )
    },
    write (req) {
      const data = req.data.toString('base64')
      RNFS.write(name, data, req.offset, 'base64').then(
        () => {
          req.callback(null)
        },
        err => {
          req.callback(err)
        }
      )
    }
  })
}