import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client' ;
import * as app from 'express';
import { makeDecorator } from '@angular/core/src/util/decorators';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  socket: SocketIOClient.Socket;
  name: string;
  message: string;  
  dest: string [] = [];
  type: string;
  outputList: string[] = [];
  visible: boolean = false;
  messages: string[] = [];
  sala: string[] = [];

  constructor() { 
    this.socket = io.connect('http://localhost:3000');

    //Listen events
    this.socket.on('chat', function(mensaje, name, type, dest){
      console.log(type);
      if (type == 'individual'){
        console.log (mensaje +"    " + name +"    "+ dest +"   "+ type)
          if (dest == this.socket.id || name == this.name){
            this.sala.push(name + ":" + mensaje);        
            console.log(this.sala);
            }
         }
      //multiple si no pongo destino
      if (type == 'multichat'){  
        this.messages.push(name + ":" + mensaje);
             console.log(this.messages);      
        }
      }.bind(this));  

      this.socket.on('user', function(socket){
        var socketlength = socket.length;
        console.log("nombre users", socketlength);
        this.outputList = [];
        for (var i = 0; i <= socketlength-1; i++) {
            console.log("socket ", socket[i]);
            this.outputList.push(socket[i]);   
            this.dest.push(socket[i]);
            console.log("lista de destinossssss    " + this.dest);          
        }      
    }.bind(this));  
  }

  ngOnInit() {
  }

  openForm(){
    this.visible = true;
    console.log("VISIBLE", this.visible);
  }
  sendMessage(){
    console.log("name", this.name);
    console.log("message: ", this.message);
    this.socket.emit("chat", this.message, this.name, this.type, this.dest);
  }
  closeForm() {
    this.visible = false;
  }
  sendName(){
    this.socket.emit('nickname', this.name);
    console.log("nickname" + this.name);
  }
}

