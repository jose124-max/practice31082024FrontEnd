import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './adminpanel.css'; // Importa el archivo CSS

const AdminPanel = () => {
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/hotels/')
      .then(response => {
        setHotels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
      });
  }, []);

  const handleImageUpload = async () => {
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);  
      console.log("URL RECUPERADA:", url); 
      setImageUrl(url); 
    }
  };

  const handleAddHotel = () => {
    axios.post('http://localhost:8000/api/hotels/', {
      name: hotelName,
      address: hotelAddress,
      description: hotelDescription
    })
    .then(response => {
      console.log('Hotel added:', response.data);
      setHotels([...hotels, response.data]);
    })
    .catch(error => {
      console.error('Error adding hotel:', error);
    });
  };

  const handleAddRoom = async () => {
    if (!selectedHotel) {
      alert('Please select a hotel.');
      return;
    }

    await handleImageUpload();
    console.log('se subio la imagen');
    const roomData = {
      hotel: selectedHotel,
      name: roomName,
      description: roomDescription,
      price: roomPrice,
      image_url: imageUrl
    };
    console.log('Image URL:', imageUrl);
    console.log('Data being sent:', roomData);

    axios.post('http://localhost:8000/api/rooms/', roomData)
      .then(response => {
        console.log('Room added:', response.data);
      })
      .catch(error => {
        console.error('Error adding room:', error);
        console.error('Error response data:', error.response?.data);
      });
  };

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>
      <div>
        <h3>Agregar habitación</h3>
        <select onChange={(e) => setSelectedHotel(e.target.value)} value={selectedHotel}>
          <option value="" disabled>Selecciona un hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nombre de habitación"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <textarea
          placeholder="Descripción de la habitación"
          onChange={(e) => setRoomDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          onChange={(e) => setRoomPrice(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button onClick={handleAddRoom}>Agregar habitación</button>
      </div>
      <div>
        <h3>Agregar hotel</h3>
        <input
          type="text"
          placeholder="Nombre de hotel"
          onChange={(e) => setHotelName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección de hotel"
          onChange={(e) => setHotelAddress(e.target.value)}
        />
        <textarea
          placeholder="Descripción de hotel"
          onChange={(e) => setHotelDescription(e.target.value)}
        />
        <button onClick={handleAddHotel}>Agregar Hotel</button>
      </div>
    </div>
  );
};

export default AdminPanel;
