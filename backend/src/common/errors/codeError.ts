type ErrorDF = {
  type: string;
  message: string;
}

const errosMap = new Map<string, ErrorDF>;

errosMap.set('NOTVALIDTOKEN', {
  type: 'NOTVALIDTOKEN',
  message: 'Token is not valid with this user!',
});

errosMap.set('MULTIPLETAB', {
  type: 'MULTIPLETAB',
  message: 'You only can open in one tab!',
});

errosMap.set('NOTFOUNDROOM', {
  type: 'NOTFOUNDROOM',
  message: 'Room not found!',
});

errosMap.set('CANNOTJOIN', {
  type: 'CANNOTJOIN',
  message: 'Can not join this room!',
});

export default errosMap;