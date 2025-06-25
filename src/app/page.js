'use client';

import { useState,useEffect } from 'react';
import './globals.css';

const kitchenStaff = ['정민', '종혁', '대니', '유승', '나영', '사장님'];
const serverStaff = ['로라', '민재', '민디', '은영', '리']
;

export default function TipCalculator() {
  const [date, setDate] = useState('');
  const [dateNy, setDateNy] = useState('');
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString('ko-KR', { month: 'long' });
    const day = now.getDate();
    const weekday = now.toLocaleString('ko-KR', { weekday: 'short' });

    setDate(`${year}년 ${month} ${day}일 (${weekday})`);
    setDateNy(`${month} ${day}일 (${weekday})`);
  }, []);
  

  const [cashTip, setCashTip] = useState("");
  const [cardTip, setCardTip] = useState("");
  const [showCashPopup, setShowCashPopup] = useState(false);

  const [showCardPopup, setShowCardPopup] = useState(false);

  const [previousCardTip, setPreviousCardTip] = useState("");
  const [currentCardTip, setCurrentCardTip] = useState("");

  const [coins, setCoins] = useState({
    '20': "",
    '10': "",
    '5': "",
    '2': "",
    '1': "",
    '0.25': "",
    '0.10': "",
    '0.05': "",
  });

  const [selectedKitchen, setSelectedKitchen] = useState([]);
  const [selectedServer, setSelectedServer] = useState([]);

  const toggleSelection = (person, type) => {
    const updater = type === 'kitchen' ? setSelectedKitchen : setSelectedServer;
    updater(prev =>
      prev.includes(person) ? prev.filter(p => p !== person) : [...prev, person]
    );
  };

  const calculateCashTotal = () => {
    const total = Object.entries(coins).reduce(
      (sum, [denom, count]) => sum + parseFloat(denom) * count,
      0
    );
    setCashTip(total.toFixed(2));
    setShowCashPopup(false);
  };

    const calculateCardTip = () => {
    const result = currentCardTip - previousCardTip;
    setCardTip(result.toFixed(2));
    setShowCardPopup(false);
  };

  const totalTip = Number(cashTip) + Number(cardTip);
  const kitchenTip = totalTip * 0.4;
  const serverTip = totalTip * 0.6;

  const kitchenPerPerson = selectedKitchen.length ? kitchenTip / selectedKitchen.length : 0;
  const serverPerPerson = selectedServer.length ? serverTip / selectedServer.length : 0;

  const coinOrder = ['20','10', '5', '2', '1', '0.25', '0.10', '0.05'];

  const resetCoins = () => {
  const reset = {};
  coinOrder.forEach((denom) => {
    reset[denom] = "";
  });
  setCoins(reset);
};

  return (
    <div className="container">
      <h1 className="heading flex items-center justify-between !mb-0">
       💰 팁 분배 계산기
      </h1>
      <h2 className=" text-sm text-right !mt-0">📅{date}</h2>

      <div className="input-group">
        <label>💵 캐시 팁</label>
        <div className="flex gap-2 items-center">
          $
          <input
          inputMode='numeric'
          onFocus={(e) => e.target.select()}
            value={cashTip}
            onChange={(e) => setCashTip(e.target.value)}
            className="input"
          />
          <button className="person-button w-30 text-center whitespace-normal" onClick={() => {setShowCardPopup(false); setShowCashPopup(true);}}>현금<br/>계산기</button>
        </div>

        <label>💳 카드 팁</label>
        <div className="flex gap-2 items-center">
          $
          <input
          inputMode='numeric'
          onFocus={(e) => e.target.select()}
            value={cardTip}
            onChange={(e) => setCardTip(e.target.value)}
            className="input"
          />
          <button className="person-button w-30 text-center whitespace-normal" onClick={() => {setShowCardPopup(true); setShowCashPopup(false);}}>카드팁<br/>계산기</button>
        </div>
      </div>

      {showCashPopup && (
        <div className="popup">
          <h2 className="section-title">💰 동전/화폐 개수 입력</h2>
          <div className="grid grid-cols-2 gap-3">
            {coinOrder.map((denom) => (
              <div key={denom} className="flex justify-between items-center">
                <label className="mr-10 text-base w-2">${denom}</label>
                <input
                inputMode='numeric'
                onFocus={(e) => e.target.select()}
                  value={coins[denom]}
                  onChange={(e) => setCoins({ ...coins, [denom]: Number(e.target.value) })}
                  className="input w-12"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="person-button selected-kitchen" onClick={calculateCashTotal}>계산</button>
            <button className="person-button" onClick={() => setShowCashPopup(false)}>닫기</button>
            <button className="person-button bg-gray-300" onClick={resetCoins}>초기화</button>
          </div>
        </div>
      )}

      {showCardPopup && (
        <div className="popup">
          <h2 className="section-title">💳 카드팁 계산기</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="w-40">이전 카드팁</label>
              <input
              inputMode='numeric'
              onFocus={(e) => e.target.select()}
                value={previousCardTip}
                onChange={(e) => setPreviousCardTip(Number(e.target.value))}
                className="input w-24"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="w-40">현재 카드팁</label>
              <input
              inputMode='numeric'
              onFocus={(e) => e.target.select()}
                value={currentCardTip}
                onChange={(e) => setCurrentCardTip(Number(e.target.value))}
                className="input w-24"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button className="person-button selected-server" onClick={calculateCardTip}>계산</button>
              <button className="person-button" onClick={() => setShowCardPopup(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}


      <div>
        <h2 className="section-title">👨‍🍳 주방 인원 선택</h2>
        <div className="button-group">
          {kitchenStaff.map(name => (
            <button
              key={name}
              onClick={() => toggleSelection(name, 'kitchen')}
              className={`person-button ${selectedKitchen.includes(name) ? 'selected-kitchen' : ''}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title">👩 서버 인원 선택</h2>
        <div className="button-group">
          {serverStaff.map(name => (
            <button
              key={name}
              onClick={() => toggleSelection(name, 'server')}
              className={`person-button ${selectedServer.includes(name) ? 'selected-server' : ''}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="result-box">
        <p>
          <span className="text-2xl text-black-500 ml-0">
            {dateNy}
          </span>
        </p>
        <br/>
        <p className="text-xl text-black-500"> 현금 팁: <strong>${Number(cashTip).toFixed(2)}</strong></p>
        <p className="text-xl text-black-500"> 카드 팁: <strong>${Number(cardTip).toFixed(2)}</strong></p>
        <br/>
        <ul>
          {selectedServer.map(name => (
            <li className="text-2xl text-black-500 m-1" key={name}>{name}: ${serverPerPerson.toFixed(2)}</li>
          ))}
          {selectedKitchen.map(name => (
            <li className="text-2xl text-black-500 m-1" key={name}>{name}: ${kitchenPerPerson.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
        {/* <p>서버 팁 (60%): ${serverTip.toFixed(2)} → 인원 {selectedServer.length}명 → 1인당 <strong>${serverPerPerson.toFixed(2)}</strong></p> */}
        {/* <p>주방 팁 (40%): ${kitchenTip.toFixed(2)} → 인원 {selectedKitchen.length}명 → 1인당 <strong>${kitchenPerPerson.toFixed(2)}</strong></p> */}
