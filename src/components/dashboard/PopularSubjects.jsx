import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Smartphone, 
  Database, 
  Globe, 
  Palette, 
  Briefcase, 
  Languages,
  Brain,
  Shield,
  Gamepad2,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const iconMap = {
  programming: Code,
  web_development: Globe,
  data_science: Database,
  mobile: Smartphone,
  design: Palette,
  business: Briefcase,
  languages: Languages,
  ai_ml: Brain,
  cybersecurity: Shield,
  game_dev: Gamepad2
};

const defaultSubjects = [
  {
    name: "Python Programming",
    category: "programming",
    description: "Learn Python from basics to advanced concepts",
    popular: true,
    icon: "programming"
  },
  {
    name: "Web Development",
    category: "web_development", 
    description: "HTML, CSS, JavaScript and modern frameworks",
    popular: true,
    icon: "web_development"
  },
  {
    name: "Data Science",
    category: "data_science",
    description: "Analytics, machine learning, and visualization",
    popular: true,
    icon: "data_science"
  },
  {
    name: "React Development",
    category: "web_development",
    description: "Build modern web applications with React",
    popular: true,
    icon: "web_development"
  },
  {
    name: "Mobile App Development",
    category: "mobile",
    description: "iOS and Android app development",
    popular: true,
    icon: "mobile"
  },
  {
    name: "Machine Learning",
    category: "ai_ml",
    description: "AI and machine learning fundamentals",
    popular: true,
    icon: "ai_ml"
  }
];

export default function PopularSubjects({ subjects }) {
  const displaySubjects = subjects.length > 0 ? subjects : defaultSubjects;
  const popularSubjects = displaySubjects.filter(s => s.popular).slice(0, 6);

  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Popular Subjects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularSubjects.map((subject, index) => {
            const IconComponent = iconMap[subject.icon] || Code;
            return (
              <Link key={index} to={createPageUrl(`Generator?subject=${encodeURIComponent(subject.name)}`)}>
                <Card className="h-full hover:shadow-md transition-all duration-200 group cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {subject.description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {subject.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}