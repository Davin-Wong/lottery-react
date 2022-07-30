import React, { useState, useEffect } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [currPlayer, setCurrPlayer] = useState('');

  useEffect(() => {
    getLotteryInfo();
  }, []);

  const getLotteryInfo = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const accounts = await web3.eth.getAccounts();

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
    setCurrPlayer(accounts[0]);
  };

  const updateLotteryStatus = async () => {
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setPlayers(players);
    setBalance(balance);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });

    setMessage('You have been entered!');

    updateLotteryStatus();
  };

  const handleClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage('A winner has been picked!');

    updateLotteryStatus();
  };

  return (
    <div className='App'>
      <div className='lottery--details'>
        <h1 className='lottery--header'>Lottery Contract</h1>
        <p className='lottery--info'>This contract is managed by {manager}.</p>
        <p className='lottery--info'>
          There are currently {players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(balance, 'ether')} ether!
        </p>
        <hr />
        <form className='lottery--form' onSubmit={handleSubmit}>
          <h4 className='section--header'>Want to try gamble?</h4>
          <div>
            <label className='form--label'>Amount of ether to enter</label>
            <input
              className='form--input'
              value={value}
              onChange={handleChange}
            />
          </div>
          <button className='btn btn--submit'>Enter</button>
        </form>
        {currPlayer === manager && (
          <>
            <hr />
            <h4 className='section--header'>Ready to pick a winner?</h4>
            <button className='btn btn--pick--winner' onClick={handleClick}>
              Pick a winner!
            </button>
          </>
        )}
        <hr />
        <h1>{message}</h1>
      </div>
    </div>
  );
}

export default App;
