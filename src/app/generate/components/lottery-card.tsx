'use client';

import { cn } from '@/lib/utils';

const numbers = Array.from({ length: 60 }, (_, i) => i + 1);
const selectedNumbers = [4, 12, 23, 33, 41, 58, 7, 19, 28, 45, 50];

export function LotteryCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 transform -rotate-2">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-green-700">MEGA DA VIRADA</h2>
      </div>
      <div className="grid grid-cols-10 gap-1 sm:gap-2">
        {numbers.map((number) => (
          <div
            key={number}
            className={cn(
              'aspect-square flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 font-bold text-sm sm:text-base',
              selectedNumbers.includes(number) &&
                'bg-green-700 border-green-800 text-white'
            )}
          >
            {selectedNumbers.includes(number) ? '?' : number.toString().padStart(2, '0')}
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-center text-gray-400">
        Marque de 6 a 15 números.
      </div>
    </div>
  );
}
