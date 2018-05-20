'use strict';

const dgram = require('dgram');

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-esp-gesture', 'ESPGESTURE', ESPGESPlugin);
};

class ESPGESPlugin
{
  constructor(log, config) {
    this.log = log;
    this.name = config.name;
       var switchnamea = this.name + '1'
       var switchnameb = this.name + '2'
       
//    this.num = config.number || '1';
    this.listen_port = config.listen_port || 8265;
	  
	this.informationService = new Service.AccessoryInformation();

    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "ESP")
      .setCharacteristic(Characteristic.Model, "ESPEasyGesture")
      .setCharacteristic(Characteristic.SerialNumber, this.device);
	  
	this.switch1Service = new Service.StatelessProgrammableSwitch(this.name, switchnamea);
	  
	this.switch2Service = new Service.StatelessProgrammableSwitch(this.name, switchnameb);
    

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
	    
	    
//	if (this.num == '1') {
	    	if (gesture == '1') {
        this.switch1Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
     	.setValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
		} else if (gesture == '2') {
        this.switch1Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
     	.setValue(Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS);
		} else if (gesture == '3') {
        this.switch1Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
     	.setValue(Characteristic.ProgrammableSwitchEvent.LONG_PRESS);
		}
//	} else { 
		else if (gesture == '4') {
        this.switch2Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
     	.setValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
		} else if (gesture == '5') {
        this.switch2Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
     	.setValue(Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS);
		} else if (gesture == '6') {
        this.switch2Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
     	.setValue(Characteristic.ProgrammableSwitchEvent.LONG_PRESS);
		}
//	}
	    /*else if (gesture == '4') {
        this.switch1Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent.BUTTON_2)
     	.setValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
		} else if (gesture == '5') {
        this.switch1Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent.BUTTON_2)
     	.setValue(Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS);
		} else if (gesture == '6') {
        this.switch1Service
	.getCharacteristic(Characteristic.ProgrammableSwitchEvent.BUTTON_2)
     	.setValue(Characteristic.ProgrammableSwitchEvent.LONG_PRESS);
		}*/
		
		

	    
    });

    
    this.server.bind(this.listen_port);

  }

  getServices() {
	  
//	return [this.informationService, this.switch1Service];
	return [this.informationService, this.switch1Service, this.switch2Service];

  }
}

