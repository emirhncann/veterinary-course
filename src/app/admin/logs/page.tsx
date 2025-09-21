'use client';

import * as React from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Filter,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthGuard } from '@/components/AuthGuard';
import { useAdminLogs, type LogLevel, type LogCategory } from '@/lib/stores/useAdminLogs';
import { useToast } from '@/lib/stores/useToast';

export default function AdminLogsPage() {
  const { logs, clearLogs, getLogsByCategory, getLogsByLevel } = useAdminLogs();
  const { success, info } = useToast();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [levelFilter, setLevelFilter] = React.useState<LogLevel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<LogCategory | 'all'>('all');

  // Filtrelenmiş loglar
  const filteredLogs = React.useMemo(() => {
    let filtered = logs;

    // Level filtresi
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // Category filtresi
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    // Arama filtresi
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(search) ||
        log.details?.toLowerCase().includes(search) ||
        log.category.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [logs, levelFilter, categoryFilter, searchTerm]);

  const handleClearLogs = () => {
    clearLogs();
    success('Loglar Temizlendi', 'Tüm admin logları başarıyla temizlendi');
  };

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `admin-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    info('Loglar Dışa Aktarıldı', `${filteredLogs.length} log JSON formatında kaydedildi`);
  };

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      default: return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case 'success': return 'bg-green-100 dark:bg-green-900';
      case 'error': return 'bg-red-100 dark:bg-red-900';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900';
      default: return 'bg-blue-100 dark:bg-blue-900';
    }
  };

  const getBadgeVariant = (level: LogLevel) => {
    switch (level) {
      case 'error': return 'destructive' as const;
      case 'success': return 'default' as const;
      case 'warning': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  // İstatistikler
  const stats = React.useMemo(() => {
    const total = logs.length;
    const errors = logs.filter(log => log.level === 'error').length;
    const warnings = logs.filter(log => log.level === 'warning').length;
    const success = logs.filter(log => log.level === 'success').length;
    const info = logs.filter(log => log.level === 'info').length;

    return { total, errors, warnings, success, info };
  }, [logs]);

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Logları
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Sistem aktiviteleri ve admin işlemleri
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportLogs} disabled={filteredLogs.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Dışa Aktar
            </Button>
            <Button variant="outline" onClick={handleClearLogs} disabled={logs.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Temizle
            </Button>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Toplam</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-muted-foreground">Hata</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                <div className="text-sm text-muted-foreground">Uyarı</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                <div className="text-sm text-muted-foreground">Başarılı</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
                <div className="text-sm text-muted-foreground">Bilgi</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtreler */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Arama</label>
                <Input
                  placeholder="Log içeriğinde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Seviye</label>
                <Select value={levelFilter} onValueChange={(value: LogLevel | 'all') => setLevelFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seviye seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="error">Hata</SelectItem>
                    <SelectItem value="warning">Uyarı</SelectItem>
                    <SelectItem value="success">Başarılı</SelectItem>
                    <SelectItem value="info">Bilgi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Kategori</label>
                <Select value={categoryFilter} onValueChange={(value: LogCategory | 'all') => setCategoryFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="auth">Kimlik Doğrulama</SelectItem>
                    <SelectItem value="courses">Kurslar</SelectItem>
                    <SelectItem value="users">Kullanıcılar</SelectItem>
                    <SelectItem value="orders">Siparişler</SelectItem>
                    <SelectItem value="settings">Ayarlar</SelectItem>
                    <SelectItem value="system">Sistem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loglar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Loglar ({filteredLogs.length})
              </CardTitle>
              {filteredLogs.length !== logs.length && (
                <Badge variant="outline">
                  {logs.length} toplam logdan {filteredLogs.length} tanesi gösteriliyor
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">
                  {logs.length === 0 ? 'Henüz log yok' : 'Filtreye uygun log bulunamadı'}
                </p>
                <p className="text-sm">
                  {logs.length === 0 
                    ? 'Admin işlemleri yapıldıkça burada görünecek'
                    : 'Farklı filtre seçenekleri deneyin'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className={`w-10 h-10 ${getLogColor(log.level)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {getLogIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            <span className="capitalize">{log.category}:</span> {log.action}
                          </p>
                          {log.details && (
                            <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                          )}
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Badge variant={getBadgeVariant(log.level)}>
                            {log.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
