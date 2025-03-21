# متجر التسوق الإلكتروني

متجر إلكتروني متكامل يوفر تجربة تسوق سلسة وآمنة للمستخدمين في ليبيا. يتميز الموقع بواجهة مستخدم عصرية وسهلة الاستخدام، مع دعم كامل للغة العربية.

## المميزات الرئيسية

- ✨ واجهة مستخدم عصرية وسهلة الاستخدام
- 🛍️ تصفح وشراء المنتجات بسهولة
- 📱 تصميم متجاوب يعمل على جميع الأجهزة
- 🔍 بحث متقدم عن المنتجات
- 🛒 سلة تسوق ديناميكية
- 💳 عملية شراء سلسة وآمنة
- 📦 تتبع الطلبات في الوقت الفعلي
- 👤 لوحة تحكم للمستخدم
- 👨‍💼 لوحة تحكم للإدارة
- 🌙 الوضع الداكن

## التقنيات المستخدمة

- React.js مع TypeScript
- Tailwind CSS للتصميم
- Firebase للتخزين وإدارة البيانات
- Framer Motion للحركات والتأثيرات البصرية
- React Router للتنقل
- React Hook Form لإدارة النماذج

## التثبيت والتشغيل

1. قم بنسخ المستودع:
\`\`\`bash
git clone [رابط المستودع]
\`\`\`

2. قم بتثبيت التبعيات:
\`\`\`bash
npm install
\`\`\`

3. قم بتشغيل المشروع:
\`\`\`bash
npm run dev
\`\`\`

## المساهمة

نرحب بمساهماتكم في تطوير المشروع. يرجى اتباع الخطوات التالية:

1. قم بعمل Fork للمشروع
2. قم بإنشاء فرع جديد للميزة: \`git checkout -b feature/amazing-feature\`
3. قم بتنفيذ التغييرات وإضافتها: \`git add .\`
4. قم بعمل Commit: \`git commit -m 'إضافة ميزة رائعة'\`
5. قم برفع التغييرات: \`git push origin feature/amazing-feature\`
6. قم بإنشاء Pull Request

## الترخيص

جميع الحقوق محفوظة © 2024

## Project info

**URL**: https://lovable.dev/projects/35d68654-281f-4f0e-8092-62669edabab6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/35d68654-281f-4f0e-8092-62669edabab6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Client-Side Routing Configuration

This project uses React Router for client-side routing. To ensure that direct URL access works correctly (avoiding 404 errors when accessing routes directly), the following configurations have been added:

### Development Mode

The Vite development server is configured with `historyApiFallback: true` in `vite.config.ts`, which redirects all 404 responses to serve the `index.html` file.

### Production Deployment

For production deployment, several configuration files have been added to support different hosting platforms:

- **Netlify**: `public/_redirects` file redirects all routes to index.html
- **Vercel**: `vercel.json` configures rewrites to handle client-side routing
- **Static file servers**:
  - `public/.htaccess` for Apache servers
  - `public/web.config` for IIS (Windows servers)
- **Heroku**: `static.json` for static buildpacks

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/35d68654-281f-4f0e-8092-62669edabab6) and click on Share -> Publish.

For other deployment options:

1. Build the project with `npm run build`
2. Deploy the generated `dist` directory to your preferred hosting platform
3. The configuration files included in this project should handle client-side routing for most common hosting platforms

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
