import net from 'net'

export const getStats = (port, callback) => {
    const client = net.connect(port, '127.0.0.1', () => {
      const buff = Buffer.from([ 0xFE, 0x01 ]);
      client.write(buff);
    });

    client.setTimeout(5000);

    client.on('data', (data) => {
      if (data && data != '') {
        const server_info = data.toString().split("\x00\x00\x00");
        if (server_info && server_info.length >= 6) {
          callback(true, {
            version: server_info[2].replace(/\u0000/g,''),
            motd: server_info[3].replace(/\u0000/g,''),
            current_players: server_info[4].replace(/\u0000/g,''),
            max_players: server_info[5].replace(/\u0000/g,'')
          })
        } else {
          callback(false)
        }
      }
      client.end();
    })

    client.on('timeout', () => {
      callback(false)
      client.end()
    })

    client.on('error', () => {
      callback(false)
      client.end()
    })
  }