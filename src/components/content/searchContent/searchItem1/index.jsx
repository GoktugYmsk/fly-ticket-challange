import React, { useState, useEffect } from 'react';
import DateTime from 'react-datetime';
import PassengerPopup from './popup';
import { FaExchangeAlt } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import flightPorts from '../../../../assets/flightPorts';
import { setFlightPort, setFlightPortArrive } from '../../../configure';
import 'react-datetime/css/react-datetime.css';
import './index.scss';

function SearchItem1() {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [ticketAmount, setTicketAmount] = useState({ adults: 1, children: 0, babies: 0 });
  const [openPorts, setOpenPorts] = useState(false);
  const [openPortsWhere, setOpenPortsWhere] = useState(false);
  const [popup, setPopup] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState('');
  const [selectedExplanationRight, setSelectedExplanationRight] = useState('');

  const flightPortsData = flightPorts.ports;

  const navigate = useNavigate();

  const dispatch = useDispatch()

  const handleSwitchChange = () => {
    setIsRoundTrip(!isRoundTrip);
  };

  const handleCalendarClick = () => {
    setIsCalendarOpen(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date._d);
  };

  const renderCalendar = () => {
    const currentMonth = new Date().getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    const isValidDate = (current) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

      return (
        current.toDate().getMonth() === currentMonth - 1 ||
        current.toDate().getMonth() === nextMonth - 1
      ) && current.toDate() >= currentDate;
    };

    return (
      <div className='calendar'>
        <DateTime
          required
          value={getNextDay() || selectedDate}
          onChange={handleDateChange}
          dateFormat='DD/MM/YYYY'
          timeFormat={false}
          closeOnSelect
          viewMode='months'
          isValidDate={isValidDate}
          renderMonth={(props, month, year) => (
            <div {...props}>
              {month === currentMonth || month === nextMonth ? (
                <div>{`${month}/${year}`}</div>
              ) : null}
            </div>
          )}
        />
      </div>
    );
  };

  const handleOpenPopup = () => {
    setPopup(true);
  };

  const getNextDay = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDay = currentDate.getDate();
    const nextMonth = currentDate.getMonth() + 1;
    const nextYear = currentDate.getFullYear();

    return `${nextDay} ${getMonthName(nextMonth)} ${nextYear}`;
  };

  const getMonthName = (month) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    return monthNames[month - 1];
  };

  const totalPassenger = ticketAmount.adults + ticketAmount.children + ticketAmount.babies;

  const navigateToExpedition = () => {
    if (selectedExplanation && selectedExplanationRight) {
      sessionStorage.setItem('totalPassenger', totalPassenger);
      navigate('/fly-companies');
    }
    else {
      alert('Lütfen nerden ve nereye havaalanlarını seçin.');
    }
  };

  const renderPassengerAmount = () => {
    const childCount = ticketAmount.children;
    const babyCount = ticketAmount.babies;

    if (childCount > 0) {
      return (
        <>
          {childCount > 0 && `${childCount}...`}
          {babyCount > 0 && ``}
        </>
      );
    } else if (babyCount > 0) {
      return (
        <>
          {babyCount > 0 && `${babyCount}...`}
        </>
      );
    } else {
      return (
        <>
          ... Çocuk
          ... Bebek
        </>
      );
    }
  };

  useEffect(() => {
    if (
      selectedExplanation) {
      setOpenPortsWhere(true);
      setOpenPorts(false)
    }
  }, [selectedExplanation])

  useEffect(() => {
    if (selectedExplanationRight) {
      setOpenPortsWhere(false);
    }
  }, [selectedExplanationRight])

  const handlePortOpenClick = () => {
    setOpenPorts(!openPorts);
  };

  const handlePortOpenClickRight = () => {
    setOpenPortsWhere(!openPortsWhere);
    setOpenPorts(false);
  };

  const handlePortClick = (explanationCode) => {
    const selectedPort = flightPortsData.find((port) => port.code === explanationCode);
    if (selectedPort) {
      setSelectedExplanation(selectedPort.explanation);
      dispatch(setFlightPort(selectedPort.code))
    }
  };

  const handlePortClickRigth = (explanationCode) => {
    const selectedPortArrive = flightPortsData.find((port) => port.code === explanationCode);
    if (selectedPortArrive) {
      dispatch(setFlightPortArrive(selectedPortArrive.code));
      setSelectedExplanationRight(selectedPortArrive.explanation);
    }
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.searchItem-one__container-port')) {
      setOpenPorts(false);
      setOpenPortsWhere(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className='searchItem-one__container'>
        <div className='searchItem-one__container-slider'>
          <label className="switch">
            <input
              type='checkbox'
              checked={isRoundTrip}
              onChange={handleSwitchChange}
            />
            <span className='switch-slider'>
              <p>Tek Yön</p>
              <p>Gidiş Dönüş</p>
            </span>
          </label>
        </div>
        <div className='searchItem-one__container__content'>
          <div className='searchItem-one__container-place'>
            <div onClick={handlePortOpenClick} className='searchItem-one__container-place__ports-one'>
              <p>Nerden</p>
              <p>{selectedExplanation}</p>
              <hr />
            </div>
            <FaExchangeAlt />
            <div onClick={handlePortOpenClickRight} className='searchItem-one__container-place__ports-one'>
              <p>Nereye</p>
              <p>{selectedExplanationRight}</p>
              <hr />
            </div>
          </div>
          <div className='searchItem-one__container__chose-travelDate'>
            <div className='travel-date' onClick={handleCalendarClick}>
              <p>Gidiş Tarihi</p>
              <p className='SearchItem-one__container-travelDate'>
                {isCalendarOpen && renderCalendar()}
              </p>
            </div>
            <div className='searchItem-one__container-return'>
              <FaCalendarAlt />
              <p>{isRoundTrip ? 'Gidiş-Dönüş' : 'Tek Yön'}</p>
              {isRoundTrip && renderCalendar()}
            </div>
          </div>
          <div className='searchItem-one__container-passenger-amount'>
            <h3>Yolcu</h3>
            {ticketAmount.adults > 0 && (
              <h2 onClick={handleOpenPopup}>{`${ticketAmount.adults} Yetişkin`}</h2>
            )}
            {(ticketAmount.children > 0 || ticketAmount.babies > 0) && (
              <h2 onClick={handleOpenPopup}>{renderPassengerAmount()}</h2>
            )}
          </div>
          <Button onClick={navigateToExpedition} variant='secondary'>Ucuz Uçuş Bileti Ara</Button>
        </div>
      </div>
      {popup && <PassengerPopup setTicketAmount={setTicketAmount} setPopup={setPopup} />}
      <div className='searchItem-one__container-port'>
        {openPorts && (
          <div className='searchItem-one__container-place__ports'>
            {flightPortsData.map((port, key) => (
              <div key={key} onClick={() => handlePortClick(port.code)}>
                <p>{port.explanation}</p>
              </div>
            ))}
          </div>
        )}
        {openPortsWhere && (
          <div className='searchItem-one__container-place__ports-right'>
            {flightPortsData.map((port, key) => (
              <div key={key} onClick={() => handlePortClickRigth(port.code)}>
                <p>{port.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchItem1;
