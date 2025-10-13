import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { mockSettings } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState(mockSettings);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your app settings and business rules
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Settings</CardTitle>
            <CardDescription>
              Configure delivery fees and minimum order values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryFee: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Minimum Order Value (₹)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={settings.minOrderValue}
                  onChange={(e) =>
                    setSettings({ ...settings, minOrderValue: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet & Cashback Settings</CardTitle>
            <CardDescription>
              Configure cashback and referral reward percentages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cashback">Cashback Percentage (%)</Label>
                <Input
                  id="cashback"
                  type="number"
                  value={settings.cashbackPercentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cashbackPercentage: Number(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Credited to virtual wallet on delivery
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referral">Referral Reward (%)</Label>
                <Input
                  id="referral"
                  type="number"
                  value={settings.referralRewardPercentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      referralRewardPercentage: Number(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Single-level conversion on delivery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Area</CardTitle>
            <CardDescription>
              Configure service radius and business hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="radius">Service Radius (km)</Label>
              <Input
                id="radius"
                type="number"
                value={settings.serviceRadius}
                onChange={(e) =>
                  setSettings({ ...settings, serviceRadius: Number(e.target.value) })
                }
              />
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Business Hours Start</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.businessHours.start}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessHours: {
                        ...settings.businessHours,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Business Hours End</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={settings.businessHours.end}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessHours: {
                        ...settings.businessHours,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
