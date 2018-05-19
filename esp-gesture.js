'use strict';

const dgram = require('dgram');

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-esp-lux', 'ESPLUX', ESPLUXPlugin);
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
      .setCharacteristic(Characteristic.Model, "ESPEasyLux")
      .setCharacteristic(Characteristic.SerialNumber, this.device);
	  
	this.lightService = new Service.LightSensor(this.name);
    

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

      const light_lux = json.light_lux;
	    
    if (light_lux >= 0) {
        this.lightService
	.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
	.setValue(Math.round(light_lux))
    }
    });

    
    this.server.bind(this.listen_port);

  }

  getServices() {
	  
	return [this.informationService, this.lightService];

  }
}
