import crypto from 'crypto'
import md5 from 'md5'

export const shuffle = (list) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [list[i], list[j]] = [list[j], list[i]]
  }
}

export const uuidConstruct = (name) => {
  const hexString = md5('OfflinePlayer:' + name)
  const tokens = hexString.match(/[a-fA-F0-9][a-fA-F0-9]/gi)
  const byteArray = tokens.map((t, i) => {
  	if (i == 6) return parseInt(t, 16) & 0x0f | 0x30
  	if (i == 8) return parseInt(t, 16) & 0x3f | 0x80
  	return parseInt(t, 16)
  });
  let uuid = ''
  byteArray.forEach((byte, i) => {
  	let s = byte.toString(16)
  	if (s.length == 1) s = '0' + s
    uuid += s
    if ([3, 5, 7, 9].includes(i)) uuid += '-'
  })
  return uuid
}

export const generateSalt = (saltLength) => {
  let salt = '';
  for (let i = 0; i < saltLength; i ++) {
    let value = Math.floor(Math.random() * 16)
    salt += value.toString(16)
  }
  return salt;
}

export const hashPassword = (password, salt) => {
  let hash = crypto.createHash('sha256').update(password).digest('hex')
  hash += salt;
  hash = crypto.createHash('sha256').update(hash).digest('hex')
  return hash;
}
