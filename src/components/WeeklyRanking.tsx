import React from 'react';
import { MOCK_RANKINGS } from '../data';
import { Trophy, Medal, Flame, TrendingUp } from 'lucide-react';

export default function WeeklyRanking() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
      {/* Header section matching screen 1 */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-50">
        <div>
          <h3 className="text-sm font-black text-gray-900 font-sans tracking-tight">주간 랭킹</h3>
          <p className="text-[10px] text-gray-400 font-semibold">이번 주 가장 많이 걸은 러너</p>
        </div>
        <span className="text-xs font-bold text-[#004fde] bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 전체보기
        </span>
      </div>

      {/* List matches Screen 1 bottom layout */}
      <div className="space-y-2.5">
        {MOCK_RANKINGS.map((item, idx) => {
          const isTop3 = idx < 3;
          const rankColors = [
            'text-amber-500 bg-amber-50 border-amber-200',
            'text-slate-400 bg-slate-50 border-slate-100',
            'text-amber-700 bg-orange-50 border-orange-100'
          ];
          
          return (
            <div
              key={`rank-${item.rank}`}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all hover:translate-x-1 ${
                idx === 0
                  ? 'border-blue-100 bg-[#004fde]/5'
                  : 'border-gray-50 bg-[#FBFBFF]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank number badge styling matching screen 1 */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-sans text-xs font-black ${
                  isTop3 ? rankColors[idx] : 'text-gray-400 bg-gray-50 border-gray-100'
                } border`}>
                  {item.rank}
                </div>

                {/* Avatar with referrer policy to prevent broken images */}
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-[#EBEBEF]"
                />

                <div>
                  <span className="text-xs font-extrabold text-gray-900">{item.name}</span>
                  {idx === 0 && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-rose-500 bg-rose-50 px-1 py-0.2 rounded-sm border border-rose-100">
                      <Flame className="w-2.5 h-2.5 text-rose-500 fill-rose-500 animate-pulse" /> 선두
                    </span>
                  )}
                  {idx === 1 && (
                    <span className="ml-1.5 text-[9px] font-black text-blue-600 bg-blue-50 px-1 py-0.2 rounded-sm uppercase">
                      바짝 추격
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-sans text-xs font-black text-gray-800 italic">{item.distance.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">km</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sporty Quote */}
      <div className="bg-[#FAF8FF] p-3 rounded-2xl border border-gray-100/50 flex gap-2 items-center text-[10px] text-gray-500 font-medium">
        <TrendingUp className="w-4 h-4 text-[#004fde]" />
        <span>다음 등급까지 <b>2.5 km</b> 남았습니다. 지름길 미션을 완료하고 보상을 얻으세요!</span>
      </div>
    </div>
  );
}
