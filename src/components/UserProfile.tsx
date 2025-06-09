
import React, { useState, useEffect } from 'react';
import { MapPin, Save, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { UserProfile as UserProfileType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<UserProfileType>>({});
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          use_current_location: true,
        });
        setGettingLocation(false);
        toast({
          title: "Success!",
          description: "Current location obtained successfully.",
        });
      },
      (error) => {
        setGettingLocation(false);
        toast({
          title: "Error",
          description: "Unable to get current location. Please enter address manually.",
          variant: "destructive",
        });
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address_line1">Address Line 1</Label>
              <Input
                id="address_line1"
                value={formData.address_line1 || ''}
                onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                placeholder="Street address"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
              <Input
                id="address_line2"
                value={formData.address_line2 || ''}
                onChange={(e) => setFormData({...formData, address_line2: e.target.value})}
                placeholder="Apartment, suite, etc."
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Enter city"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state || ''}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                placeholder="Enter state"
              />
            </div>
            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                placeholder="Enter postal code"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || 'United States'}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <Label className="text-base font-medium">Use Current Location</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this to use your current GPS location for delivery
                </p>
              </div>
              <Switch
                checked={formData.use_current_location || false}
                onCheckedChange={(checked) => setFormData({...formData, use_current_location: checked})}
              />
            </div>
            
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="mb-4"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {gettingLocation ? 'Getting Location...' : 'Get Current Location'}
            </Button>

            {formData.latitude && formData.longitude && (
              <div className="text-sm text-muted-foreground">
                Location: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
