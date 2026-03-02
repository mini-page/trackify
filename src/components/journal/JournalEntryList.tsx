
import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { CalendarDays, Tag, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: string;
  tags?: string[];
}

interface JournalEntryListProps {
  entries: JournalEntry[];
  onViewCalendar?: () => void;
}

const moodEmojis: Record<string, string> = {
  'Happy': '😃',
  'Good': '🙂',
  'Calm': '😌',
  'Neutral': '😐',
  'Tired': '😴',
  'Anxious': '😟',
  'Sad': '😢',
  'Angry': '😡',
  'Grateful': '🙏',
  'Excited': '🤩'
};

const moodColors: Record<string, string> = {
  'Happy': 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400',
  'Good': 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-400',
  'Calm': 'bg-indigo-500/20 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-400',
  'Neutral': 'bg-gray-500/20 text-gray-700 dark:bg-gray-500/30 dark:text-gray-400',
  'Tired': 'bg-purple-500/20 text-purple-700 dark:bg-purple-500/30 dark:text-purple-400',
  'Anxious': 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-400',
  'Sad': 'bg-blue-700/20 text-blue-900 dark:bg-blue-700/30 dark:text-blue-300',
  'Angry': 'bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-400',
  'Grateful': 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-400',
  'Excited': 'bg-pink-500/20 text-pink-700 dark:bg-pink-500/30 dark:text-pink-400'
};

const JournalEntryList: React.FC<JournalEntryListProps> = ({ entries, onViewCalendar }) => {
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});

  const getMoodBorderColor = (mood?: string): string => {
    if (!mood) return 'var(--border)';

    const moodClass = moodColors[mood];
    if (!moodClass) return 'var(--border)';

    const bgClass = moodClass.split(' ').find(cls => cls.startsWith('bg-'));
    if (!bgClass) return 'var(--border)';

    const colorToken = bgClass.replace('bg-', '').split('/')[0];
    return `rgb(var(--${colorToken}-rgb) / 0.7)`;
  };

  const toggleExpand = (entryId: string) => {
    setExpandedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };

  const groupEntriesByDate = () => {
    const groups: Record<string, JournalEntry[]> = {};
    
    entries.forEach(entry => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    
    return Object.entries(groups)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, entries]) => ({
        date,
        formattedDate: format(new Date(date), 'EEEE, MMMM d, yyyy'),
        entries
      }));
  };

  const groupedEntries = groupEntriesByDate();

  return (
    <div className="space-y-6">
      {onViewCalendar && (
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewCalendar}
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            <span>Calendar View</span>
          </Button>
        </div>
      )}
      
      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        groupedEntries.map(group => (
          <div key={group.date}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{group.formattedDate}</h3>
            <div className="space-y-3">
              {group.entries.map((entry) => (
                <Card 
                  key={entry.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow border-l-4"
                  style={{ 
                    borderLeftColor: getMoodBorderColor(entry.mood)
                  }}
                >
                  <CardHeader className="py-3 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{entry.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarDays className="h-3.5 w-3.5 mr-1" />
                        <span>{formatDistanceToNow(new Date(entry.date), { addSuffix: true })}</span>
                      </div>
                    </div>
                    {entry.mood && (
                      <div className={cn(
                        "px-2 py-1 rounded text-xs font-medium flex items-center gap-1",
                        moodColors[entry.mood] || ""
                      )}>
                        <span>{moodEmojis[entry.mood] || ""}</span>
                        <span>{entry.mood}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className={cn(
                      "whitespace-pre-line",
                      !expandedEntries[entry.id] && entry.content.length > 150 && "line-clamp-3"
                    )}>
                      {entry.content}
                    </p>
                    
                    {entry.content.length > 150 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleExpand(entry.id)}
                        className="mt-1 h-7 px-2"
                      >
                        {expandedEntries[entry.id] ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5 mr-1" />
                            <span>Show less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5 mr-1" />
                            <span>Read more</span>
                          </>
                        )}
                      </Button>
                    )}
                    
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {entry.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JournalEntryList;
