import React, { useState } from 'react';
import { getRoute, CAMPUS_BUILDINGS } from '../data';
import CampusMap from './CampusMap';
import { Navigation, Compass, AlertCircle, Sparkles, Check, Play, RefreshCw, Eye, ArrowRight, Layers, Shuffle, Flame } from 'lucide-react';
import { RouteOption, User } from '../types';

interface NavigationFlowProps {
  initialStart?: string;
  initialEnd?: string;
  user: User;
  onAwardPoints: (pts: number) => void;
}

export default function NavigationFlow({
  initialStart = '학술정보관',
  initialEnd = '융합교육관',
  user,
  onAwardPoints
}: NavigationFlowProps) {
  const [startB, setStartB] = useState(initialStart);
  const [endB, setEndB] = useState(initialEnd);
  
  // Choose route option: default to 'fast'
  const [selectedOptionId, setSelectedOptionId] = useState<'fast' | '舒适' | 'rainfree'>('fast');
  const [isActiveNavigation, setIsActiveNavigation] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(2); // Speed up for preview
  const [routeFinished, setRouteFinished] = useState(false);

  const currentRoute = getRoute(startB, endB);
  const selectedOption = currentRoute.options.find(o => o.id === selectedOptionId) || currentRoute.options[0];

  const handleSelectBuilding = (type: 'start' | 'end', val: string) => {
    if (type === 'start') {
      setStartB(val);
      // Avoid starting and ending at same building
      if (val === endB) {
        const remaining = CAMPUS_BUILDINGS.find(b => b.name !== val);
        if (remaining) setEndB(remaining.name);
      }
    } else {
      setEndB(val);
      if (val === startB) {
        const remaining = CAMPUS_BUILDINGS.find(b => b.name !== val);
        if (remaining) setStartB(remaining.name);
      }
    }
    setRouteFinished(false);
  };

  const swapBuildings = () => {
    const temp = startB;
    setStartB(endB);
    setEndB(temp);
    setRouteFinished(false);
  };

  const handleStartGuidance = () => {
    setIsActiveNavigation(true);
    setRouteFinished(false);
  };

  const handleFinishNavigation = () => {
    setIsActiveNavigation(false);
    setRouteFinished(true);
    // Add real points to user model!
    onAwardPoints(500);
  };

  const resetRoute = () => {
    setIsActiveNavigation(false);
    setRouteFinished(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8FF] animate-fade-in text-gray-800">
      {/* Scrollable Layout Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        
        {/* Dynamic Route Builder (Only show if not currently navigating) */}
        {!isActiveNavigation && !routeFinished && (
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-4 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#004fde] flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#004fde]" /> 스마트 캠퍼 경로 설계
              </span>
              <button 
                type="button" 
                onClick={swapBuildings} 
                className="p-1 rounded-full text-[#004fde] bg-blue-50 hover:bg-blue-100 active:scale-90 transition-all"
                title="출도착 경유 교환"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Dropdown */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#004fde] block">출발지 (START)</label>
                <select
                  value={startB}
                  onChange={(e) => handleSelectBuilding('start', e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#004fde] focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 transition"
                >
                  {CAMPUS_BUILDINGS.map(b => (
                    <option key={`start-${b.id}`} value={b.name}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>

              {/* End Dropdown */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-semibold text-rose-500 block">도착지 (DEST)</label>
                <select
                  value={endB}
                  onChange={(e) => handleSelectBuilding('end', e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#004fde] focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 transition"
                >
                  {CAMPUS_BUILDINGS.map(b => (
                    <option key={`end-${b.id}`} value={b.name}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Live Map Panel - Unified Wayfinder */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-2 shadow-xs">
          <CampusMap
            startBuilding={startB}
            endBuilding={endB}
            selectedOptionId={selectedOptionId}
            isActiveNavigation={isActiveNavigation}
            onSelectBuilding={handleSelectBuilding}
            onFinishNavigation={handleFinishNavigation}
            speedMultiplier={speedMultiplier}
          />
        </div>

        {/* Normal Mode: Route Detail Options (Screens 6) */}
        {!isActiveNavigation && !routeFinished && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider px-1">소요시간 및 경로 옵션</h3>
            
            {/* Options list container matching screen 6 */}
            <div className="space-y-2.5">
              {currentRoute.options.map((option) => {
                const isSel = selectedOptionId === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                      isSel
                        ? 'border-[#004fde] bg-blue-50/50 shadow-sm ring-1 ring-[#004fde]'
                        : 'border-white bg-[#F3F5FC]/70 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${option.id === 'fast' ? 'bg-[#004fde]/10 text-[#004fde]' : 'bg-green-100 text-green-700'}`}>
                          {option.tag}
                        </span>
                        <h4 className="text-xs font-black text-gray-900">{option.title}</h4>
                      </div>
                      <div className="text-right">
                        <span className="font-sans text-sm font-black text-[#004fde]">{option.duration}분</span>
                        <p className="text-[10px] text-gray-400 font-semibold">{option.distance}m</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1.5 leading-normal">{option.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Turn-by-turn steps container matching screen 6 */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5 pb-2 border-b border-gray-100">
                <Navigation className="w-3.5 h-3.5 text-[#004fde]" /> 턴바이턴 경로 상세
              </h4>

              <div className="space-y-4 relative pl-3.5 Before:absolute Before:left-[5px] Before:top-2 Before:bottom-2 Before:w-0.5 Before:bg-gray-200">
                {selectedOption.steps.map((step, idx) => (
                  <div key={step.id} className="relative text-left space-y-0.5">
                    {/* Circle Bullet */}
                    <div className={`absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${idx === 0 ? 'bg-[#004fde]' : idx === selectedOption.steps.length - 1 ? 'bg-rose-500' : 'bg-gray-300'}`} />
                    <p className="text-xs font-bold text-gray-800 leading-tight">{step.instruction}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Start button screen 6 bottom */}
            <button
              onClick={handleStartGuidance}
              className="w-full bg-[#004fde] hover:bg-blue-700 text-white font-black py-4 rounded-full text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Flame className="w-4 h-4 fill-white text-[#CCFF00]" /> {selectedOption.title} 안내 시작하기
            </button>
          </div>
        )}

        {/* Active Navigation Mode Tracker (Screen 1 & 7 details) */}
        {isActiveNavigation && (
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-md space-y-5 animate-fade-in text-center">
            {/* Reward box in screen 1 */}
            <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-[11px] font-black tracking-wide text-[#004fde] gap-1 items-center mx-auto shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" /> 보상: <b className="text-blue-700 font-black text-xs">+500P</b>
            </span>

            {/* Circular Progress Ring matching Screen 1 accurately */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              {/* Outer circle */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="#EBECF0" strokeWidth="10" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="#004fde"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={377}
                  strokeDashoffset={377 * (1 - (selectedOption.distance / 2500))} // Using normalized target
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              
              {/* Center Metrics block */}
              <div className="text-center">
                <p className="font-sans text-xl font-black text-[#004fde] tracking-tight">{selectedOption.distance / 1000} km</p>
                <div className="h-px bg-gray-100 w-12 mx-auto my-1" />
                <p className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">/ 2.5 km</p>
              </div>
            </div>

            {/* Speed Simulation Control Toggles */}
            <div className="bg-[#FAF8FF] p-3 rounded-2xl border border-gray-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-400">시뮬레이션 배속</span>
              <div className="flex gap-1">
                {[1, 2, 5, 10].map(mult => (
                  <button
                    key={`mult-${mult}`}
                    onClick={() => setSpeedMultiplier(mult)}
                    className={`px-3 py-1 rounded-full font-mono text-[10px] font-extrabold transition-all ${speedMultiplier === mult ? 'bg-[#004fde] text-[#ffffff]' : 'bg-white border border-gray-200 text-gray-600'}`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            {/* Stop / Cancel Guidance buttons */}
            <div className="flex gap-3">
              <button
                onClick={resetRoute}
                className="flex-1 py-3 text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-all text-center"
              >
                일시정지
              </button>
              <button
                onClick={handleFinishNavigation}
                className="flex-1 py-3 text-xs font-extrabold text-white bg-[#004fde] hover:bg-blue-700 rounded-full transition-all text-center flex items-center justify-center gap-1"
              >
                도착 완료하기
              </button>
            </div>
          </div>
        )}

        {/* Route Completed Finish Screen */}
        {routeFinished && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-blue-100 text-[#004fde] rounded-full mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 font-extrabold" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-gray-900 font-sans tracking-tight">미션 완주 성공!</h3>
              <p className="text-xs text-gray-400 font-medium">캠퍼스 샛길 미션을 성공적으로 수행하였습니다.</p>
            </div>

            {/* Point Earn Visualizer block */}
            <div className="inline-flex gap-2 items-center bg-[#CCFF00]/10 border border-emerald-500/10 px-5 py-2.5 rounded-2xl text-emerald-700 font-sans text-sm font-black mx-auto">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>보상 포인트 적립: +500P</span>
            </div>

            <p className="text-[11px] text-gray-400 font-medium leading-relaxed bg-[#FAF8FF] p-3 rounded-xl border border-gray-100/50">
              현재 보유 포인트가 <b>{(user.points + 500).toLocaleString()} P</b> 로 등극되었습니다! 마이페이지 포인트 숍에서 기프티콘으로 교환할 수 있습니다.
            </p>

            <button
              onClick={resetRoute}
              className="w-full bg-[#004fde] text-[#ffffff] font-extrabold py-3.5 rounded-full text-xs tracking-wide hover:bg-blue-700 active:scale-95 transition-all text-center uppercase"
            >
              새로운 지름길 탐색하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
