import React, { useState } from 'react';
import { User, AchievementItem, ShopItem, PurchasedCoupon } from '../types';
import { SHOP_ITEMS, INITIAL_ACHIEVEMENTS } from '../data';
import { Award, CreditCard, ChevronRight, CheckCircle2, AlertCircle, ShoppingCart, Ticket, RefreshCw } from 'lucide-react';

interface MyPointShopProps {
  user: User;
  achievements: AchievementItem[];
  onDeductPoints: (pts: number) => boolean;
}

export default function MyPointShop({ user, achievements, onDeductPoints }: MyPointShopProps) {
  const [purchasedCoupons, setPurchasedCoupons] = useState<PurchasedCoupon[]>([]);
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<ShopItem | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<PurchasedCoupon | null>(null);
  const [algorithmRating, setAlgorithmRating] = useState<string | null>(null);

  const handleOpenPurchaseDialog = (item: ShopItem) => {
    setSelectedItemForPurchase(item);
    setPurchaseError(null);
    setPurchaseSuccess(null);
  };

  const handleConfirmPurchase = () => {
    if (!selectedItemForPurchase) return;

    if (user.points < selectedItemForPurchase.price) {
      setPurchaseError('포인트가 부족합니다. 미션을 더 완주해보세요!');
      return;
    }

    const success = onDeductPoints(selectedItemForPurchase.price);
    if (success) {
      const generatedBarcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
      const newCoupon: PurchasedCoupon = {
        id: `coupon-${Date.now()}`,
        item: selectedItemForPurchase,
        purchasedAt: new Date().toLocaleDateString('ko-KR'),
        barcode: generatedBarcode,
        used: false,
      };

      setPurchasedCoupons([newCoupon, ...purchasedCoupons]);
      setPurchaseSuccess(newCoupon);
      setSelectedItemForPurchase(null);
    } else {
      setPurchaseError('결제 도중 문제가 발생했습니다.');
    }
  };

  const handleRateAlgorithm = (rating: 'perfect' | 'poor') => {
    if (rating === 'perfect') {
      setAlgorithmRating('소중한 찬사에 감사드립니다! 빠른 도보 알고리즘을 한층 고도화하겠습니다.');
    } else {
      setAlgorithmRating('피드백 감사드립니다. 대나무 숲길 및 엘리베이터 정지 시간을 교정하겠습니다.');
    }
    setTimeout(() => {
      setAlgorithmRating(null);
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8FF] animate-fade-in text-gray-800 pb-16">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        
        {/* User profile card - Screen 2 header */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Visual Profile Avatar Circle */}
            <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-[#004fde] font-sans font-black text-lg shadow-inner">
              고은
            </div>
            <div className="text-left">
              <h3 className="text-base font-extrabold text-gray-900">{user.name}님</h3>
              <p className="text-[11px] font-bold text-[#004fde] bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                레벨: {user.level} (등급: 마스터 러너)
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">러닝 등급</span>
            <span className="text-xs font-black text-emerald-600 block">전력 질주율 94%</span>
          </div>
        </div>

        {/* Owned Points card matching Screen 2 visually (Vibrant speed visual blue block) */}
        <div className="bg-gradient-to-r from-[#004fde] to-[#2563EB] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-20px] opacity-10">
            <Award className="w-40 h-40" />
          </div>

          <p className="text-xs font-bold uppercase tracking-wider opacity-85">보유 포인트</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-sans text-4xl font-extrabold tracking-tight italic select-all">
              {user.points.toLocaleString()}
            </span>
            <span className="text-base font-black uppercase font-sans tracking-wide">P</span>
          </div>
        </div>

        {/* List of recent points matching Screen 2 (최근 획득 내역) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3.5">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-older pb-2 border-b border-gray-50 flex items-center gap-1.5 matches-design text-left">
            ⚡ 최근 획득 내역
          </h4>

          <div className="divide-y divide-gray-50 space-y-2 text-left">
            {achievements.map((item) => (
              <div key={item.id} className="flex items-center justify-between pt-2 first:pt-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#004fde] flex items-center justify-center font-bold text-xs select-none">
                    {item.iconType === 'check' ? '✓' : item.iconType === 'shortcut' ? '⚡' : '★'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 leading-none">{item.title}</p>
                    <p className="text-[9px] text-gray-400 font-semibold mt-1">{item.date}</p>
                  </div>
                </div>
                <span className="font-sans text-xs font-black text-[#004fde] text-[#004fde]">
                  +{item.points.toLocaleString()}P
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Points Gift Coupon Shop in screen 2 */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider text-left">포인트 샵</h4>
              <p className="text-[9px] text-gray-400 font-medium text-left">적립한 샛길 기여 마일리지로 간편 모바일 기프티콘 교환 가능</p>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">전체보기</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-1">
            {SHOP_ITEMS.map((item) => {
              // Get item colors and text
              const isAffordable = user.points >= item.price;
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenPurchaseDialog(item)}
                  className={`border rounded-2xl p-4 text-center cursor-pointer transition-all hover:scale-102 flex flex-col justify-between items-center space-y-2.5 bg-[#FAF8FF] ${
                    isAffordable ? 'border-gray-100 hover:bg-blue-50/20' : 'border-gray-100 opacity-60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-xs border border-gray-100 font-sans text-xl">
                    {item.icon === 'coffee' ? '☕' : item.icon === 'utensils' ? '🍱' : item.icon === 'bread' ? '🥐' : ' Sh'}
                  </div>

                  <div>
                    <h5 className="text-xs font-extrabold text-gray-800 leading-tight">{item.title}</h5>
                    <span className="inline-block mt-1 font-sans text-[11px] font-black text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {item.price.toLocaleString()} P
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vouchers and Active Barcode Display - Highly Interactive! */}
        {purchasedCoupons.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-md space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full">
              <Ticket className="w-3.5 h-3.5 shrink-0" /> 내 보관 마이 쿠폰 ({purchasedCoupons.length})
            </span>

            <div className="space-y-4">
              {purchasedCoupons.map((coupon) => (
                <div key={coupon.id} className="border border-dashed border-gray-200 rounded-2xl p-4 text-center space-y-3 relative overflow-hidden bg-[#FAFDFE]">
                  <p className="text-xs font-black text-gray-800">{coupon.item.title}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">구매일자: {coupon.purchasedAt}</p>

                  {/* Aesthetic barcode */}
                  <div className="bg-white py-3 px-8 border border-gray-100 rounded-lg max-w-[240px] mx-auto">
                    <div className="h-10 border-black flex gap-[2px] justify-between items-stretch overflow-hidden select-none">
                      {coupon.barcode.split('').map((char, i) => (
                        <div
                          key={`bar-${i}`}
                          className="bg-black shrink-0"
                          style={{ width: parseInt(char) % 3 === 0 ? '4px' : parseInt(char) % 2 === 0 ? '2px' : '1px' }}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-[9px] text-gray-500 tracking-widest mt-1.5 font-bold">{coupon.barcode}</p>
                  </div>

                  <span className="inline-block text-[10px] text-[#004fde] font-bold">식당 / 카페 카운터 바코드 태그 가능</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dialogs / Modals for Coupon purchase confirmation */}
        {selectedItemForPurchase && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full border border-gray-100 shadow-xl space-y-4 text-center">
              <h3 className="text-sm font-black text-gray-900">쿠폰 교환하기</h3>
              <p className="text-xs text-gray-500 font-medium">
                <b>{selectedItemForPurchase.title}</b> 제품을 <b>{selectedItemForPurchase.price.toLocaleString()} 포인트</b>로 교환하시겠습니까?
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForPurchase(null)}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 text-xs font-bold hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPurchase}
                  className="flex-1 py-2.5 rounded-full bg-[#004fde] text-white text-xs font-black hover:bg-blue-700"
                >
                  교환 완료
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast feedback for purchase result */}
        {purchaseError && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 text-xs text-rose-600 flex items-center gap-2.5 max-w-sm mx-auto">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <p className="font-semibold text-left">{purchaseError}</p>
          </div>
        )}

        {purchaseSuccess && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 text-xs text-emerald-700 flex items-center gap-2.5 max-w-sm mx-auto">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <p className="font-semibold text-left"><b>{purchaseSuccess.item.title}</b> 교환 성공! 하단 보관함을 스캔하세요.</p>
          </div>
        )}

        {/* Algorithm Feedback box matching Screen 2 bottom exactly */}
        <div className="bg-blue-50/40 rounded-3xl p-5 border border-blue-100/50 space-y-3.5 text-left text-sm font-semibold">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-gray-800">분석 알고리즘이 정확했나요?</h4>
            <p className="text-[10px] text-gray-400 font-medium leading-normal">여러분들의 지름길 피드백 및 GPS 보정 데이터로 더 빠르고 정확한 길을 연산합니다.</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => handleRateAlgorithm('perfect')}
              className="flex-1 bg-white border border-blue-200/50 hover:bg-blue-50 rounded-xl py-2 px-3 text-center text-xs font-extrabold text-[#004fde] flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
            >
              네, 정확해요
            </button>
            <button
              onClick={() => handleRateAlgorithm('poor')}
              className="flex-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl py-2 px-3 text-center text-xs font-bold text-gray-500 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
            >
              아쉬워요
            </button>
          </div>

          {algorithmRating && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-semibold animate-fade-in text-center">
              {algorithmRating}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
