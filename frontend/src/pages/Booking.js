import React, { useEffect, useState } from 'react';
import { useStateValue } from '../context/auth-context';
// import BookingsChart from '../components/Bookings/BookingChart/BookingChart';
import BookingsControls from '../components/Bookings/BookingControls/BookingControls';
import BookingList from '../components/Bookings/BookingList/BookingList';
import Spinner from '../components/Spinner/Spinner';
import { BASE_URL } from '../utils/util';

function Booking() {
  const [isLoading, setIsLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [outputType, setOutputType] = useState('list');
  const [bookings, setBookings] = useState([]);
  const [stateValue] = useStateValue();

  useEffect(() => {
    setIsLoading(true);
    const getEvents = async () => {
      const requestBody = {
        query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
                price
              }
            }
          }
        `
      };

      try {
        const response = await fetch(BASE_URL, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + stateValue?.user.token
          }
        });

        const responseData = await response.json();
        setBookings(responseData.data.bookings);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        throw new Error(err);
      }
    }

    getEvents();
  }, [stateValue?.user.token, removing]);

  const changeOutputTypeHandler = (outputType) => {
    if (outputType === 'list') {
      setOutputType('list');
    } else {
      setOutputType('chart');
    }
  };

  const deleteBookingHandler = async (bookingId) => {
    setRemoving(true);
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
    };

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + stateValue?.user.token
        }
      });

      await response.json();
      setRemoving(false);
    } catch (err) {
      setRemoving(false);
      throw new Error(err);
    }
  }

  let content = <Spinner />;
  if (!isLoading && !removing) {
    content = (
      <React.Fragment>
        <BookingsControls
          activeOutputType={outputType}
          onChange={changeOutputTypeHandler}
        />
        <div>
          {outputType === 'list' ? (
            <BookingList
              bookings={bookings}
              onDelete={deleteBookingHandler}
            />
          ) : (
            <></>
            // <BookingsChart bookings={bookings} />
          )}
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>{content}</React.Fragment>
  );
}

export default Booking;
