import React, { useState } from 'react';
import { INITIAL_USER, INITIAL_ACHIEVEMENTS, TIGHT_TIMETABLE } from './data';
import { User, AchievementItem, TimetableCourse } from './types';
import TimetableUpload from './components/TimetableUpload';
import NavigationFlow from './components/NavigationFlow';
import WeeklyRanking from './components/WeeklyRanking';
import ReportScreen from './components/ReportScreen';
import MyPointShop from './components/MyPointShop';

// Lucide Icons
import {
  Menu,
  Bell,
  Home,
  Map,
  BarChart3,
  User as UserIcon,
  Calendar,
  Bus,
  Flag,
  Sparkles,
  ChevronRight,
  MapPin,
  X,
  Info,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'report' | 'profile' | 'upload'>('home');
  
  // Real-time user states
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [riskGrade, setRiskGrade] = useState<'A' | 'B' | 'C' | 'D'>('D'); // Starts at D as indicated in Screen 3
  const [uploadedTimetable, setUploadedTimetable] = useState<TimetableCourse[]>(TIGHT_TIMETABLE);

  // Quick modals state
  const [shuttleModalOpen, setShuttleModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shortcut routing state passing to Map Tab
  const [mapShortcutStart, setMapShortcutStart] = useState<string>('학술정보관');
  const [mapShortcutEnd, setMapShortcutEnd] = useState<string>('융합교육관');

  // Point triggers
  const handleAwardPoints = (pointsToAdd: number) => {
    setUser(prev => ({
      ...prev,
      points: prev.points + pointsToAdd
    }));

    const newAchievement: AchievementItem = {
      id: `ach-v-${Date.now()}`,
      title: '샛길 개척 미션 완주 보너스',
      points: pointsToAdd,
      date: '방금 전',
      iconType: 'check'
    };

    setAchievements(prev => [newAchievement, ...prev]);
    showToast(`축하합니다! ${pointsToAdd}P가 성공적으로 지급되었습니다!`);
  };

  const handleDeductPoints = (pointsToDeduct: number): boolean => {
    if (user.points < pointsToDeduct) return false;
    setUser(prev => ({
      ...prev,
      points: prev.points - pointsToDeduct
    }));
    showToast(`${pointsToDeduct}P가 사용되었습니다. 기프티콘 바코드가 발급되었습니다.`);
    return true;
  };

  // Upload timetable callback
  const handleTimetableUploadSuccess = (courses: TimetableCourse[], newGrade: 'A' | 'B' | 'C' | 'D') => {
    setUploadedTimetable(courses);
    setRiskGrade(newGrade);
    setActiveTab('home');
    showToast(`시간표 매핑 성공! 동선 위험 등급이 ${newGrade}등급으로 갱신되었습니다.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const triggerShortcutToMap = (start: string, end: string) => {
    setMapShortcutStart(start);
    setMapShortcutEnd(end);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 selection:bg-[#004fde]/20 select-none">
      {/* Phone container mockup matching design guidelines */}
      <div className="w-full max-w-md h-screen sm:h-[840px] bg-[#FAF8FF] shadow-2xl sm:rounded-[40px] border border-gray-200/50 flex flex-col overflow-hidden relative font-sans">
        
        {/* Toast Display Notification popup */}
        {toastMessage && (
          <div className="absolute top-20 left-4 right-4 z-50 bg-slate-900/95 backdrop-blur-md text-white font-semibold text-xs py-3.5 px-4 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-slide-in">
            <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0" />
            <p className="flex-1 text-left">{toastMessage}</p>
            <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global Nav Header - matching Screen 3 header */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-gray-100/80 bg-white shadow-3xs z-30 shrink-0">
          <button 
            type="button" 
            onClick={() => showToast('Sync Route 사이드 기능 서포트 센터 준비 중입니다.')} 
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-black text-[#004fde] font-serif tracking-tight cursor-pointer" onClick={() => setActiveTab('home')}>
            Sync Route
          </h1>

          <div className="relative">
            <button 
              type="button" 
              onClick={() => setNotificationModalOpen(true)} 
              className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition relative active:scale-95"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
            </button>
          </div>
        </header>

        {/* Dynamic Main Body Content Router */}
        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'home' && (
            <div className="h-full overflow-y-auto px-5 py-5 space-y-5">
              
              {/* Profile Welcome Block - matching Screen 3 */}
              <div className="text-left space-y-0.5 pb-1">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1">
                  안녕하세요, {user.name}님! <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                </h2>
                <p className="text-xs text-gray-400 font-semibold">오늘도 전력 질주 준비 되셨나요?</p>
              </div>

              {/* Path Risk Grade Banner - matching Screen 3 exactly */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-3xs text-left grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-sans font-black text-2xl border-4 ${
                  riskGrade === 'D' 
                    ? 'bg-rose-50 border-rose-100 text-rose-500' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-500'
                }`}>
                  {riskGrade}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-gray-800">현재 동선 위험 등급</h3>
                  <p className="text-[11px] text-gray-400 leading-normal font-semibold">
                    {riskGrade === 'D' 
                      ? '현재 동선은 D등급(위험)! 3번 강의실 이동 시 전력 질주가 필요합니다.'
                      : '현재 동선은 B등급(안전)! 넉넉하게 걸어도 다음 교실 입실에 문제없습니다.'}
                  </p>
                </div>
              </div>

              {/* Functional Dashboard Action Buttons - Screen 3 */}
              <div className="space-y-2.5">
                {/* 1. Find Shortest Path Blue button */}
                <button
                  type="button"
                  onClick={() => triggerShortcutToMap('학술정보관', '융합교육관')}
                  className="w-full bg-[#004fde] hover:bg-blue-700 active:scale-98 text-white rounded-2xl py-4 px-5 flex items-center justify-between text-left transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                      <Compass className="w-5.5 h-5.5 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-wide">최단 경로 찾기</h4>
                      <p className="text-[10px] opacity-80 mt-0.5">지각 방지 특화 최단 샛길 안내</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/90" />
                </button>

                {/* 2. Side-by-side action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Calendar/Timetable selection */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="bg-white hover:bg-gray-50 active:scale-97 p-4 border border-gray-100 rounded-2xl flex flex-col justify-between items-start text-left gap-4 transition-all"
                  >
                    <div className="w-9 h-9 bg-blue-50 text-[#004fde] rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-gray-800">시간표 업로드</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">에브리타임 캡처 이미지 탑재</p>
                    </div>
                  </button>

                  {/* Shuttle Bus tracker */}
                  <button
                    type="button"
                    onClick={() => setShuttleModalOpen(true)}
                    className="bg-white hover:bg-gray-50 active:scale-97 p-4 border border-gray-100 rounded-2xl flex flex-col justify-between items-start text-left gap-4 transition-all"
                  >
                    <div className="w-9 h-9 bg-[#CCFF00]/10 text-emerald-700 rounded-xl flex items-center justify-center">
                      <Bus className="w-5 h-5 text-[#004fde]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-gray-800">실시간 셔틀</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">교재 셔틀 버스 배차 요도</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Today's Mission - Screen 3 */}
              <div 
                className="bg-white hover:bg-blue-50/10 border border-gray-100 rounded-3xl p-4 flex items-center justify-between text-left transition-all cursor-pointer shadow-3xs"
                onClick={() => triggerShortcutToMap('공학관', '인문관')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-[#004fde] rounded-full flex items-center justify-center">
                    <Flag className="w-5 h-5 text-[#004fde]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#004fde] bg-blue-100/50 px-2 py-0.5 rounded-full">오늘의 미션</span>
                      <span className="font-sans text-[11px] font-black text-[#004fde]">+500P</span>
                    </div>
                    <h4 className="text-xs font-black text-gray-800 mt-1">공학관 샛길 정복하기</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">새로운 지름길을 개척하고 포인트를 획득하세요.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>

              {/* Static Map preview area - Screen 3 bottom */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">지도 영역</h4>
                  <span onClick={() => setActiveTab('map')} className="text-[10px] text-[#004fde] font-bold cursor-pointer hover:underline">캠퍼스 전체 지도보기</span>
                </div>
                
                <div 
                  onClick={() => setActiveTab('map')}
                  className="relative aspect-video rounded-3xl border border-gray-100/85 overflow-hidden shadow-2xs group cursor-pointer"
                >
                  {/* Cute simplified stylized miniature map */}
                  <div className="absolute inset-0 bg-blue-50" />
                  <div className="absolute top-4 left-6 bg-white border border-gray-200 rounded-lg p-1.5 text-[8px] font-bold">인문대</div>
                  <div className="absolute bottom-4 right-6 bg-blue-500 text-white rounded-lg p-1.5 text-[8px] font-bold">공과대</div>
                  <div className="absolute top-[40%] left-[30%] w-24 h-1 border-b-2 border-dashed border-[#004fde] animate-pulse" />
                  
                  {/* Blur tint cover */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all flex items-center justify-center">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black py-2 px-4 rounded-full flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" /> 실시간 기가와이파이 샛길 지도 모드 진입
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly High Scores mini list */}
              <WeeklyRanking />

            </div>
          )}

          {activeTab === 'map' && (
            <NavigationFlow
              initialStart={mapShortcutStart}
              initialEnd={mapShortcutEnd}
              user={user}
              onAwardPoints={handleAwardPoints}
            />
          )}

          {activeTab === 'report' && (
            <ReportScreen
              user={user}
              riskGrade={riskGrade}
              onNavigateShortcut={triggerShortcutToMap}
            />
          )}

          {activeTab === 'profile' && (
            <MyPointShop
              user={user}
              achievements={achievements}
              onDeductPoints={handleDeductPoints}
            />
          )}

          {activeTab === 'upload' && (
            <TimetableUpload
              onBack={() => setActiveTab('home')}
              onUploadSuccess={handleTimetableUploadSuccess}
            />
          )}
        </main>

        {/* Global Pill Bottom Navigator - matching Screens 1, 2, 3 bottom */}
        <nav className="absolute bottom-4 left-4 right-4 z-40 bg-white/90 backdrop-blur-md border border-slate-100/80 rounded-full h-15 flex items-center justify-around px-3 py-1 shadow-lg transition-all">
          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              resetRouteStates();
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              activeTab === 'home' ? 'text-[#004fde] scale-110 font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[8px] mt-0.5 font-bold">홈</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              activeTab === 'map' ? 'text-[#004fde] scale-110 font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="text-[8px] mt-0.5 font-bold">지도</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              activeTab === 'report' ? 'text-[#004fde] scale-110 font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[8px] mt-0.5 font-bold">리포트</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              activeTab === 'profile' ? 'text-[#004fde] scale-110 font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[8px] mt-0.5 font-bold">포인트숍</span>
          </button>
        </nav>

        {/* Real-Time Shuttle Bus Modal (Screen 3 shuttle action) */}
        {shuttleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-100 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#004fde] uppercase tracking-wide flex items-center gap-1">
                  <Bus className="w-4 h-4 text-[#004fde]" /> 캠퍼스 셔틀 버스 라이브
                </span>
                <button onClick={() => setShuttleModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 font-medium">캠퍼스 간 순환 셔틀버스의 현재 배차 및 잔여 좌석 정보입니다.</p>

              <div className="space-y-3 pt-1">
                <div className="bg-[#FAF8FF] p-3 rounded-2xl border border-gray-100 flex items-center justify-between text-left">
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-800">국제캠퍼스 정기 셔틀 (A노선)</h5>
                    <p className="text-[9px] text-gray-400 font-medium mt-0.5">정류장: 학술정보관 앞 대기 교차로</p>
                  </div>
                  <span className="text-xs font-sans font-black text-[#004fde] italic">5분 뒤 출발</span>
                </div>

                <div className="bg-[#FAF8FF] p-3 rounded-2xl border border-gray-100 flex items-center justify-between text-left">
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-800">공학관 ↔ 인문대 셔틀 (B노선)</h5>
                    <p className="text-[9px] text-gray-400 font-medium mt-0.5">정류장: 학생회관 앞 정류소</p>
                  </div>
                  <span className="text-xs font-sans font-black text-amber-600 italic">12분 뒤 출발</span>
                </div>
              </div>

              <div className="bg-[#CCFF00]/10 border border-emerald-500/10 p-3 rounded-xl text-[10px] text-emerald-800 font-medium text-center">
                현재 지각 방지를 위한 <b>셔틀 특급 연계 등대 알고리즘</b> 가동 중!
              </div>
            </div>
          </div>
        )}

        {/* Shortcut Obstruction Notifications Modal */}
        {notificationModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-100 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-rose-500 uppercase tracking-wide flex items-center gap-1">
                  <Bell className="w-4 h-4 text-rose-500" /> 캠퍼스 실시간 샛길 제약 상황
                </span>
                <button onClick={() => setNotificationModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 font-medium">캠퍼스 내 도보 공사 및 결빙, 미끄럼 등 지름길 이용 제약 사항입니다.</p>

              <div className="space-y-3 pt-1">
                <div className="bg-rose-50/50 p-3 border border-rose-100/50 rounded-2xl flex items-start gap-3 text-left">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 text-rose-500 font-bold text-xs mt-0.5">⚠</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-800">도서관 산책로 보도블록 공사</h5>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">도서관 삼거리 ~ 융합교육관 뒤편 보도 정비로 인해 빠른 길 소요시간이 1분 증가합니다.</p>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-3 border border-blue-100/50 rounded-2xl flex items-start gap-3 text-left">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-[#004fde] font-bold text-xs mt-0.5">i</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-800">창전관 에어커튼 및 에스컬레이터 가동</h5>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">비를 피할 수 있는 지름길(지하 아케이드) 승강설비가 원활히 운용 중입니다.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setNotificationModalOpen(false)}
                className="w-full bg-[#004fde] text-[#ffffff] font-extrabold py-3 rounded-full text-xs hover:bg-blue-700 transition"
              >
                상황 인지 완료
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  // Helper reset routine when home tab is clicked
  function resetRouteStates() {
    // Keeps state fresh
    setMapShortcutStart('학술정보관');
    setMapShortcutEnd('융합교육관');
  }
}
