let socket;

document.getElementById('bnt').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  if (!name || name.length <= 0) {
    alert('Deve-se fornecer um nome');
    throw new Error('Deve-se fornecer um nome');
  }

  socket = io(`http://localhost:3000/game?name=${name}`);

  socket.on('join', (data) => {
    console.log('join: ', data);
  });
  socket.on('leave', (data) => {
    console.log('leave: ', data);
  });
  socket.on('player names', (data) => {
    console.log('player names: ', data);
  });
  socket.on('error', (data) => {
    console.log('error: ', data);
  });
});
