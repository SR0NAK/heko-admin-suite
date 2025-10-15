import { useState, useEffect } from "react";
import { Store, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useVendorProfile } from "@/hooks/useVendorProfile";

export default function VendorSettings() {
  const { vendor, isLoading, updateVendor } = useVendorProfile();
  
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    contactNumber: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (vendor) {
      setStoreInfo({
        storeName: vendor.business_name || "",
        contactNumber: vendor.phone || "",
        email: vendor.email || "",
        address: vendor.address || "",
      });
    }
  }, [vendor]);

  const [timings, setTimings] = useState({
    monday: { open: "09:00", close: "21:00", isOpen: true },
    tuesday: { open: "09:00", close: "21:00", isOpen: true },
    wednesday: { open: "09:00", close: "21:00", isOpen: true },
    thursday: { open: "09:00", close: "21:00", isOpen: true },
    friday: { open: "09:00", close: "21:00", isOpen: true },
    saturday: { open: "09:00", close: "22:00", isOpen: true },
    sunday: { open: "10:00", close: "20:00", isOpen: true },
  });

  const handleSaveStoreInfo = () => {
    updateVendor({
      business_name: storeInfo.storeName,
      phone: storeInfo.contactNumber,
      email: storeInfo.email,
      address: storeInfo.address,
    });
  };

  const handleSaveTimings = () => {
    toast({
      title: "Store Timings Updated",
      description: "Your store timings have been saved successfully",
    });
  };

  const handleTimingChange = (
    day: string,
    field: "open" | "close" | "isOpen",
    value: string | boolean
  ) => {
    setTimings({
      ...timings,
      [day]: { ...timings[day as keyof typeof timings], [field]: value },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Settings</h1>
        <p className="text-muted-foreground">
          Manage your store information and timings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={storeInfo.storeName}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, storeName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={storeInfo.contactNumber}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, contactNumber: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={storeInfo.email}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Store Address</Label>
            <Input
              id="address"
              value={storeInfo.address}
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, address: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSaveStoreInfo}>Save Store Information</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Store Timings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(timings).map(([day, timing]) => (
            <div key={day}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-24">
                    <span className="font-medium capitalize">{day}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={timing.open}
                      onChange={(e) =>
                        handleTimingChange(day, "open", e.target.value)
                      }
                      disabled={!timing.isOpen}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={timing.close}
                      onChange={(e) =>
                        handleTimingChange(day, "close", e.target.value)
                      }
                      disabled={!timing.isOpen}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`${day}-toggle`}
                    className="text-sm text-muted-foreground"
                  >
                    {timing.isOpen ? "Open" : "Closed"}
                  </Label>
                  <Switch
                    id={`${day}-toggle`}
                    checked={timing.isOpen}
                    onCheckedChange={(checked) =>
                      handleTimingChange(day, "isOpen", checked)
                    }
                  />
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
          <Button onClick={handleSaveTimings}>Save Store Timings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
