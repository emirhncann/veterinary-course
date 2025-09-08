import Link from 'next/link';
import { BookOpen, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-xl">KursPlatform</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Modern ve etkili online eğitim platformu. 
              Uzman eğitmenlerden kaliteli kurslar alın.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
                <span className="sr-only">E-posta</span>
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                  Tüm Kurslar
                </Link>
              </li>
              <li>
                <Link href="/courses?level=beginner" className="text-muted-foreground hover:text-foreground">
                  Başlangıç Kursları
                </Link>
              </li>
              <li>
                <Link href="/courses?level=intermediate" className="text-muted-foreground hover:text-foreground">
                  Orta Seviye
                </Link>
              </li>
              <li>
                <Link href="/courses?level=advanced" className="text-muted-foreground hover:text-foreground">
                  İleri Seviye
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Destek</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Yardım Merkezi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  Sık Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Şirket</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-muted-foreground hover:text-foreground">
                  Eğitmenler
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Kariyer
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 KursPlatform. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Kullanım Şartları
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Gizlilik
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
              Çerezler
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
