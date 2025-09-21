'use client';

import * as React from 'react';
import { Settings, Save, User, Bell, Shield, Database, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthGuard } from '@/components/AuthGuard';
import { apiFetch } from '@/lib/fetcher';

interface AdminSettings {
  site: {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    newUserRegistration: boolean;
    newCourseEnrollment: boolean;
    newOrder: boolean;
    systemAlerts: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    allowGuestCheckout: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
  };
}

async function getSettings(): Promise<AdminSettings | null> {
  try {
    const response = await apiFetch<AdminSettings>('/admin/settings');
    return response;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

async function updateSettings(settings: AdminSettings): Promise<boolean> {
  try {
    await apiFetch('/admin/settings', {
      method: 'PUT',
      body: settings,
    });
    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<AdminSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const success = await updateSettings(settings);
      if (success) {
        toast.success('Ayarlar başarıyla güncellendi');
      } else {
        toast.error('Ayarlar güncellenirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Ayarlar güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: keyof AdminSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value,
      },
    }));
  };

  if (loading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!settings) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ayarlar yüklenemedi</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sistem Ayarları
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Platform ayarlarını yönetin
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>

        <Tabs defaultValue="site" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="site" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Site Bilgileri
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-posta
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Bildirimler
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Güvenlik
            </TabsTrigger>
          </TabsList>

          {/* Site Settings */}
          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>Site Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Adı</Label>
                    <Input
                      id="siteName"
                      value={settings.site.name}
                      onChange={(e) => updateSetting('site', 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteEmail">Site E-postası</Label>
                    <Input
                      id="siteEmail"
                      type="email"
                      value={settings.site.email}
                      onChange={(e) => updateSetting('site', 'email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Açıklaması</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.site.description}
                    onChange={(e) => updateSetting('site', 'description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sitePhone">Telefon</Label>
                    <Input
                      id="sitePhone"
                      value={settings.site.phone}
                      onChange={(e) => updateSetting('site', 'phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteLogo">Logo URL</Label>
                    <Input
                      id="siteLogo"
                      value={settings.site.logo}
                      onChange={(e) => updateSetting('site', 'logo', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteAddress">Adres</Label>
                  <Textarea
                    id="siteAddress"
                    value={settings.site.address}
                    onChange={(e) => updateSetting('site', 'address', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>E-posta Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Sunucusu</Label>
                    <Input
                      id="smtpHost"
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Kullanıcı Adı</Label>
                    <Input
                      id="smtpUser"
                      value={settings.email.smtpUser}
                      onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Şifre</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Gönderen E-posta</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromName">Gönderen Adı</Label>
                    <Input
                      id="fromName"
                      value={settings.email.fromName}
                      onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Bildirim Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Yeni Kullanıcı Kaydı</Label>
                      <p className="text-sm text-muted-foreground">
                        Yeni kullanıcı kaydolduğunda bildirim al
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newUserRegistration}
                      onCheckedChange={(checked) => updateSetting('notifications', 'newUserRegistration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Yeni Kurs Kaydı</Label>
                      <p className="text-sm text-muted-foreground">
                        Kullanıcı kursa kaydolduğunda bildirim al
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newCourseEnrollment}
                      onCheckedChange={(checked) => updateSetting('notifications', 'newCourseEnrollment', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Yeni Sipariş</Label>
                      <p className="text-sm text-muted-foreground">
                        Yeni sipariş geldiğinde bildirim al
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newOrder}
                      onCheckedChange={(checked) => updateSetting('notifications', 'newOrder', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sistem Uyarıları</Label>
                      <p className="text-sm text-muted-foreground">
                        Sistem uyarıları ve hata bildirimleri
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Güvenlik Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>E-posta Doğrulama Zorunlu</Label>
                      <p className="text-sm text-muted-foreground">
                        Kullanıcıların e-posta adreslerini doğrulamasını zorunlu kıl
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.requireEmailVerification}
                      onCheckedChange={(checked) => updateSetting('security', 'requireEmailVerification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Misafir Ödeme</Label>
                      <p className="text-sm text-muted-foreground">
                        Kayıt olmadan ödeme yapılmasına izin ver
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.allowGuestCheckout}
                      onCheckedChange={(checked) => updateSetting('security', 'allowGuestCheckout', checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Maksimum Giriş Denemesi</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="1"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="15"
                      max="1440"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}
