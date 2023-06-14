import geoip from 'geoip-lite'

import readerIp from '@maxmind/geoip2-node'
import fs from 'fs'

export const getGeoLocation = (req, res, next) => {
      const ip = req.clientIp
      console.log('ip' , ip)
}

