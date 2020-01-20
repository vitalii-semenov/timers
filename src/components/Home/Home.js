import React, {useState, useEffect} from 'react';
import moment from 'moment';
import addImg from '../../assets/pictures/play_arrow-24px.svg';
import pauseImg from '../../assets/pictures/pause_circle_outline-24px.svg';
import playImg from '../../assets/pictures/play_circle_outline-24px.svg';
import removeImg from '../../assets/pictures/remove_circle_outline-24px.svg';

import './Home.scss'

const TIMERS = 'timers';
const EXIT_TIME = 'exit-time';

const Home = () => {
  const [state, setState] = useState({
    isChanged: false,
    name: '',
    timers: []
  });

  useEffect(() => {
    const diff = getTimeFromExit();
    const timersFromLocalStorage = JSON.parse(localStorage.getItem(TIMERS));
    timersFromLocalStorage && timersFromLocalStorage.forEach(el => {
      !el.pause ? el.timer = moment(el.timer).add(diff) : el.timer = moment(el.timer);
    });
    setState(prevState => ({...prevState, timers: timersFromLocalStorage || []}))
    const interval = () => setState(prevState => ({...prevState, isChanged: !prevState.isChanged}));
    setInterval(interval, 1000);
    return () => clearInterval(interval)
    }, []);

  useEffect(() => {
    let newT = [...state.timers];
    if (newT.length)  {
      newT.forEach(el => {
        if (!el.pause) {
          return el.timer.add(1000);
        } else {
          return el.timer
        }
      });
      localStorage.setItem(TIMERS, JSON.stringify(newT))
      localStorage.setItem(EXIT_TIME, JSON.stringify(moment().format()))
      setState(prevState => ({...prevState, timers: newT}))
    }
  }, [state.isChanged]);

  const parseDaysTo = (date) => {
    return `${date.days() * 24 + date.hours()}:${date.format('mm')}:${date.format('ss')}`
  };

  const getTimeFromExit = () => {
    const exitTime = JSON.parse(localStorage.getItem(EXIT_TIME));
    if(exitTime) {
      return moment().diff(moment(exitTime));
    } else return 0;
  };

  const addTimer = () => {
    let newTimers = [...state.timers];
    newTimers.unshift({name: state.name, timer: moment().startOf('week'), pause: false});
    setState(prevState => ({...prevState, timers: newTimers, name: '', isChanged: !prevState.isChanged}))
  };

  const setPause = (id) => {{
    const newTimers = [...state.timers];
    newTimers[id].pause = !newTimers[id].pause;
    setState(prevState => ({...prevState, timers: newTimers}))
  }};

  const setDelete = (id) => {
    const newTimers = [...state.timers].filter((el, index) => index !== id);
    if (!newTimers.length) localStorage.setItem(TIMERS, JSON.stringify(newTimers));
    setState(prevState => ({...prevState, timers: newTimers}))
  };

  return (
    <div className={'container'}>
      <h1>tracker</h1>
      <div className="createInputContainer">
        <input type="text" value={state.name} onChange={(e) => {
          e.persist();
          setState(prevState => ({...prevState, name: e.target.value}))
        }}/>
        <img className="addImg" src={addImg} alt="" onClick={addTimer}/>
      </div>
      <ul className="timersListContainer">
        {state.timers.length && state.timers.map((timer, index) => (
          <li key={index}>
            <div>{timer.name}</div>
            <div>
              <span>{parseDaysTo(timer.timer)}</span>
              <img src={!timer.pause ? pauseImg : playImg} alt="" onClick={() => setPause(index)}/>
              <img src={removeImg} alt="" onClick={() => setDelete(index)}/>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Home;
