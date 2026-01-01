
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EarnMaster Pro - Earn Money Online</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Hind Siliguri', sans-serif;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            overflow-x: hidden;
        }
        .spin-wheel {
            transition: transform 4s cubic-bezier(0.1, 0, 0, 1);
        }
        ::-webkit-scrollbar {
            width: 0px;
        }
        .animate-float {
            animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    </style>
<script type="importmap">
{
  "imports": {
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "react/": "https://esm.sh/react@^19.2.3/",
    "react": "https://esm.sh/react@^19.2.3"
  }
}
</script>
</head>
<body class="bg-[#f8fafc] text-slate-900">
    <div id="root"></div>

    <!-- Monetag/Adsterra Integration -->
    <script>
      function showMonetagAd(zoneId) {
        return new Promise((resolve) => {
          // এখানে আপনার আসল মনেট্যাগ ডিরেক্ট লিঙ্ক বা স্ক্রিপ্ট ইনজেক্ট করতে পারেন
          // উদাহরণস্বরূপ একটি পপ-আপ অ্যাড ওপেন করা:
          console.log("Calling Monetag Zone:", zoneId);
          
          // সিমুলেশন: ৩ সেকেন্ড পর রিওয়ার্ড কনফার্ম করবে
          setTimeout(() => {
            resolve(true);
          }, 3000);
        });
      }
    </script>
</body>
</html>
