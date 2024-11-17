let socket;

document.getElementById('bnt').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  if (!name || name.length <= 0) {
    alert('Deve-se fornecer um nome');
    throw new Error('Deve-se fornecer um nome');
  }

  socket = io(`http://localhost:3000/game?name=${name}`);

  socket.emit('message', 'asdw');
  socket.on('message', (data) => {
    console.log(data);
  });
});
