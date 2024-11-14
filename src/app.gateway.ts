import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import corsOptions from './CorsOptions';
import { Namespace, Socket } from 'socket.io';

type TJogador = {
  name: string | string[];
  socketId: string;
};

const jogadores = new Map<TJogador, string>();

@WebSocketGateway({ namespace: 'game', cors: corsOptions })
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  io: Namespace;
  afterInit() {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const clientId = client.id;
    const clientName = client.handshake.query?.name;
    console.log(`Id: ${clientId} || Name: ${clientName}`);
    jogadores.set({ name: clientName, socketId: clientId }, `${clientId}`);
    console.log(jogadores);
  }
  handleDisconnect() {}

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: object) {
    console.log(`Client: ${client.id} || Payload: ${payload}`);
    return client.emit('message', 'Hello World');
  }
}
