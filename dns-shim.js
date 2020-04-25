const lookup = (domain, options, cb) => {
  if (!cb) {
    cb = options;
  }
  if (domain === 'router.bittorrent.com') {
    cb(null, '67.215.246.10', 4);
    return;
  }
  if (domain === 'router.utorrent.com') {
    cb(null, '82.221.103.244', 4);
    return;
  }
  if (domain === 'dht.transmissionbt.com') {
    cb(null, '212.129.33.59', 4);
    return;
  }
  console.error('dns call for ', domain);
};

export { lookup };