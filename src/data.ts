import { User, AchievementItem, RankingItem, ShopItem, Route, TimetableCourse } from './types';

export const INITIAL_USER: User = {
  name: '최고은',
  level: '전력질주자',
  points: 12450,
};

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: '어제 공학관 미션 완료',
    points: 500,
    date: '2026-05-21',
    iconType: 'check',
  },
  {
    id: 'ach-2',
    title: '도서관 샛길 제보',
    points: 100,
    date: '2026-05-19',
    iconType: 'shortcut',
  },
  {
    id: 'ach-3',
    title: '회원가입 환영 보너스',
    points: 1000,
    date: '2026-05-15',
    iconType: 'register',
  },
];

export const MOCK_RANKINGS: RankingItem[] = [
  { rank: 1, name: '최고은', distance: 42.5, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Jordan K.', distance: 38.2, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Sam R.', distance: 35.0, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { rank: 4, name: '민지후', distance: 31.8, avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { rank: 5, name: '박건우', distance: 28.4, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'item-coffee', title: '아메리카노', price: 3000, icon: 'coffee' },
  { id: 'item-lunch', title: '학생식당 식권', price: 5500, icon: 'utensils' },
  { id: 'item-bread', title: '베이커리 소금빵', price: 2800, icon: 'bread' },
  { id: 'item-booster', title: '실시간 셔틀 급행권', price: 1000, icon: 'sparkles' },
];

export const CAMPUS_BUILDINGS = [
  { id: 'academic', name: '학술정보관', code: 'LIB', lat: 37.556, lng: 126.937 },
  { id: 'convergence', name: '융합교육관', code: 'CONV', lat: 37.559, lng: 126.935 },
  { id: 'engineering', name: '공학관', code: 'ENG', lat: 37.558, lng: 126.939 },
  { id: 'humanities', name: '인문관', code: 'HUM', lat: 37.555, lng: 126.934 },
  { id: 'student', name: '학생회관', code: 'UNION', lat: 37.557, lng: 126.936 },
];

export const DEFAULT_ROUTE_OP_FAST_STEPS = [
  { id: 'step-1', instruction: '도서관 산책로에서 북쪽으로 이동', detail: '중앙 분수대 방향으로 100미터 걷기.', type: 'up' as const },
  { id: 'step-2', instruction: '과학관 아트리움으로 우회전', detail: '카페 옆 측면 출입구 이용.', type: 'right' as const },
  { id: 'step-3', instruction: '엘리베이터를 타고 2층으로 이동', detail: '내려서 스카이브릿지를 건너 인문관으로 이동.', type: 'elevator' as const },
  { id: 'step-4', instruction: '인문관 도착', detail: '목적지가 오른쪽에 있습니다.', type: 'arrival' as const },
];

export const MOCK_ROUTES: Record<string, Route> = {
  'academic-convergence': {
    start: '학술정보관',
    end: '융합교육관',
    options: [
      {
        id: 'fast',
        title: '빠른 길',
        duration: 5,
        distance: 450,
        tag: '최단시간',
        tagBg: 'bg-blue-100',
        tagColor: 'text-blue-700',
        description: '건물 관통 지름길 (도서관 샛길 우회)',
        steps: [
          { id: 'step-1-1', instruction: '학술정보관 후문 샛길 진입', detail: '도서관 뒤편 대나무 숲길로 50m 직진', type: 'up' },
          { id: 'step-1-2', instruction: '창의관 1층 로비 관통', detail: '전자 출입증 태그 없이 통과 가능', type: 'up' },
          { id: 'step-1-3', instruction: '융합교육관 스카이브릿지 진입', detail: '2층 보행 통로를 이용해 이동', type: 'elevator' },
          { id: 'step-1-4', instruction: '융합교육관 2층 로비 도착', detail: '도착 완료', type: 'arrival' }
        ]
      },
      {
        id: '舒适',
        title: '편안한 길',
        duration: 8,
        distance: 600,
        tag: '그늘진 복도',
        tagBg: 'bg-green-100',
        tagColor: 'text-green-700',
        description: '야외 보행 가로수길 중심 평지 경로',
        steps: [
          { id: 'step-2-1', instruction: '중앙 분수대 광장 이동', detail: '평탄한 보도블록 따라 150m 이동', type: 'up' },
          { id: 'step-2-2', instruction: '은행나무 가로수길 직진', detail: '경사도가 완만하고 그늘이 많습니다', type: 'up' },
          { id: 'step-2-3', instruction: '융합교육관 정문 출입구 진입', detail: '목적지 1층 로비 입구', type: 'arrival' }
        ]
      },
      {
        id: 'rainfree',
        title: '비 안 맞는 길',
        duration: 10,
        distance: 550,
        tag: '100% 실내/연결 통로',
        tagBg: 'bg-orange-100',
        tagColor: 'text-orange-700',
        description: '지하 연결통로 및 연동 엘리베이터',
        steps: [
          { id: 'step-3-1', instruction: '학술정보관 지하 1층 통로', detail: '창조관 연결 통로로 이동', type: 'left' },
          { id: 'step-3-2', instruction: '창조관 엘리베이터 승차', detail: '3층에서 내려 공학관 방향 연결교 이동', type: 'elevator' },
          { id: 'step-3-3', instruction: '융합교육관 2층 실내 연계 통로', detail: '엘리베이터를 통해 비를 맞지 않고 이동', type: 'elevator' },
          { id: 'step-3-4', instruction: '융합교육관 도착', detail: '실내 로비 도착', type: 'arrival' }
        ]
      }
    ]
  },
  'engineering-humanities': {
    start: '공학관',
    end: '인문관',
    options: [
      {
        id: 'fast',
        title: '빠른 길',
        duration: 5,
        distance: 400,
        tag: '최단시간',
        tagBg: 'bg-blue-100',
        tagColor: 'text-blue-700',
        description: '공학관 후문 대나무숲 지름길 활용',
        steps: [
          { id: 'step-1', instruction: '공학관 후문 가파른 계단 하강', detail: '미끄럼 주의하여 30미터 하강', type: 'up' },
          { id: 'step-2', instruction: '도서관 뒤편 샛길 합류', detail: '좁은 흙길 구간 100미터 직진', type: 'up' },
          { id: 'step-3', instruction: '인문관 동관 1층 로비 진입', detail: '정수기 옆 출입구 이용', type: 'right' },
          { id: 'step-4', instruction: '인문관 도착', detail: '최단 기록 달성 가능', type: 'arrival' }
        ]
      },
      {
        id: '舒适',
        title: '편안한 길',
        duration: 8,
        distance: 580,
        tag: '완만한 경사',
        tagBg: 'bg-green-100',
        tagColor: 'text-green-700',
        description: '중앙로 보도블록 우회 경로',
        steps: [
          { id: 'step-1', instruction: '공학관 정문 이동', detail: '완만한 슬로프 따라 하강', type: 'up' },
          { id: 'step-2', instruction: '대운동장 옆 평탄한 인도 200m', detail: '탁 트인 중앙 아스팔트길 도보', type: 'up' },
          { id: 'step-3', instruction: '인문관 정문 앞 화단 우회', detail: '정문 진입', type: 'arrival' }
        ]
      }
    ]
  }
};

// Default route helper if dynamic pair is chosen
export function getRoute(start: string, end: string): Route {
  const key = `${start}-${end}`;
  const reverseKey = `${end}-${start}`;
  if (MOCK_ROUTES[key]) {
    return MOCK_ROUTES[key];
  }
  if (MOCK_ROUTES[reverseKey]) {
    // Reverse the start and end of the route
    const original = MOCK_ROUTES[reverseKey];
    return {
      start: original.end,
      end: original.start,
      options: original.options.map(option => ({
        ...option,
        steps: option.steps.map((s, i) => ({
          ...s,
          id: `rev-${s.id}`,
          instruction: i === 0 ? `${original.end} 출발` : i === option.steps.length - 1 ? `${original.start} 도착` : s.instruction
        }))
      }))
    };
  }

  // Generate fallback route options on the fly
  return {
    start,
    end,
    options: [
      {
        id: 'fast',
        title: '빠른 길',
        duration: 6,
        distance: 480,
        tag: '최단시간',
        tagBg: 'bg-blue-100',
        tagColor: 'text-blue-700',
        description: '지경관 스카이웨이 관통로',
        steps: [
          { id: 'fb-1', instruction: `${start} 출입구 출발`, detail: '가장 가까운 계단을 이용해 1층으로 내려가기', type: 'up' },
          { id: 'fb-2', instruction: '연결 광장 대각선 횡단', detail: '보도블록을 따라 120m 이동', type: 'right' },
          { id: 'fb-3', instruction: '사잇길 샛길 진입', detail: '나무 그늘 사이 흙길로 시간 단축', type: 'up' },
          { id: 'fb-4', instruction: `${end} 도착`, detail: '목적지 정문 입구입니다.', type: 'arrival' }
        ]
      },
      {
        id: '舒适',
        title: '편안한 길',
        duration: 9,
        distance: 650,
        tag: '나무 그늘',
        tagBg: 'bg-green-100',
        tagColor: 'text-green-700',
        description: '보안등이 잘 켜진 메인 도보 경로',
        steps: [
          { id: 'fb-comfort-1', instruction: `${start} 정문 출발`, detail: '메인 가로등 길 따라 이동', type: 'up' },
          { id: 'fb-comfort-2', instruction: '평지 잔디광장 직진', detail: '가장 안전하고 넓은 인도 250m', type: 'up' },
          { id: 'fb-comfort-3', instruction: `${end} 도착`, detail: '입구 도착', type: 'arrival' }
        ]
      }
    ]
  };
}

// Sample Timetables for interaction
export const TIGHT_TIMETABLE: TimetableCourse[] = [
  {
    id: 'c1',
    name: '공학 수학 I',
    building: '공학관',
    room: '302호',
    day: '월',
    startTime: '10:30',
    endTime: '11:50',
    color: 'bg-blue-500 text-white',
  },
  {
    id: 'c2',
    name: '인문학의 이해',
    building: '인문관',
    room: '102호',
    day: '월',
    startTime: '11:55',
    endTime: '13:15',
    color: 'bg-purple-500 text-white',
  },
  {
    id: 'c3',
    name: '창의융합설계',
    building: '융합교육관',
    room: '405호',
    day: '화',
    startTime: '14:00',
    endTime: '15:30',
    color: 'bg-teal-500 text-white',
  },
  {
    id: 'c4',
    name: '자료구조',
    building: '공학관',
    room: '501호',
    day: '화',
    startTime: '16:00',
    endTime: '17:15',
    color: 'bg-blue-600 text-white',
  },
  {
    id: 'c5',
    name: '디지털 혁신 논문',
    building: '학술정보관',
    room: '세미나실 B',
    day: '수',
    startTime: '13:00',
    endTime: '14:30',
    color: 'bg-orange-500 text-white',
  },
];

export const RELAXED_TIMETABLE: TimetableCourse[] = [
  {
    id: 'r1',
    name: '인공지능 개론',
    building: '융합교육관',
    room: '202호',
    day: '월',
    startTime: '09:30',
    endTime: '11:00',
    color: 'bg-emerald-500 text-white',
  },
  {
    id: 'r2',
    name: '글로벌 커뮤니케이션',
    building: '학술정보관',
    room: '컨퍼런스룸 A',
    day: '월',
    startTime: '13:00',
    endTime: '14:30',
    color: 'bg-amber-500 text-white',
  },
  {
    id: 'r3',
    name: '소프트웨어 설계',
    building: '공학관',
    room: '312호',
    day: '목',
    startTime: '11:00',
    endTime: '12:30',
    color: 'bg-indigo-500 text-white',
  },
];
