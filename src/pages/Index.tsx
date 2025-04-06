
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WaterTracker from '@/components/ui/water-tracker';
import CalorieTracker from '@/components/ui/calorie-tracker';
import ExerciseTracker from '@/components/ui/exercise-tracker';
import MoodTracker from '@/components/ui/mood-tracker';
import DailyGoal from '@/components/ui/daily-goal';
import { Activity, ChevronDown, TrendingUp, Droplet, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { toast } from 'sonner';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';

const Index = () => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<'current' | 'last' | 'lastTwoWeeks'>('current');
  const [weeklyData, setWeeklyData] = useState({
    waterProgress: '87%',
    exerciseProgress: '63%',
    sleepQuality: 'Good'
  });
  const [dashboardItems, setDashboardItems] = useState({
    water: true,
    nutrition: true,
    exercise: true,
    mood: true,
    goals: true,
    quickWater: true,
    quickExercise: true,
    quickNutrition: true,
    quickGoals: true,
    quickSleep: false,
    quickBudget: false,
    quickMood: false,
    quickCycle: false
  });

  // Load dashboard settings from localStorage
  useEffect(() => {
    const savedDashboardItems = localStorage.getItem('dashboardItems');
    if (savedDashboardItems) {
      try {
        setDashboardItems(JSON.parse(savedDashboardItems));
      } catch (error) {
        console.error('Failed to parse dashboard items from localStorage', error);
      }
    }
  }, []);

  // Calculate date ranges for week selection
  const today = new Date();
  const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(new Date(today.setDate(today.getDate() - 7)), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(new Date(today.setDate(today.getDate() - 7)), { weekStartsOn: 1 });

  // Format date ranges for display
  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  };

  // Weekly data options
  const weekOptions = [
    { 
      label: 'This Week', 
      value: 'current',
      dateRange: formatDateRange(thisWeekStart, thisWeekEnd),
      data: { waterProgress: '87%', exerciseProgress: '63%', sleepQuality: 'Good' }
    },
    { 
      label: 'Last Week', 
      value: 'last',
      dateRange: formatDateRange(lastWeekStart, lastWeekEnd),
      data: { waterProgress: '72%', exerciseProgress: '55%', sleepQuality: 'Fair' }
    },
    { 
      label: 'Last 2 Weeks', 
      value: 'lastTwoWeeks',
      dateRange: `${format(lastWeekStart, 'MMM d')} - ${format(thisWeekEnd, 'MMM d')}`,
      data: { waterProgress: '79%', exerciseProgress: '58%', sleepQuality: 'Good' }
    }
  ];

  // Find currently selected week data
  const currentWeekOption = weekOptions.find(opt => opt.value === selectedWeek) || weekOptions[0];

  const handleWeekChange = (value: 'current' | 'last' | 'lastTwoWeeks') => {
    setSelectedWeek(value);
    const selectedOption = weekOptions.find(opt => opt.value === value);
    if (selectedOption) {
      setWeeklyData(selectedOption.data);
    }
  };

  // Map dashboard items to quick action items
  const quickActionItems = {
    water: dashboardItems.quickWater,
    exercise: dashboardItems.quickExercise,
    goals: dashboardItems.quickGoals,
    nutrition: dashboardItems.quickNutrition,
    sleep: dashboardItems.quickSleep,
    budget: dashboardItems.quickBudget,
    mood: dashboardItems.quickMood,
    cycle: dashboardItems.quickCycle
  };

  useEffect(() => {
    // Add animation classes to elements when they mount
    const sections = document.querySelectorAll('.animate-on-mount');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('animate-enter');
      }, 100 * index);
    });
  }, []);

  return (
    <MainLayout>
      <div className="mb-6 animate-on-mount opacity-0">
        <h1 className="text-2xl font-bold mb-1">Trackify Dashboard</h1>
        <p className="text-muted-foreground">Track your life, simplify your journey</p>
      </div>
      
      <div className="glass-card p-4 mb-8 animate-on-mount opacity-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Weekly Progress</span>
          </h3>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-sm text-muted-foreground hover:text-foreground flex items-center">
                {currentWeekOption.label} <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="p-2">
                {weekOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedWeek === option.value
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => handleWeekChange(option.value as 'current' | 'last' | 'lastTwoWeeks')}
                  >
                    <div>{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.dateRange}</div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-secondary/50 dark:bg-secondary/20 rounded-xl p-4 flex items-center no-hover">
            <div className="h-12 w-12 rounded-full bg-water/10 flex items-center justify-center mr-4">
              <Droplet className="h-6 w-6 text-water" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Water Intake</p>
              <p className="text-xl font-bold">{weeklyData.waterProgress}</p>
            </div>
          </div>
          
          <div className="bg-secondary/50 dark:bg-secondary/20 rounded-xl p-4 flex items-center no-hover">
            <div className="h-12 w-12 rounded-full bg-calories/10 flex items-center justify-center mr-4">
              <Activity className="h-6 w-6 text-calories" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exercise Goal</p>
              <p className="text-xl font-bold">{weeklyData.exerciseProgress}</p>
            </div>
          </div>
          
          <div className="bg-secondary/50 dark:bg-secondary/20 rounded-xl p-4 flex items-center no-hover">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Moon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sleep Quality</p>
              <p className="text-xl font-bold">{weeklyData.sleepQuality}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.water && <WaterTracker className="animate-on-mount opacity-0 no-hover" />}
        {dashboardItems.nutrition && <CalorieTracker className="animate-on-mount opacity-0 no-hover" />}
        {dashboardItems.exercise && <ExerciseTracker className="animate-on-mount opacity-0 no-hover" />}
        {dashboardItems.mood && <MoodTracker className="animate-on-mount opacity-0 no-hover" />}
        {dashboardItems.goals && <DailyGoal className="animate-on-mount opacity-0 no-hover" />}
        
        <DashboardQuickActions visibleActions={quickActionItems} />
      </div>
    </MainLayout>
  );
};

export default Index;
