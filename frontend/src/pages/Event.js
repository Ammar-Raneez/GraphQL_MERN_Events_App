import React, { useEffect, useRef, useState } from 'react';
import { useStateValue } from '../context/auth-context';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Modal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import './Event.css';
import { BASE_URL } from '../utils/util';

function Event() {
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [stateValue] = useStateValue();

  const titleElRef = useRef();
  const priceElRef = useRef();
  const dateElRef = useRef();
  const descriptionElRef = useRef();

  useEffect(() => {
    setIsLoading(true);
    const getEvents = async () => {
      const requestBody = {
        query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
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
            'Content-Type': 'application/json'
          }
        });

        const responseData = await response.json();
        setEvents(responseData.data.events);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        throw new Error(err);
      }
    }

    getEvents();
  }, [creating]);

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  }

  const modalConfirmHandler = async () => {
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (title.trim().length === 0 || price <= 0
      || date.trim().length === 0 || description.trim().length === 0) {
      return;
    }

    const token = stateValue?.user.token;

    const requestBody = {
      query: `
        mutation createEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
          createEvent(event: { title: $title, description: $desc, price: $price, date: $date}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        desc: description,
        title,
        price,
        date,
      }
    }

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });

      const responseData = await response.json();
      const event = {
        _id: responseData.data.createEvent._id,
        title: responseData.data.createEvent.title,
        description: responseData.data.createEvent.description,
        date: responseData.data.createEvent.date,
        price: responseData.data.createEvent.price,
        creator: {
          _id: this.context.userId
        }
      }

      setCreating(false);
      setEvents([...events, event]);
    } catch (err) {
      setCreating(false);
      throw new Error('Failed!');
    }
  }

  const startCreateEventHandler = () => {
    setCreating(true);
  }

  const bookEventHandler = () => {
    if (!stateValue?.user.token) {
      setSelectedEvent(null);
      return;
    }
  }

  const showDetailHandler = (eventId) => {
    const event = events.find((event) => event._id === eventId);
    setSelectedEvent(event);
  }

  return (
    <React.Fragment>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                ref={descriptionElRef}
              />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={stateValue?.user.token ? 'Book' : 'Confirm'}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {stateValue?.user.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={stateValue?.user.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
}

export default Event;
