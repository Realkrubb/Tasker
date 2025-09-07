"use client";
import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Gift, X, Check, AlertCircle, Calendar} from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  const [showCongrats, setShowCongrats] = useState(false);
  
  // Modal states - ใช้จากโค้ดที่ส่งมา
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmClose, setIsConfirmClose] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [reward, setReward] = useState('');
  const [repeatMode, setRepeatMode] = useState('once');
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [weekRepeatMode, setWeekRepeatMode] = useState('once');
  
  // เพิ่ม state สำหรับ edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  // Reward settings states
  const [isRewardSettingsOpen, setIsRewardSettingsOpen] = useState(false);
  const [rewardImage, setRewardImage] = useState('');
  const [customCongratsText, setCustomCongratsText] = useState('Congratulations! Task completed! Enjoy your reward!');
  const [customSoundEffect, setCustomSoundEffect] = useState('');
  const [selectedPresetSound, setSelectedPresetSound] = useState('success');
  
  const modalRef = useRef(null);

  // Preset sound effects
  const presetSounds = {
    'success': () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    },
    'chime': () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    },
    'bell': () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    },
    'fanfare': () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Play multiple notes in sequence
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      
      notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.15);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + index * 0.15 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3);
        
        oscillator.start(audioContext.currentTime + index * 0.15);
        oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3);
      });
    },
    'ding': () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    },
    'none': () => {
      // No sound
    }
  };

  // ฟังก์ชันจากโค้ดเดิม
  const handleConfirm = () => {
    if (taskName.trim()) {
      if (isEditMode) {
        // Update existing task
        setTasks(tasks.map(task => 
          task.id === editingTaskId 
            ? { ...task, task: taskName, time: taskTime, date: selectedDate, reward: reward }
            : task
        ));
      } else {
        // Save task logic here
        const newTask = {
          id: Date.now(),
          task: taskName,
          time: taskTime,
          date: selectedDate,
          reward: reward,
          repeatMode: repeatMode,
          selectedWeekdays: selectedWeekdays,
          weekRepeatMode: weekRepeatMode
        };
        setTasks([...tasks, newTask]);
      }
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingTaskId(null);
      // Reset form
      setTaskName('');
      setTaskTime('');
      setSelectedDate('');
      setReward('');
      setRepeatMode('once');
      setSelectedWeekdays([]);
      setWeekRepeatMode('once');
    } else {
      alert('Please enter a task name');
    }
  };

  const handleCancel = () => {
    if (showCancelWarning) {
      // กดครั้งที่สอง - ปิด modal
      confirmClose();
    } else {
      // กดครั้งแรก - แสดงคำเตือน
      setShowCancelWarning(true);
    }
  };

  const openRewardSettings = () => {
    setIsRewardSettingsOpen(true);
  };

  const closeRewardSettings = () => {
    setIsRewardSettingsOpen(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRewardImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSoundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomSoundEffect(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmClose = () => {
    setIsModalOpen(false);
    setIsConfirmClose(false);
    setShowCancelWarning(false);
    setIsEditMode(false);
    setEditingTaskId(null);
    // Reset form
    setTaskName('');
    setTaskTime('');
    setSelectedDate('');
    setReward('');
    setRepeatMode('once');
    setSelectedWeekdays([]);
    setWeekRepeatMode('once');
  };

  const cancelClose = () => {
    setIsConfirmClose(false);
  };

  const handleDateSelect = (event) => {
    setSelectedDate(event.target.value);
  };

  const toggleWeekday = (day) => {
    setSelectedWeekdays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  // ฟังก์ชันสำหรับ Task Manager
  const addNewTask = () => {
    setIsEditMode(false);
    setEditingTaskId(null);
    setShowCancelWarning(false);
    setTaskName('');
    setTaskTime('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setReward('');
    setRepeatMode('once');
    setSelectedWeekdays([]);
    setWeekRepeatMode('once');
    setIsModalOpen(true);
  };

  const startEditing = (task) => {
    setIsEditMode(true);
    setEditingTaskId(task.id);
    setShowCancelWarning(false);
    setTaskName(task.task);
    setTaskTime(task.time);
    setSelectedDate(task.date);
    setReward(task.reward);
    setRepeatMode('once');
    setSelectedWeekdays([]);
    setWeekRepeatMode('once');
    setIsModalOpen(true);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const completeTask = (taskId) => {
    // Play custom sound if available, otherwise play preset sound
    if (customSoundEffect) {
      const audio = new Audio(customSoundEffect);
      audio.play().catch(e => console.log('Could not play custom sound:', e));
    } else if (selectedPresetSound && presetSounds[selectedPresetSound]) {
      try {
        presetSounds[selectedPresetSound]();
      } catch (e) {
        console.log('Could not play preset sound:', e);
      }
    }
    
    setShowCongrats(true);
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== taskId));
      setShowCongrats(false);
    }, 2000);
  };

  // Group tasks by date
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }
    acc[task.date].push(task);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const weekdays = [
    { short: 'M', full: 'Monday', value: 'monday' },
    { short: 'T', full: 'Tuesday', value: 'tuesday' },
    { short: 'W', full: 'Wednesday', value: 'wednesday' },
    { short: 'T', full: 'Thursday', value: 'thursday' },
    { short: 'F', full: 'Friday', value: 'friday' },
    { short: 'S', full: 'Saturday', value: 'saturday' },
    { short: 'S', full: 'Sunday', value: 'sunday' }
  ];

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const commonEmojis = [
    '🎁', '🎉', '🍕', '🍔', '🍰', '🎮', '📱', '💰', 
    '🏆', '⭐', '🎯', '🎪', '🎨', '📚', '🎵', '🏃‍♂️',
    '☕', '🍿', '🎬', '🛍️', '🏖️', '🧘‍♀️', '🎸', '🏅'
  ];

  const handleEmojiSelect = (emoji: string) => {
    setReward(reward + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 mb-6 text-center">
          <div className="text-gray-600 font-medium">task</div>
          <div className="text-gray-600 font-medium">time</div>
          <div className="text-gray-600 font-medium">reward</div>
          <div className="text-gray-600 font-medium">date</div>
        </div>

        {/* Tasks grouped by date */}
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg mb-2">No tasks yet</p>
            <p className="text-sm">Click the + button to add your first task</p>
          </div>
        ) : (
          Object.entries(groupedTasks)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, dateTasks]) => (
            <div key={date} className="mb-6">
              {/* Date header */}
              <div className="text-center mb-4">
                <span className="text-gray-700 font-medium text-sm border-b border-gray-300 pb-1">
                  {formatDate(date)}
                </span>
              </div>

              {/* Tasks for this date */}
              {dateTasks.map((task) => (
                <div key={task.id} className="grid grid-cols-4 gap-4 mb-3 items-center">
                  <div className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                    <span className="break-words">{task.task}</span>
                  </div>
                  <div className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-center bg-white">
                    {task.time}
                  </div>
                  <div 
                    className={`border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                      task.reward === 'eating' ? 'bg-yellow-200' : 'bg-white'
                    }`}
                    onClick={() => completeTask(task.id)}
                    title="Click to complete task and get reward!"
                  >
                    <span className="break-words">{task.reward}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <button
                      className="border border-gray-300 rounded-lg px-2 py-2 text-xs bg-white hover:bg-gray-50 flex-1 flex items-center justify-center gap-1"
                      title="Change date"
                    >
                      <Calendar size={12} />
                      <span>{formatDate(task.date)}</span>
                    </button>
                    <button
                      onClick={() => startEditing(task)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="Edit task"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        {/* Add button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={addNewTask}
            className="bg-white border border-gray-300 rounded-full p-3 hover:bg-gray-50 shadow-sm"
          >
            <Plus size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Reward Settings Button - moved under the add button */}
        <div className="text-center mt-4">
          <button
            onClick={openRewardSettings}
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
          >
            reward setting
          </button>
        </div>
      </div>

      {/* Modal จากโค้ดที่ส่งมา - ไม่แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditMode ? 'edit task' : 'add task/edit'}
              </h2>
              <div className="flex gap-2">
                <div className="flex flex-col items-end">
                  <button 
                    onClick={handleCancel}
                    className={`px-4 py-2 text-sm rounded border border-red-500 text-red-500 hover:bg-red-50 ${showCancelWarning ? 'bg-red-50' : ''}`}
                  >
                    cancel
                  </button>
                  {showCancelWarning && (
                    <div className="text-red-500 text-xs mt-1 whitespace-nowrap">
                      Click again to close without saving
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleConfirm}
                  className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  confirm
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SET NAME
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="enter your task name here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Task Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SET TIME
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SET DATE
                </label>
                <div className="relative mb-4">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Repeat Mode Toggle */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRepeatMode('once')}
                      className={`w-12 h-6 rounded-full border-2 relative transition-colors ${
                        repeatMode === 'once' ? 'bg-green-400 border-green-400' : 'bg-gray-200 border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                        repeatMode === 'once' ? 'translate-x-1' : 'translate-x-6'
                      }`} />
                    </button>
                    <span className="text-sm text-gray-600">once</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRepeatMode('repeat')}
                      className={`w-12 h-6 rounded-full border-2 relative transition-colors ${
                        repeatMode === 'repeat' ? 'bg-gray-400 border-gray-400' : 'bg-gray-200 border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                        repeatMode === 'repeat' ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <span className="text-sm text-gray-600">repeat every ...</span>
                  </div>
                </div>
              </div>

              {/* Weekly Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  SET IN WEEK
                </label>
                
                {/* Weekday Buttons */}
                <div className="flex justify-center gap-1 mb-4">
                  {weekdays.map((day, index) => (
                    <button
                      key={day.value}
                      onClick={() => toggleWeekday(day.value)}
                      className={`w-12 h-12 rounded-full border-2 text-sm font-medium transition-colors ${
                        selectedWeekdays.includes(day.value)
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                      title={day.full}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>

                {/* Weekly Repeat Mode Toggle */}
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWeekRepeatMode('once')}
                      className={`w-12 h-6 rounded-full border-2 relative transition-colors ${
                        weekRepeatMode === 'once' ? 'bg-green-400 border-green-400' : 'bg-gray-200 border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                        weekRepeatMode === 'once' ? 'translate-x-1' : 'translate-x-6'
                      }`} />
                    </button>
                    <span className="text-sm text-gray-600">once</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWeekRepeatMode('repeat')}
                      className={`w-12 h-6 rounded-full border-2 relative transition-colors ${
                        weekRepeatMode === 'repeat' ? 'bg-gray-400 border-gray-400' : 'bg-gray-200 border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                        weekRepeatMode === 'repeat' ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <span className="text-sm text-gray-600">repeat every ...</span>
                  </div>
                </div>
              </div>

              {/* Reward */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SET REWARD
                </label>
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    placeholder="enter your reward here"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded transition-all duration-200 cursor-pointer hover:scale-110"
                  >
                    <Gift className="h-5 w-5 text-gray-600 hover:text-gray-700 transition-colors" />
                  </button>
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <>
                      {/* Backdrop to close picker */}
                      <div 
                        className="fixed inset-0 z-[90]" 
                        onClick={() => setShowEmojiPicker(false)}
                      ></div>
                      <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-[100] w-64">
                        <div className="text-xs text-gray-500 mb-2">Choose emoji:</div>
                        <div className="grid grid-cols-8 gap-1">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleEmojiSelect(emoji);
                              }}
                              className="text-lg p-1 hover:bg-gray-100 rounded transition-colors flex items-center justify-center h-8 w-8"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Settings Modal */}
      {isRewardSettingsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Reward Settings
              </h2>
              <button 
                onClick={closeRewardSettings}
                className="px-4 py-2 text-sm rounded border border-red-500 text-red-500 hover:bg-red-50"
              >
                close
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Input Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  REWARD IMAGE
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {rewardImage && (
                  <div className="mt-3 text-center">
                    <img 
                      src={rewardImage} 
                      alt="Reward" 
                      className="max-w-full h-32 object-contain mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => setRewardImage('')}
                      className="text-red-500 text-sm mt-2 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>

              {/* Custom Congratulation Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CUSTOM CONGRATULATION TEXT
                </label>
                <textarea
                  value={customCongratsText}
                  onChange={(e) => setCustomCongratsText(e.target.value)}
                  placeholder="Enter your custom congratulation message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              {/* Custom Sound Effect */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SOUND EFFECT
                </label>
                
                {/* Preset Sound Selection */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">
                    Choose from presets:
                  </label>
                  <select
                    value={selectedPresetSound}
                    onChange={(e) => {
                      setSelectedPresetSound(e.target.value);
                      setCustomSoundEffect(''); // Clear custom sound when preset is selected
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  >
                    <option value="success">🎵 Success Chord</option>
                    <option value="chime">🔔 Chime</option>
                    <option value="bell">🛎️ Bell</option>
                    <option value="fanfare">🎺 Fanfare</option>
                    <option value="ding">✨ Ding</option>
                    <option value="none">🔇 No Sound</option>
                  </select>
                  <button
                    onClick={() => {
                      if (selectedPresetSound && presetSounds[selectedPresetSound]) {
                        try {
                          presetSounds[selectedPresetSound]();
                        } catch (e) {
                          console.log('Could not play preset sound:', e);
                        }
                      }
                    }}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Test Sound
                  </button>
                </div>

                {/* Custom Sound Upload */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Or upload your own:
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      handleSoundUpload(e);
                      setSelectedPresetSound('none'); // Clear preset when custom is uploaded
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {customSoundEffect && (
                    <div className="mt-3 text-center">
                      <audio controls className="w-full">
                        <source src={customSoundEffect} />
                        Your browser does not support the audio element.
                      </audio>
                      <button
                        onClick={() => setCustomSoundEffect('')}
                        className="text-red-500 text-sm mt-2 hover:text-red-700"
                      >
                        Remove sound
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Pop-up */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl animate-bounce">
            <div className="text-center">
              {rewardImage ? (
                <img 
                  src={rewardImage} 
                  alt="Reward" 
                  className="w-24 h-24 object-contain mx-auto mb-4"
                />
              ) : (
                <div className="text-6xl mb-4">🎉</div>
              )}
              <h2 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h2>
              <p className="text-gray-600">{customCongratsText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;