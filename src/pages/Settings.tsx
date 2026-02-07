import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Download,
  Save
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserRolesManager } from "@/components/settings/UserRolesManager";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    companyName: "Mining Corp International",
    email: "admin@miningcorp.com",
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    impactAlerts: true,
    dataRetention: "12",
    autoBackup: true,
    language: "en",
    units: "metric"
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleExportData = () => {
    // Generate CSV content with multiple sections
    const csvSections: string[] = [];
    
    // Header
    csvSections.push("TERRALENS LCA DATA EXPORT");
    csvSections.push(`Export Date,${new Date().toLocaleDateString()}`);
    csvSections.push(`Export Time,${new Date().toLocaleTimeString()}`);
    csvSections.push("");
    
    // Projects Section
    csvSections.push("=== LCA PROJECTS ===");
    csvSections.push("Project ID,Project Name,Product Name,Functional Unit,System Boundary,Status,GWP (kg CO2e),Acidification (kg SO2e),Eutrophication (kg PO4e),Water Footprint (m³),Energy Demand (MJ),Circularity Score (%)");
    csvSections.push("proj-1,Steel Production LCA - Mumbai Plant,Hot Rolled Steel Coil,1 tonne of HR Steel Coil,cradle-to-gate,in-progress,2100,8.5,1.2,52,25000,42");
    csvSections.push("proj-2,Copper Smelting Assessment,Copper Cathode,1 tonne of LME Grade A Copper,gate-to-gate,completed,3500,45,2.8,130,48000,35");
    csvSections.push("proj-3,Aluminum Recycling Circularity Study,Secondary Aluminum Ingot,1 tonne of A380 Aluminum Alloy,cradle-to-grave,draft,450,2.1,0.35,18,5500,78");
    csvSections.push("");
    
    // Circularity Metrics Section
    csvSections.push("=== CIRCULARITY METRICS ===");
    csvSections.push("Metric,Value");
    csvSections.push("Recycled Input Rate,32%");
    csvSections.push("Recyclability Rate,85%");
    csvSections.push("Resource Efficiency,68%");
    csvSections.push("Waste Reduction Rate,45%");
    csvSections.push("Material Circularity Index,0.58");
    csvSections.push("Byproduct Utilization,72%");
    csvSections.push("");
    
    // Mining Operations Section
    csvSections.push("=== MINING OPERATIONS ===");
    csvSections.push("Operation Name,Location,Type,Primary Ore,Annual Production (tonnes)");
    csvSections.push("Jharkhand Iron Ore Complex,\"Jharkhand, India\",open-pit,Iron Ore (Hematite),12000000");
    csvSections.push("Karnataka Copper Mine,\"Karnataka, India\",underground,Copper Ore,850000");
    csvSections.push("Odisha Bauxite Operation,\"Odisha, India\",open-pit,Bauxite,4500000");
    csvSections.push("");
    
    // Monthly Emissions Data Section
    csvSections.push("=== MONTHLY EMISSIONS DATA ===");
    csvSections.push("Month,CO2 Emissions (tonnes),Target (tonnes),Variance");
    csvSections.push("January,1850,2000,-150");
    csvSections.push("February,1920,1950,-30");
    csvSections.push("March,1780,1900,-120");
    csvSections.push("April,1650,1850,-200");
    csvSections.push("May,1720,1800,-80");
    csvSections.push("June,1580,1750,-170");
    csvSections.push("July,1490,1700,-210");
    csvSections.push("August,1420,1650,-230");
    csvSections.push("September,1380,1600,-220");
    csvSections.push("October,1290,1550,-260");
    csvSections.push("November,1210,1500,-290");
    csvSections.push("December,1150,1450,-300");
    csvSections.push("");
    
    // Materials Section
    csvSections.push("=== MATERIALS DATABASE ===");
    csvSections.push("Material Name,Category,Carbon Footprint (kg CO2e/kg),Water Usage (L/kg),Energy Consumption (MJ/kg),Recyclability (%)");
    csvSections.push("Iron Ore (Hematite),ore,0.03,1.2,0.15,0");
    csvSections.push("Pig Iron,metal,1.8,28,12.5,95");
    csvSections.push("Steel (Carbon),alloy,2.1,52,18.5,98");
    csvSections.push("Recycled Steel Scrap,recycled,0.4,8,6.2,95");
    csvSections.push("Copper Concentrate,concentrate,0.8,45,8.5,0");
    csvSections.push("Refined Copper,metal,3.5,130,45,100");
    csvSections.push("");
    
    // Summary Section
    csvSections.push("=== SUMMARY ===");
    csvSections.push("Metric,Value");
    csvSections.push("Total Projects,3");
    csvSections.push("Completed Assessments,1");
    csvSections.push("In Progress,1");
    csvSections.push("Draft,1");
    csvSections.push("Overall Sustainability Grade,B");
    csvSections.push("Environmental Score,62%");
    csvSections.push("Economic Score,78%");
    csvSections.push("Social Score,71%");
    csvSections.push("Overall Score,70%");
    
    const csvContent = csvSections.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TerraLens-Export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your LCA data has been downloaded as CSV (Excel compatible).",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your company and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={settings.companyName}
                      onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language"
                    className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <Separator />
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch 
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly sustainability reports
                    </p>
                  </div>
                  <Switch 
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings({...settings, weeklyReports: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Impact Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when impact thresholds are exceeded
                    </p>
                  </div>
                  <Switch 
                    checked={settings.impactAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, impactAlerts: checked})}
                  />
                </div>
                <Separator />
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage data retention, backups, and exports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Data Retention Period (months)</Label>
                  <Input 
                    type="number"
                    className="max-w-xs"
                    value={settings.dataRetention}
                    onChange={(e) => setSettings({...settings, dataRetention: e.target.value})}
                  />
                  <p className="text-sm text-muted-foreground">
                    How long to retain LCA assessment data
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup data weekly
                    </p>
                  </div>
                  <Switch 
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Download all your LCA data and assessments
                  </p>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Units System</Label>
                  <select 
                    className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={settings.units}
                    onChange={(e) => setSettings({...settings, units: e.target.value})}
                  >
                    <option value="metric">Metric (kg, km)</option>
                    <option value="imperial">Imperial (lbs, miles)</option>
                  </select>
                </div>
                <Separator />
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* User Roles Section */}
            <UserRolesManager />

            {/* Password & 2FA Section */}
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and two-factor authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="space-y-2 max-w-md">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                <Separator />
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
