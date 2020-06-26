/**
 * algorithm for constructing an offline uuid using player name
 */

import md5 from 'md5'

const uuidConstruct = (name) => {
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

export { uuidConstruct }