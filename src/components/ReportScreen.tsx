import React from 'react';
import { User } from '../types';
import { AlertCircle, Zap, ShieldCheck, TrendingUp, HelpCircle, ChevronRight, MapPin, Sparkles } from 'lucide-react';

interface ReportScreenProps {
  user: User;
  riskGrade: 'A' | 'B' | 'C' | 'D';
  onNavigateShortcut: (start: string, end: string) => void;
}

export default function ReportScreen({ user, riskGrade = 'B', onNavigateShortcut }: ReportScreenProps) {
  // Determine text based on loaded/analyzed grade
  const isDGrade = riskGrade === 'D';

  return (
    <div className="flex flex-col h-full bg-[#FAF8FF] animate-fade-in text-gray-800">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        
        {/* Title */}
        <div className="text-center py-2">
          <h2 className="font-sans text-xl font-extrabold text-[#004fde] tracking-tight">
            {user.name}님의<br />2학기 동선 분석 리포트
          </h2>
          <p className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase mt-1">캠퍼스 이동 효율성 분석 결과</p>
        </div>

        {/* 1. 이동 등급 Card - Screen 4 styled */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-center space-y-3.5 relative overflow-hidden">
          {/* Subtle gradient light background */}
          <div className="absolute inset-0 bg-radial-gradient from-emerald-50/20 to-transparent pointer-events-none" />

          <p className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">이동 등급</p>
          
          <div className="flex flex-col items-center justify-center space-y-1">
            {isDGrade ? (
              <>
                <span className="font-sans text-5xl font-black text-rose-500 italic drop-shadow-sm">D <span className="text-sm font-semibold select-all font-sans italic tracking-normal">(위험)</span></span>
                <p className="text-xs text-gray-600 font-bold mt-2 font-sans px-4">
                  일부 수업들의 쉬는 시간이 매우 촉박하며, 전력 질주를 요하는 급경사지가 포함되어 있습니다.
                </p>
              </>
            ) : (
              <>
                <span className="font-sans text-5xl font-black text-emerald-500 italic drop-shadow-sm">B <span className="text-sm font-semibold font-sans italic tracking-normal">(안전)</span></span>
                <p className="text-xs text-gray-600 font-bold mt-2 font-sans px-4">
                  전반적인 효율성은 좋으나, 특정 요일의 돌발 장애 이동 등 지각 위험이 다소 존재합니다.
                </p>
              </>
            )}
          </div>
        </div>

        {/* 2. 위험 감지 Card - Screen 4 styled */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm space-y-4 text-left relative">
          <div className="absolute top-4 right-4 text-rose-400">
            <AlertCircle className="w-5 h-5 animate-pulse" />
          </div>

          <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 text-rose-500 text-[9px] font-black uppercase px-2.5 py-1 rounded-full">
            ⚠️ 위험 감지
          </span>

          <div className="space-y-1">
            <h3 className="text-xs font-black text-gray-800 leading-tight">
              {isDGrade 
                ? '월요일 연강 수업 이동시 이동시간 5분 절대 부족' 
                : '월요일 전공수업 사이 이동시 이동시간 5분 부족'}
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-normal mt-1">
              공학관에서 인문관까지의 현재 예상 이동 시간은 <b>8분</b>입니다. 쉬는 시간이 각 5분씩 밖에 없어 지각 위험이 매우 높습니다.
            </p>
          </div>

          {/* Comparative visual bar graph - matching screen 4 */}
          <div className="space-y-2 pt-2 border-t border-gray-50">
            {/* Grid Bar */}
            <div className="relative w-full h-8 bg-gray-100 rounded-lg overflow-hidden flex font-mono text-[9px] font-bold text-white">
              {/* Segments representing lengths */}
              <div className="h-full bg-rose-500 flex items-center justify-center" style={{ width: '38%' }}>
                0분 ~ 5분
              </div>
              <div className="h-full bg-amber-500 flex items-center justify-center border-l border-white" style={{ width: '22%' }}>
                가용시간 (5분)
              </div>
              <div className="h-full bg-blue-500 flex items-center justify-center border-l border-white" style={{ width: '40%' }}>
                이동실요 (8분)
              </div>
            </div>

            {/* Labels beneath graph */}
            <div className="flex justify-between text-[9px] text-gray-400 font-bold px-1 uppercase">
              <span>0분</span>
              <span>5분 (가용 시간)</span>
              <span>8분 (필요 시간)</span>
            </div>
          </div>
        </div>

        {/* 3. 최적화 지름길 Card - Screen 4 styled */}
        <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-sm space-y-4 text-left relative">
          <div className="absolute top-4 right-4 text-emerald-400">
            <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
          </div>

          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase px-2.5 py-1 rounded-full">
            ⚡ 최적화 해결책
          </span>

          <div className="space-y-1">
            <h3 className="text-xs font-black text-[#004fde] leading-tight">지름길 활용 시 3분 단축 가용</h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-normal mt-1">
              도서관 뒤편 대나무 숲길 샛길을 이용해 공학관 뒤편 언덕을 관통하면, 인문관까지의 고도 소모를 줄이면서 이동 시간을 <b>5분 이내</b>로 보완해 지각을 피할 수 있습니다.
            </p>
          </div>

          {/* Currently vs Optimized visual box matching screen 4 bubbles */}
          <div className="bg-[#FAF8FF] rounded-2.5xl p-4 border border-gray-100/50 flex items-center justify-center gap-6 text-center">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">현재 소요</p>
              <p className="font-sans text-lg font-black text-rose-500 italic">8분</p>
            </div>
            
            <div className="text-gray-300 font-bold font-mono text-lg flex items-center">➔</div>
            
            <div className="bg-[#CCFF00]/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wide">최적화됨</p>
              <p className="font-sans text-xl font-black text-emerald-600 italic">5분</p>
            </div>
          </div>
        </div>

        {/* 4. 경로 시각화 Elevation Elevation Wave Profile */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3.5 text-left text-sm font-semibold">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">경로 입체 시각화</h4>
          <p className="text-[10px] text-gray-400 font-semibold leading-normal mt-0.5">캠퍼스 고도 및 수직 경사 단면도 (산악 지형 극복 구역)</p>

          {/* Simple creative SVG waveform mimicking screen 4 path visualization */}
          <div className="relative h-20 bg-gradient-to-t from-gray-50 to-white border border-gray-100 rounded-2xl overflow-hidden flex items-end">
            <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#004fde" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#004fde" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Dynamic spline wave */}
              <path
                d="M 0 60 Q 50 20 100 45 T 200 15 T 300 70 L 300 80 L 0 80 Z"
                fill="url(#curveGrad)"
                stroke="#004fde"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              {/* Markers along route elevation */}
              <circle cx="50" cy="30" r="4" fill="#EF4444" />
              <text x="56" y="30" fill="#EF4444" fontSize="6.5" fontWeight="bold">공학관 후문 (고도 최고점)</text>

              <circle cx="200" cy="15" r="4" fill="#CCFF00" stroke="#004fde" strokeWidth="1" />
              <text x="180" y="27" fill="#1E293B" fontSize="6.5" fontWeight="bold">대나무숲 샛길 (평지 단축)</text>
            </svg>
          </div>

          <button
            onClick={() => onNavigateShortcut('공학관', '인문관')}
            className="w-full bg-[#004fde] hover:bg-blue-700 text-[#ffffff] font-extrabold py-3.5 rounded-full text-xs uppercase text-center tracking-wider flex items-center justify-center gap-1 transition-all"
          >
            <MapPin className="w-4 h-4 fill-white" /> 지도에서 지름길 확인하고 정복하기
          </button>
        </div>

      </div>
    </div>
  );
}
