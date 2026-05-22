import React, { useState, useEffect } from 'react';
import { CAMPUS_BUILDINGS, MOCK_ROUTES } from '../data';
import { Navigation, Play, MapPin, Eye, Compass, Activity, ArrowRight, Sparkles } from 'lucide-react';

interface CampusMapProps {
  startBuilding: string;
  endBuilding: string;
  selectedOptionId: 'fast' | '舒适' | 'rainfree';
  isActiveNavigation: boolean;
  onSelectBuilding?: (type: 'start' | 'end', value: string) => void;
  onFinishNavigation?: () => void;
  speedMultiplier?: number;
}

export default function CampusMap({
  startBuilding,
  endBuilding,
  selectedOptionId,
  isActiveNavigation,
  onSelectBuilding,
  onFinishNavigation,
  speedMultiplier = 1
}: CampusMapProps) {
  // SVG coordinates for buildings
  const buildingsCoords: Record<string, { x: number; y: number; color: string; label: string }> = {
    '학술정보관': { x: 90, y: 240, color: '#4F46E5', label: 'LIB' },
    '학생회관': { x: 200, y: 170, color: '#10B981', label: 'UNION' },
    '인문관': { x: 80, y: 90, color: '#F59E0B', label: 'HUM' },
    '융합교육관': { x: 210, y: 60, color: '#EC4899', label: 'CONV' },
    '공학관': { x: 310, y: 130, color: '#3B82F6', label: 'ENG' }
  };

  const getCoordinates = (bName: string) => {
    return buildingsCoords[bName] || { x: 200, y: 150 };
  };

  const startCoord = getCoordinates(startBuilding);
  const endCoord = getCoordinates(endBuilding);

  // Animation percentage for active navigation
  const [navProgress, setNavProgress] = useState(0);
  const [localSpeed, setLocalSpeed] = useState(1.2);
  const [timeRemaining, setTimeRemaining] = useState(5.0);

  useEffect(() => {
    let interval: any;
    if (isActiveNavigation) {
      setNavProgress(0);
      setLocalSpeed(1.2 + Math.random() * 0.4);
      // Determine initial duration based on selected choice
      const initialMinutes = selectedOptionId === 'fast' ? 5.0 : selectedOptionId === 'rainfree' ? 10.0 : 8.0;
      setTimeRemaining(initialMinutes);

      interval = setInterval(() => {
        setNavProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (onFinishNavigation) onFinishNavigation();
            return 100;
          }
          const increment = 1.5 * speedMultiplier;
          const nextProgress = prev + increment;
          
          // Randomly fluctuate speed and time remaining
          setLocalSpeed((s) => Math.max(0.8, Math.min(2.8, s + (Math.random() - 0.5) * 0.3)));
          setTimeRemaining((t) => Math.max(0, initialMinutes * (1 - nextProgress / 100)));

          return nextProgress > 100 ? 100 : nextProgress;
        });
      }, 100);
    } else {
      setNavProgress(0);
    }
    return () => clearInterval(interval);
  }, [isActiveNavigation, startBuilding, endBuilding, selectedOptionId, speedMultiplier]);

  // Generate intermediate points along the path for animation/visuals
  const generatePathPoints = () => {
    const p1 = startCoord;
    const p2 = endCoord;
    const points: { x: number; y: number }[] = [];

    // Construct a stylized path according to selected option
    if (selectedOptionId === 'fast') {
      // Shortcut routes go through back paths with green accents
      // Let's create an irregular 3-point bend
      const mid1 = { x: p1.x + (p2.x - p1.x) * 0.3 - 25, y: p1.y + (p2.y - p1.y) * 0.4 };
      const mid2 = { x: p1.x + (p2.x - p1.x) * 0.7 - 5, y: p1.y + (p2.y - p1.y) * 0.8 + 15 };
      return [p1, mid1, mid2, p2];
    } else if (selectedOptionId === 'rainfree') {
      // Rain-free routes use regular geometric, indoor alignment
      const mid1 = { x: p1.x, y: p2.y };
      return [p1, mid1, p2];
    } else {
      // Comfort paths are wider curves
      const mid = { x: p1.x + (p2.x - p1.x) * 0.5 + 30, y: p1.y + (p2.y - p1.y) * 0.5 - 20 };
      return [p1, mid, p2];
    }
  };

  const pathPoints = generatePathPoints();
  
  // Calculate SVG polyline path string
  const pathString = pathPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Live Position Finder
  const getProgressCoordinates = () => {
    if (pathPoints.length === 0) return { x: 200, y: 150 };
    if (navProgress <= 0) return pathPoints[0];
    if (navProgress >= 100) return pathPoints[pathPoints.length - 1];

    const totalSegments = pathPoints.length - 1;
    const exactSegmentProgress = (navProgress / 100) * totalSegments;
    const segmentIndex = Math.floor(exactSegmentProgress);
    const segmentPercent = exactSegmentProgress - segmentIndex;

    const pStart = pathPoints[segmentIndex];
    const pEnd = pathPoints[segmentIndex + 1];

    return {
      x: pStart.x + (pEnd.x - pStart.x) * segmentPercent,
      y: pStart.y + (pEnd.y - pStart.y) * segmentPercent
    };
  };

  const livePos = getProgressCoordinates();

  return (
    <div className="relative w-full overflow-hidden bg-[#FAF8FF] select-none touch-none">
      {/* Dynamic Header Metrics - Sporty Minimalism Stat */}
      {isActiveNavigation && (
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-2 justify-between bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-blue-50 shadow-sm transition-all animate-bounce-subtle">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-50 text-[#004fde]">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">속도</p>
              <p className="font-mono text-sm font-bold text-gray-800 italic">{localSpeed.toFixed(1)} m/s</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#CCFF00]/10 text-emerald-600">
              <Activity className="w-5 h-5 text-[#004fde]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">남은 시간</p>
              <p className="font-sans text-sm font-black text-[#004fde] italic">
                {Math.floor(timeRemaining)}분 {Math.floor((timeRemaining % 1) * 60)}초
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-amber-50 text-amber-600">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">획득 예정</p>
              <p className="font-sans text-sm font-black text-amber-600">+500P</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Guidance Bubble - matching Screen 7 */}
      {isActiveNavigation && (
        <div className="absolute top-20 left-4 right-4 z-20 animate-fade-in">
          <div className="bg-white/95 border-l-4 border-l-[#004fde] shadow-md p-3.5 rounded-xl text-xs text-gray-700 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#004fde] text-[#ffffff] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">i</div>
            <div>
              {selectedOptionId === 'fast' && (
                <p className="font-semibold"><b className="text-blue-700">{endBuilding} 2층 엘리베이터</b>를 이용하면 비를 맞지 않고 가장 빠르게 이동할 수 있습니다.</p>
              )}
              {selectedOptionId === 'rainfree' && (
                <p className="font-semibold">실내 아케이드 통로로 관통하는 중입니다. 냉방 가용 구역으로 쾌적합니다.</p>
              )}
              {selectedOptionId === '舒适' && (
                <p className="font-semibold">대운동장 옆 그늘 가득한 보행로를 따라 걷고 있습니다.</p>
              )}
              <p className="text-[10px] text-gray-400 mt-1">지름길 개척 알고리즘 실시간 분석 중...</p>
            </div>
          </div>
        </div>
      )}

      {/* Campus Map Area Container */}
      <div className="relative aspect-[4/3] w-full border border-gray-100 rounded-3xl overflow-hidden bg-gradient-to-b from-[#F2F6FE] to-[#FAF8FF]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(#004fde 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} />

        {/* Dynamic Canvas SVG */}
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {/* Aesthetic Lawns & Features on campus */}
          <rect x="120" y="110" width="130" height="40" rx="20" fill="#E6FFFA" stroke="#CBF3EB" strokeWidth="1" />
          <text x="185" y="134" fill="#14B8A6" fontSize="9" fontWeight="bold" opacity="0.6">대운동장 (GREEN COUPE)</text>

          <circle cx="210" cy="220" r="16" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1" />
          <text x="195" y="242" fill="#0284C7" fontSize="8" fontWeight="bold" opacity="0.6">중앙분수대</text>

          {/* Shortcut connections dashed track paths (representing hidden walkways) */}
          <line x1="90" y1="240" x2="80" y2="90" stroke="#CCFF00" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
          <line x1="310" y1="130" x2="90" y2="240" stroke="#CCFF00" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.9" />

          {/* Active Path rendering if start/end selected */}
          {startBuilding && endBuilding && startBuilding !== endBuilding && (
            <>
              {/* Glow filter */}
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Glow Line */}
              <polyline
                points={pathString}
                fill="none"
                stroke="#004fde"
                strokeWidth={selectedOptionId === 'fast' ? "6" : "5"}
                strokeOpacity="0.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Foreground Solid Path */}
              <polyline
                points={pathString}
                fill="none"
                stroke={selectedOptionId === 'fast' ? "#004fde" : selectedOptionId === 'rainfree' ? "#F97316" : "#10B981"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={isActiveNavigation ? "none" : "5 5"}
              />
            </>
          )}

          {/* Static Buildings Render card style */}
          {Object.entries(buildingsCoords).map(([bName, coord]) => {
            const isStart = bName === startBuilding;
            const isEnd = bName === endBuilding;
            const isHighlighted = isStart || isEnd;

            return (
              <g
                key={bName}
                className="cursor-pointer group transition-all"
                onClick={() => {
                  if (onSelectBuilding) {
                    if (!startBuilding || (startBuilding && endBuilding)) {
                      onSelectBuilding('start', bName);
                    } else if (startBuilding && bName !== startBuilding) {
                      onSelectBuilding('end', bName);
                    }
                  }
                }}
              >
                {/* Visual Circle Shadow */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isHighlighted ? "18" : "14"}
                  fill={isStart ? "#004fde" : isEnd ? "#EF4444" : "#FFFFFF"}
                  stroke={isStart ? "#ffffff" : isEnd ? "#ffffff" : "#D1D5DB"}
                  strokeWidth={isHighlighted ? "3" : "1.5"}
                  className="transition-all duration-300"
                  style={{ filter: isHighlighted ? 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' : 'none' }}
                />

                {/* Building Acronym inside Circle */}
                <text
                  x={coord.x}
                  y={coord.y + 3}
                  textAnchor="middle"
                  fill={isHighlighted ? "#ffffff" : "#4B5563"}
                  fontSize="8"
                  fontWeight="bold"
                  className="pointer-events-none select-none font-mono"
                >
                  {coord.label}
                </text>

                {/* Nice clean athletic label underneath */}
                <rect
                  x={coord.x - 30}
                  y={coord.y + 17}
                  width="60"
                  height="12"
                  rx="4"
                  fill={isHighlighted ? "#1E293B" : "rgba(255, 255, 255, 0.85)"}
                  stroke={isHighlighted ? "#3B82F6" : "#E5E7EB"}
                  strokeWidth="0.5"
                  className="transition-all"
                />
                <text
                  x={coord.x}
                  y={coord.y + 25}
                  textAnchor="middle"
                  fill={isHighlighted ? "#ffffff" : "#1F2937"}
                  fontSize="7.5"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {bName}
                </text>
              </g>
            );
          })}

          {/* Animated active navigation particle runner dot */}
          {isActiveNavigation && (
            <g>
              <circle
                cx={livePos.x}
                cy={livePos.y}
                r="9"
                fill="#CCFF00"
                stroke="#004fde"
                strokeWidth="2.5"
                className="animate-pulse"
                filter="url(#glow)"
              />
              <circle
                cx={livePos.x}
                cy={livePos.y}
                r="3"
                fill="#ffffff"
              />
              {/* Dynamic athletic trace particles tail */}
              <circle cx={livePos.x - 6} cy={livePos.y - 1} r="1.5" fill="#CCFF00" opacity="0.6" />
              <circle cx={livePos.x + 5} cy={livePos.y + 5} r="1" fill="#CCFF00" opacity="0.4" />
            </g>
          )}
        </svg>

        {/* Legend Overlay Info */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-[9px] text-gray-500 font-medium flex gap-3 justify-center border border-gray-100 shadow-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#004fde]" /> 빠른 길
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" /> 편안한 길
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" /> 비 안 맞는 길
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-1 bg-[#CCFF00] inline-block rounded-sm" /> 캠퍼스 지름길
          </span>
        </div>
      </div>
    </div>
  );
}
