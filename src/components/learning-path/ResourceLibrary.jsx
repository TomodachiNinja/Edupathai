import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Youtube, 
  BookOpen, 
  Globe, 
  Wrench, 
  ExternalLink,
  Library,
  Search
} from "lucide-react";

export default function ResourceLibrary({ resources }) {
  if (!resources) return null;

  const openYouTubeChannel = (channelName) => {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(channelName + " channel")}`;
    window.open(searchUrl, '_blank');
  };

  const searchGoogle = (query) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
  };

  const resourceSections = [
    {
      title: "YouTube Channels",
      icon: Youtube,
      items: resources.youtube_channels,
      color: "text-red-600",
      bgColor: "bg-red-50",
      action: (item) => openYouTubeChannel(item),
      actionIcon: Youtube
    },
    {
      title: "Books",
      icon: BookOpen,
      items: resources.books,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: (item) => searchGoogle(item + " book"),
      actionIcon: Search
    },
    {
      title: "Websites",
      icon: Globe,
      items: resources.websites,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: (item) => {
        // If it looks like a domain, open it. Otherwise, search.
        if (item.includes('.') && !item.includes(' ')) {
          const url = item.startsWith('http') ? item : `https://${item}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          searchGoogle(item);
        }
      },
      actionIcon: ExternalLink
    },
    {
      title: "Tools",
      icon: Wrench,
      items: resources.tools,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: (item) => searchGoogle(item + " download"),
      actionIcon: Search
    }
  ];

  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Library className="w-5 h-5" />
          Resource Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {resourceSections.map((section) => (
          section.items && section.items.length > 0 && (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-3">
                <section.icon className={`w-4 h-4 ${section.color}`} />
                <h3 className="font-semibold text-slate-800 text-sm">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, index) => {
                  // Determine icon and title based on action
                  let ActionIcon, actionTitle;
                  if (section.title === 'Websites') {
                    if (item.includes('.') && !item.includes(' ')) {
                      ActionIcon = ExternalLink;
                      actionTitle = 'Visit website';
                    } else {
                      ActionIcon = Search;
                      actionTitle = 'Search online';
                    }
                  } else {
                    ActionIcon = section.actionIcon;
                    actionTitle = 'Search online';
                  }

                  return (
                    <div
                      key={index}
                      className={`${section.bgColor} rounded-lg p-3 flex items-center justify-between hover:shadow-sm transition-shadow`}
                    >
                      <span className="text-sm text-slate-700 flex-1">{item}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 hover:bg-white/80"
                        onClick={() => section.action(item)}
                        title={actionTitle}
                      >
                        <ActionIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}

        <div className="pt-4 border-t">
          <h3 className="font-semibold text-slate-800 text-sm mb-3">Quick Tips</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="bg-blue-50 rounded p-2">
              📺 <strong>Video Tip:</strong> Use the YouTube player above to watch recommended videos directly
            </div>
            <div className="bg-green-50 rounded p-2">
              🎯 <strong>Practice Tip:</strong> Apply what you learn immediately through exercises
            </div>
            <div className="bg-purple-50 rounded p-2">
              📝 <strong>Note-Taking:</strong> Use the daily notes section to track your progress
            </div>
            <div className="bg-orange-50 rounded p-2">
              🔍 <strong>Resource Tip:</strong> Click the icons next to resources to find them online
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}