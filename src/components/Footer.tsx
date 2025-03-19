import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Heart, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDarkMode } from '@/lib/darkModeContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { darkMode } = useDarkMode();
  
  return (
    <footer className={cn(
      "relative pt-16 pb-8 overflow-hidden",
      darkMode
        ? "bg-gradient-to-br from-gray-800 to-gray-900"
        : "bg-gradient-to-br from-primary/5 to-primary/10"
    )}>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-primary/5 blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Store Information */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <h2 className={cn(
                "text-2xl font-bold mb-2",
                darkMode ? "text-white" : "text-gray-800"
              )}>متجر ليبيا للتسوق</h2>
              <div className="h-1 w-16 bg-primary/70 rounded-full mb-4"></div>
            </div>
            
            <p className={cn(
              "leading-relaxed",
              darkMode ? "text-gray-300" : "text-gray-600"
            )}>
              نقدم لك تجربة تسوق فريدة مع مجموعة واسعة من المنتجات عالية الجودة بأسعار تنافسية.
              نسعى دائماً لتوفير أفضل الخدمات لعملائنا الكرام في جميع أنحاء ليبيا.
            </p>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-110 text-primary",
                  darkMode ? "bg-gray-700" : "bg-white"
                )}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
             
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className={cn(
              "text-lg font-bold mb-6",
              darkMode ? "text-white" : "text-gray-800"
            )}>روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className={cn(
                  "flex items-center hover:text-primary transition-colors group",
                  darkMode ? "text-gray-300" : "text-gray-600"
                )}>
                  <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className={cn(
                  "flex items-center hover:text-primary transition-colors group",
                  darkMode ? "text-gray-300" : "text-gray-600"
                )}>
                  <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>المنتجات</span>
                </Link>
              </li>
             
              
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="md:col-span-4" id="contact">
            <h3 className={cn(
              "text-lg font-bold mb-6",
              darkMode ? "text-white" : "text-gray-800"
            )}>اتصل بنا</h3>
            <div className="space-y-4">
              <div className={cn(
                "flex items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-all",
                darkMode ? "bg-gray-800" : "bg-white"
              )}>
                <Phone size={20} className="ml-3 text-primary" />
                <div>
                  <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-500"}>اتصل بنا</p>
                  <p className={darkMode ? "font-medium text-gray-200" : "font-medium text-gray-700"}>092-207-8595</p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-all",
                darkMode ? "bg-gray-800" : "bg-white"
              )}>
                <Mail size={20} className="ml-3 text-primary" />
                <div>
                  <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-500"}>البريد الإلكتروني</p>
                  <p className={darkMode ? "font-medium text-gray-200" : "font-medium text-gray-700"}>betterapi@outlook.com</p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-all",
                darkMode ? "bg-gray-800" : "bg-white"
              )}>
                <MapPin size={20} className="ml-3 text-primary" />
                <div>
                  <p className={darkMode ? "text-sm text-gray-400" : "text-sm text-gray-500"}>العنوان</p>
                  <p className={darkMode ? "font-medium text-gray-200" : "font-medium text-gray-700"}>حي الإنتصار،طريق المطار، طرابلس، ليبيا</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className={cn(
          "pt-8 flex flex-col md:flex-row justify-between items-center",
          darkMode ? "border-t border-gray-700" : "border-t border-gray-200"
        )}>
          <p className={cn(
            "text-center md:text-right mb-4 md:mb-0",
            darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            &copy; {currentYear} - متجر ليبيا للتسوق. جميع الحقوق محفوظة
          </p>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;