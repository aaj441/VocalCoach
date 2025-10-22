import React, { useState } from 'react';
import { Star, Lock, Unlock } from 'lucide-react';
import { useStore } from '../store/useStore';

const avatarOptions = {
  skin: [
    { id: 'light', name: 'Light', color: '#FFE0BD', unlockLevel: 1 },
    { id: 'medium', name: 'Medium', color: '#D4A574', unlockLevel: 3 },
    { id: 'dark', name: 'Dark', color: '#8D5524', unlockLevel: 5 },
  ],
  hair: [
    { id: 'short-brown', name: 'Short Brown', emoji: '👦', unlockLevel: 1 },
    { id: 'long-blonde', name: 'Long Blonde', emoji: '👱', unlockLevel: 4 },
    { id: 'curly-black', name: 'Curly Black', emoji: '👨‍🦱', unlockLevel: 7 },
    { id: 'bald', name: 'Bald', emoji: '👴', unlockLevel: 10 },
  ],
  outfit: [
    { id: 'casual', name: 'Casual', emoji: '👕', unlockLevel: 1 },
    { id: 'formal', name: 'Formal', emoji: '👔', unlockLevel: 5 },
    { id: 'sporty', name: 'Sporty', emoji: '🏃', unlockLevel: 8 },
    { id: 'rockstar', name: 'Rockstar', emoji: '🎸', unlockLevel: 12 },
  ],
  accessory: [
    { id: 'none', name: 'None', emoji: '∅', unlockLevel: 1 },
    { id: 'glasses', name: 'Glasses', emoji: '👓', unlockLevel: 3 },
    { id: 'headphones', name: 'Headphones', emoji: '🎧', unlockLevel: 6 },
    { id: 'crown', name: 'Crown', emoji: '👑', unlockLevel: 15 },
  ],
};

export function AvatarCustomization() {
  const { user, updateAvatar } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof avatarOptions>('skin');

  const categories = [
    { id: 'skin' as const, name: 'Skin Tone', icon: '🎨' },
    { id: 'hair' as const, name: 'Hairstyle', icon: '💇' },
    { id: 'outfit' as const, name: 'Outfit', icon: '👔' },
    { id: 'accessory' as const, name: 'Accessories', icon: '👓' },
  ];

  const handleSelect = (category: keyof typeof avatarOptions, itemId: string) => {
    const item = avatarOptions[category].find((opt) => opt.id === itemId);
    if (!item) return;

    if (item.unlockLevel > user.level) {
      alert(`Unlock this at level ${item.unlockLevel}!`);
      return;
    }

    updateAvatar({ [category]: itemId });

    // Add to unlocked items if not already there
    if (!user.avatar.unlocked.includes(itemId)) {
      updateAvatar({
        unlocked: [...user.avatar.unlocked, itemId],
      });
    }
  };

  const isUnlocked = (unlockLevel: number) => user.level >= unlockLevel;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Avatar Customization</h2>
        <Star className="w-8 h-8 text-yellow-500" />
      </div>

      <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">Unlock Rewards by Leveling Up!</h3>
        <p className="opacity-90">
          Keep practicing to unlock new customization options for your avatar.
        </p>
      </div>

      {/* Avatar Preview */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold mb-4">Your Avatar</h3>
          <div className="inline-block">
            <div
              className="w-48 h-48 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl shadow-xl"
              style={{
                backgroundColor: avatarOptions.skin.find((s) => s.id === user.avatar.skin)?.color,
              }}
            >
              <div className="space-y-2">
                <div>{avatarOptions.hair.find((h) => h.id === user.avatar.hair)?.emoji}</div>
                <div>{avatarOptions.outfit.find((o) => o.id === user.avatar.outfit)?.emoji}</div>
                <div>{avatarOptions.accessory.find((a) => a.id === user.avatar.accessory)?.emoji}</div>
              </div>
            </div>
            <div className="text-xl font-bold">{user.name}</div>
            <div className="text-gray-600">Level {user.level}</div>
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-primary-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Options Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 capitalize">{selectedCategory} Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {avatarOptions[selectedCategory].map((option) => {
            const unlocked = isUnlocked(option.unlockLevel);
            const isSelected = user.avatar[selectedCategory] === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(selectedCategory, option.id)}
                disabled={!unlocked}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : unlocked
                    ? 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  {selectedCategory === 'skin' ? (
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-3 shadow-md"
                      style={{ backgroundColor: option.color }}
                    />
                  ) : (
                    <div className="text-4xl mb-3">{option.emoji}</div>
                  )}
                  <div className="font-semibold text-sm mb-1">{option.name}</div>
                  <div className="flex items-center justify-center space-x-1 text-xs">
                    {unlocked ? (
                      <>
                        <Unlock className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">Unlocked</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-500">Level {option.unlockLevel}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Unlock Progress</h3>
        <div className="space-y-3">
          {Object.entries(avatarOptions).map(([category, options]) => {
            const unlockedCount = options.filter((opt) => isUnlocked(opt.unlockLevel)).length;
            const totalCount = options.length;
            const percentage = (unlockedCount / totalCount) * 100;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{category}</span>
                  <span className="text-sm text-gray-600">
                    {unlockedCount}/{totalCount}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
