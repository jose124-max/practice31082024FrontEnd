import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Asegúrate de importar auth aquí
import './roomlist.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null); // Almacena la información del usuario autenticado

  useEffect(() => {
    axios.get('http://localhost:8000/api/rooms/')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });

    // Escuchar cambios en la autenticación
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      if (authenticatedUser) {
        setUser(authenticatedUser); // Establecer el usuario autenticado en el estado
      }
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();

  }, []);

  const handleReserve = (roomId) => {
    const reservedRoom = rooms.find(room => room.id === roomId);
    if (reservedRoom && user) {
      // Realizar la solicitud POST para registrar la reserva en el backend

      const valor={room: reservedRoom.id,
      user: user.uid, // Utilizar el UID del usuario autenticado
      check_in: '2024-07-31', // Puedes reemplazar estas fechas con fechas dinámicas
      check_out: '2024-08-21'}
      console.log(valor);


      axios.post('http://localhost:8000/api/reservations/', {
        room: reservedRoom.id,
        user: user.uid, // Utilizar el UID del usuario autenticado
        check_in: '2024-07-31', // Puedes reemplazar estas fechas con fechas dinámicas
        check_out: '2024-08-21'
      })
      .then(response => {
        setReservations([...reservations, response.data]);
        console.log('Room reserved:', response.data);
      })
      .catch(error => {
        console.error('Error reserving room:', error);
      });
    } else if (!user) {
      console.error('User is not authenticated');
    }
  };

  return (
    <div className="room-list-container">
      <div>
        <h2>Habitaciones disponibles</h2>
        <div className='cards'>
          {rooms.map(room => (
            <div className='card' key={room.id}>
              <li>
                <img src={room.image_url} alt={room.name} width="200" />
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <p>${room.price}</p>
                <button onClick={() => handleReserve(room.id)}>Reserve</button>
              </li>
            </div>
          ))}
        </div>
      </div>

      <div className="reservations-panel">
        <h2>Habitaciones reservadas</h2>
        <ul>
          {reservations.map(reservation => (
            <li key={reservation.id}>
              <h3>{reservation.room.name}</h3>
              <p>${reservation.room.price}</p>
              <p>Check-in: {reservation.check_in}</p>
              <p>Check-out: {reservation.check_out}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomList;
