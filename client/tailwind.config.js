/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Đảm bảo Tailwind tạo ra tất cả các lớp này tại thời điểm build
    "sm:w-dynamic-width",
    "md:w-dynamic-width",
    "lg:w-dynamic-width",
    "xl:w-dynamic-width",
  ],
  theme: {
    extend: {
      // Thêm tiện ích `dynamic-width` có giá trị là biến CSS `--dynamic-width`
      width: {
        "dynamic-width": "var(--dynamic-width)",
      },
      maxWidth: {
        "dynamic-width": "var(--dynamic-width)",
      },
      minWidth: {
        "dynamic-width": "var(--dynamic-width)",
      },
      screens: {
        xs: "320px",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("can-hover", "@media (hover:hover)");
    },
  ],
};
