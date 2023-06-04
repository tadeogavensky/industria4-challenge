import React, { useState } from "react";

const Bluetooth = () => {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [dataReceived, setDataReceived] = useState(null);
  const [data, setData] = useState(null);
  const [services, setServices] = useState();

  const connectToDevice = async () => {
    try {
      console.log("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["0000180f-0000-1000-8000-00805f9b34fb"],
      });
      console.log("Bluetooth device selected:", device);

      const server = await device.gatt.connect();
      console.log("Bluetooth device connected!");

      const discoveredServices = await server.getPrimaryServices();

      const serviceUUIDs = discoveredServices.map((service) => service.uuid);

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

  const sendData = async (e) => {
    e.preventDefault();
  
    if (device && connected) {
      try {
        console.log("services :>> ", services);
  
        // Connect to the Bluetooth device and retrieve the GATT server
        const server = await device.gatt.connect();
  
        // Get the specified service
        const service = await server.getPrimaryService(services);
  
        // Get the characteristic with the specified UUID
        const characteristics = await service.getCharacteristics();
  
        console.log("characterisatics :>> ", characteristics[0].uuid);
  
        const characteristic = await service.getCharacteristic(
          characteristics[0].uuid
        );
  
        console.log("characteristic:", characteristic);
  
        const data = new Uint8Array([0x01, 0x20, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const dataBuffer = data.buffer;
  
        await characteristic.writeValue(dataBuffer);
  
        console.log("Data sent:", data);
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
        <form className="flex flex-col gap-2" onSubmit={sendData}>
          <input
            type="file"
            placeholder="select a file"
            onChange={(e) => {
              setData(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="input text"
            className=" border-blue-300 border-2 p-2"
            onChange={(e) => {
              setData(e.target.value);
            }}
          />
          <button
            onClick={sendData}
            disabled={!connected}
            className="bg-[#a3b18a] hover:bg-[#588157] transition-all ease-in-out duration-300 text-white px-3 py-2 rounded-md "
          >
            Send Data
          </button>
        </form>
      )}

      <div className="flex flex-col">
        <p>Recieved data will be displayed here</p>
        {dataReceived && <p>Data received: {dataReceived}</p>}
      </div>
    </div>
  );
};

export default Bluetooth;
