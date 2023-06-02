import React, { useState } from "react";

const Bluetooth = () => {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [dataReceived, setDataReceived] = useState(null);
  const [services, setServices] = useState();
  const connectToDevice = async () => {
    try {
      console.log("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000180f-0000-1000-8000-00805f9b34fb'],
      });
      console.log("Bluetooth device selected:", device);

      const server = await device.gatt.connect();
      console.log("Bluetooth device connected!");

      const discoveredServices = await server.getPrimaryServices();

      console.log('discoveredServices :>> ', discoveredServices);

      const serviceUUIDs = discoveredServices.map(service => service.uuid);
      
      console.log("Discovered services:", serviceUUIDs);

      setConnected(true);
      setDevice(device);
      setServices(serviceUUIDs);
    } catch (error) {
      console.error("Failed to connect to Bluetooth device:", error);
      setConnected(false);
    }
  };

  const handleReceiveData = (event) => {
    try {
      const { value } = event.target;
      if (value) {
        console.log("Received data:", value);
        // Process the received data as needed
        setDataReceived(value);
      } else {
        console.log("Received empty data");
      }
    } catch (error) {
      console.error("Error receiving data:", error);
    }
  };
  

  const sendData = async () => {
    const data = "Hello, Bluetooth device!";
    console.log('data :>> ', data);
    console.log('services :>> ', services);
    if (device && connected) {
      console.log('entra aca :>> ');
      try {
        const services = await device.gatt.getPrimaryServices();
  
        services.forEach(async (service) => {
          const characteristics = await service.getCharacteristics();
          characteristics.forEach(async (characteristic) => {
            console.log("Characteristic", characteristic.uuid);
  
            await characteristic.writeValue(new TextEncoder().encode(data));
            console.log("Data sent:", data);
          });
        });
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  };
  

  return (
    <div className="flex flex-col mt-20 gap-3 w-[500px] shadow-md bg-white p-5 text-center">
      <h1>Please Connect to a Bluetooth Device</h1>
      <button
        className="bg-[#8ecae6] hover:bg-[#219ebc] transition-all ease-in-out duration-300 text-white px-3 py-2 rounded-md "
        onClick={connectToDevice}
      >
        Connect to Bluetooth
      </button>
      {connected && <p>Bluetooth device connected: {device.name}</p>}

      {connected && (
        <button
          onClick={sendData}
          disabled={!connected}
          className="bg-[#a3b18a] hover:bg-[#588157] transition-all ease-in-out duration-300 text-white px-3 py-2 rounded-md "
        >
          Send Data
        </button>
      )}

      {dataReceived && <p>Data received: {dataReceived}</p>}
    </div>
  );
};

export default Bluetooth;
