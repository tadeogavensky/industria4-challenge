import React, { useState } from "react";

const Bluetooth = () => {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [dataReceived, setDataReceived] = useState(null);

  const connectToDevice = async () => {
    try {
      console.log("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });
      console.log("Bluetooth device selected:", device);


      const server = await device.gatt.connect();
      console.log("Bluetooth device connected!");

      const service = await server.getPrimaryService("service_uuid");
      const characteristic = await service.getCharacteristic("characteristic_uuid");
  
      // Read data from the characteristic
      const value = await characteristic.readValue();
      console.log("Received data:", new TextDecoder().decode(value));
  
      // Write data to the characteristic
      const data = new Uint8Array([0x01, 0x02, 0x03]);
      await characteristic.writeValue(data);
      console.log("Data sent:", data);

      setConnected(true);
      setDevice(device);
    } catch (error) {
      console.error("Failed to connect to Bluetooth device:", error);
      setConnected(false);
    }
  };

  const handleReceiveData = (event) => {
    const value = event.target.value;
    console.log("Received data:", value);

    // Process the received data as needed
    setDataReceived(value);
  };

  const sendData = async () => {
    const data = "Hello, Bluetooth device!";
    if (device && connected) {
      try {
        const service = await device.gatt.getPrimaryService("service_uuid");
        const characteristic = await service.getCharacteristic(
          "characteristic_uuid"
        );

        await characteristic.writeValue(new TextEncoder().encode(data));
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
