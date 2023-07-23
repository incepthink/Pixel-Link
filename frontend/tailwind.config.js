module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        gothom_pro: ["Gotham Pro", "sans-serif"],
        bebas: ["Bebas", "sans-serif"],
        arcade: ['Press Start 2P', "cursive"],
        manrope: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        "home-background-1": 'url("https://hash-collect.s3.ap-south-1.amazonaws.com/website/home_background_1_1.png")',
        "home-background-2": 'url("https://hash-collect.s3.ap-south-1.amazonaws.com/website/home_background_1_2.png")',
        "home-background-3": 'url("https://hash-collect.s3.ap-south-1.amazonaws.com/website/home_background_1_3.png")',
        "catalogue-background-1": 'url("https://hash-collect.s3.ap-south-1.amazonaws.com/website/catalogue-background-1.png")',
      },
      colors: {
        "custom-blue": "#00C2FF",
      },
      borderWidth: {
        '1' : '1px'
      },
    },
  },
  plugins: [],
};
