import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Morning Aarti",
    description: "Daily morning prayers and rituals",
    date: "Every Day",
    time: "6:00 AM - 7:00 AM",
    location: "Main Temple Hall",
  },
  {
    id: 2,
    title: "Evening Aarti",
    description: "Evening prayers and ceremonies",
    date: "Every Day",
    time: "6:00 PM - 7:00 PM",
    location: "Main Temple Hall",
  },
  {
    id: 3,
    title: "Special Puja",
    description: "Monthly special worship ceremony",
    date: "First Sunday",
    time: "10:00 AM - 12:00 PM",
    location: "Main Temple Hall",
  },
  {
    id: 4,
    title: "Spiritual Discourse",
    description: "Weekly spiritual teachings and discussions",
    date: "Every Saturday",
    time: "4:00 PM - 5:30 PM",
    location: "Community Hall",
  },
];

const EventsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
          Temple Events
        </h1>

        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-muted-foreground mb-4">{event.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
