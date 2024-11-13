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

@WebSocketGateway({ namespace: 'game', cors: corsOptions })
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  io: Namespace;
  afterInit() {}

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect() {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: object): string {
    console.log(`Client: ${client.id} || Payload: ${payload}`);
    return 'Hello world!';
  }
}
