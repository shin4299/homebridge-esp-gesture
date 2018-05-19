'use strict';

const dgram = require('dgram');

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-esp-gesture', 'GestureButton', ESPLUXPlugin);
};

class ESPLUXPlugin
{
  constructor(log, config) {
    this.log = log;
    this.name = config.name;
    this.listen_port = config.listen_port || 8269;
	  
	this.informationService = new Service.AccessoryInformation();

    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "ESP")
      .setCharacteristic(Characteristic.Model, "ESPEasyGesture")
      .setCharacteristic(Characteristic.SerialNumber, this.device);
	  
	this.switch1Service = new Service.StatelessProgrammableSwitch(this.name + '1');
	this.switch2Service = new Service.StatelessProgrammableSwitch(this.name + '2');
    

    this.server = dgram.createSocket('udp4');
    
    this.server.on('error', (err) => {
      console.log(`udp server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      console.log(`server received udp: ${msg} from ${rinfo.address}`);

      let json;
      try {
          json = JSON.parse(msg);
      } catch (e) {
          console.log(`failed to decode JSON: ${e}`);
          return;
      }

      const gesture = json.gesture;
	    
    if (gesture >= 4) {
        this.switch2Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
     	 if (gesture == '4') {
     	   event.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS); //0
   	   } else if (gesture == '5') {
   	     event.updateValue(Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS); //1
   	   } else if (gesture == '6') {
   	     event.updateValue(Characteristic.ProgrammableSwitchEvent.LONG_PRESS); //2
  	    }
    } else if (gesture >= 1) {
        this.switch1Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
     	 if (gesture == '1') {
     	   event.updateValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS); //0
   	   } else if (gesture == '2') {
   	     event.updateValue(Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS); //1
   	   } else if (gesture == '3') {
   	     event.updateValue(Characteristic.ProgrammableSwitchEvent.LONG_PRESS); //2
  	    }
    } 
	    
    });

    
    this.server.bind(this.listen_port);

  }

  getServices() {
	  
	return [this.informationService, this.switch1Service, this.switch2Service];

  }
}
