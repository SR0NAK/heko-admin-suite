import { useState } from "react";
import { 
  Power, 
  User, 
  Car, 
  FileCheck, 
  HelpCircle, 
  BookOpen, 
  Globe, 
  Bell, 
  LogOut,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function DeliveryProfile() {
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("english");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    toast({
      title: !isOnline ? "You're now Online" : "You're now Offline",
      description: !isOnline 
        ? "You can now receive delivery assignments" 
        : "You won't receive new assignments",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    setTimeout(() => navigate("/login"), 1000);
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    toast({
      title: notifications ? "Notifications disabled" : "Notifications enabled",
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: "Language updated",
      description: `Language changed to ${value}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>

        {/* Online/Offline Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5" />
              Availability Status
            </CardTitle>
            <CardDescription>Control when you receive delivery assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="font-medium">{isOnline ? "Online" : "Offline"}</p>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? "Available for deliveries" : "Not accepting assignments"}
                  </p>
                </div>
              </div>
              <Switch checked={isOnline} onCheckedChange={handleToggleOnline} />
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">Rajesh Kumar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">rajesh.kumar@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">Mumbai, Maharashtra</p>
                </div>
              </div>
            </div>
            <Separator />
            <Button variant="outline" className="w-full">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Vehicle & KYC Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle & KYC Status
            </CardTitle>
            <CardDescription>Verification and vehicle information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">KYC Verification</p>
                    <p className="text-sm text-muted-foreground">Aadhaar & PAN verified</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Vehicle Registration</p>
                    <p className="text-sm text-muted-foreground">MH02AB1234 - Honda Activa</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">Driving License</p>
                    <p className="text-sm text-muted-foreground">Expires: 2028-12-31</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">Insurance</p>
                    <p className="text-sm text-muted-foreground">Expires in 30 days</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-700">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Renew Soon
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications} 
                onCheckedChange={handleNotificationToggle}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                </div>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Support & Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support & Help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Training & How-Tos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileCheck className="h-4 w-4 mr-2" />
              Terms & Conditions
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
