# Transfers Admin Panel - PRD

## Original Problem Statement
إكمال لوحة تحكم Admin Panel لتطبيق ترانسفيرز - تطبيق مشابه لـ Careem/Uber يشمل خدمة الرحلات والتوصيل. المطلوب: إدارة المستخدمين، السائقين، المطاعم، الرحلات، الطلبات، العروض، الإعدادات. دعم عربي/إنجليزي RTL. نظام عملات متعدد (12 دولة).

## User Personas
1. **مدير النظام (Super Admin)**: صلاحيات كاملة لإدارة جميع جوانب التطبيق
2. **مشرف العمليات**: مراقبة الرحلات والطلبات
3. **مدير التسويق**: إدارة العروض والكوبونات

## Core Requirements (Static)
- ✅ تسجيل دخول آمن للمشرفين
- ✅ لوحة تحكم بإحصائيات ورسوم بيانية
- ✅ إدارة المستخدمين (عرض، تفعيل، حظر)
- ✅ إدارة السائقين (عرض، توثيق، تفعيل/إيقاف)
- ✅ إدارة المطاعم (عرض، فتح/إغلاق)
- ✅ متابعة الرحلات
- ✅ متابعة الطلبات
- ✅ إدارة العروض والكوبونات (CRUD)
- ✅ صفحة الإعدادات
- ✅ دعم RTL للغة العربية
- ✅ تصميم Dark Theme عصري

## What's Been Implemented (2026-01-30)
### Pages
- `/login` - صفحة تسجيل الدخول
- `/admin` - لوحة التحكم الرئيسية (Dashboard)
- `/admin/users` - إدارة المستخدمين
- `/admin/drivers` - إدارة السائقين
- `/admin/restaurants` - إدارة المطاعم
- `/admin/rides` - متابعة الرحلات
- `/admin/orders` - متابعة الطلبات
- `/admin/promotions` - إدارة العروض
- `/admin/settings` - الإعدادات

### Components
- `Layout.jsx` - التخطيط الرئيسي
- `Sidebar.jsx` - القائمة الجانبية
- `AdminContext.js` - حالة التطبيق

### Features
- Protected Routes للصفحات المحمية
- Mock Data للبيانات التجريبية
- فلترة وبحث في الجداول
- إضافة عروض جديدة (Dialog)
- تغيير حالة العناصر (تفعيل/حظر)
- توثيق السائقين
- Responsive Design

## Prioritized Backlog

### P0 - Critical (Next Phase)
1. ربط Backend مع MongoDB APIs
2. نظام المصادقة JWT الحقيقي
3. إدارة الجلسات والتوكنات

### P1 - High Priority
1. إضافة/تعديل/حذف المستخدمين
2. صفحات تفاصيل (User/Driver/Restaurant Details)
3. تقارير PDF قابلة للتصدير
4. إشعارات Real-time

### P2 - Medium Priority
1. Google Maps Integration للخرائط
2. نظام الدفع الحقيقي
3. دعم اللغة الإنجليزية الكامل
4. Dark/Light theme toggle

## Technical Stack
- **Frontend**: React, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI (جاهز للربط)
- **Database**: MongoDB (جاهز للربط)
- **Icons**: Lucide React

## Next Tasks
1. [ ] إنشاء Backend APIs للـ CRUD operations
2. [ ] ربط صفحات Frontend مع APIs
3. [ ] إضافة JWT Authentication
4. [ ] WebSocket للإشعارات الفورية
