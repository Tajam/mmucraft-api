import crypto from 'crypto'

const generateSalt = (saltLength) => {
  let salt = '';
  for (let i = 0; i < saltLength; i ++) {
    let value = Math.floor(Math.random() * 16);
    salt += value.toString(16);
  }
  return salt;
},

const hashPassword = (password, salt) => {
  let hash = crypto.createHash('sha256').update(password).digest('hex');
  hash += salt;
  hash = crypto.createHash('sha256').update(hash).digest('hex');
  return hash;
}

export { generateSalt, hashPassword }
